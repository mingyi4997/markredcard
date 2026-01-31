// 富文本编辑器组件

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import { ResizableImage } from '@/extensions/ResizableImage'
import { PageBreak } from '@/extensions/PageBreak'
import { useEditorStore } from '@/stores/editorStore'
import { RichTextToolbar } from './RichTextToolbar'
import { convertEmojiInHTML } from '@/utils/emojiConverter'

export function RichTextEditor() {
  const { markdown: content, setMarkdown, loadFromLocalStorage } = useEditorStore()

  // 创建编辑器实例
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage.configure({
        inline: false,
        allowBase64: true,
      }),
      PageBreak,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
        alignments: ['left', 'center', 'right'],
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      // 保存为 HTML 格式，并转换小红书表情
      const html = editor.getHTML()
      const convertedHtml = convertEmojiInHTML(html)
      setMarkdown(convertedHtml)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: 100%; padding: 20px;',
      },
      // 处理粘贴图片和文本
      handlePaste: (_view, event) => {
        const items = Array.from(event.clipboardData?.items || [])

        // 处理图片粘贴
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            event.preventDefault()

            const file = item.getAsFile()
            if (file) {
              const reader = new FileReader()

              reader.onload = (e) => {
                const base64 = e.target?.result as string
                editor?.chain().focus().setImage({ src: base64 }).run()
              }

              reader.readAsDataURL(file)
              return true
            }
          }
        }

        // 处理文本粘贴，转换小红书表情
        const text = event.clipboardData?.getData('text/plain')
        if (text && /\[[^\]]+\]/.test(text)) {
          event.preventDefault()
          const convertedText = convertEmojiInHTML(text)
          editor?.commands.insertContent(convertedText)
          return true
        }

        return false
      },
      // 处理拖拽图片
      handleDrop: (_view, event) => {
        const files = Array.from(event.dataTransfer?.files || [])

        for (const file of files) {
          if (file.type.indexOf('image') === 0) {
            event.preventDefault()

            const reader = new FileReader()

            reader.onload = (e) => {
              const base64 = e.target?.result as string
              editor?.chain().focus().setImage({ src: base64 }).run()
            }

            reader.readAsDataURL(file)
            return true
          }
        }

        return false
      },
    },
  })

  // 组件挂载时加载内容
  useEffect(() => {
    loadFromLocalStorage()
  }, [])

  // 更新编辑器内容
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 标题栏 - 固定 */}
      <div className="px-4 py-2.5 bg-white border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          编辑器
        </h2>
      </div>

      {/* 工具栏 - 固定 */}
      {editor && (
        <div className="flex-shrink-0">
          <RichTextToolbar editor={editor} />
        </div>
      )}

      {/* 编辑器内容区 - 可滚动 */}
      <div className="flex-1 overflow-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
