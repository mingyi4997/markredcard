// 单个卡片组件

import { useState } from 'react'
import type { Card as CardType } from '@/types/card'
import type { Settings } from '@/types/settings'
import { renderBlocks } from '@/core/markdown/renderer'
import { PageNumber } from './PageNumber'
import { FONT_SIZES, LINE_HEIGHTS } from '@/types/settings'
import { toPng } from 'html-to-image'

interface CardProps {
  card: CardType
  totalCards: number
  settings: Settings
  scale?: number
  isExportView?: boolean // 是否是导出视图（原始尺寸）
}

export function Card({ card, totalCards, settings, scale = 0.3, isExportView = false }: CardProps) {
  const { cardSize, padding, theme, fontSize, lineHeight, pageNumber, styleEnhancement } = settings
  const [isHovered, setIsHovered] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // 渲染内容块
  const content = renderBlocks(card.blocks, {
    theme,
    fontSize: FONT_SIZES[fontSize],
    lineHeight: LINE_HEIGHTS[lineHeight],
    styleEnhancement,
  })

  // 下载单张卡片
  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // 创建隐藏的导出容器
      const exportContainer = document.createElement('div')
      exportContainer.style.position = 'absolute'
      exportContainer.style.left = '-9999px'
      exportContainer.style.top = '0'
      document.body.appendChild(exportContainer)

      // 创建原始尺寸的卡片
      const exportCard = document.createElement('div')
      exportCard.className = 'card-export'
      exportCard.style.width = `${cardSize.width}px`
      exportCard.style.height = `${cardSize.height}px`
      exportCard.style.backgroundColor = theme.colors.background
      exportCard.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
      exportCard.style.position = 'relative'
      exportCard.style.overflow = 'hidden'

      // 渲染内容
      const contentDiv = document.createElement('div')
      contentDiv.style.height = '100%'
      contentDiv.style.overflow = 'hidden'

      // 使用React渲染到DOM（简化版，直接复制当前卡片内容）
      const cardElement = document.querySelector(`[data-card-id="${card.id}"]`)
      if (cardElement) {
        const clonedContent = cardElement.cloneNode(true) as HTMLElement
        // 移除transform缩放
        clonedContent.style.transform = 'none'
        clonedContent.style.width = `${cardSize.width}px`
        clonedContent.style.height = `${cardSize.height}px`
        exportContainer.appendChild(clonedContent)

        // 等待渲染
        await new Promise((resolve) => setTimeout(resolve, 100))

        // 导出为图片
        const dataUrl = await toPng(clonedContent, {
          width: cardSize.width,
          height: cardSize.height,
          pixelRatio: 2,
          cacheBust: true,
        })

        // 下载
        const link = document.createElement('a')
        link.download = `card-${String(card.index + 1).padStart(2, '0')}.png`
        link.href = dataUrl
        link.click()
      }

      // 清理
      document.body.removeChild(exportContainer)
    } catch (error) {
      console.error('下载失败:', error)
      alert('下载失败，请重试')
    } finally {
      setIsDownloading(false)
    }
  }

  // 导出视图：原始尺寸，不缩放
  if (isExportView) {
    return (
      <div
        className="card-export"
        data-card-id={card.id}
        style={{
          width: cardSize.width,
          height: cardSize.height,
          backgroundColor: theme.colors.background,
          padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 内容区域 */}
        <div
          style={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {content}
        </div>

        {/* 页码 */}
        <PageNumber
          current={card.index + 1}
          total={totalCards}
          config={pageNumber}
          theme={theme}
        />
      </div>
    )
  }

  // 预览视图：缩放显示
  const scaledWidth = cardSize.width * scale
  const scaledHeight = cardSize.height * scale

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        className="card-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: scaledWidth,
          height: scaledHeight,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div
          className="card-content"
          data-card-id={card.id}
          style={{
            width: cardSize.width,
            height: cardSize.height,
            backgroundColor: theme.colors.background,
            padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 内容区域 */}
          <div
            style={{
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {content}
          </div>

          {/* 页码 */}
          <PageNumber
            current={card.index + 1}
            total={totalCards}
            config={pageNumber}
            theme={theme}
          />
        </div>
      </div>

      {/* 下载按钮 */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          opacity: isHovered || isDownloading ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        {isDownloading ? '下载中...' : '📥 下载'}
      </button>
    </div>
  )
}
