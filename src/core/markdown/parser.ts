// Markdown 解析器

import MarkdownIt from 'markdown-it'
import type { ContentBlock, ParsedMarkdown } from '@/types/markdown'
import { pagebreakPlugin } from './plugins/pagebreak'

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})

// 使用分页符插件
md.use(pagebreakPlugin)

/**
 * 解析 Markdown 文本为结构化的内容块
 */
export function parseMarkdown(markdown: string): ParsedMarkdown {
  // 解析为 tokens
  const tokens = md.parse(markdown, {})

  // 转换 tokens 为 ContentBlock
  const blocks = tokensToBlocks(tokens)

  return {
    blocks,
    meta: extractMeta(markdown),
  }
}

/**
 * 将 markdown-it tokens 转换为 ContentBlock 数组
 */
function tokensToBlocks(tokens: any[]): ContentBlock[] {
  const blocks: ContentBlock[] = []
  let i = 0

  while (i < tokens.length) {
    const token = tokens[i]

    if (token.type === 'heading_open') {
      const level = parseInt(token.tag.substring(1)) as 1 | 2 | 3 | 4
      const inlineToken = tokens[i + 1]
      const content = inlineToken ? parseInlineContent(inlineToken.content) : []

      blocks.push({
        type: 'heading',
        level,
        content,
      })

      i += 3 // 跳过 heading_open, inline, heading_close
    } else if (token.type === 'paragraph_open') {
      const inlineToken = tokens[i + 1]
      const content = inlineToken ? parseInlineContent(inlineToken.content) : []

      blocks.push({
        type: 'paragraph',
        content,
      })

      i += 3 // 跳过 paragraph_open, inline, paragraph_close
    } else if (token.type === 'blockquote_open') {
      // 查找对应的 blockquote_close
      let j = i + 1
      let depth = 1
      while (j < tokens.length && depth > 0) {
        if (tokens[j].type === 'blockquote_open') depth++
        if (tokens[j].type === 'blockquote_close') depth--
        j++
      }

      // 递归解析引用块内的内容
      const innerTokens = tokens.slice(i + 1, j - 1)
      const innerBlocks = tokensToBlocks(innerTokens)

      blocks.push({
        type: 'blockquote',
        content: innerBlocks,
      })

      i = j
    } else if (token.type === 'bullet_list_open' || token.type === 'ordered_list_open') {
      const ordered = token.type === 'ordered_list_open'

      // 查找对应的 list_close
      let j = i + 1
      let depth = 1
      while (j < tokens.length && depth > 0) {
        if (tokens[j].type === 'bullet_list_open' || tokens[j].type === 'ordered_list_open') depth++
        if (tokens[j].type === 'bullet_list_close' || tokens[j].type === 'ordered_list_close') depth--
        j++
      }

      const listItems = parseListItems(tokens.slice(i + 1, j - 1))

      blocks.push({
        type: 'list',
        ordered,
        items: listItems,
      })

      i = j
    } else if (token.type === 'fence' || token.type === 'code_block') {
      blocks.push({
        type: 'code',
        language: token.info || '',
        content: token.content,
      })

      i++
    } else if (token.type === 'table_open') {
      // 查找对应的 table_close
      let j = i + 1
      while (j < tokens.length && tokens[j].type !== 'table_close') {
        j++
      }

      const table = parseTable(tokens.slice(i, j + 1))
      if (table) {
        blocks.push(table)
      }

      i = j + 1
    } else if (token.type === 'hr') {
      blocks.push({
        type: 'divider',
      })

      i++
    } else if (token.type === 'pagebreak') {
      blocks.push({
        type: 'pagebreak',
      })

      i++
    } else if (token.type === 'html_block') {
      // 检查是否是图片
      const imgMatch = token.content.match(/<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/i)
      if (imgMatch) {
        blocks.push({
          type: 'image',
          src: imgMatch[1],
          alt: imgMatch[2] || '',
        })
      }

      i++
    } else {
      i++
    }
  }

  return blocks
}

/**
 * 解析行内内容（加粗、斜体、链接等）
 */
function parseInlineContent(text: string): Array<{ type: 'text'; content: string }> {
  // 简化版：直接返回纯文本
  // TODO: 后续可以实现完整的行内元素解析
  return [{ type: 'text', content: text }]
}

/**
 * 解析列表项
 */
function parseListItems(tokens: any[]): Array<{ content: Array<{ type: 'text'; content: string }> }> {
  const items: Array<{ content: Array<{ type: 'text'; content: string }> }> = []
  let i = 0

  while (i < tokens.length) {
    const token = tokens[i]

    if (token.type === 'list_item_open') {
      // 查找对应的 list_item_close
      let j = i + 1
      let depth = 1
      while (j < tokens.length && depth > 0) {
        if (tokens[j].type === 'list_item_open') depth++
        if (tokens[j].type === 'list_item_close') depth--
        j++
      }

      // 提取列表项内容
      const itemTokens = tokens.slice(i + 1, j - 1)
      let content: Array<{ type: 'text'; content: string }> = []

      for (const itemToken of itemTokens) {
        if (itemToken.type === 'inline') {
          content = parseInlineContent(itemToken.content)
          break
        }
      }

      items.push({ content })
      i = j
    } else {
      i++
    }
  }

  return items
}

/**
 * 解析表格
 */
function parseTable(tokens: any[]): ContentBlock | null {
  let headers: string[] = []
  let aligns: Array<'left' | 'center' | 'right'> = []
  let rows: string[][] = []

  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]

    if (token.type === 'thead_open') {
      // 解析表头
      let j = i + 1
      while (j < tokens.length && tokens[j].type !== 'thead_close') {
        if (tokens[j].type === 'inline') {
          headers.push(tokens[j].content)
        }
        j++
      }
      i = j + 1
    } else if (token.type === 'tbody_open') {
      // 解析表体
      let j = i + 1
      let currentRow: string[] = []

      while (j < tokens.length && tokens[j].type !== 'tbody_close') {
        if (tokens[j].type === 'tr_open') {
          currentRow = []
        } else if (tokens[j].type === 'inline') {
          currentRow.push(tokens[j].content)
        } else if (tokens[j].type === 'tr_close') {
          if (currentRow.length > 0) {
            rows.push(currentRow)
          }
        }
        j++
      }
      i = j + 1
    } else {
      i++
    }
  }

  if (headers.length === 0) {
    return null
  }

  // 默认左对齐
  aligns = headers.map(() => 'left')

  return {
    type: 'table',
    headers,
    aligns,
    rows,
  }
}

/**
 * 提取元信息（如标题、描述）
 */
function extractMeta(markdown: string): { title?: string; description?: string } {
  const lines = markdown.split('\n')
  let title: string | undefined
  let description: string | undefined

  // 尝试提取第一个 h1 作为标题
  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)$/)
    if (h1Match) {
      title = h1Match[1]
      break
    }
  }

  return { title, description }
}
