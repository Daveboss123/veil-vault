import type { CSSProperties } from 'react'
import { usePop } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

export function Stamp({
  label,
  sub,
  delay = 0,
  color = COLORS.alarm,
  rotate = -7,
  style,
}: {
  label: string
  sub?: string
  delay?: number
  color?: string
  rotate?: number
  style?: CSSProperties
}) {
  const pop = usePop(delay)

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: '12px 18px 10px',
        border: `3px solid ${color}`,
        boxShadow: `0 0 0 1px ${withAlpha(color, 0.25)} inset, 0 0 26px ${withAlpha(color, 0.22)}`,
        color,
        transform: `rotate(${rotate}deg) scale(${0.7 + pop * 0.3})`,
        opacity: pop,
        ...style,
      }}
    >
      <span style={{ font: `700 24px/0.9 ${FONT.pixel}`, letterSpacing: '0.08em' }}>{label}</span>
      {sub && <span style={{ font: `400 9px/1 ${FONT.pixel}`, letterSpacing: '0.12em', opacity: 0.8 }}>{sub}</span>}
    </div>
  )
}
