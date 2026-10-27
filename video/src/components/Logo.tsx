import { COLORS, FONT } from '../theme'

export function LogoMark({ size = 30, color = COLORS.ink, accent = COLORS.lime }: {
  size?: number
  color?: string
  accent?: string
}) {
  return (
    <svg
      viewBox="0 0 40 46"
      width={size}
      height={size * 1.15}
      aria-hidden="true"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path d="M5 41V18C5 9.5 11.5 3 20 3s15 6.5 15 15v23" fill="none" stroke={color} strokeWidth="2.4" />
      <path d="M11 41V18.5C11 13.2 14.6 9.5 20 9.5s9 3.7 9 9V41" fill="none" stroke={color} strokeOpacity="0.36" strokeWidth="1" />
      <circle cx="20" cy="24" r="4.4" fill={accent} />
      <path d="M18.3 27h3.4l1.5 9h-6.4z" fill={accent} />
    </svg>
  )
}

export function Wordmark({ size = 13, sub = true, color = COLORS.ink }: {
  size?: number
  sub?: boolean
  color?: string
}) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ font: `700 ${size}px/1 ${FONT.pixel}`, letterSpacing: '0.11em', color }}>
        VEIL <span style={{ color: COLORS.lime }}>VAULT</span>
      </span>
      {sub && (
        <span style={{ font: `400 ${Math.max(6, size * 0.46)}px/1 ${FONT.pixel}`, letterSpacing: '0.14em', color: COLORS.inkDim }}>
          SHIELDED BLUFFING GAME
        </span>
      )}
    </span>
  )
}

export function LogoLockup({ size = 30, sub = true }: { size?: number; sub?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
      <LogoMark size={size} />
      <Wordmark size={size * 0.44} sub={sub} />
    </span>
  )
}
