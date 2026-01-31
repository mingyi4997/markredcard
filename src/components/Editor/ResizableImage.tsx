// 可调整大小的图片组件

import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'
import { useSettingsStore } from '@/stores/settingsStore'

export function ResizableImageView(props: NodeViewProps) {
  const { node, updateAttributes, selected } = props
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<'left' | 'right'>('right')
  const [tempWidth, setTempWidth] = useState<number | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const startX = useRef(0)
  const startWidth = useRef(0)

  // 获取卡片设置，计算最大可用宽度
  const { settings } = useSettingsStore()
  const maxWidth = settings.cardSize.width - settings.padding.left - settings.padding.right

  // 显示的宽度：拖动时用临时宽度，否则用node属性
  const displayWidth = tempWidth !== null ? tempWidth : (node.attrs.width || 400)

  const handleMouseDown = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    startX.current = e.clientX
    startWidth.current = node.attrs.width || 400
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX.current
      // 左边拖动时方向相反
      const actualDiff = resizeDirection === 'left' ? -diff : diff
      const newWidth = Math.max(100, Math.min(maxWidth, startWidth.current + actualDiff))
      setTempWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      if (tempWidth !== null) {
        updateAttributes({ width: tempWidth })
        setTempWidth(null)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, tempWidth, updateAttributes, resizeDirection, maxWidth])

  return (
    <NodeViewWrapper className="resizable-image-wrapper">
      <div
        className="relative inline-block"
        style={{
          width: `${displayWidth}px`,
          maxWidth: '100%',
        }}
      >
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt}
          className={`rounded-lg ${selected ? 'ring-2 ring-blue-500' : ''}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />

        {/* 调整手柄 */}
        {selected && (
          <>
            {/* 右边手柄 */}
            <div
              className="absolute top-1/2 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize transform translate-x-1/2 -translate-y-1/2 shadow-lg"
              onMouseDown={(e) => handleMouseDown(e, 'right')}
              style={{ zIndex: 10 }}
            />

            {/* 左边手柄 */}
            <div
              className="absolute top-1/2 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
              onMouseDown={(e) => handleMouseDown(e, 'left')}
              style={{ zIndex: 10 }}
            />

            {/* 尺寸提示 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">
              {displayWidth}px
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}
