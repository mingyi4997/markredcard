// 卡片预览组件

import { useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useMarkdown } from '@/hooks/useMarkdown'
import { Card } from './Card'

export function CardPreview() {
  const { markdown, setCards } = useEditorStore()
  const { settings } = useSettingsStore()

  // 解析和分页
  const { cards } = useMarkdown(markdown, settings)

  // 更新 store 中的卡片数据
  useEffect(() => {
    setCards(cards)
  }, [cards, setCards])

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 标题栏 - 固定 */}
      <div className="px-4 py-2.5 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            预览
          </h2>
          <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200 font-medium">
            {cards.length} 张卡片
          </span>
        </div>
      </div>

      {/* 卡片区域 - 可滚动 */}
      <div className="flex-1 overflow-auto p-8">
        {cards.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg mb-2">还没有内容</p>
              <p className="text-sm">在左侧编辑器中输入 Markdown 内容</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 max-w-6xl mx-auto">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                totalCards={cards.length}
                settings={settings}
                scale={0.25}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
