// 富文本编辑器工具栏

import { Editor } from '@tiptap/react'
import { useCallback } from 'react'
import { convertEmojiInHTML } from '@/utils/emojiConverter'

interface RichTextToolbarProps {
  editor: Editor
}

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  // 上传图片
  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result as string
          editor.chain().focus().setImage({ src: base64 }).run()
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }, [editor])

  // 转换小红书表情
  const handleConvertEmoji = useCallback(() => {
    const html = editor.getHTML()
    const converted = convertEmojiInHTML(html)
    if (converted !== html) {
      editor.commands.setContent(converted)
      alert('✅ 表情转换完成！')
    } else {
      alert('ℹ️ 没有发现需要转换的小红书表情')
    }
  }, [editor])

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex flex-wrap gap-1 items-center">
        {/* 标题 */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 font-bold' : ''
            }`}
            title="标题 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 font-bold' : ''
            }`}
            title="标题 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 font-bold' : ''
            }`}
            title="标题 3"
          >
            H3
          </button>
        </div>

        {/* 文字格式 */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 font-bold ${
              editor.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            title="加粗 (Ctrl+B)"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 italic ${
              editor.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            title="斜体 (Ctrl+I)"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 underline ${
              editor.isActive('underline') ? 'bg-gray-200' : ''
            }`}
            title="下划线 (Ctrl+U)"
          >
            U
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 line-through ${
              editor.isActive('strike') ? 'bg-gray-200' : ''
            }`}
            title="删除线"
          >
            S
          </button>
          <input
            type="color"
            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            className="w-8 h-7 rounded cursor-pointer border border-gray-300"
            title="文字颜色"
          />
          <select
            onChange={(e) => {
              const value = e.target.value
              if (value) {
                editor.chain().focus().setFontFamily(value).run()
              } else {
                editor.chain().focus().unsetFontFamily().run()
              }
            }}
            className="px-2 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
            title="字体"
          >
            <option value="">默认字体</option>
            <option value='"Noto Sans SC", "Source Han Sans CN", sans-serif'>思源黑体</option>
            <option value='"Noto Serif SC", "Source Han Serif CN", serif'>思源宋体</option>
            <option value='"PingFang SC", -apple-system, BlinkMacSystemFont, sans-serif'>苹方</option>
            <option value='"Microsoft YaHei", sans-serif'>微软雅黑</option>
            <option value='SimSun, serif'>宋体</option>
            <option value='SimHei, sans-serif'>黑体</option>
            <option value='Arial, sans-serif'>Arial</option>
            <option value='Georgia, serif'>Georgia</option>
            <option value='"Times New Roman", serif'>Times New Roman</option>
            <option value='Monaco, Consolas, monospace'>Monaco</option>
          </select>
        </div>

        {/* 对齐 */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
            }`}
            title="左对齐"
          >
            ≡
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
            }`}
            title="居中"
          >
            ≣
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
            }`}
            title="右对齐"
          >
            ≡
          </button>
        </div>

        {/* 列表 */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            title="无序列表"
          >
            • 列表
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            title="有序列表"
          >
            1. 列表
          </button>
        </div>

        {/* 引用和代码 */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive('blockquote') ? 'bg-gray-200' : ''
            }`}
            title="引用"
          >
            " 引用
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-2 py-1 text-sm rounded hover:bg-gray-100 ${
              editor.isActive('codeBlock') ? 'bg-gray-200' : ''
            }`}
            title="代码块"
          >
            &lt;/&gt;
          </button>
        </div>

        {/* 图片 */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={handleImageUpload}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100"
            title="插入图片 (也可以直接粘贴)"
          >
            🖼️ 图片
          </button>
        </div>

        {/* 分割线和换页 */}
        <div className="flex gap-1 border-r pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100"
            title="分割线"
          >
            ―
          </button>
          <button
            onClick={() => editor.chain().focus().setPageBreak().run()}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 text-blue-600 font-semibold"
            title="换页（强制分页）"
          >
            📄 换页
          </button>
        </div>

        {/* 表情转换 */}
        <div className="flex gap-1">
          <button
            onClick={handleConvertEmoji}
            className="px-2 py-1 text-sm rounded hover:bg-gray-100 text-orange-600"
            title="转换小红书表情为emoji"
          >
            😊 表情
          </button>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="text-xs text-gray-500 mt-2">
        💡 提示：<strong>Ctrl+V 粘贴图片</strong> | <strong>拖拽图片</strong>调整大小 | 粘贴小红书内容<strong>自动转换表情</strong>
      </div>
    </div>
  )
}
