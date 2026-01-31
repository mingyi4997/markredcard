// 编辑器状态管理

import { create } from 'zustand'
import type { EditorState } from '@/types/card'
import type { Card } from '@/types/card'
import { STORAGE_KEYS, EXAMPLE_MARKDOWN } from '@/utils/constants'

interface EditorStore extends EditorState {
  // Actions
  setMarkdown: (markdown: string) => void
  setCards: (cards: Card[]) => void
  updateWordCount: (count: number) => void
  markAsSaved: () => void
  markAsDirty: () => void
  loadFromLocalStorage: () => void
  saveToLocalStorage: () => void
  clearContent: () => void
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  markdown: '',
  cards: [],
  totalCards: 0,
  wordCount: 0,
  lastSaved: null,
  isDirty: false,

  // Actions
  setMarkdown: (markdown) => {
    set({ markdown, isDirty: true })
    // 自动保存到 localStorage
    setTimeout(() => {
      get().saveToLocalStorage()
    }, 500)
  },

  setCards: (cards) =>
    set({
      cards,
      totalCards: cards.length,
    }),

  updateWordCount: (wordCount) => set({ wordCount }),

  markAsSaved: () =>
    set({
      lastSaved: new Date(),
      isDirty: false,
    }),

  markAsDirty: () => set({ isDirty: true }),

  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MARKDOWN_CONTENT)
      if (saved) {
        set({
          markdown: saved,
          isDirty: false,
          lastSaved: new Date(),
        })
      } else {
        // 首次访问，加载示例内容
        set({
          markdown: EXAMPLE_MARKDOWN,
          isDirty: false,
        })
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      // 加载失败，使用示例内容
      set({
        markdown: EXAMPLE_MARKDOWN,
        isDirty: false,
      })
    }
  },

  saveToLocalStorage: () => {
    try {
      const { markdown } = get()
      localStorage.setItem(STORAGE_KEYS.MARKDOWN_CONTENT, markdown)
      set({
        lastSaved: new Date(),
        isDirty: false,
      })
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  clearContent: () => {
    set({
      markdown: '',
      cards: [],
      totalCards: 0,
      wordCount: 0,
      isDirty: true,
    })
    localStorage.removeItem(STORAGE_KEYS.MARKDOWN_CONTENT)
  },
}))
