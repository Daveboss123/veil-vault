import { interpolate, useCurrentFrame } from 'remotion'
import { CLAMP, easeInOutCubic } from '../lib/anim'
import { COLORS } from '../theme'

type Point = { at: number; x: number; y: number }

export function Cursor({
  points,
  clicks = [],
  scale = 1,
}: {
  points: Point[]
  clicks?: number[]
  scale?: number
}) {
  const frame = useCurrentFrame()
  if (points.length === 0) return null

  let x = points[0].x
  let y = points[0].y
  if (frame >= points[points.length - 1].at) {
    x = points[points.length - 1].x
    y = points[points.length - 1].y
  } else if (frame > points[0].at) {
    for (let index = 0; index < points.length - 1; index++) {
      const current = points[index]
      const next = points[index + 1]
      if (frame >= current.at && frame <= next.at) {
        const raw = (frame - current.at) / Math.max(1, next.at - current.at)
        const eased = easeInOutCubic(raw)
        x = interpolate(eased, [0, 1], [current.x, next.x])
        y = interpolate(eased, [0, 1], [current.y, next.y])
        break
      }
    }
  }

  const press = clicks.some((click) => frame >= click && frame <= click + 8) ? 0.84 : 1

  return (
    <>
      {clicks.map((click) => {
        const progress = interpolate(frame, [click, click + 20], [0, 1], CLAMP)
        if (progress <= 0 || progress >= 1) return null
        const point = points.reduce((best, entry) => (entry.at <= click ? entry : best), points[0])
        return (
          <div
            key={click}
            style={{
              position: 'absolute',
              left: point.x - 34 * progress,
              top: point.y - 34 * progress,
              width: 68 * progress,
              height: 68 * progress,
              borderRadius: '50%',
              border: `2px solid ${COLORS.lime}`,
              opacity: 1 - progress,
              boxShadow: `0 0 18px ${COLORS.lime}`,
            }}
          />
        )
      })}
      <svg
        viewBox="0 0 26 34"
        width={26 * scale}
        height={34 * scale}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `scale(${press})`,
          transformOrigin: '0 0',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.55))',
        }}
        aria-hidden="true"
      >
        <path d="M2 2v25l7-6 4 10 5-2-4-10 9-1z" fill={COLORS.ink} stroke={COLORS.bgDeep} strokeWidth="2" strokeLinejoin="miter" />
      </svg>
    </>
  )
}
