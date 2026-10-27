import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { BrowserWindow } from '../components/BrowserWindow'
import { Chip, CornerTicks } from '../components/Panel'
import { RevealText } from '../components/RevealText'
import { Stamp } from '../components/Stamp'
import { ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

function Node({
  x,
  index,
  title,
  sub,
  detail,
  accent,
  icon,
  frame,
}: {
  x: number
  index: number
  title: string
  sub: string
  detail: string
  accent: string
  icon: 'site' | 'wallet' | 'shield'
  frame: number
}) {
  const enter = ramp(frame, 80 + index * 34, 26)
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 480,
        width: 440,
        height: 214,
        border: `1px solid ${withAlpha(accent, 0.34)}`,
        background: `linear-gradient(145deg, ${withAlpha(accent, 0.055)}, rgba(9,15,11,0.92))`,
        padding: 24,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px)`,
      }}
    >
      <CornerTicks color={withAlpha(accent, 0.55)} size={10} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ font: `400 9px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.12em' }}>
          0{index + 1} / {sub}
        </span>
        {icon === 'site' && (
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <rect x="4" y="5" width="22" height="20" fill="none" stroke={accent} strokeWidth="1" />
            <path d="M8 10h14M8 15h14M8 20h9" stroke={accent} strokeWidth="1" opacity="0.6" />
          </svg>
        )}
        {icon === 'wallet' && (
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <circle cx="15" cy="11" r="5" fill="none" stroke={accent} strokeWidth="1.2" />
            <path d="M15 16v9M11 21h8" fill="none" stroke={accent} strokeWidth="1.2" />
          </svg>
        )}
        {icon === 'shield' && (
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <path d="M15 3l10 4v8c0 7-5 10-10 12C10 25 5 22 5 15V7z" fill="none" stroke={accent} strokeWidth="1.2" />
            <path d="M11 15l3 3 6-7" fill="none" stroke={accent} strokeWidth="1.2" />
          </svg>
        )}
      </div>
      <div style={{ marginTop: 24, font: `400 34px/0.85 ${FONT.display}`, color: COLORS.ink }}>
        {title}
      </div>
      <div style={{ marginTop: 12, font: `400 11px/1.6 ${FONT.pixel}`, color: COLORS.inkDim }}>
        {detail}
      </div>
    </div>
  )
}

export function Zcash() {
  const frame = useCurrentFrame()
  const headlineIn = useEnter(16)
  const diagramIn = useEnter(60)
  const guardIn = useEnter(300)
  const testnetIn = useEnter(40)
  const dash = -frame * 1.6

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.crown} glowX={82} glowY={22} intensity={0.85} watermark="arch" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 124,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          font: `400 11px/1 ${FONT.pixel}`,
          letterSpacing: '0.14em',
          color: COLORS.inkMute,
          opacity: ramp(frame, 8, 20),
        }}
      >
        <span style={{ width: 28, height: 1, backgroundColor: COLORS.crown }} />
        ZCASH RAIL / SHIELDED TESTNET LAB
      </div>

      <div style={{ position: 'absolute', left: 120, top: 166, width: 1000, opacity: headlineIn }}>
        <RevealText
          text={'CARRY A SEALED MOVE\nTHROUGH ZCASH.'}
          delay={20}
          stagger={2}
          distance={30}
          style={{ font: `400 78px/0.8 ${FONT.display}`, color: COLORS.ink }}
        />
        <p style={{ margin: '20px 0 0', font: `400 14px/1.6 ${FONT.pixel}`, color: COLORS.inkDim, maxWidth: 820 }}>
          The same commit-then-reveal pattern can travel through Zcash. The site prepares shielded
          wallet requests; the wallet signs; the site never sees keys.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 120,
          width: 640,
          opacity: testnetIn,
          transform: `translateY(${(1 - testnetIn) * 24}px)`,
        }}
      >
        <BrowserWindow
          src="shots/testnet.png"
          imgW={1920}
          imgH={1080}
          width={640}
          height={320}
          focus={[{ at: 0, rect: { x: 217, y: 0, w: 1486, h: 650 } }]}
          label="TESTNET ONLY"
          url="veil-vault-game.vercel.app/#testnet"
        />
        <div style={{ position: 'absolute', left: 12, top: 52 }}>
          <Chip accent={COLORS.amber} solid>JUDGE APPENDIX</Chip>
        </div>
        <div style={{ position: 'absolute', right: -6, top: 280 }}>
          <Stamp label="NOT RUN" sub="NO LIVE ROUND" delay={300} rotate={-6} color={COLORS.amber} />
        </div>
      </div>

      <div style={{ opacity: diagramIn }}>
        <Node
          x={120}
          index={0}
          title="VEIL VAULT"
          sub="SITE"
          detail="Prepares a shielded request. Holds no keys, relays no transaction."
          accent={COLORS.lime}
          icon="site"
          frame={frame}
        />
        <Node
          x={740}
          index={1}
          title="YOUR WALLET"
          sub="SIGNER"
          detail="Reviews, signs, and sends. The keys stay inside the wallet."
          accent={COLORS.moon}
          icon="wallet"
          frame={frame}
        />
        <Node
          x={1360}
          index={2}
          title="ZCASHD"
          sub="TESTNET"
          detail="Shielded testnet pool. A supporting lab, not a live game round."
          accent={COLORS.crown}
          icon="shield"
          frame={frame}
        />

        <svg width="1920" height="1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
          <defs>
            <marker id="arrow-lime" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0l8 4-8 4z" fill={COLORS.lime} />
            </marker>
            <marker id="arrow-moon" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0l8 4-8 4z" fill={COLORS.moon} />
            </marker>
          </defs>
          <line x1="566" y1="587" x2="722" y2="587" stroke={COLORS.lime} strokeWidth="1.5" strokeDasharray="8 6" strokeDashoffset={dash} markerEnd="url(#arrow-lime)" opacity={0.8} />
          <line x1="1186" y1="587" x2="1342" y2="587" stroke={COLORS.moon} strokeWidth="1.5" strokeDasharray="8 6" strokeDashoffset={dash} markerEnd="url(#arrow-moon)" opacity={0.8} />
          <text x="610" y="568" fill={COLORS.lime} fontFamily="Silkscreen" fontSize="9" letterSpacing="1">REQUEST</text>
          <text x="1218" y="568" fill={COLORS.moon} fontFamily="Silkscreen" fontSize="9" letterSpacing="1">SIGNED TX</text>
        </svg>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 730,
          borderTop: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
          paddingTop: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
          opacity: guardIn,
          transform: `translateY(${(1 - guardIn) * 18}px)`,
        }}
      >
        {[
          { title: 'THE WALLET SIGNS', detail: 'The site never sees keys.', accent: COLORS.moon },
          { title: 'TESTNET ONLY', detail: 'Never send mainnet ZEC.', accent: COLORS.amber },
          { title: 'NO LIVE ROUND', detail: 'The lab is a judge appendix.', accent: COLORS.lime },
        ].map((item) => (
          <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ width: 8, height: 8, marginTop: 4, backgroundColor: item.accent }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ font: `700 13px/1 ${FONT.pixel}`, color: item.accent, letterSpacing: '0.06em' }}>
                {item.title}
              </span>
              <span style={{ font: `400 11px/1.4 ${FONT.pixel}`, color: COLORS.inkDim }}>{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 862,
          padding: '14px 18px',
          border: `1px solid ${withAlpha(COLORS.amber, 0.34)}`,
          background: withAlpha(COLORS.amber, 0.05),
          color: COLORS.amber,
          font: `400 11px/1.5 ${FONT.pixel}`,
          letterSpacing: '0.04em',
          opacity: guardIn,
        }}
      >
        TESTNET LAB / NO LIVE TESTNET ROUND HAS BEEN RUN / THE WALLET SIGNS; THE SITE NEVER SEES KEYS
      </div>
    </AbsoluteFill>
  )
}
