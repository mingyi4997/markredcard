// 页码组件

import { PAGE_NUMBER_STYLES } from '@/utils/constants'
import type { PageNumberConfig } from '@/types/settings'
import type { Theme } from '@/types/theme'

interface PageNumberProps {
  current: number
  total: number
  config: PageNumberConfig
  theme: Theme
}

export function PageNumber({ current, total, config, theme }: PageNumberProps) {
  if (!config.enabled) {
    return null
  }

  // 生成页码文本
  const text = PAGE_NUMBER_STYLES[config.style](current, total)

  // 根据位置确定样式
  const positionStyles: Record<string, React.CSSProperties> = {
    'bottom-center': {
      position: 'absolute',
      bottom: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    'bottom-right': {
      position: 'absolute',
      bottom: '40px',
      right: '40px',
    },
    'top-right': {
      position: 'absolute',
      top: '40px',
      right: '40px',
    },
  }

  return (
    <div
      style={{
        ...positionStyles[config.position],
        fontSize: '24px',
        color: theme.colors.body,
        opacity: 0.6,
        fontFamily: theme.fonts.body,
      }}
    >
      {text}
    </div>
  )
}
