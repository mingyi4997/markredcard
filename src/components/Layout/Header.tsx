// 顶部工具栏组件

import { useSettingsStore } from '@/stores/settingsStore'
import { presetThemes } from '@/core/themes/presets'
import type { CardRatio } from '@/types/settings'
import { ExportButton } from '@/components/Export/ExportButton'
import { StyleSettings } from '@/components/Settings/StyleSettings'

export function Header() {
  const { settings, setTheme, setCardRatio, setCustomCardSize, setPaddingTop, setPaddingBottom, setPaddingLeft, setPaddingRight } = useSettingsStore()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50 backdrop-blur-lg bg-white/80">
      <div className="flex items-center justify-between max-w-[1800px] mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">🎴</span>
            <span className="tracking-tight">MarkRedCard</span>
          </div>
        </div>

        {/* 设置选项 */}
        <div className="flex items-center space-x-3">
          {/* 主题选择 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 font-medium">主题</label>
            <select
              value={settings.theme.id}
              onChange={(e) => {
                const theme = presetThemes.find((t) => t.id === e.target.value)
                if (theme) setTheme(theme)
              }}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-300 transition-colors"
            >
              {presetThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          {/* 尺寸选择 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 font-medium">尺寸</label>
            <select
              value={settings.cardSize.ratio}
              onChange={(e) => setCardRatio(e.target.value as CardRatio)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent hover:border-gray-300 transition-colors"
            >
              <option value="3:4">3:4</option>
              <option value="1:1">1:1</option>
              <option value="4:3">4:3</option>
              <option value="16:9">16:9</option>
              <option value="2:3">2:3</option>
              <option value="9:16">9:16</option>
              <option value="custom">自定义</option>
            </select>
            {settings.cardSize.ratio === 'custom' && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={settings.cardSize.width}
                  onChange={(e) => setCustomCardSize(Number(e.target.value), settings.cardSize.height)}
                  className="w-16 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="宽"
                  min="100"
                  max="3000"
                />
                <span className="text-xs text-gray-500">×</span>
                <input
                  type="number"
                  value={settings.cardSize.height}
                  onChange={(e) => setCustomCardSize(settings.cardSize.width, Number(e.target.value))}
                  className="w-16 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="高"
                  min="100"
                  max="3000"
                />
              </div>
            )}
          </div>

          {/* 内边距调整 */}
          <div className="flex items-center space-x-3 border-l border-gray-200 pl-3">
            <label className="text-sm text-gray-600 font-medium">边距</label>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-6">上</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={settings.padding.top}
                  onChange={(e) => setPaddingTop(Number(e.target.value))}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500 w-8">{settings.padding.top}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-6">下</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={settings.padding.bottom}
                  onChange={(e) => setPaddingBottom(Number(e.target.value))}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500 w-8">{settings.padding.bottom}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-6">左</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={settings.padding.left}
                  onChange={(e) => setPaddingLeft(Number(e.target.value))}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500 w-8">{settings.padding.left}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-6">右</span>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={settings.padding.right}
                  onChange={(e) => setPaddingRight(Number(e.target.value))}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500 w-8">{settings.padding.right}</span>
              </div>
            </div>
          </div>

          {/* 样式配置 */}
          <StyleSettings />

          {/* 导出按钮 */}
          <ExportButton />

          {/* 帮助按钮 */}
          <button
            className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-gray-200"
            onClick={() => alert('💡 使用提示：\n\n1. 直接编辑文字或粘贴内容\n2. Ctrl+V 粘贴图片\n3. 点击图片，拖动边缘调整大小\n4. 支持所有emoji 😊🎉\n5. 切换主题和尺寸实时预览\n6. 全部导出或选择导出')}
          >
            ？
          </button>
        </div>
      </div>
    </header>
  )
}
