// 内容处理 Hook（支持 Markdown 和富文本）

import { useMemo } from 'react'
import { parseHTML } from '@/core/richtext/htmlParser'
import { paginate } from '@/core/pagination/paginator'
import type { Settings } from '@/types/settings'

/**
 * 解析内容并分页
 * 自动检测是 Markdown 还是 HTML
 */
export function useMarkdown(content: string, settings: Settings) {
  const parsed = useMemo(() => {
    if (!content || !content.trim() || content === '<p></p>') {
      return { blocks: [], cards: [] }
    }

    // 检测是否是 HTML（富文本编辑器输出）
    const isHTML = content.trim().startsWith('<')

    let blocks
    if (isHTML) {
      // 解析 HTML（富文本）
      blocks = parseHTML(content)
    } else {
      // 暂时使用 HTML 解析器（因为富文本编辑器输出的就是 HTML）
      blocks = parseHTML(content)
    }

    // 分页
    const cards = paginate(blocks, settings)

    return { blocks, cards }
  }, [content, settings])

  return parsed
}
