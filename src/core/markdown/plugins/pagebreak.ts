// Markdown-it 分页符插件

import type MarkdownIt from 'markdown-it'

/**
 * 分页符插件
 * 识别以下格式的分页标记：
 * - <!-- pagebreak -->
 * - ---pagebreak---
 * - <!-- page-break -->
 */
export function pagebreakPlugin(md: MarkdownIt) {
  // 添加自定义规则
  md.block.ruler.before('fence', 'pagebreak', (state, startLine, _endLine, silent) => {
    const pos = state.bMarks[startLine] + state.tShift[startLine]
    const max = state.eMarks[startLine]

    // 获取当前行内容
    const lineText = state.src.substring(pos, max).trim()

    // 检查是否是分页符标记
    const isPagebreak =
      lineText === '<!-- pagebreak -->' ||
      lineText === '---pagebreak---' ||
      lineText === '<!-- page-break -->'

    if (!isPagebreak) {
      return false
    }

    // 预检模式，不实际处理
    if (silent) {
      return true
    }

    // 创建 token
    const token = state.push('pagebreak', '', 0)
    token.markup = lineText
    token.map = [startLine, startLine + 1]

    state.line = startLine + 1

    return true
  })

  // 添加渲染器
  md.renderer.rules.pagebreak = () => {
    return '<div class="pagebreak" data-pagebreak="true"></div>'
  }
}
