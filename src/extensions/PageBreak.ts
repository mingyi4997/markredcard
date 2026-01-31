// 分页符扩展
import { Node, mergeAttributes } from '@tiptap/core'

export const PageBreak = Node.create({
  name: 'pageBreak',

  group: 'block',

  parseHTML() {
    return [
      {
        tag: 'hr[data-type="pagebreak"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'hr',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'pagebreak',
        class: 'pagebreak-divider',
      }),
    ]
  },

  addCommands() {
    return {
      setPageBreak:
        () =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
          })
        },
    }
  },
})
