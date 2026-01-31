// Markdown 相关类型定义

export type Alignment = 'left' | 'center' | 'right'

// 行内内容类型
export type InlineContent =
  | { type: 'text'; content: string; style?: { color?: string; fontFamily?: string } }
  | { type: 'bold'; content: InlineContent[] }
  | { type: 'italic'; content: InlineContent[] }
  | { type: 'underline'; content: InlineContent[] }
  | { type: 'strikethrough'; content: InlineContent[] }
  | { type: 'code'; content: string }
  | { type: 'link'; href: string; content: InlineContent[] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'break' }

// 列表项
export interface ListItem {
  content: InlineContent[]
  children?: ListItem[] // 嵌套列表
}

// 内容块类型
export type ContentBlock =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; content: InlineContent[]; id?: string; textAlign?: Alignment }
  | { type: 'paragraph'; content: InlineContent[]; textAlign?: Alignment }
  | { type: 'blockquote'; content: ContentBlock[] }
  | { type: 'list'; ordered: boolean; items: ListItem[] }
  | { type: 'code'; language: string; content: string }
  | { type: 'table'; headers: string[]; aligns: Alignment[]; rows: string[][] }
  | { type: 'image'; src: string; alt: string; width?: number; height?: number }
  | { type: 'divider' }
  | { type: 'pagebreak' } // 强制分页符

// Markdown 解析结果
export interface ParsedMarkdown {
  blocks: ContentBlock[]
  meta?: {
    title?: string
    description?: string
  }
}
