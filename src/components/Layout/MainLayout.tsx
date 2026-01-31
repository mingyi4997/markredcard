// 主布局组件 - 双栏布局

import { ReactNode } from 'react'

interface MainLayoutProps {
  leftPanel: ReactNode
  rightPanel: ReactNode
}

export function MainLayout({ leftPanel, rightPanel }: MainLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-72px)]">
      {/* 左侧编辑器区域 */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        {leftPanel}
      </div>

      {/* 右侧预览区域 */}
      <div className="w-1/2 bg-gray-50 flex flex-col overflow-hidden">
        {rightPanel}
      </div>
    </div>
  )
}
