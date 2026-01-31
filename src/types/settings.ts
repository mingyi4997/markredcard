// 设置相关类型定义

import { Theme } from './theme'

// 卡片尺寸
export type CardRatio = '3:4' | '1:1' | '4:3' | '16:9' | '2:3' | '9:16' | 'custom'

export interface CardSize {
  width: number   // 宽度（px）
  height: number  // 高度（px）
  ratio: CardRatio
}

// 边距设置
export interface Padding {
  top: number
  bottom: number
  left: number
  right: number
}

// 字体大小
export type FontSize = 'small' | 'medium' | 'large'

// 行高
export type LineHeight = 'compact' | 'normal' | 'loose'

// 页码样式
export type PageNumberStyle = 'fraction' | 'circle' | 'dash' // 1/5 | ① | - 1 -

// 页码位置
export type PageNumberPosition = 'bottom-center' | 'bottom-right' | 'top-right'

// 页码配置
export interface PageNumberConfig {
  enabled: boolean
  style: PageNumberStyle
  position: PageNumberPosition
}

// 导出格式
export type ExportFormat = 'png' | 'jpg'

// 导出质量
export type ExportQuality = 'high' | 'medium' | 'low'

// 导出缩放
export type ExportScale = 1 | 2

// 样式增强配置
export interface StyleEnhancement {
  headingBar: {
    enabled: boolean
    color: string
  }
  blockquoteBorder: {
    enabled: boolean
    color: string
  }
  imageBorder: {
    enabled: boolean
    color: string
  }
}

// 字体配置
export interface FontConfig {
  titleFont?: string // 标题字体，可选，不设置则使用主题默认
  bodyFont?: string  // 正文字体，可选，不设置则使用主题默认
  codeFont?: string  // 代码字体，可选，不设置则使用主题默认
}

// 全局设置
export interface Settings {
  theme: Theme
  cardSize: CardSize
  padding: Padding
  fontSize: FontSize
  lineHeight: LineHeight
  pageNumber: PageNumberConfig
  coverMode: boolean // 是否启用封面模式
  exportFormat: ExportFormat
  exportQuality: ExportQuality
  exportScale: ExportScale
  styleEnhancement: StyleEnhancement
  fontConfig: FontConfig
}

// 默认卡片尺寸配置
export const CARD_SIZES: Record<Exclude<CardRatio, 'custom'>, CardSize> = {
  '3:4': { width: 1080, height: 1440, ratio: '3:4' },
  '1:1': { width: 1080, height: 1080, ratio: '1:1' },
  '4:3': { width: 1080, height: 810, ratio: '4:3' },
  '16:9': { width: 1080, height: 608, ratio: '16:9' },
  '2:3': { width: 1080, height: 1620, ratio: '2:3' },
  '9:16': { width: 1080, height: 1920, ratio: '9:16' },
}

// 默认边距
export const DEFAULT_PADDING: Padding = {
  top: 80,
  bottom: 80,
  left: 80,
  right: 80,
}

// 字号映射（基于 1080px 宽度）
export const FONT_SIZES: Record<FontSize, number> = {
  small: 28,
  medium: 32,
  large: 36,
}

// 行高映射
export const LINE_HEIGHTS: Record<LineHeight, number> = {
  compact: 1.5,
  normal: 1.8,
  loose: 2.1,
}

// 可用字体列表
export const AVAILABLE_FONTS = [
  { name: '默认', value: '' },
  { name: '思源黑体', value: '"Noto Sans SC", "Source Han Sans CN", sans-serif' },
  { name: '思源宋体', value: '"Noto Serif SC", "Source Han Serif CN", serif' },
  { name: '苹方', value: '"PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif' },
  { name: '微软雅黑', value: '"Microsoft YaHei", sans-serif' },
  { name: '宋体', value: 'SimSun, serif' },
  { name: '黑体', value: 'SimHei, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
]

// 代码字体列表
export const CODE_FONTS = [
  { name: '默认', value: '' },
  { name: 'Monaco', value: 'Monaco, Consolas, monospace' },
  { name: 'Consolas', value: 'Consolas, Monaco, monospace' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'Fira Code', value: '"Fira Code", monospace' },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
]
