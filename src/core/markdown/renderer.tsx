// Markdown 渲染器 - 将 ContentBlock 转换为 React 组件

import type { ContentBlock, InlineContent } from '@/types/markdown'
import type { Theme } from '@/types/theme'
import type { StyleEnhancement } from '@/types/settings'
import { HEADING_FONT_SIZES, HEADING_MARGINS } from '@/utils/constants'

interface RenderOptions {
  theme: Theme
  fontSize: number
  lineHeight: number
  styleEnhancement?: StyleEnhancement
}

/**
 * 渲染内容块数组
 */
export function renderBlocks(
  blocks: ContentBlock[],
  options: RenderOptions
): React.ReactElement[] {
  return blocks.map((block, index) => renderBlock(block, index, options))
}

/**
 * 渲染单个内容块
 */
export function renderBlock(
  block: ContentBlock,
  key: number | string,
  options: RenderOptions
): React.ReactElement {
  const { theme, fontSize, lineHeight, styleEnhancement } = options

  switch (block.type) {
    case 'heading':
      return (
        <div
          key={key}
          style={{
            fontSize: `${HEADING_FONT_SIZES[block.level]}px`,
            fontWeight: 700,
            color: theme.colors.title,
            marginBottom: `${HEADING_MARGINS[block.level]}px`,
            lineHeight: 1.3,
            fontFamily: theme.fonts.title,
            textAlign: block.textAlign || 'left',
            position: 'relative',
            paddingLeft: styleEnhancement?.headingBar.enabled ? '20px' : '0',
          }}
        >
          {styleEnhancement?.headingBar.enabled && (
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '6px',
                backgroundColor: styleEnhancement.headingBar.color,
                borderRadius: '3px',
              }}
            />
          )}
          {renderInlineContent(block.content)}
        </div>
      )

    case 'paragraph':
      return (
        <p
          key={key}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight,
            color: theme.colors.body,
            marginBottom: '24px',
            fontFamily: theme.fonts.body,
            textAlign: block.textAlign || 'left',
          }}
        >
          {renderInlineContent(block.content)}
        </p>
      )

    case 'blockquote':
      return (
        <div
          key={key}
          style={{
            borderLeft: `4px solid ${
              styleEnhancement?.blockquoteBorder.enabled
                ? styleEnhancement.blockquoteBorder.color
                : theme.colors.blockquoteBorder
            }`,
            backgroundColor: theme.colors.blockquoteBg,
            padding: '20px',
            marginBottom: '24px',
            fontStyle: 'italic',
          }}
        >
          {renderBlocks(block.content, options)}
        </div>
      )

    case 'list':
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag
          key={key}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight,
            color: theme.colors.body,
            marginBottom: '24px',
            paddingLeft: '40px',
            fontFamily: theme.fonts.body,
          }}
        >
          {block.items.map((item, i) => (
            <li key={i} style={{ marginBottom: '12px' }}>
              {renderInlineContent(item.content)}
            </li>
          ))}
        </ListTag>
      )

    case 'code':
      return (
        <div
          key={key}
          style={{
            backgroundColor: theme.colors.codeBg,
            color: theme.colors.codeText,
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px',
            overflow: 'auto',
          }}
        >
          {block.language && (
            <div
              style={{
                fontSize: '14px',
                color: theme.colors.accent,
                marginBottom: '12px',
                fontWeight: 600,
              }}
            >
              {block.language}
            </div>
          )}
          <pre
            style={{
              margin: 0,
              fontSize: '28px',
              fontFamily: theme.fonts.code,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            <code>{block.content}</code>
          </pre>
        </div>
      )

    case 'table':
      return (
        <div key={key} style={{ marginBottom: '24px', overflow: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '28px',
              fontFamily: theme.fonts.body,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: theme.colors.tableHeaderBg }}>
                {block.headers.map((header, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '2px solid ' + theme.colors.divider,
                      textAlign: block.aligns[i] || 'left',
                      fontWeight: 700,
                      color: theme.colors.title,
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    backgroundColor:
                      i % 2 === 0 ? 'transparent' : theme.colors.tableStripeBg,
                  }}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid ' + theme.colors.divider,
                        textAlign: block.aligns[j] || 'left',
                        color: theme.colors.body,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'image':
      return (
        <div
          key={key}
          style={{
            marginBottom: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <img
              src={block.src}
              alt={block.alt}
              style={{
                width: block.width ? `${block.width}px` : undefined,
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                display: 'block',
              }}
            />
            {styleEnhancement?.imageBorder.enabled && (
              <div
                style={{
                  width: '100%',
                  height: '3px',
                  backgroundColor: styleEnhancement.imageBorder.color,
                  borderRadius: '2px',
                }}
              />
            )}
          </div>
          {block.alt && (
            <div
              style={{
                fontSize: '24px',
                color: theme.colors.body,
                marginTop: '8px',
                opacity: 0.7,
              }}
            >
              {block.alt}
            </div>
          )}
        </div>
      )

    case 'divider':
      return (
        <hr
          key={key}
          style={{
            border: 'none',
            borderTop: `1px solid ${theme.colors.divider}`,
            margin: '32px 0',
          }}
        />
      )

    case 'pagebreak':
      // 分页符不渲染（仅用于分页计算）
      return <div key={key} data-pagebreak="true" style={{ display: 'none' }} />

    default:
      return <div key={key} />
  }
}

/**
 * 渲染行内内容
 */
function renderInlineContent(content: InlineContent[]): React.ReactNode {
  return content.map((item, index) => {
    switch (item.type) {
      case 'text':
        return (
          <span
            key={index}
            style={{
              color: item.style?.color,
              fontFamily: item.style?.fontFamily,
            }}
          >
            {item.content}
          </span>
        )

      case 'bold':
        return (
          <strong key={index} style={{ fontWeight: 700 }}>
            {renderInlineContent(item.content)}
          </strong>
        )

      case 'italic':
        return (
          <em key={index} style={{ fontStyle: 'italic' }}>
            {renderInlineContent(item.content)}
          </em>
        )

      case 'underline':
        return (
          <span key={index} style={{ textDecoration: 'underline' }}>
            {renderInlineContent(item.content)}
          </span>
        )

      case 'strikethrough':
        return (
          <span key={index} style={{ textDecoration: 'line-through' }}>
            {renderInlineContent(item.content)}
          </span>
        )

      case 'code':
        return (
          <code
            key={index}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: '0.9em',
            }}
          >
            {item.content}
          </code>
        )

      case 'link':
        return (
          <a
            key={index}
            href={item.href}
            style={{
              color: '#2563EB',
              textDecoration: 'underline',
            }}
          >
            {renderInlineContent(item.content)}
          </a>
        )

      case 'image':
        return (
          <img
            key={index}
            src={item.src}
            alt={item.alt}
            style={{
              maxWidth: '100%',
              height: 'auto',
              verticalAlign: 'middle',
            }}
          />
        )

      case 'break':
        return <br key={index} />

      default:
        return null
    }
  })
}
