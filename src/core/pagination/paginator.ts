// 智能分页算法 - 基于高度计算

import type { ContentBlock } from '@/types/markdown'
import type { Card } from '@/types/card'
import type { Settings } from '@/types/settings'
import { estimateBlockHeight } from './heightCalculator'
import { FONT_SIZES, LINE_HEIGHTS } from '@/types/settings'

/**
 * 智能分页算法
 * 根据内容块的实际高度进行分页，确保每页内容充实且不溢出
 */
export function paginate(blocks: ContentBlock[], settings: Settings): Card[] {
  const cards: Card[] = []

  // 计算卡片可用高度和宽度
  const availableHeight = getAvailableHeight(settings)
  const availableWidth = settings.cardSize.width - settings.padding.left - settings.padding.right
  const fontSize = FONT_SIZES[settings.fontSize]
  const lineHeight = LINE_HEIGHTS[settings.lineHeight]

  let currentBlocks: ContentBlock[] = []
  let currentHeight = 0
  let cardIndex = 0

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]

    // 遇到分页符，强制分页
    if (block.type === 'pagebreak') {
      if (currentBlocks.length > 0) {
        cards.push({
          id: `card-${cardIndex}`,
          index: cardIndex,
          blocks: currentBlocks,
          isCover: cardIndex === 0,
        })
        cardIndex++
        currentBlocks = []
        currentHeight = 0
      }
      continue
    }

    // 估算当前块的高度（传入可用宽度用于更准确的估算）
    const blockHeight = estimateBlockHeight(block, fontSize, lineHeight, availableWidth)

    // 检查是否需要分页（预留5%的安全边距用于CSS渲染误差）
    const safeHeight = availableHeight * 0.95
    if (currentBlocks.length > 0 && currentHeight + blockHeight > safeHeight) {
      // 当前页已满，创建新页
      cards.push({
        id: `card-${cardIndex}`,
        index: cardIndex,
        blocks: currentBlocks,
        isCover: cardIndex === 0,
      })
      cardIndex++
      currentBlocks = []
      currentHeight = 0
    }

    // 添加当前块到当前页
    currentBlocks.push(block)
    currentHeight += blockHeight
  }

  // 处理剩余的块
  if (currentBlocks.length > 0) {
    cards.push({
      id: `card-${cardIndex}`,
      index: cardIndex,
      blocks: currentBlocks,
      isCover: cardIndex === 0,
    })
  }

  // 如果没有卡片，返回一个空卡片
  if (cards.length === 0) {
    cards.push({
      id: 'card-0',
      index: 0,
      blocks: [],
      isCover: true,
    })
  }

  return cards
}

/**
 * 计算卡片的可用高度（减去padding和页码高度）
 */
function getAvailableHeight(settings: Settings): number {
  const { cardSize, padding, pageNumber } = settings

  let availableHeight = cardSize.height - padding.top - padding.bottom

  // 如果显示页码，减去页码高度
  if (pageNumber.enabled) {
    const pageNumberHeight = 60 // 页码区域高度（包括间距）
    availableHeight -= pageNumberHeight
  }

  return availableHeight
}
