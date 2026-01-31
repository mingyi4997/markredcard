// 常量定义

// LocalStorage 键名
export const STORAGE_KEYS = {
  MARKDOWN_CONTENT: 'markredcard_markdown',
  SETTINGS: 'markredcard_settings',
  THEME_ID: 'markredcard_theme_id',
} as const

// 页码样式文字
export const PAGE_NUMBER_STYLES = {
  fraction: (current: number, total: number) => `${current}/${total}`,
  circle: (current: number) => {
    const circleNumbers = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
    return current <= 10 ? circleNumbers[current] : `⑩+${current - 10}`
  },
  dash: (current: number) => `- ${current} -`,
} as const

// 分页符标记
export const PAGEBREAK_MARKERS = [
  '<!-- pagebreak -->',
  '---pagebreak---',
  '<!-- page-break -->',
] as const

// 标题级别字号（基于 1080px 宽度）
export const HEADING_FONT_SIZES = {
  1: 48,
  2: 40,
  3: 36,
  4: 32,
} as const

// 标题底部间距
export const HEADING_MARGINS = {
  1: 24,
  2: 20,
  3: 16,
  4: 12,
} as const

// 默认示例 HTML 内容（富文本编辑器格式）
export const EXAMPLE_MARKDOWN = `<h1>欢迎使用 MarkRedCard 🎨</h1>
<blockquote><p>现在支持富文本编辑！像 Word 一样轻松编辑内容</p></blockquote>

<h2>新功能特性</h2>
<ul>
  <li>✨ <strong>富文本编辑</strong>：所见即所得的编辑体验</li>
  <li>🖼️ <strong>图片粘贴</strong>：直接 Ctrl+V 粘贴图片，或拖拽图片到编辑器</li>
  <li>🎨 <strong>多套主题</strong>：6 种精美预设主题可选</li>
  <li>📏 <strong>自动分页</strong>：智能分页算法，确保内容完整</li>
  <li>📦 <strong>批量导出</strong>：一键导出所有卡片为 PNG 图片</li>
</ul>

<h2>如何使用</h2>
<p>使用工具栏的格式化按钮来编辑文本：</p>
<ul>
  <li><strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>、<s>删除线</s></li>
  <li>标题 H1、H2、H3</li>
  <li>左对齐、居中、右对齐</li>
  <li>有序列表和无序列表</li>
  <li>引用和代码块</li>
</ul>

<h2>插入图片</h2>
<p>您可以通过以下方式插入图片：</p>
<ol>
  <li>点击工具栏的 🖼️ 图片按钮</li>
  <li>直接 <strong>Ctrl+V</strong> 粘贴图片</li>
  <li>拖拽图片文件到编辑器中</li>
</ol>

<blockquote><p>💡 提示：试试粘贴一张图片，然后选中图片可以看到选中效果！</p></blockquote>

<hr>

<h2>开始创作</h2>
<p>现在就开始编辑这段文字，右侧会实时显示卡片效果！</p>
<p>切换不同的主题和尺寸，找到最适合你的风格。</p>

<p><strong>祝你创作愉快！🚀</strong></p>`

// 图片限制
export const IMAGE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const
