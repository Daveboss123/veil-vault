import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { RevealText } from '../components/RevealText'
import { Stamp } from '../components/Stamp'
import { CLAMP, ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

const ROWS = [
  { time: '23:40:02', act: 'PURCHASE', detail: 'AMOUNT / PRIVATE', highlight: true },
  { time: '23:40:18', act: 'PASSAGE', detail: 'GATE 07 / PRIVATE', highlight: false },
  { time: '23:41:07', act: 'PROMISE', detail: 'TERMS / PRIVATE', highlight: false },
  { time: '23:41:33', act: 'MINT', detail: 'BELL COURT / PRIVATE', highlight: false },
  { time: '23:42:11', act: 'PURCHASE', detail: 'AMOUNT / PRIVATE', highlight: false },
  { time: '23:42:56', act: 'PASSAGE', detail: 'GATE 12 / PRIVATE', highlight: true },
  { time: '23:43:04', act: 'TRANSFER', detail: 'ROUTE / PRIVATE', highlight: false },
  { time: '23:43:29', act: 'PROMISE', detail: 'TERMS / PRIVATE', highlight: false },
  { time: '23:44:02', act: 'WITNESS', detail: 'IDENTITY / PRIVATE', highlight: false },
  { time: '23:44:37', act: 'MINT', detail: 'SEAL / PRIVATE', highlight: false },
  { time: '23:45:10', act: 'PASSAGE', detail: 'GATE 03 / PRIVATE', highlight: true },
  { time: '23:45:44', act: 'PURCHASE', detail: 'AMOUNT / PRIVATE', highlight: false },
]

export function ColdOpen() {
  const frame = useCurrentFrame()
  const headlineTwo = useEnter(246)
  const ledgerFade = 1 - ramp(frame, 250, 60) * 0.72
  const subReveal = ramp(frame, 186, 28)
  const redLine = ramp(frame, 330, 20)
  const finalFade = 1 - ramp(frame, 430, 28)

  return (
    <AbsoluteFill style={{ opacity: finalFade }}>
      <Backdrop accent={COLORS.lime} glowX={78} glowY={16} intensity={1.05} watermark="bell" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 148,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          font: `400 12px/1 ${FONT.pixel}`,
          letterSpacing: '0.18em',
          color: COLORS.inkMute,
          opacity: ramp(frame, 10, 24),
        }}
      >
        <span style={{ width: 42, height: 1, backgroundColor: COLORS.lime }} />
        VEYR / NIGHT 19 / PUBLIC RECORD
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 252,
          width: 780,
          opacity: 1 - ramp(frame, 238, 34) * 0.88,
          transform: `translateY(${ramp(frame, 238, 34) * -22}px)`,
        }}
      >
        <RevealText
          text={'EVERY CHOICE\nIS WRITTEN DOWN.'}
          delay={34}
          stagger={3}
          distance={46}
          style={{
            font: `400 128px/0.78 ${FONT.display}`,
            letterSpacing: '0.004em',
            color: COLORS.ink,
            textShadow: '0 2px 0 rgba(0,0,0,0.35)',
          }}
        />

        <div
          style={{
            marginTop: 38,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            opacity: subReveal,
            transform: `translateY(${(1 - subReveal) * 14}px)`,
          }}
        >
          {['Every purchase.', 'Every passage.', 'Every promise.'].map((line, index) => (
            <span
              key={line}
              style={{
                font: `400 25px/1.2 ${FONT.pixel}`,
                color: index === 1 ? COLORS.ink : COLORS.inkDim,
                letterSpacing: '0.015em',
              }}
            >
              <span style={{ color: COLORS.lime, marginRight: 14 }}>0{index + 1}</span>
              {line}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 92,
          top: 118,
          width: 900,
          height: 830,
          opacity: ledgerFade * ramp(frame, 14, 30),
          transform: 'perspective(1800px) rotateY(-7deg) rotateZ(-1.2deg)',
          transformOrigin: '100% 50%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: `1px solid ${withAlpha(COLORS.ink, 0.16)}`,
            background: 'linear-gradient(145deg, rgba(16,27,19,0.97), rgba(8,14,10,0.96))',
            boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 80px rgba(217,255,103,0.03) inset',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${withAlpha(COLORS.lime, 0.045)} 1px, transparent 1px)`,
            backgroundSize: '100% 63px',
            opacity: 0.7,
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 26,
            right: 26,
            top: 22,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 16,
            borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.12)}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 7, height: 7, backgroundColor: COLORS.alarm, boxShadow: `0 0 10px ${COLORS.alarm}` }} />
            <span style={{ font: `400 11px/1 ${FONT.pixel}`, letterSpacing: '0.14em', color: COLORS.inkSoft }}>
              CIVIC LEDGER / OPEN RECORD
            </span>
          </div>
          <span style={{ font: `400 10px/1 ${FONT.pixel}`, letterSpacing: '0.1em', color: COLORS.inkMute }}>
            WITNESSED / IMMUTABLE
          </span>
        </div>

        <div style={{ position: 'absolute', left: 26, right: 26, top: 84 }}>
          {ROWS.map((row, index) => {
            const enter = ramp(frame, 30 + index * 3, 22)
            const highlightStart = row.highlight
              ? index === 0
                ? 186
                : index === 5
                  ? 206
                  : 226
              : -1
            const highlight = row.highlight ? ramp(frame, highlightStart, 18) : 0
            const bar = row.highlight ? ramp(frame, highlightStart + 6, 26) : 1
            return (
              <div
                key={row.time}
                style={{
                  height: 62,
                  display: 'grid',
                  gridTemplateColumns: '112px 132px 1fr 118px',
                  alignItems: 'center',
                  borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.075)}`,
                  opacity: enter * (row.highlight ? 0.65 + highlight * 0.35 : 0.72),
                  transform: `translateX(${(1 - enter) * 26}px)`,
                  background: row.highlight
                    ? `linear-gradient(90deg, ${withAlpha(COLORS.lime, 0.08 * highlight)}, transparent 70%)`
                    : undefined,
                  position: 'relative',
                }}
              >
                <span style={{ font: `400 11px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.04em' }}>
                  {row.time}
                </span>
                <span
                  style={{
                    font: `700 12px/1 ${FONT.pixel}`,
                    color: row.highlight ? COLORS.lime : COLORS.inkSoft,
                    letterSpacing: '0.08em',
                  }}
                >
                  {row.act}
                </span>
                <span style={{ position: 'relative', display: 'block', height: 18, overflow: 'hidden' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 2,
                      font: `400 10px/1 ${FONT.pixel}`,
                      color: COLORS.inkMute,
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.detail}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: 18,
                      width: `${bar * 100}%`,
                      backgroundColor: '#050906',
                      borderLeft: `2px solid ${withAlpha(COLORS.alarm, 0.65)}`,
                      boxShadow: `4px 0 12px ${withAlpha(COLORS.alarm, 0.16)}`,
                    }}
                  />
                </span>
                <span
                  style={{
                    justifySelf: 'end',
                    font: `400 9px/1 ${FONT.pixel}`,
                    color: withAlpha(COLORS.alarm, 0.82),
                    letterSpacing: '0.1em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                  }}
                >
                  <span style={{ width: 4, height: 4, backgroundColor: COLORS.alarm }} />
                  RECORDED
                </span>
              </div>
            )
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 100 + ((frame * 1.8) % 660),
            height: 90,
            background: `linear-gradient(to bottom, transparent, ${withAlpha(COLORS.lime, 0.06)}, transparent)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${withAlpha(COLORS.bgDeep, 0.76)} 0%, ${withAlpha(COLORS.bgDeep, 0.32)} 54%, transparent 82%)`,
          pointerEvents: 'none',
          opacity: ramp(frame, 238, 30),
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 292,
          width: 1560,
          opacity: headlineTwo,
          transform: `translateY(${(1 - headlineTwo) * 40}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            padding: '7px 12px',
            border: `1px solid ${withAlpha(COLORS.alarm, 0.5)}`,
            color: COLORS.alarm,
            font: `400 11px/1 ${FONT.pixel}`,
            letterSpacing: '0.14em',
            marginBottom: 34,
          }}
        >
          <span style={{ width: 6, height: 6, backgroundColor: COLORS.alarm }} />
          THE CITY REMEMBERS
        </div>
        <div
          style={{
            font: `400 142px/0.76 ${FONT.display}`,
            color: COLORS.ink,
            letterSpacing: '0.002em',
            textShadow: '0 3px 0 rgba(0,0,0,0.45)',
          }}
        >
          <div>PRIVACY BECAME</div>
          <div>
            EVIDENCE OF{' '}
            <span style={{ color: COLORS.alarm, textShadow: `0 0 40px ${withAlpha(COLORS.alarm, 0.35)}` }}>GUILT.</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 34,
            height: 3,
            width: `${redLine * 760}px`,
            backgroundColor: COLORS.alarm,
            boxShadow: `0 0 22px ${withAlpha(COLORS.alarm, 0.65)}`,
          }}
        />
      </div>

      <div style={{ position: 'absolute', left: 1130, top: 760, opacity: ramp(frame, 374, 14) }}>
        <Stamp label="RECORDED" sub="NO CONSENT / NO CONTEXT" delay={374} rotate={-8} />
      </div>

    </AbsoluteFill>
  )
}
