// 图片生成器 - 将卡片 DOM 转换为图片

import { toPng } from 'html-to-image'

/**
 * 将单个卡片元素转换为 PNG 图片
 */
export async function exportCardToImage(element: HTMLElement): Promise<Blob> {
  try {
    // 使用 html-to-image 将 DOM 转换为 PNG
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2, // 2x 提高清晰度
      cacheBust: true,
      style: {
        // 确保字体已加载
        fontFamily: 'inherit',
      },
      filter: (node) => {
        // 过滤掉不需要导出的元素（如调试信息）
        const element = node as HTMLElement
        return !element.classList?.contains('no-export')
      },
    })

    // 将 data URL 转换为 Blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()

    return blob
  } catch (error) {
    console.error('导出卡片失败:', error)
    throw new Error('导出卡片失败，请重试')
  }
}

/**
 * 批量导出所有卡片
 */
export async function exportAllCards(
  cardElements: HTMLElement[],
  onProgress?: (current: number, total: number) => void
): Promise<Blob[]> {
  const blobs: Blob[] = []
  const total = cardElements.length

  for (let i = 0; i < total; i++) {
    const element = cardElements[i]

    // 通知进度
    if (onProgress) {
      onProgress(i + 1, total)
    }

    // 等待一小段时间，确保渲染完成
    await new Promise((resolve) => setTimeout(resolve, 100))

    // 导出卡片
    const blob = await exportCardToImage(element)
    blobs.push(blob)
  }

  return blobs
}

/**
 * 下载单个图片
 */
export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
