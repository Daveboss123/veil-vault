import type { CSSProperties } from 'react'
import { Img, staticFile } from 'remotion'
import { COLORS, FONT, withAlpha } from '../theme'

export type RunnerId = 'you' | 'fox' | 'moth' | 'rook'

const RUNNERS: Record<RunnerId, { name: string; art: string; accent: string }> = {
  you: { name: 'You', art: 'art/the-unnamed.webp', accent: COLORS.lime },
  fox: { name: 'Fox', art: 'art/fox.webp', accent: COLORS.copper },
  moth: { name: 'Moth', art: 'art/moth.webp', accent: COLORS.moon },
  rook: { name: 'Rook', art: 'art/rook.webp', accent: COLORS.crown },
}

export function RunnerChip({
  id,
  size = 56,
  showName = false,
  nameBelow = false,
  dim = false,
  style,
}: {
  id: RunnerId
  size?: number
  showName?: boolean
  nameBelow?: boolean
  dim?: boolean
  style?: CSSProperties
}) {
  const runner = RUNNERS[id]
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: nameBelow ? 'column' : 'row',
        alignItems: 'center',
        gap: nameBelow ? 8 : 10,
        opacity: dim ? 0.4 : 1,
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `1px solid ${withAlpha(runner.accent, 0.65)}`,
          backgroundColor: COLORS.bgDeep,
          boxShadow: `0 0 0 3px ${withAlpha(runner.accent, 0.08)}, 0 0 22px ${withAlpha(runner.accent, 0.18)}`,
          flex: '0 0 auto',
        }}
      >
        <Img
          src={staticFile(runner.art)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '50% 16%',
            transform: 'scale(1.24)',
            transformOrigin: '50% 30%',
            filter: 'saturate(0.85) contrast(1.06)',
          }}
        />
      </div>
      {showName && (
        <span
          style={{
            font: `700 ${Math.max(11, size * 0.24)}px/1 ${FONT.body}`,
            letterSpacing: '0.02em',
            color: runner.accent,
            textTransform: 'uppercase',
          }}
        >
          {runner.name}
        </span>
      )}
      {nameBelow && (
        <span style={{ font: `400 11px/1 ${FONT.body}`, letterSpacing: '0.02em', color: runner.accent, textTransform: 'uppercase' }}>
          {runner.name}
        </span>
      )}
    </div>
  )
}

export function runnerMeta(id: RunnerId) {
  return RUNNERS[id]
}
