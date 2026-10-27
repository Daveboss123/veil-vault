import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { BrowserWindow } from '../components/BrowserWindow'
import { Chip, Panel } from '../components/Panel'
import { RevealText } from '../components/RevealText'
import { RunnerChip, type RunnerId } from '../components/RunnerChip'
import { Stamp } from '../components/Stamp'
import { hashString, ramp, scrambleText, truncateHash, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

const ROWS: { id: RunnerId; name: string; choice: string; value: string; alarm?: boolean; delay: number }[] = [
  { id: 'you', name: 'YOU', choice: 'SUN CROWN', value: '+8', delay: 76 },
  { id: 'moth', name: 'MOTH', choice: 'COPPER', value: '+3', delay: 104 },
  { id: 'fox', name: 'FOX', choice: 'MOON', value: 'ALARM', alarm: true, delay: 132 },
  { id: 'rook', name: 'ROOK', choice: 'MOON', value: 'ALARM', alarm: true, delay: 160 },
]

function RevealRow({ row, frame }: { row: (typeof ROWS)[number]; frame: number }) {
  const flip = ramp(frame, row.delay, 22)
  const check = ramp(frame, row.delay + 28, 18)
  return (
    <div
      style={{
        height: 72,
        display: 'grid',
        gridTemplateColumns: '190px 1fr 190px 60px',
        alignItems: 'center',
        gap: 20,
        padding: '0 20px',
        borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.1)}`,
        background: flip > 0.5 ? withAlpha(row.alarm ? COLORS.alarm : COLORS.lime, 0.035) : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <RunnerChip id={row.id} size={36} />
        <span style={{ font: `700 12px/1 ${FONT.pixel}`, color: COLORS.inkSoft, letterSpacing: '0.08em' }}>
          {row.name}
        </span>
      </div>
      <div style={{ position: 'relative', height: 30 }}>
        <span
          className="vv-code"
          style={{
            position: 'absolute',
            left: 0,
            top: 8,
            font: `400 11px/1 ${FONT.pixel}`,
            color: COLORS.inkMute,
            letterSpacing: '0.04em',
            opacity: 1 - flip,
          }}
        >
          {scrambleText(truncateHash(hashString(`reveal-${row.id}`, 64)), ramp(frame, row.delay - 40, 30), `reveal-${row.id}`)}
        </span>
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            opacity: flip,
            transform: `translateY(${(1 - flip) * 8}px)`,
          }}
        >
          <span style={{ font: `700 18px/1 ${FONT.pixel}`, color: row.alarm ? COLORS.alarm : COLORS.ink, letterSpacing: '0.04em' }}>
            {row.choice}
          </span>
          {row.alarm && <Chip accent={COLORS.alarm}>SHARED DOOR</Chip>}
        </span>
      </div>
      <span
        style={{
          justifySelf: 'end',
          font: `700 24px/1 ${FONT.pixel}`,
          color: row.alarm ? COLORS.alarm : COLORS.lime,
          opacity: flip,
        }}
      >
        {row.value}
      </span>
      <div
        style={{
          width: 28,
          height: 28,
          border: `1px solid ${row.alarm ? COLORS.alarm : COLORS.lime}`,
          display: 'grid',
          placeItems: 'center',
          color: row.alarm ? COLORS.alarm : COLORS.lime,
          opacity: check,
          transform: `scale(${0.7 + check * 0.3})`,
          font: `700 16px/1 ${FONT.pixel}`,
        }}
      >
        {row.alarm ? '×' : '✓'}
      </div>
    </div>
  )
}

export function Reveal() {
  const frame = useCurrentFrame()
  const boardIn = useEnter(24)
  const verifiedIn = useEnter(150)
  const browserIn = ramp(frame, 254, 24)
  const boardOut = 1 - ramp(frame, 250, 24)
  const headlineIn = useEnter(16)

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.lime} glowX={50} glowY={18} intensity={0.9} watermark="arch" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 78,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          font: `400 11px/1 ${FONT.pixel}`,
          letterSpacing: '0.14em',
          color: COLORS.inkMute,
          opacity: ramp(frame, 8, 20),
        }}
      >
        <span style={{ width: 28, height: 1, backgroundColor: COLORS.lime }} />
        PHASE 04 / 04 / REVEAL
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 154,
          width: 1000,
          opacity: headlineIn * boardOut,
          transform: `translateY(${(1 - headlineIn) * 24}px)`,
        }}
      >
        <RevealText
          text={'LIFT THE VEIL.'}
          delay={20}
          stagger={3}
          distance={34}
          style={{ font: `400 86px/0.8 ${FONT.display}`, color: COLORS.ink }}
        />
        <p style={{ margin: '18px 0 0', font: `400 14px/1.6 ${FONT.pixel}`, color: COLORS.inkDim }}>
          Every runner reveals. The browser checks each reveal against its commitment, then
          recomputes the round.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 328,
          width: 1680,
          opacity: boardIn * boardOut,
          transform: `translateY(${(1 - boardIn) * 24}px)`,
        }}
      >
        <Panel label="REVEAL LEDGER / ROUND 7915" accent={COLORS.lime} padding={0}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '190px 1fr 190px 60px',
              gap: 20,
              padding: '12px 20px',
              borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.12)}`,
              font: `400 9px/1 ${FONT.pixel}`,
              color: COLORS.inkMute,
              letterSpacing: '0.1em',
            }}
          >
            <span>RUNNER</span>
            <span>COMMITMENT → REVEAL</span>
            <span style={{ textAlign: 'right' }}>CLAIM</span>
            <span style={{ textAlign: 'right' }}>CHECK</span>
          </div>
          {ROWS.map((row) => (
            <RevealRow key={row.id} row={row} frame={frame} />
          ))}
        </Panel>

        <div
          style={{
            marginTop: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: verifiedIn,
            transform: `translateY(${(1 - verifiedIn) * 12}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                display: 'grid',
                placeItems: 'center',
                background: COLORS.lime,
                color: COLORS.bgDeep,
                font: `700 20px/1 ${FONT.pixel}`,
              }}
            >
              ✓
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ font: `700 15px/1 ${FONT.pixel}`, color: COLORS.lime, letterSpacing: '0.04em' }}>
                4 / 4 REVEALS MATCH THEIR COMMITMENTS
              </span>
              <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute }}>
                The winner was recomputed from the revealed moves.
              </span>
            </div>
          </div>
          <Chip accent={COLORS.lime}>BROWSER-SIDE CHECK</Chip>
        </div>

        <div
          style={{
            marginTop: 84,
            paddingTop: 18,
            borderTop: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
            display: 'flex',
            justifyContent: 'space-between',
            font: `400 10px/1.4 ${FONT.pixel}`,
            color: COLORS.inkMute,
            letterSpacing: '0.08em',
            opacity: verifiedIn,
          }}
        >
          <span>COMMITMENTS ARE PUBLIC. MOVES STAY HIDDEN UNTIL REVEAL.</span>
          <span>EVERY REVEAL IS CHECKED AGAINST ITS COMMITMENT.</span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 110,
          opacity: browserIn,
          transform: `translateY(${(1 - browserIn) * 30}px)`,
        }}
      >
        <BrowserWindow
          src="shots/result-tall.png"
          imgW={1920}
          imgH={1400}
          width={1500}
          height={820}
          focus={[
            { at: 0, rect: { x: 210, y: 150, w: 1500, h: 780 } },
            { at: 100, rect: { x: 210, y: 450, w: 1500, h: 780 } },
            { at: 300, rect: { x: 210, y: 560, w: 1500, h: 780 } },
            { at: 574, rect: { x: 210, y: 560, w: 1500, h: 780 } },
          ]}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 200,
          opacity: ramp(frame, 330, 22),
          textAlign: 'right',
        }}
      >
        <Chip accent={COLORS.lime}>4 / 4 VERIFIED</Chip>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 650,
          opacity: ramp(frame, 430, 22),
        }}
      >
        <Stamp label="REJECTED" sub="FORGED WINNER" delay={430} rotate={-7} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 960,
          font: `400 10px/1.4 ${FONT.pixel}`,
          color: COLORS.inkMute,
          letterSpacing: '0.08em',
          opacity: ramp(frame, 430, 22),
        }}
      >
        BROWSER-SIDE VERIFICATION / NOT ON-CHAIN VERIFICATION
      </div>
    </AbsoluteFill>
  )
}
