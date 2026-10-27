import type { CSSProperties } from 'react'
import type { VaultKey } from '../theme'

const PALETTE: Record<VaultKey, {
  accent: string
  base: string
  light: string
  dark: string
  line: string
}> = {
  copper: {
    accent: '#d18a67',
    base: '#a65d40',
    light: '#d98a63',
    dark: '#6f3b28',
    line: '#142019',
  },
  moon: {
    accent: '#bdcfda',
    base: '#5f7182',
    light: '#bdcfda',
    dark: '#3d4e5e',
    line: '#142019',
  },
  crown: {
    accent: '#f1cf6c',
    base: '#a37d2f',
    light: '#f1cf6c',
    dark: '#6d4f18',
    line: '#142019',
  },
}

export function Emblem({
  id,
  size = 120,
  glow = false,
  style,
}: {
  id: VaultKey
  size?: number
  glow?: boolean
  style?: CSSProperties
}) {
  const colors = PALETTE[id]
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      focusable="false"
      style={{
        display: 'block',
        overflow: 'visible',
        filter: glow ? `drop-shadow(0 0 ${size * 0.16}px ${colors.accent}66)` : undefined,
        ...style,
      }}
    >
      <circle cx="32" cy="32" r="30" fill="#0c1610" />
      <circle cx="32" cy="32" r="29" fill="none" stroke={colors.accent} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="24" fill="none" stroke={colors.accent} strokeWidth="1" opacity="0.34" />
      <path d="M32 1v4M32 59v4M1 32h4M59 32h4" stroke={colors.accent} strokeWidth="2" opacity="0.7" />
      {id === 'copper' && (
        <g strokeLinecap="square" strokeLinejoin="miter">
          <ellipse cx="32" cy="43" rx="16" ry="6.5" fill={colors.dark} />
          <path d="M16 36c0-3.6 7.2-6.5 16-6.5s16 2.9 16 6.5v7c0 3.6-7.2 6.5-16 6.5s-16-2.9-16-6.5z" fill={colors.base} />
          <ellipse cx="32" cy="36" rx="16" ry="6.5" fill={colors.light} />
          <path d="M21 29c0-2.8 4.9-5 11-5s11 2.2 11 5v5c0 2.8-4.9 5-11 5s-11-2.2-11-5z" fill={colors.dark} />
          <ellipse cx="32" cy="29" rx="11" ry="5" fill={colors.light} />
          <path d="M32 25.5l3 3.5-3 3.5-3-3.5z" fill="none" stroke={colors.line} strokeWidth="2" />
        </g>
      )}
      {id === 'moon' && (
        <g strokeLinecap="square" strokeLinejoin="miter">
          <path d="M32 7l14 10 4 19-9 16-9 5-9-5-9-16 4-19z" fill={colors.base} />
          <path d="M32 7l14 10-9 9-5-19zM32 7L18 17l9 9 5-19z" fill={colors.light} />
          <path d="M32 26l9-9 5 19-9 16-5-26zM32 26l-9-9-5 19 9 16 5-26z" fill={colors.dark} />
          <path d="M32 7v45M18 17l14 9 14-9M23 42l9-16 9 16" fill="none" stroke={colors.line} strokeWidth="1" opacity="0.45" />
          <path d="M39 25a8 8 0 1 0 0 15 10 10 0 0 1 0-15z" fill={colors.light} />
        </g>
      )}
      {id === 'crown' && (
        <g strokeLinecap="square" strokeLinejoin="miter">
          <circle cx="32" cy="30" r="14" fill={colors.dark} />
          <path d="M32 5v4M8 17l3 3M56 17l-3 3M6 32h4M54 32h4" fill="none" stroke={colors.light} strokeWidth="1.5" opacity="0.8" />
          <path d="M13 45l4-24 10 9 5-15 5 15 10-9 4 24z" fill={colors.base} />
          <path d="M16 45h32v7H16z" fill={colors.light} />
          <path d="M21 45l3-17 8 7 8-7 3 17" fill="none" stroke={colors.line} strokeWidth="2" />
          <circle cx="32" cy="32" r="2.5" fill="none" stroke={colors.line} strokeWidth="2" />
        </g>
      )}
    </svg>
  )
}
