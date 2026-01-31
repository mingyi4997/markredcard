// 主题相关类型定义

export interface ThemeColors {
  background: string        // 背景色
  title: string            // 标题色
  body: string             // 正文色
  accent: string           // 强调色（用于链接、装饰等）
  blockquoteBg: string     // 引用块背景
  blockquoteBorder: string // 引用块边框
  codeBg: string           // 代码块背景
  codeText: string         // 代码块文字
  tableHeaderBg: string    // 表头背景
  tableStripeBg: string    // 表格斑马纹背景
  divider: string          // 分割线颜色
}

export interface ThemeFonts {
  title: string   // 标题字体
  body: string    // 正文字体
  code: string    // 代码字体
}

export interface Theme {
  id: string
  name: string
  colors: ThemeColors
  fonts: ThemeFonts
}

// 预设主题ID
export type ThemeId =
  | 'classic-white'
  | 'warm-orange'
  | 'mint-green'
  | 'starry-blue'
  | 'cherry-pink'
  | 'elegant-gray'
