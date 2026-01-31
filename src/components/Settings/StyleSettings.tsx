// 样式配置组件
import { useState } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

// 预设颜色方案（高级纯色，不同色系）
const PRESET_COLORS = [
  { name: '深红', color: '#B0150D' },   // 深红 - 热烈经典
  { name: '宝蓝', color: '#1E40AF' },   // 宝蓝 - 沉稳专业
  { name: '森绿', color: '#15803D' },   // 森林绿 - 自然雅致
]

export function StyleSettings() {
  const {
    settings,
    setHeadingBarEnabled,
    setHeadingBarColor,
    setBlockquoteBorderEnabled,
    setBlockquoteBorderColor,
    setImageBorderEnabled,
    setImageBorderColor,
  } = useSettingsStore()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
      >
        🎨 样式
      </button>

      {isOpen && (
        <>
          {/* 遮罩层 */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* 下拉面板 */}
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">样式配置</h3>

            {/* 标题左侧色块 */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">标题左侧色块</label>
                <input
                  type="checkbox"
                  checked={settings.styleEnhancement.headingBar.enabled}
                  onChange={(e) => setHeadingBarEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              {settings.styleEnhancement.headingBar.enabled && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.color}
                        onClick={() => setHeadingBarColor(preset.color)}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          settings.styleEnhancement.headingBar.color === preset.color
                            ? 'border-gray-900 ring-2 ring-gray-200'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={settings.styleEnhancement.headingBar.color}
                      onChange={(e) => setHeadingBarColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300"
                      title="自定义颜色"
                    />
                  </div>
                  <span className="text-xs text-gray-500">{settings.styleEnhancement.headingBar.color}</span>
                </div>
              )}
            </div>

            {/* 引用块竖线颜色 */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">引用块竖线颜色</label>
                <input
                  type="checkbox"
                  checked={settings.styleEnhancement.blockquoteBorder.enabled}
                  onChange={(e) => setBlockquoteBorderEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              {settings.styleEnhancement.blockquoteBorder.enabled && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.color}
                        onClick={() => setBlockquoteBorderColor(preset.color)}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          settings.styleEnhancement.blockquoteBorder.color === preset.color
                            ? 'border-gray-900 ring-2 ring-gray-200'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={settings.styleEnhancement.blockquoteBorder.color}
                      onChange={(e) => setBlockquoteBorderColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300"
                      title="自定义颜色"
                    />
                  </div>
                  <span className="text-xs text-gray-500">{settings.styleEnhancement.blockquoteBorder.color}</span>
                </div>
              )}
            </div>

            {/* 图片下方横线 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">图片下方横线</label>
                <input
                  type="checkbox"
                  checked={settings.styleEnhancement.imageBorder.enabled}
                  onChange={(e) => setImageBorderEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              {settings.styleEnhancement.imageBorder.enabled && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.color}
                        onClick={() => setImageBorderColor(preset.color)}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          settings.styleEnhancement.imageBorder.color === preset.color
                            ? 'border-gray-900 ring-2 ring-gray-200'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={settings.styleEnhancement.imageBorder.color}
                      onChange={(e) => setImageBorderColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-2 border-gray-300"
                      title="自定义颜色"
                    />
                  </div>
                  <span className="text-xs text-gray-500">{settings.styleEnhancement.imageBorder.color}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
