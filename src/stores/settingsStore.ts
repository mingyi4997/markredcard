// 设置状态管理

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings, CardRatio, PageNumberStyle, PageNumberPosition } from '@/types/settings'
import { CARD_SIZES, DEFAULT_PADDING } from '@/types/settings'
import { defaultTheme } from '@/core/themes/presets'
import { STORAGE_KEYS } from '@/utils/constants'

interface SettingsStore {
  settings: Settings

  // Actions
  setTheme: (theme: Settings['theme']) => void
  setCardRatio: (ratio: CardRatio) => void
  setCustomCardSize: (width: number, height: number) => void
  setPadding: (padding: number) => void
  setPaddingTop: (top: number) => void
  setPaddingBottom: (bottom: number) => void
  setPaddingLeft: (left: number) => void
  setPaddingRight: (right: number) => void
  setFontSize: (size: Settings['fontSize']) => void
  setLineHeight: (height: Settings['lineHeight']) => void
  setPageNumberEnabled: (enabled: boolean) => void
  setPageNumberStyle: (style: PageNumberStyle) => void
  setPageNumberPosition: (position: PageNumberPosition) => void
  setCoverMode: (enabled: boolean) => void
  setHeadingBarEnabled: (enabled: boolean) => void
  setHeadingBarColor: (color: string) => void
  setBlockquoteBorderEnabled: (enabled: boolean) => void
  setBlockquoteBorderColor: (color: string) => void
  setImageBorderEnabled: (enabled: boolean) => void
  setImageBorderColor: (color: string) => void
  setTitleFont: (font: string | undefined) => void
  setBodyFont: (font: string | undefined) => void
  setCodeFont: (font: string | undefined) => void
  resetSettings: () => void
}

// 默认设置
const defaultSettings: Settings = {
  theme: defaultTheme,
  cardSize: CARD_SIZES['3:4'],
  padding: DEFAULT_PADDING,
  fontSize: 'medium',
  lineHeight: 'normal',
  pageNumber: {
    enabled: false,
    style: 'fraction',
    position: 'bottom-center',
  },
  coverMode: false,
  exportFormat: 'png',
  exportQuality: 'high',
  exportScale: 2,
  styleEnhancement: {
    headingBar: {
      enabled: false,
      color: '#B0150D',
    },
    blockquoteBorder: {
      enabled: false,
      color: '#B0150D',
    },
    imageBorder: {
      enabled: false,
      color: '#B0150D',
    },
  },
  fontConfig: {
    titleFont: undefined,
    bodyFont: undefined,
    codeFont: undefined,
  },
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),

      setCardRatio: (ratio) =>
        set((state) => ({
          settings: {
            ...state.settings,
            cardSize: ratio === 'custom'
              ? { ...state.settings.cardSize, ratio: 'custom' }
              : CARD_SIZES[ratio],
          },
        })),

      setCustomCardSize: (width, height) =>
        set((state) => ({
          settings: {
            ...state.settings,
            cardSize: { width, height, ratio: 'custom' },
          },
        })),

      setPadding: (padding) =>
        set((state) => ({
          settings: {
            ...state.settings,
            padding: {
              top: padding,
              bottom: padding,
              left: padding,
              right: padding,
            },
          },
        })),

      setPaddingTop: (top) =>
        set((state) => ({
          settings: {
            ...state.settings,
            padding: { ...state.settings.padding, top },
          },
        })),

      setPaddingBottom: (bottom) =>
        set((state) => ({
          settings: {
            ...state.settings,
            padding: { ...state.settings.padding, bottom },
          },
        })),

      setPaddingLeft: (left) =>
        set((state) => ({
          settings: {
            ...state.settings,
            padding: { ...state.settings.padding, left },
          },
        })),

      setPaddingRight: (right) =>
        set((state) => ({
          settings: {
            ...state.settings,
            padding: { ...state.settings.padding, right },
          },
        })),

      setFontSize: (fontSize) =>
        set((state) => ({
          settings: { ...state.settings, fontSize },
        })),

      setLineHeight: (lineHeight) =>
        set((state) => ({
          settings: { ...state.settings, lineHeight },
        })),

      setPageNumberEnabled: (enabled) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pageNumber: { ...state.settings.pageNumber, enabled },
          },
        })),

      setPageNumberStyle: (style) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pageNumber: { ...state.settings.pageNumber, style },
          },
        })),

      setPageNumberPosition: (position) =>
        set((state) => ({
          settings: {
            ...state.settings,
            pageNumber: { ...state.settings.pageNumber, position },
          },
        })),

      setCoverMode: (coverMode) =>
        set((state) => ({
          settings: { ...state.settings, coverMode },
        })),

      setHeadingBarEnabled: (enabled) =>
        set((state) => ({
          settings: {
            ...state.settings,
            styleEnhancement: {
              ...state.settings.styleEnhancement,
              headingBar: { ...state.settings.styleEnhancement.headingBar, enabled },
            },
          },
        })),

      setHeadingBarColor: (color) =>
        set((state) => ({
          settings: {
            ...state.settings,
            styleEnhancement: {
              ...state.settings.styleEnhancement,
              headingBar: { ...state.settings.styleEnhancement.headingBar, color },
            },
          },
        })),

      setBlockquoteBorderEnabled: (enabled) =>
        set((state) => ({
          settings: {
            ...state.settings,
            styleEnhancement: {
              ...state.settings.styleEnhancement,
              blockquoteBorder: { ...state.settings.styleEnhancement.blockquoteBorder, enabled },
            },
          },
        })),

      setBlockquoteBorderColor: (color) =>
        set((state) => ({
          settings: {
            ...state.settings,
            styleEnhancement: {
              ...state.settings.styleEnhancement,
              blockquoteBorder: { ...state.settings.styleEnhancement.blockquoteBorder, color },
            },
          },
        })),

      setImageBorderEnabled: (enabled) =>
        set((state) => ({
          settings: {
            ...state.settings,
            styleEnhancement: {
              ...state.settings.styleEnhancement,
              imageBorder: { ...state.settings.styleEnhancement.imageBorder, enabled },
            },
          },
        })),

      setImageBorderColor: (color) =>
        set((state) => ({
          settings: {
            ...state.settings,
            styleEnhancement: {
              ...state.settings.styleEnhancement,
              imageBorder: { ...state.settings.styleEnhancement.imageBorder, color },
            },
          },
        })),

      setTitleFont: (titleFont) =>
        set((state) => ({
          settings: {
            ...state.settings,
            fontConfig: { ...state.settings.fontConfig, titleFont },
          },
        })),

      setBodyFont: (bodyFont) =>
        set((state) => ({
          settings: {
            ...state.settings,
            fontConfig: { ...state.settings.fontConfig, bodyFont },
          },
        })),

      setCodeFont: (codeFont) =>
        set((state) => ({
          settings: {
            ...state.settings,
            fontConfig: { ...state.settings.fontConfig, codeFont },
          },
        })),

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      partialize: (state) => ({
        settings: {
          ...state.settings,
          // 只保存主题 ID，不保存完整主题对象
          theme: { id: state.settings.theme.id } as any,
        },
      }),
    }
  )
)
