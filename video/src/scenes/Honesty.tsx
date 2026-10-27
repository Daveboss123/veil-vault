import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { Chip, Panel } from '../components/Panel'
import { RevealText } from '../components/RevealText'
import { easeInOutCubic, ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

const CLAIMS = [
  { claim: 'Browser practice, not chain evidence.', scope: 'PRACTICE', status: 'STATED', accent: COLORS.lime },
  { claim: 'The wallet signs; the site never sees keys.', scope: 'WALLET', status: 'BY DESIGN', accent: COLORS.moon },
  { claim: 'The audit sample is fabricated.', scope: 'AUDIT', status: 'SAMPLE DATA', accent: COLORS.copper },
  { claim: 'Browser-side verification, not on-chain verification.', scope: 'VERIFY', status: 'BROWSER-SIDE', accent: COLORS.crown },
  { claim: 'No accounts, analytics, cookies, or browser storage.', scope: 'PRIVACY', status: 'NONE', accent: COLORS.lime },
]

export function Honesty() {
  const frame = useCurrentFrame()
  const headlineIn = useEnter(16)
  const panelIn = useEnter(40)
  const stripIn = useEnter(320)
  const noteIn = useEnter(380)

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.lime} glowX={26} glowY={24} intensity={0.7} watermark="arch" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 124,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          font: `400 12px/1 ${FONT.pixel}`,
          letterSpacing: '0.12em',
          color: COLORS.inkMute,
          opacity: ramp(frame, 8, 20),
        }}
      >
        <span style={{ width: 28, height: 1, backgroundColor: COLORS.lime }} />
        CLAIMS REVIEW / HONESTY LEDGER
      </div>

      <div style={{ position: 'absolute', left: 120, top: 166, width: 1100, opacity: headlineIn }}>
        <RevealText
          text={'WHAT THIS IS.\nWHAT IT IS NOT.'}
          delay={20}
          stagger={2}
          distance={30}
          style={{ font: `600 64px/1.03 ${FONT.display}`, color: COLORS.ink }}
        />
        <p style={{ margin: '20px 0 0', font: `400 17px/1.6 ${FONT.body}`, color: COLORS.inkSoft }}>
          The boundary is part of the build. This ledger states the scope plainly.
        </p>
      </div>

      <div style={{ position: 'absolute', right: 120, top: 188, opacity: ramp(frame, 180, 24) }}>
        <Chip accent={COLORS.lime} solid>SCOPE VERIFIED</Chip>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 372,
          width: 1680,
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 22}px)`,
        }}
      >
        <Panel label="CLAIMS LEDGER / WHAT THE DEMO DOES AND DOES NOT CLAIM" accent={COLORS.lime} padding={0}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '64px 1fr 210px 230px',
              alignItems: 'center',
              padding: '12px 20px',
              borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.12)}`,
              font: `400 11px/1 ${FONT.pixel}`,
              color: COLORS.inkMute,
              letterSpacing: '0.08em',
            }}
          >
            <span>CHECK</span>
            <span>CLAIM</span>
            <span>SCOPE</span>
            <span style={{ textAlign: 'right' }}>STATUS</span>
          </div>
          {CLAIMS.map((row, index) => {
            const enter = easeInOutCubic(ramp(frame, 76 + index * 26, 24))
            return (
              <div
                key={row.claim}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '64px 1fr 210px 230px',
                  alignItems: 'center',
                  minHeight: 70,
                  padding: '0 20px',
                  borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.08)}`,
                  opacity: enter,
                  transform: `translateX(${(1 - enter) * -18}px)`,
                  background: index % 2 === 0 ? withAlpha(COLORS.ink, 0.015) : undefined,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: `1px solid ${row.accent}`,
                    display: 'grid',
                    placeItems: 'center',
                    color: row.accent,
                    font: `700 17px/1 ${FONT.body}`,
                  }}
                >
                  ✓
                </div>
                <span style={{ font: `400 17px/1.4 ${FONT.body}`, color: COLORS.inkSoft, letterSpacing: '0' }}>
                  {row.claim}
                </span>
                <span style={{ font: `400 11px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.06em' }}>
                  {row.scope}
                </span>
                <div style={{ justifySelf: 'end' }}>
                  <Chip accent={row.accent}>{row.status}</Chip>
                </div>
              </div>
            )
          })}
        </Panel>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 828,
          width: 1680,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
          background: withAlpha(COLORS.panel, 0.86),
          opacity: stripIn,
          transform: `translateY(${(1 - stripIn) * 16}px)`,
        }}
      >
        {[
          { value: '0', label: 'ACCOUNTS' },
          { value: '0', label: 'ANALYTICS' },
          { value: '0', label: 'COOKIES' },
          { value: '0', label: 'BROWSER STORAGE' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '18px 20px',
              borderRight: `1px solid ${withAlpha(COLORS.ink, 0.1)}`,
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
            }}
          >
            <span style={{ font: `600 46px/1 ${FONT.display}`, color: COLORS.lime }}>{item.value}</span>
            <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.06em' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 944,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          opacity: noteIn,
          font: `400 11px/1.4 ${FONT.pixel}`,
          color: COLORS.inkMute,
          letterSpacing: '0.05em',
        }}
      >
        <span style={{ width: 6, height: 6, backgroundColor: COLORS.lime }} />
        NO HYPE / JUST THE BOUNDARY / PRACTICE SIMULATION
      </div>
    </AbsoluteFill>
  )
}
