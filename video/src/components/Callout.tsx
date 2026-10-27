import type { CSSProperties } from 'react'
import { useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

export function Callout({
  x,
  y,
  label,
  detail,
  delay = 0,
  accent = COLORS.lime,
  align = 'left',
  width = 290,
  style,
}: {
  x: number
  y: number
  label: string
  detail?: string
  delay?: number
  accent?: string
  align?: 'left' | 'right'
  width?: number
  style?: CSSProperties
}) {
  const progress = useEnter(delay)

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        transform: `translate(${align === 'right' ? '-100%' : '0'}, ${(1 - progress) * 12}px)`,
        opacity: progress,
        paddingLeft: 13,
        borderLeft: `1px solid ${withAlpha(accent, 0.55)}`,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 6,
            height: 6,
            backgroundColor: accent,
            boxShadow: `0 0 12px ${withAlpha(accent, 0.85)}`,
          }}
        />
        <span
          style={{
            font: `700 12px/1.2 ${FONT.pixel}`,
            letterSpacing: '0.1em',
            color: accent,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>
      {detail && (
        <p
          style={{
            margin: '8px 0 0 14px',
            font: `400 12px/1.55 ${FONT.pixel}`,
            letterSpacing: '0.01em',
            color: COLORS.inkDim,
          }}
        >
          {detail}
        </p>
      )}
    </div>
  )
}
