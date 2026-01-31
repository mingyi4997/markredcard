// 导出按钮组件

import { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useEditorStore } from '@/stores/editorStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { Card } from '@/components/Preview/Card'
import { exportAllCards } from '@/core/export/imageGenerator'
import { packAndDownloadZip } from '@/core/export/zipPacker'

export function ExportButton() {
  const { cards } = useEditorStore()
  const { settings } = useSettingsStore()
  const [isExporting, setIsExporting] = useState(false)
  const [showSelection, setShowSelection] = useState(false)
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleExport = async (selectedOnly = false) => {
    if (cards.length === 0) {
      alert('没有可导出的卡片')
      return
    }

    // 确定要导出的卡片
    const cardsToExport = selectedOnly
      ? cards.filter((card) => selectedCards.has(card.id))
      : cards

    if (cardsToExport.length === 0) {
      alert('请至少选择一张卡片')
      return
    }

    try {
      setIsExporting(true)
      setProgress({ current: 0, total: cardsToExport.length })

      // 创建隐藏容器用于渲染原始尺寸卡片
      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.pointerEvents = 'none'
      document.body.appendChild(container)

      // 渲染所有要导出的卡片（原始尺寸）
      const root = createRoot(container)
      root.render(
        <>
          {cardsToExport.map((card) => (
            <Card
              key={card.id}
              card={card}
              totalCards={cards.length}
              settings={settings}
              isExportView={true}
            />
          ))}
        </>
      )

      // 等待渲染完成
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 获取所有渲染好的卡片元素
      const cardElements = container.querySelectorAll('.card-export')
      const elements = Array.from(cardElements) as HTMLElement[]

      // 批量导出卡片
      const blobs = await exportAllCards(elements, (current, total) => {
        setProgress({ current, total })
      })

      // 清理容器
      root.unmount()
      document.body.removeChild(container)

      // 打包为 ZIP 并下载
      await packAndDownloadZip(blobs, 'markredcard-cards.zip')

      alert(`成功导出 ${blobs.length} 张卡片！`)
      setShowSelection(false)
    } catch (error) {
      console.error('导出失败:', error)
      alert('导出失败，请重试')
    } finally {
      setIsExporting(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  const toggleCardSelection = (cardId: string) => {
    const newSelected = new Set(selectedCards)
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId)
    } else {
      newSelected.add(cardId)
    }
    setSelectedCards(newSelected)
  }

  const selectAll = () => {
    setSelectedCards(new Set(cards.map((card) => card.id)))
  }

  const deselectAll = () => {
    setSelectedCards(new Set())
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex gap-2">
        <button
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isExporting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
          }`}
          onClick={() => handleExport(false)}
          disabled={isExporting || cards.length === 0}
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              <span>导出中 {progress.current}/{progress.total}</span>
            </span>
          ) : (
            <span>全部导出</span>
          )}
        </button>

        <button
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200"
          onClick={() => setShowSelection(!showSelection)}
          disabled={isExporting || cards.length === 0}
        >
          选择导出
        </button>
      </div>

      {/* 选择面板 */}
      {showSelection && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-50 w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">选择要导出的卡片</h3>
            <button
              onClick={() => setShowSelection(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={selectAll}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            >
              全选
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
            >
              全不选
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto mb-3 space-y-1">
            {cards.map((card, index) => (
              <label
                key={card.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCards.has(card.id)}
                  onChange={() => toggleCardSelection(card.id)}
                  className="w-4 h-4"
                />
                <span className="text-sm">第 {index + 1} 张卡片</span>
              </label>
            ))}
          </div>

          <button
            onClick={() => handleExport(true)}
            disabled={selectedCards.size === 0}
            className={`w-full py-2 rounded text-sm font-medium ${
              selectedCards.size === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            导出选中的 {selectedCards.size} 张卡片
          </button>
        </div>
      )}

      {/* 进度提示 */}
      {isExporting && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-3 min-w-[200px] z-50">
          <div className="text-sm text-gray-700 mb-2">
            正在导出第 {progress.current} / {progress.total} 张卡片
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
