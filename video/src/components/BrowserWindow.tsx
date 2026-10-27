import type { CSSProperties, ReactNode } from 'react'
import { Img, staticFile, useCurrentFrame } from 'remotion'
import { focusAt, type FocusKeyframe } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

export function BrowserWindow({
  src,
  imgW,
  imgH,
  focus,
  width = 1680,
  height = 900,
  style,
  url = 'veil-vault-game.vercel.app',
  label = 'PRACTICE SIMULATION',
  children,
}: {
  src: string
  imgW: number
  imgH: number
  focus: FocusKeyframe[]
  width?: number
  height?: number
  style?: CSSProperties
  url?: string
  label?: string
  children?: ReactNode
}) {
  const frame = useCurrentFrame()
  const rect = focusAt(focus, frame)
  const chromeHeight = 40
  const viewW = width
  const viewH = height - chromeHeight
  const scale = Math.max(viewW / Math.max(1, rect.w), viewH / Math.max(1, rect.h))
  const left = viewW / 2 - (rect.x + rect.w / 2) * scale
  const top = viewH / 2 - (rect.y + rect.h / 2) * scale

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${withAlpha(COLORS.lime, 0.2)}`,
        background: COLORS.panel,
        boxShadow: '0 42px 110px rgba(0,0,0,0.62), 0 0 0 1px rgba(0,0,0,0.55) inset',
        ...style,
      }}
    >
      <div
        style={{
          height: chromeHeight,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 16px',
          background: 'linear-gradient(to bottom, #101b13, #0b140e)',
          borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.08)}`,
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div style={{ display: 'flex', gap: 7 }}>
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              style={{
                width: 8,
                height: 8,
                border: `1px solid ${withAlpha(COLORS.ink, index === 0 ? 0.26 : 0.16)}`,
                backgroundColor: index === 0 ? withAlpha(COLORS.ink, 0.1) : 'transparent',
              }}
            />
          ))}
        </div>

        <div
          style={{
            flex: 1,
            maxWidth: 760,
            margin: '0 auto',
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            border: `1px solid ${withAlpha(COLORS.ink, 0.08)}`,
            backgroundColor: withAlpha(COLORS.black, 0.18),
            color: withAlpha(COLORS.ink, 0.5),
            font: `400 11px/1 ${FONT.pixel}`,
            letterSpacing: '0.04em',
          }}
        >
          <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden="true">
            <rect x="1" y="5" width="7" height="5" fill="none" stroke="currentColor" />
            <path d="M2.5 5V3.5a2 2 0 0 1 4 0V5" fill="none" stroke="currentColor" />
          </svg>
          {url}
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '5px 8px',
            border: `1px solid ${withAlpha(COLORS.lime, 0.28)}`,
            color: withAlpha(COLORS.lime, 0.85),
            font: `400 9px/1 ${FONT.pixel}`,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 5, height: 5, backgroundColor: COLORS.lime }} />
          {label}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: viewW,
          height: viewH,
          overflow: 'hidden',
          backgroundColor: COLORS.bg,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            position: 'absolute',
            width: imgW,
            height: imgH,
            maxWidth: 'none',
            transform: `translate(${left}px, ${top}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            boxShadow: '0 0 90px rgba(0,0,0,0.28) inset',
          }}
        />
        {children}
      </div>
    </div>
  )
}
