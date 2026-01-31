// Tiptap 扩展类型定义
import '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      /**
       * 插入分页符
       */
      setPageBreak: () => ReturnType
    }
  }
}
