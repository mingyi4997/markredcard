// 可调整大小的图片扩展

import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ResizableImageView } from '@/components/Editor/ResizableImage'

export const ResizableImage = Image.extend({
  name: 'resizableImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 400,
        renderHTML: (attributes) => {
          return {
            width: attributes.width,
          }
        },
        parseHTML: (element) => {
          return element.getAttribute('width') || 400
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})
