import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { formatTimecode, pad, ramp } from '../lib/anim'
import { CHAPTERS, COLORS, FONT, withAlpha } from '../theme'
import { TIMELINE } from '../timeline'
import { LogoLockup } from './Logo'

export function Chrome() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const sceneIndex = Math.max(
    0,
    TIMELINE.scenes.findIndex(
      (scene) => frame >= scene.from && frame < scene.from + scene.durationInFrames,
    ),
  )
  const scene = TIMELINE.scenes[sceneIndex] ?? TIMELINE.scenes[TIMELINE.scenes.length - 1]
  const chapter = CHAPTERS[sceneIndex] ?? CHAPTERS[CHAPTERS.length - 1]
  const fadeIn = ramp(frame, 16, 26)
  const fadeOut = 1 - ramp(frame, TIMELINE.totalInFrames - 22, 22)
  const opacity = Math.min(fadeIn, fadeOut)
  const totalSeconds = Math.round(TIMELINE.totalSeconds)
  const elapsed = Math.min(totalSeconds, Math.floor(frame / fps))

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      <div style={{ position: 'absolute', left: 44, top: 30 }}>
        <LogoLockup size={24} />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 44,
          top: 30,
          textAlign: 'right',
          font: `400 10px/1.6 ${FONT.pixel}`,
          letterSpacing: '0.14em',
          color: COLORS.inkMute,
          textTransform: 'uppercase',
        }}
      >
        <div style={{ color: withAlpha(COLORS.lime, 0.8) }}>ZECATHON 2026</div>
        <div>WILDCARD ENTRY / DEMO</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 44,
          right: 44,
          bottom: 22,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          font: `400 10px/1.3 ${FONT.pixel}`,
          letterSpacing: '0.1em',
          color: COLORS.inkMute,
          textTransform: 'uppercase',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 6, height: 6, backgroundColor: COLORS.lime, boxShadow: `0 0 10px ${COLORS.lime}` }} />
          VEIL VAULT / DEMO CUT
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
          <span style={{ color: withAlpha(COLORS.ink, 0.42) }}>
            {formatTimecode(elapsed * fps, fps)} / {formatTimecode(totalSeconds * fps, fps)}
          </span>
          <span style={{ color: COLORS.inkSoft }}>
            {pad(sceneIndex + 1)} / {pad(TIMELINE.scenes.length)} · {chapter.label}
          </span>
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          display: 'flex',
          gap: 2,
          backgroundColor: withAlpha(COLORS.ink, 0.04),
        }}
      >
        {TIMELINE.scenes.map((entry, index) => {
          const localProgress = Math.max(
            0,
            Math.min(1, (frame - entry.from) / Math.max(1, entry.durationInFrames)),
          )
          const isPast = index < sceneIndex
          const isCurrent = index === sceneIndex
          return (
            <div
              key={entry.id}
              style={{
                flexGrow: entry.durationInFrames,
                height: '100%',
                backgroundColor: withAlpha(COLORS.ink, 0.06),
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: `${(isPast ? 1 : isCurrent ? localProgress : 0) * 100}%`,
                  backgroundColor: isCurrent ? COLORS.lime : withAlpha(COLORS.lime, 0.42),
                  boxShadow: isCurrent ? `0 0 12px ${withAlpha(COLORS.lime, 0.5)}` : undefined,
                }}
              />
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}
