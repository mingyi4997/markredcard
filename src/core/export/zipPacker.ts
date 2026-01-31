// ZIP 打包器 - 将多个图片打包为 ZIP

import JSZip from 'jszip'
import { saveAs } from 'file-saver'

/**
 * 将多个图片 Blob 打包为 ZIP 并下载
 */
export async function packAndDownloadZip(
  blobs: Blob[],
  filename: string = 'markredcard-cards.zip'
): Promise<void> {
  try {
    const zip = new JSZip()

    // 添加所有图片到 ZIP
    blobs.forEach((blob, index) => {
      // 文件命名：01.png, 02.png, ...
      const paddedIndex = String(index + 1).padStart(2, '0')
      zip.file(`${paddedIndex}.png`, blob)
    })

    // 生成 ZIP 文件
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6, // 压缩级别 1-9
      },
    })

    // 下载 ZIP 文件
    saveAs(zipBlob, filename)
  } catch (error) {
    console.error('打包 ZIP 失败:', error)
    throw new Error('打包 ZIP 失败，请重试')
  }
}
