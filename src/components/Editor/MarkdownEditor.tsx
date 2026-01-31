// Markdown 编辑器组件

import { useEditorStore } from '@/stores/editorStore'
import { useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'

export function MarkdownEditor() {
  const { markdown: content, setMarkdown, loadFromLocalStorage } = useEditorStore()

  // 组件挂载时从 localStorage 加载内容
  useEffect(() => {
    loadFromLocalStorage()
  }, [])

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-medium text-gray-700">Markdown 编辑器</h2>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={content}
          onChange={(value) => setMarkdown(value)}
          extensions={[
            markdown({
              base: markdownLanguage,
            }),
          ]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          height="100%"
          style={{
            fontSize: '14px',
            height: '100%',
          }}
        />
      </div>
    </div>
  )
}
