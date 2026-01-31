// 卡片相关类型定义

import { ContentBlock } from './markdown'

// 单张卡片
export interface Card {
  id: string            // 卡片唯一ID
  index: number         // 卡片序号（从 0 开始）
  blocks: ContentBlock[] // 该卡片包含的内容块
  isCover: boolean      // 是否为封面卡片
}

// 编辑器状态
export interface EditorState {
  markdown: string       // Markdown 原始内容
  cards: Card[]         // 分页后的卡片列表
  totalCards: number    // 总卡片数
  wordCount: number     // 字数统计
  lastSaved: Date | null // 最后保存时间
  isDirty: boolean      // 是否有未保存的更改
}

// 导出状态
export interface ExportState {
  isExporting: boolean   // 是否正在导出
  progress: number       // 导出进度 (0-100)
  currentCard: number    // 当前正在导出的卡片序号
  totalCards: number     // 总卡片数
  error: string | null   // 错误信息
}
