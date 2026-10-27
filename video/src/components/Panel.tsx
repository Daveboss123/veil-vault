import type { CSSProperties, ReactNode } from 'react'
import { COLORS, FONT, withAlpha } from '../theme'

export function CornerTicks({ color = COLORS.lime, size = 10, inset = -1 }: {
  color?: string
  size?: number
  inset?: number
}) {
  const base: CSSProperties = { position: 'absolute', width: size, height: size, pointerEvents: 'none' }
  return (
    <>
      <span style={{ ...base, left: inset, top: inset, borderLeft: `1px solid ${color}`, borderTop: `1px solid ${color}` }} />
      <span style={{ ...base, right: inset, top: inset, borderRight: `1px solid ${color}`, borderTop: `1px solid ${color}` }} />
      <span style={{ ...base, left: inset, bottom: inset, borderLeft: `1px solid ${color}`, borderBottom: `1px solid ${color}` }} />
      <span style={{ ...base, right: inset, bottom: inset, borderRight: `1px solid ${color}`, borderBottom: `1px solid ${color}` }} />
    </>
  )
}

export function Panel({
  children,
  label,
  accent = COLORS.lime,
  style,
  padding = 28,
}: {
  children: ReactNode
  label?: string
  accent?: string
  style?: CSSProperties
  padding?: number
}) {
  return (
    <div
      style={{
        position: 'relative',
        border: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
        background: `linear-gradient(145deg, ${withAlpha(COLORS.panelRaised, 0.94)}, ${withAlpha(COLORS.panel, 0.9)})`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.32), 0 0 60px ${withAlpha(accent, 0.04)} inset`,
        padding,
        ...style,
      }}
    >
      <CornerTicks color={withAlpha(accent, 0.6)} />
      {label && (
        <span
          style={{
            position: 'absolute',
            top: -1,
            left: 22,
            transform: 'translateY(-50%)',
            padding: '0 8px',
            background: COLORS.bg,
            color: accent,
            font: `400 10px/1 ${FONT.pixel}`,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

export function Chip({
  children,
  accent = COLORS.lime,
  solid = false,
  style,
}: {
  children: ReactNode
  accent?: string
  solid?: boolean
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 10px',
        border: `1px solid ${withAlpha(accent, solid ? 0.9 : 0.34)}`,
        backgroundColor: solid ? accent : withAlpha(accent, 0.06),
        color: solid ? COLORS.bgDeep : accent,
        font: `400 10px/1 ${FONT.pixel}`,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  )
}
