// 预设主题定义

import { Theme } from '@/types/theme'

// 经典白 - 简洁干净
export const classicWhite: Theme = {
  id: 'classic-white',
  name: '经典白',
  colors: {
    background: '#FFFFFF',
    title: '#1A1A1A',
    body: '#333333',
    accent: '#2563EB',
    blockquoteBg: 'rgba(37, 99, 235, 0.08)',
    blockquoteBorder: '#2563EB',
    codeBg: '#F5F5F5',
    codeText: '#1A1A1A',
    tableHeaderBg: '#F3F4F6',
    tableStripeBg: '#F9FAFB',
    divider: '#E5E7EB',
  },
  fonts: {
    title: 'Noto Sans SC',
    body: 'Noto Sans SC',
    code: 'Monaco, Consolas, monospace',
  },
}

// 暖阳橘 - 温暖活力
export const warmOrange: Theme = {
  id: 'warm-orange',
  name: '暖阳橘',
  colors: {
    background: '#FFF8F0',
    title: '#E8740C',
    body: '#4A3728',
    accent: '#F59E0B',
    blockquoteBg: 'rgba(245, 158, 11, 0.1)',
    blockquoteBorder: '#F59E0B',
    codeBg: '#FEF3C7',
    codeText: '#78350F',
    tableHeaderBg: '#FED7AA',
    tableStripeBg: '#FFEDD5',
    divider: '#FED7AA',
  },
  fonts: {
    title: 'Noto Sans SC',
    body: 'Noto Sans SC',
    code: 'Monaco, Consolas, monospace',
  },
}

// 薄荷绿 - 清新自然
export const mintGreen: Theme = {
  id: 'mint-green',
  name: '薄荷绿',
  colors: {
    background: '#F0FFF4',
    title: '#276749',
    body: '#2D3748',
    accent: '#10B981',
    blockquoteBg: 'rgba(16, 185, 129, 0.1)',
    blockquoteBorder: '#10B981',
    codeBg: '#D1FAE5',
    codeText: '#065F46',
    tableHeaderBg: '#A7F3D0',
    tableStripeBg: '#D1FAE5',
    divider: '#A7F3D0',
  },
  fonts: {
    title: 'Noto Sans SC',
    body: 'Noto Sans SC',
    code: 'Monaco, Consolas, monospace',
  },
}

// 星空蓝 - 深色高级
export const starryBlue: Theme = {
  id: 'starry-blue',
  name: '星空蓝',
  colors: {
    background: '#1A202C',
    title: '#90CDF4',
    body: '#E2E8F0',
    accent: '#63B3ED',
    blockquoteBg: 'rgba(99, 179, 237, 0.15)',
    blockquoteBorder: '#63B3ED',
    codeBg: '#2D3748',
    codeText: '#90CDF4',
    tableHeaderBg: '#2D3748',
    tableStripeBg: '#1A202C',
    divider: '#4A5568',
  },
  fonts: {
    title: 'Noto Sans SC',
    body: 'Noto Sans SC',
    code: 'Monaco, Consolas, monospace',
  },
}

// 樱花粉 - 甜美可爱
export const cherryPink: Theme = {
  id: 'cherry-pink',
  name: '樱花粉',
  colors: {
    background: '#FFF5F7',
    title: '#D53F8C',
    body: '#4A5568',
    accent: '#ED64A6',
    blockquoteBg: 'rgba(237, 100, 166, 0.1)',
    blockquoteBorder: '#ED64A6',
    codeBg: '#FED7E2',
    codeText: '#97266D',
    tableHeaderBg: '#FBB6CE',
    tableStripeBg: '#FED7E2',
    divider: '#FBB6CE',
  },
  fonts: {
    title: 'Noto Sans SC',
    body: 'Noto Sans SC',
    code: 'Monaco, Consolas, monospace',
  },
}

// 高级灰 - 商务专业
export const elegantGray: Theme = {
  id: 'elegant-gray',
  name: '高级灰',
  colors: {
    background: '#F7F8FA',
    title: '#1A1A1A',
    body: '#4A5568',
    accent: '#718096',
    blockquoteBg: 'rgba(113, 128, 150, 0.1)',
    blockquoteBorder: '#718096',
    codeBg: '#E2E8F0',
    codeText: '#2D3748',
    tableHeaderBg: '#CBD5E0',
    tableStripeBg: '#E2E8F0',
    divider: '#CBD5E0',
  },
  fonts: {
    title: 'Noto Sans SC',
    body: 'Noto Sans SC',
    code: 'Monaco, Consolas, monospace',
  },
}

// 所有预设主题
export const presetThemes: Theme[] = [
  classicWhite,
  warmOrange,
  mintGreen,
  starryBlue,
  cherryPink,
  elegantGray,
]

// 默认主题
export const defaultTheme = classicWhite

// 根据 ID 获取主题
export function getThemeById(id: string): Theme {
  return presetThemes.find((theme) => theme.id === id) || defaultTheme
}
