import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { BrowserWindow } from '../components/BrowserWindow'
import { Chip, CornerTicks } from '../components/Panel'
import { Cursor } from '../components/Cursor'
import { RevealText } from '../components/RevealText'
import { ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

const POINTS = [
  { label: '3 RELICS BURN', detail: 'At first light.' },
  { label: 'RIVALS SEAL FIRST', detail: 'Before your move.' },
  { label: 'NO REACTION', detail: 'The house cannot answer.' },
]

export function Briefing() {
  const frame = useCurrentFrame()
  const browserIn = useEnter(16, { damping: 24 })
  const sidebarIn = useEnter(26)
  const buttonGlow = useEnter(220, { damping: 14, stiffness: 140 })

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.copper} glowX={72} glowY={30} intensity={0.7} watermark="bell" />

      <div style={{ position: 'absolute', left: 120, top: 148, width: 330 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            font: `400 12px/1 ${FONT.pixel}`,
            letterSpacing: '0.12em',
            color: COLORS.inkMute,
            opacity: sidebarIn,
          }}
        >
          <span style={{ width: 28, height: 1, backgroundColor: COLORS.lime }} />
          PHASE 01 / 04
        </div>

        <RevealText
          text={'THE\nTHIRTEENTH\nBELL.'}
          delay={26}
          stagger={2}
          distance={26}
          style={{
            marginTop: 22,
            font: `600 42px/1.05 ${FONT.display}`,
            color: COLORS.ink,
          }}
        />

        <p
          style={{
            margin: '24px 0 0',
            font: `400 16px/1.7 ${FONT.body}`,
            color: COLORS.inkSoft,
            opacity: ramp(frame, 70, 26),
          }}
        >
          Three relics burn at first light. Reach one vault unseen.
        </p>

        <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {POINTS.map((point, index) => {
            const appear = ramp(frame, 120 + index * 24, 26)
            return (
              <div
                key={point.label}
                style={{
                  display: 'flex',
                  gap: 12,
                  opacity: appear,
                  transform: `translateX(${(1 - appear) * -14}px)`,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    marginTop: 4,
                    backgroundColor: index === 0 ? COLORS.lime : withAlpha(COLORS.lime, 0.5),
                    flex: '0 0 auto',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ font: `700 14px/1.15 ${FONT.body}`, color: COLORS.inkSoft, letterSpacing: '0' }}>
                    {point.label}
                  </span>
                  <span style={{ font: `400 13px/1.4 ${FONT.body}`, color: COLORS.inkMute }}>{point.detail}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 36, opacity: ramp(frame, 230, 24) }}>
          <Chip accent={COLORS.lime}>YOUR MOVE IS STILL HIDDEN</Chip>
        </div>
      </div>

      <BrowserWindow
        src="shots/briefing-tall.png"
        imgW={1920}
        imgH={1400}
        width={1340}
        height={860}
        style={{
          left: 460,
          top: 110,
          opacity: browserIn,
          transform: `translateY(${(1 - browserIn) * 30}px)`,
        }}
        focus={[
          { at: 0, rect: { x: 0, y: 0, w: 1920, h: 1175 } },
          { at: 60, rect: { x: 760, y: 250, w: 900, h: 551 } },
          { at: 230, rect: { x: 760, y: 700, w: 900, h: 551 } },
          { at: 340, rect: { x: 760, y: 700, w: 900, h: 551 } },
        ]}
      />

      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 620,
          width: 430,
          height: 100,
          border: `1px solid ${withAlpha(COLORS.lime, 0.35 + buttonGlow * 0.4)}`,
          boxShadow: `0 0 ${18 + buttonGlow * 24}px ${withAlpha(COLORS.lime, 0.12)}`,
          opacity: ramp(frame, 220, 20) * (0.55 + 0.45 * Math.sin(frame / 5) ** 2),
          pointerEvents: 'none',
        }}
      >
        <CornerTicks color={COLORS.lime} size={16} inset={-2} />
      </div>

      <Cursor
        points={[
          { at: 196, x: 1420, y: 540 },
          { at: 238, x: 1000, y: 676 },
          { at: 300, x: 1000, y: 676 },
        ]}
        clicks={[258]}
      />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 842,
          font: `400 11px/1.6 ${FONT.pixel}`,
          color: COLORS.inkMute,
          letterSpacing: '0.05em',
          opacity: ramp(frame, 300, 24),
        }}
      >
        NO DECISION YET.
        <br />
        JUST THE STAKES.
      </div>
    </AbsoluteFill>
  )
}
