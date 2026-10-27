import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { Chip, Panel } from '../components/Panel'
import { RevealText } from '../components/RevealText'
import { scrambleText, hashString, ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

const HASH = hashString('veil-vault-demo-commitment', 64)
const SALT = 'a7f3c19e'

export function Problem() {
  const frame = useCurrentFrame()
  const panelIn = useEnter(34, { damping: 24 })
  const choiceIn = useEnter(60)
  const saltIn = useEnter(96)
  const hashIn = useEnter(132)
  const publicIn = useEnter(170)
  const lineProgress = ramp(frame, 70, 280)
  const revealPulse = useEnter(320, { damping: 16, stiffness: 160 })
  const subIn = useEnter(330)

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.moon} glowX={80} glowY={22} intensity={0.9} watermark="arch" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 156,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          font: `400 12px/1 ${FONT.pixel}`,
          letterSpacing: '0.16em',
          color: COLORS.inkMute,
          opacity: ramp(frame, 10, 22),
        }}
      >
        <span style={{ width: 34, height: 1, backgroundColor: COLORS.moon }} />
        THE NIGHT RUNNERS / PROTOCOL 01
      </div>

      <div style={{ position: 'absolute', left: 120, top: 242, width: 900 }}>
        <RevealText
          text={'LOCK THE CHOICE.\nNOT THE OUTCOME.'}
          delay={26}
          stagger={3}
          distance={44}
          style={{
            font: `400 96px/0.82 ${FONT.display}`,
            color: COLORS.ink,
            letterSpacing: '0.002em',
          }}
        />

        <div
          style={{
            marginTop: 34,
            maxWidth: 690,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 18}px)`,
          }}
        >
          <p style={{ margin: 0, font: `400 22px/1.65 ${FONT.pixel}`, color: COLORS.inkDim, letterSpacing: '0.01em' }}>
            A choice can be public without being readable. The Veil locks it before the final bell,
            then opens it only when no one can change course.
          </p>
          <div style={{ marginTop: 26, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Chip accent={COLORS.lime}>COMMIT EARLY</Chip>
            <Chip accent={COLORS.moon}>HIDE THE MOVE</Chip>
            <Chip accent={COLORS.crown}>REVEAL ONCE</Chip>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 150,
          width: 790,
          height: 690,
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 26}px)`,
        }}
      >
        <Panel label="THE VEIL / COMMITMENT" accent={COLORS.moon} padding={30} style={{ height: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <span style={{ font: `400 11px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.1em' }}>
              SEALED INPUT
            </span>
            <Chip accent={COLORS.moon}>PRIVATE</Chip>
          </div>

          <div
            style={{
              height: 118,
              border: `1px solid ${withAlpha(COLORS.moon, 0.35)}`,
              background: `linear-gradient(135deg, ${withAlpha(COLORS.moon, 0.1)}, rgba(7,13,9,0.4))`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '0 24px',
              opacity: choiceIn,
              transform: `translateY(${(1 - choiceIn) * 16}px)`,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                border: `1px solid ${withAlpha(COLORS.moon, 0.45)}`,
                display: 'grid',
                placeItems: 'center',
                font: `400 34px/1 ${FONT.display}`,
                color: COLORS.moon,
              }}
            >
              ?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.12em' }}>
                YOUR CHOICE
              </span>
              <span style={{ font: `700 22px/1 ${FONT.pixel}`, color: COLORS.ink, letterSpacing: '0.04em' }}>
                HIDDEN FROM RIVALS
              </span>
              <span style={{ font: `400 11px/1.4 ${FONT.pixel}`, color: COLORS.inkMute }}>
                Not written to the page.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '14px 0' }}>
            <div style={{ flex: 1, height: 1, backgroundColor: withAlpha(COLORS.ink, 0.14) }} />
            <span style={{ font: `400 20px/1 ${FONT.pixel}`, color: COLORS.moon }}>+</span>
            <div style={{ flex: 1, height: 1, backgroundColor: withAlpha(COLORS.ink, 0.14) }} />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              border: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
              opacity: saltIn,
              transform: `translateY(${(1 - saltIn) * 12}px)`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.12em' }}>
                RANDOM SALT
              </span>
              <span className="vv-code" style={{ font: `400 20px/1 ${FONT.pixel}`, color: COLORS.moon, letterSpacing: '0.16em' }}>
                {SALT}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {Array.from({ length: 8 }, (_, index) => (
                <span
                  key={index}
                  style={{
                    width: 8,
                    height: 8 + ((index * 7) % 16),
                    backgroundColor: withAlpha(COLORS.moon, 0.25 + (index % 3) * 0.12),
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 16px' }}>
            <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.lime, letterSpacing: '0.14em' }}>
              SHA-256
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: withAlpha(COLORS.lime, 0.28) }} />
            <span style={{ font: `400 18px/1 ${FONT.pixel}`, color: COLORS.lime }}>↓</span>
          </div>

          <div
            style={{
              padding: '16px 18px',
              border: `1px solid ${withAlpha(COLORS.lime, 0.38)}`,
              background: withAlpha(COLORS.lime, 0.05),
              opacity: hashIn,
              transform: `translateY(${(1 - hashIn) * 14}px)`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.lime, letterSpacing: '0.12em' }}>
                COMMITMENT / PUBLIC
              </span>
              <Chip accent={COLORS.lime}>VISIBLE</Chip>
            </div>
            <div
              className="vv-code"
              style={{
                font: `400 15px/1.6 ${FONT.pixel}`,
                color: COLORS.inkSoft,
                letterSpacing: '0.05em',
                wordBreak: 'break-all',
              }}
            >
              {scrambleText(HASH, ramp(frame, 132, 48), 'commitment-hash')}
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 16,
              borderTop: `1px solid ${withAlpha(COLORS.ink, 0.1)}`,
              opacity: publicIn,
            }}
          >
            <span style={{ font: `400 11px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.08em' }}>
              PUBLIC: THE LOCK
            </span>
            <span style={{ font: `700 22px/1 ${FONT.pixel}`, color: COLORS.lime, letterSpacing: '0.04em' }}>
              0 CHOICES
            </span>
          </div>
        </Panel>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 905,
          height: 90,
        }}
      >
        <div style={{ position: 'absolute', left: 0, right: 0, top: 5, height: 1, backgroundColor: withAlpha(COLORS.ink, 0.16) }} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 4,
            height: 3,
            width: `${lineProgress * 100}%`,
            backgroundColor: COLORS.lime,
            boxShadow: `0 0 16px ${withAlpha(COLORS.lime, 0.6)}`,
          }}
        />
        {[
          { x: '12%', label: 'COMMIT', time: 'MOVE SEALED', active: frame >= 70 },
          { x: '50%', label: 'FINAL BELL', time: 'NO CHANGES', active: frame >= 190 },
          { x: '88%', label: 'REVEAL', time: 'CHECK THE HASH', active: frame >= 320 },
        ].map((node) => (
          <div
            key={node.label}
            style={{
              position: 'absolute',
              left: node.x,
              top: 0,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                backgroundColor: node.active ? COLORS.lime : COLORS.bg,
                border: `1px solid ${node.active ? COLORS.lime : withAlpha(COLORS.ink, 0.4)}`,
                boxShadow: node.active ? `0 0 16px ${withAlpha(COLORS.lime, 0.7)}` : undefined,
                transform: node.active ? `scale(${1 + revealPulse * 0.15})` : 'scale(1)',
              }}
            />
            <span style={{ font: `700 11px/1 ${FONT.pixel}`, color: node.active ? COLORS.ink : COLORS.inkMute, letterSpacing: '0.1em' }}>
              {node.label}
            </span>
            <span style={{ font: `400 9px/1 ${FONT.pixel}`, color: node.active ? withAlpha(COLORS.lime, 0.8) : COLORS.inkFaint, letterSpacing: '0.08em' }}>
              {node.time}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}
