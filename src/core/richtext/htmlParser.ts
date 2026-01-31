// HTML 解析器 - 将富文本编辑器的 HTML 转换为 ContentBlock

import type { ContentBlock, InlineContent } from '@/types/markdown'

/**
 * 解析 HTML 为 ContentBlock 数组
 */
export function parseHTML(html: string): ContentBlock[] {
  if (!html || html === '<p></p>') {
    return []
  }

  const blocks: ContentBlock[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  // 遍历所有子节点
  for (const node of Array.from(body.childNodes)) {
    const block = parseNode(node)
    if (block) {
      blocks.push(block)
    }
  }

  return blocks
}

/**
 * 解析单个 DOM 节点
 */
function parseNode(node: ChildNode): ContentBlock | null {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const element = node as HTMLElement
  const tagName = element.tagName.toLowerCase()

  switch (tagName) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
      const headingAlign = (element.style.textAlign || 'left') as 'left' | 'center' | 'right'
      return {
        type: 'heading',
        level: parseInt(tagName[1]) as 1 | 2 | 3 | 4,
        content: parseInlineContent(element),
        textAlign: headingAlign,
      }

    case 'p':
      // 检查段落中是否**只有**图片（Tiptap的图片可能在p标签中）
      const img = element.querySelector('img')
      const hasOnlyImage = img && element.textContent?.trim() === ''

      if (hasOnlyImage && img) {
        const widthAttr = img.getAttribute('width')
        const heightAttr = img.getAttribute('height')
        const parsedWidth = widthAttr ? parseInt(widthAttr) : undefined
        const parsedHeight = heightAttr ? parseInt(heightAttr) : undefined
        return {
          type: 'image',
          src: img.src,
          alt: img.alt || '',
          width: parsedWidth,
          height: parsedHeight,
        }
      }

      // 空段落跳过
      if (!element.textContent || element.textContent.trim() === '') {
        return null
      }

      const paragraphAlign = (element.style.textAlign || 'left') as 'left' | 'center' | 'right'
      return {
        type: 'paragraph',
        content: parseInlineContent(element),
        textAlign: paragraphAlign,
      }

    case 'blockquote':
      // 递归解析引用块内容
      const quoteBlocks: ContentBlock[] = []
      for (const child of Array.from(element.childNodes)) {
        const block = parseNode(child)
        if (block) {
          quoteBlocks.push(block)
        }
      }
      return {
        type: 'blockquote',
        content: quoteBlocks,
      }

    case 'ul':
      return {
        type: 'list',
        ordered: false,
        items: parseListItems(element),
      }

    case 'ol':
      return {
        type: 'list',
        ordered: true,
        items: parseListItems(element),
      }

    case 'pre':
      const code = element.querySelector('code')
      return {
        type: 'code',
        language: '',
        content: code ? code.textContent || '' : element.textContent || '',
      }

    case 'hr':
      // 检查是否是分页符
      if (element.getAttribute('data-type') === 'pagebreak') {
        return {
          type: 'pagebreak',
        }
      }
      return {
        type: 'divider',
      }

    case 'img':
      const widthAttr = element.getAttribute('width')
      const parsedWidth = widthAttr ? parseInt(widthAttr) : undefined
      return {
        type: 'image',
        src: element.getAttribute('src') || '',
        alt: element.getAttribute('alt') || '',
        width: parsedWidth,
        height: parseInt(element.getAttribute('height') || '0') || undefined,
      }

    default:
      return null
  }
}

/**
 * 解析列表项
 */
function parseListItems(listElement: HTMLElement): Array<{ content: InlineContent[] }> {
  const items: Array<{ content: InlineContent[] }> = []

  for (const li of listElement.querySelectorAll(':scope > li')) {
    items.push({
      content: parseInlineContent(li),
    })
  }

  return items
}

/**
 * 解析行内内容（递归解析HTML保留样式）
 */
function parseInlineContent(element: Node): InlineContent[] {
  const result: InlineContent[] = []

  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      // 纯文本节点
      const text = node.textContent || ''
      if (text) {
        result.push({ type: 'text', content: text })
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      const tagName = el.tagName.toLowerCase()

      // 处理span标签，提取color和font-family
      if (tagName === 'span') {
        const style: { color?: string; fontFamily?: string } = {}
        const computedColor = el.style.color
        const computedFontFamily = el.style.fontFamily

        if (computedColor) {
          style.color = computedColor
        }
        if (computedFontFamily) {
          style.fontFamily = computedFontFamily
        }

        // 如果有样式，将整个span的内容作为带样式的文本
        if (Object.keys(style).length > 0) {
          const innerContent = parseInlineContent(el)
          // 将所有子内容合并为单个文本（如果都是纯文本）
          const allText = innerContent.map(c => c.type === 'text' ? c.content : '').join('')
          if (allText) {
            result.push({ type: 'text', content: allText, style })
          } else {
            // 如果有复杂内容，递归处理
            result.push(...innerContent)
          }
          continue
        }
        // 没有样式的span，递归处理子内容
        result.push(...parseInlineContent(el))
        continue
      }

      switch (tagName) {
        case 'strong':
        case 'b':
          result.push({
            type: 'bold',
            content: parseInlineContent(el),
          })
          break

        case 'em':
        case 'i':
          result.push({
            type: 'italic',
            content: parseInlineContent(el),
          })
          break

        case 'u':
          result.push({
            type: 'underline',
            content: parseInlineContent(el),
          })
          break

        case 's':
        case 'strike':
        case 'del':
          result.push({
            type: 'strikethrough',
            content: parseInlineContent(el),
          })
          break

        case 'code':
          result.push({
            type: 'code',
            content: el.textContent || '',
          })
          break

        case 'a':
          result.push({
            type: 'link',
            href: el.getAttribute('href') || '',
            content: parseInlineContent(el),
          })
          break

        case 'img':
          result.push({
            type: 'image',
            src: el.getAttribute('src') || '',
            alt: el.getAttribute('alt') || '',
          })
          break

        case 'br':
          result.push({ type: 'break' })
          break

        default:
          // 其他标签，递归解析子内容
          result.push(...parseInlineContent(el))
          break
      }
    }
  }

  return result
}
