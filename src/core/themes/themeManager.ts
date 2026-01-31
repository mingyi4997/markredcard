// 主题管理器

import { Theme } from '@/types/theme'
import { presetThemes, defaultTheme } from './presets'

export class ThemeManager {
  private currentTheme: Theme

  constructor(theme?: Theme) {
    this.currentTheme = theme || defaultTheme
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): Theme {
    return this.currentTheme
  }

  /**
   * 设置当前主题
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme
  }

  /**
   * 根据 ID 设置主题
   */
  setThemeById(id: string): boolean {
    const theme = presetThemes.find((t) => t.id === id)
    if (theme) {
      this.currentTheme = theme
      return true
    }
    return false
  }

  /**
   * 获取所有预设主题
   */
  getPresetThemes(): Theme[] {
    return presetThemes
  }

  /**
   * 应用主题到 CSS 变量
   */
  applythemeToCSSVariables(): void {
    const { colors } = this.currentTheme
    const root = document.documentElement

    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-title', colors.title)
    root.style.setProperty('--color-body', colors.body)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-blockquote-bg', colors.blockquoteBg)
    root.style.setProperty('--color-blockquote-border', colors.blockquoteBorder)
    root.style.setProperty('--color-code-bg', colors.codeBg)
    root.style.setProperty('--color-code-text', colors.codeText)
    root.style.setProperty('--color-table-header-bg', colors.tableHeaderBg)
    root.style.setProperty('--color-table-stripe-bg', colors.tableStripeBg)
    root.style.setProperty('--color-divider', colors.divider)
  }

  /**
   * 生成主题 CSS 样式对象
   */
  getThemeStyles(): React.CSSProperties {
    const { colors, fonts } = this.currentTheme

    return {
      backgroundColor: colors.background,
      color: colors.body,
      fontFamily: fonts.body,
    }
  }
}

// 单例实例
export const themeManager = new ThemeManager()
