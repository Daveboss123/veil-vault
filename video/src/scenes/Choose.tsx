import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { BrowserWindow } from '../components/BrowserWindow'
import { Cursor } from '../components/Cursor'
import { ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

type ReadoutProps = {
  label: string
  detail: string
  accent: string
  frame: number
}

function Readout({ label, detail, accent, frame }: ReadoutProps) {
  const enter = useEnter(0, { damping: 24 })
  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 980,
        width: 1260,
        height: 54,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 18px',
        border: `1px solid ${withAlpha(accent, 0.35)}`,
        background: `linear-gradient(90deg, ${withAlpha(COLORS.bgDeep, 0.92)}, ${withAlpha(COLORS.panel, 0.86)})`,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 10}px)`,
      }}
    >
      <span style={{ width: 7, height: 7, backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }} />
      <span style={{ font: `700 17px/1.15 ${FONT.body}`, color: accent, letterSpacing: '0', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <span style={{ width: 1, height: 24, backgroundColor: withAlpha(COLORS.ink, 0.14) }} />
      <span style={{ font: `400 16px/1.4 ${FONT.body}`, color: COLORS.inkSoft, letterSpacing: '0' }}>
        {detail}
      </span>
      <span style={{ marginLeft: 'auto', font: `400 11px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.08em' }}>
        {String(Math.min(3, Math.floor(frame / 70) + 1)).padStart(2, '0')} / 03
      </span>
    </div>
  )
}

export function Choose() {
  const frame = useCurrentFrame()
  const browserIn = useEnter(14, { damping: 24 })
  const selectedIn = ramp(frame, 378, 16)
  const stage = frame < 70 ? 0 : frame < 140 ? 1 : frame < 210 ? 2 : frame < 300 ? 3 : frame < 390 ? 4 : 5

  const readouts = [
    { label: 'THREE DOORS / ONE CHOICE', detail: 'Read the room before you commit.', accent: COLORS.lime },
    { label: 'COPPER CACHE / 3 RELICS', detail: 'The quiet corridor. Modest prize.', accent: COLORS.copper },
    { label: 'MOON ARCHIVE / 5 RELICS', detail: 'The middle door. Two entrances.', accent: COLORS.moon },
    { label: 'SUN CROWN / 8 RELICS', detail: 'The great prize. Everyone sees it.', accent: COLORS.crown },
    { label: 'READ THE TENDENCIES', detail: 'Then trust your read.', accent: COLORS.lime },
    { label: 'YOUR MOVE / SUN CROWN +8', detail: 'Selected. Now seal it before the bell.', accent: COLORS.crown },
  ]

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.crown} glowX={76} glowY={26} intensity={0.8} watermark="arch" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 76,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          font: `400 12px/1 ${FONT.pixel}`,
          letterSpacing: '0.12em',
          color: COLORS.inkMute,
          opacity: ramp(frame, 8, 20),
        }}
      >
        <span style={{ width: 28, height: 1, backgroundColor: COLORS.crown }} />
        PHASE 02 / 04 / CHOOSE
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 76,
          font: `400 11px/1 ${FONT.pixel}`,
          letterSpacing: '0.08em',
          color: withAlpha(COLORS.crown, 0.85),
          opacity: ramp(frame, 20, 20),
        }}
      >
        RIVALS LOCKED / YOUR MOVE IS OPEN
      </div>

      <BrowserWindow
        src="shots/choose-idle-tall.png"
        imgW={1920}
        imgH={1400}
        width={1680}
        height={860}
        style={{
          left: 120,
          top: 110,
          opacity: browserIn,
          transform: `translateY(${(1 - browserIn) * 30}px)`,
        }}
        focus={[
          { at: 0, rect: { x: 0, y: 0, w: 1920, h: 1400 } },
          { at: 70, rect: { x: 100, y: 480, w: 700, h: 342 } },
          { at: 140, rect: { x: 650, y: 480, w: 700, h: 342 } },
          { at: 210, rect: { x: 1200, y: 480, w: 700, h: 342 } },
          { at: 300, rect: { x: 230, y: 430, w: 1460, h: 712 } },
          { at: 505, rect: { x: 230, y: 430, w: 1460, h: 712 } },
        ]}
      />

      <BrowserWindow
        src="shots/choose-tall.png"
        imgW={1920}
        imgH={1400}
        width={1680}
        height={860}
        style={{
          left: 120,
          top: 110,
          opacity: selectedIn,
          pointerEvents: 'none',
        }}
        focus={[
          { at: 0, rect: { x: 0, y: 0, w: 1920, h: 1400 } },
          { at: 70, rect: { x: 100, y: 480, w: 700, h: 342 } },
          { at: 140, rect: { x: 650, y: 480, w: 700, h: 342 } },
          { at: 210, rect: { x: 1200, y: 480, w: 700, h: 342 } },
          { at: 300, rect: { x: 230, y: 430, w: 1460, h: 712 } },
          { at: 505, rect: { x: 230, y: 430, w: 1460, h: 712 } },
        ]}
      />

      <Readout
        key={stage}
        label={readouts[stage].label}
        detail={readouts[stage].detail}
        accent={readouts[stage].accent}
        frame={frame}
      />

      <Cursor
        points={[
          { at: 300, x: 360, y: 620 },
          { at: 336, x: 980, y: 500 },
          { at: 366, x: 1503, y: 516 },
          { at: 430, x: 1503, y: 516 },
        ]}
        clicks={[382]}
      />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 972,
          width: 1680,
          height: 1,
          backgroundColor: withAlpha(COLORS.crown, 0.18),
          opacity: selectedIn,
        }}
      />
    </AbsoluteFill>
  )
}
