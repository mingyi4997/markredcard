// 高度计算器 - 估算内容块的渲染高度

import type { ContentBlock } from '@/types/markdown'
import { HEADING_FONT_SIZES, HEADING_MARGINS } from '@/utils/constants'

/**
 * 估算内容块的高度（不需要实际渲染）
 * 用于快速分页计算
 */
export function estimateBlockHeight(
  block: ContentBlock,
  fontSize: number,
  lineHeight: number,
  availableWidth?: number
): number {
  const baseHeight = fontSize * lineHeight
  // 每行字符数基于实际宽度（中文字符约为fontSize宽度）
  const charsPerLine = availableWidth ? Math.floor(availableWidth / fontSize) : 30

  switch (block.type) {
    case 'heading':
      // 标题高度：标题字号 * lineHeight(1.3) + 底部间距
      const headingSize = HEADING_FONT_SIZES[block.level as keyof typeof HEADING_FONT_SIZES] || 32
      const headingMargin = HEADING_MARGINS[block.level as keyof typeof HEADING_MARGINS] || 12
      return headingSize * 1.3 + headingMargin

    case 'paragraph':
      // 段落高度：估算文本长度
      let textLength = 0
      for (const item of block.content) {
        if (item.type === 'text') {
          textLength += item.content.length
        }
      }
      // 根据实际宽度估算行数（中文字符宽度约为fontSize，英文约为fontSize*0.6）
      // 保守估算使用fontSize作为字符平均宽度
      const estimatedLines = Math.max(1, Math.ceil(textLength / charsPerLine))
      return estimatedLines * baseHeight + 24 // 加上段落间距

    case 'list':
      // 列表高度：每项高度 * 项数 + 整体marginBottom
      // 简化估算：假设每项只有一行文本
      const itemCount = block.items.length
      const itemMargin = 12 // 每项的marginBottom
      const listMargin = 24 // 整体的marginBottom
      return itemCount * (baseHeight + itemMargin) + listMargin

    case 'blockquote':
      // 引用高度：递归计算内部块高度（padding: 20px）
      let quoteHeight = 0
      for (const innerBlock of block.content) {
        quoteHeight += estimateBlockHeight(innerBlock, fontSize, lineHeight, availableWidth)
      }
      return quoteHeight + 40 // 加上引用padding(20px * 2)

    case 'code':
      // 代码块高度：行数 * 行高 + padding + 语言标签（如果有）
      // 代码块fontSize固定为28px, lineHeight为1.6
      const codeLines = block.content.split('\n').length
      const codeFontSize = 28
      const codeLineHeight = 1.6
      const languageHeight = block.language ? 14 + 12 : 0 // 语言标签 + marginBottom
      const padding = 24 * 2 // 上下padding
      const marginBottom = 24
      return languageHeight + (codeLines * codeFontSize * codeLineHeight) + padding + marginBottom

    case 'image':
      // 图片高度：使用实际高度或估算
      if (block.height) {
        // 使用实际高度 + 底部间距 + 可能的图片说明
        const captionHeight = block.alt ? 40 : 0
        return block.height + 24 + captionHeight
      }
      // 如果有宽度但没有高度，按4:3比例估算
      if (block.width) {
        const estimatedHeight = (block.width * 3) / 4
        const captionHeight = block.alt ? 40 : 0
        return estimatedHeight + 24 + captionHeight
      }
      // 默认图片高度（保守估算）
      return 500 // 增加默认高度以防溢出

    case 'divider':
      // 分割线高度
      return 40

    case 'table':
      // 表格高度：行数 * 行高
      const rowCount = (block.rows?.length || 1) + 1 // 包括表头
      return rowCount * 50 + 20

    default:
      return baseHeight
  }
}
