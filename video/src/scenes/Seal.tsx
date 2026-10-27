import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { BrowserWindow } from '../components/BrowserWindow'
import { Emblem } from '../components/Emblem'
import { RevealText } from '../components/RevealText'
import { Stamp } from '../components/Stamp'
import { hashString, ramp, scrambleText, truncateHash, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

const PUBLIC_HASH = hashString('veil-vault-public-commitment', 64)

export function Seal() {
  const frame = useCurrentFrame()
  const browserIn = useEnter(40, { damping: 24 })
  const formulaIn = useEnter(90)
  const receiptIn = useEnter(280)
  const statIn = useEnter(388)
  const receiptTagIn = useEnter(330)

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.lime} glowX={30} glowY={26} intensity={0.85} watermark="arch" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 148,
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
        PHASE 03 / 04 / SEAL
      </div>

      <div style={{ position: 'absolute', left: 120, top: 196, width: 520 }}>
        <RevealText
          text={'SEAL YOUR\nMOVE.'}
          delay={20}
          stagger={2}
          distance={30}
          style={{ font: `600 62px/1.03 ${FONT.display}`, color: COLORS.ink }}
        />
        <p
          style={{
            margin: '22px 0 0',
            font: `400 16px/1.7 ${FONT.body}`,
            color: COLORS.inkSoft,
            opacity: ramp(frame, 70, 24),
          }}
        >
          Your choice is mixed with a random secret and hashed into a commitment. The hash goes
          public; the inputs stay private.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 444,
          width: 520,
          opacity: formulaIn,
          transform: `translateY(${(1 - formulaIn) * 20}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.08em' }}>
              PRIVATE CHOICE
            </span>
            <div
              style={{
                width: 148,
                height: 78,
                border: `1px solid ${withAlpha(COLORS.crown, 0.4)}`,
                background: withAlpha(COLORS.crown, 0.06),
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0 12px',
              }}
            >
              <Emblem id="crown" size={34} />
              <span style={{ font: `700 12px/1.25 ${FONT.body}`, color: COLORS.crown, letterSpacing: '0' }}>
                SUN<br />CROWN
              </span>
            </div>
          </div>

          <span style={{ font: `400 22px/1 ${FONT.pixel}`, color: COLORS.inkMute, paddingBottom: 26 }}>+</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.08em' }}>
              RANDOM SALT
            </span>
            <div
              style={{
                width: 128,
                height: 78,
                border: `1px solid ${withAlpha(COLORS.moon, 0.4)}`,
                background: withAlpha(COLORS.moon, 0.06),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                font: `500 14px/1 ${FONT.pixel}`,
                color: COLORS.moon,
                letterSpacing: '0.1em',
              }}
            >
              a7f3c19e
            </div>
          </div>

          <span style={{ font: `400 20px/1 ${FONT.pixel}`, color: COLORS.lime, paddingBottom: 28 }}>→</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.lime, letterSpacing: '0.08em' }}>
              PUBLIC HASH
            </span>
            <div
              style={{
                width: 178,
                height: 78,
                border: `1px solid ${withAlpha(COLORS.lime, 0.4)}`,
                background: withAlpha(COLORS.lime, 0.05),
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                font: `400 11px/1.5 ${FONT.pixel}`,
                color: COLORS.inkSoft,
                letterSpacing: '0.04em',
              }}
            >
              {scrambleText(truncateHash(PUBLIC_HASH), ramp(frame, 120, 40), 'seal-hash')}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            font: `400 10px/1 ${FONT.pixel}`,
            color: COLORS.inkMute,
            letterSpacing: '0.06em',
          }}
        >
          <span style={{ width: 5, height: 5, backgroundColor: COLORS.lime }} />
          SHA-256 / THE INPUTS NEVER LEAVE THIS BROWSER
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 612,
          width: 520,
          height: 200,
          opacity: receiptIn,
          transform: `translateY(${(1 - receiptIn) * 20}px)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            height: '100%',
            border: `1px solid ${withAlpha(COLORS.lime, 0.24)}`,
            background: 'linear-gradient(145deg, rgba(20,33,23,0.92), rgba(8,14,10,0.94))',
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
          }}
        >
          <svg width="92" height="72" viewBox="0 0 92 72" aria-hidden="true" style={{ flex: '0 0 auto' }}>
            <rect x="2" y="8" width="88" height="62" fill="none" stroke={COLORS.inkDim} strokeWidth="1" />
            <path d="M2 10l44 32 44-32" fill="none" stroke={COLORS.inkDim} strokeWidth="1" />
            <path d="M2 68l32-26M90 68L58 42" fill="none" stroke={withAlpha(COLORS.ink, 0.2)} strokeWidth="1" />
            <circle cx="46" cy="42" r="15" fill={COLORS.bgDeep} stroke={COLORS.lime} strokeWidth="1.5" />
            <path d="M46 34l4 6-4 6-4-6z" fill={COLORS.lime} />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.lime, letterSpacing: '0.1em' }}>
              YOUR PRIVATE RECEIPT
            </span>
            <span style={{ font: `600 30px/1 ${FONT.display}`, color: COLORS.ink }}>
              Keep the key.
            </span>
            <span style={{ font: `400 13px/1.5 ${FONT.body}`, color: COLORS.inkMute }}>
              Only this receipt can open your commitment later. It is never shown here.
            </span>
          </div>
          <div style={{ position: 'absolute', right: -20, top: -24, opacity: receiptTagIn }}>
            <Stamp label="SEALED" sub="PRIVATE" delay={330} rotate={-8} color={COLORS.lime} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 832,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 38,
          opacity: statIn,
          transform: `translateY(${(1 - statIn) * 16}px)`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: `600 54px/1 ${FONT.display}`, color: COLORS.lime }}>4</span>
          <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.08em' }}>
            COMMITMENTS PUBLIC
          </span>
        </div>
        <div style={{ width: 1, height: 52, backgroundColor: withAlpha(COLORS.ink, 0.16) }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ font: `600 54px/1 ${FONT.display}`, color: COLORS.ink }}>0</span>
          <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.08em' }}>
            CHOICES REVEALED
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 680,
          top: 116,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          font: `400 11px/1 ${FONT.pixel}`,
          letterSpacing: '0.1em',
          color: COLORS.inkMute,
          opacity: browserIn,
        }}
      >
        <span style={{ width: 6, height: 6, backgroundColor: COLORS.lime }} />
        PUBLIC BOARD / SAFE TO SHOW
      </div>

      <BrowserWindow
        src="shots/sealed-tall.png"
        imgW={1920}
        imgH={1400}
        width={1120}
        height={760}
        style={{
          left: 680,
          top: 150,
          opacity: browserIn,
          transform: `translateY(${(1 - browserIn) * 30}px)`,
        }}
        focus={[
          { at: 0, rect: { x: 274, y: 0, w: 1369, h: 880 } },
          { at: 553, rect: { x: 274, y: 0, w: 1369, h: 880 } },
        ]}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 460 + ((frame * 1.6) % 260),
            height: 36,
            background: `linear-gradient(to bottom, transparent, ${withAlpha(COLORS.lime, 0.13)}, transparent)`,
            pointerEvents: 'none',
          }}
        />
      </BrowserWindow>

      <div
        style={{
          position: 'absolute',
          left: 680,
          top: 920,
          width: 1120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '11px 16px',
          border: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
          background: withAlpha(COLORS.panel, 0.86),
          opacity: browserIn,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, font: `400 11px/1 ${FONT.pixel}`, color: COLORS.inkSoft, letterSpacing: '0.04em' }}>
          <span style={{ width: 5, height: 5, backgroundColor: COLORS.lime }} />
          4 PUBLIC COMMITMENTS / 0 CHOICES
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: `400 11px/1 ${FONT.pixel}`, color: COLORS.amber, letterSpacing: '0.04em' }}>
          <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
            <rect x="1" y="5" width="8" height="6" fill="none" stroke="currentColor" />
            <path d="M2.5 5V3.5a2.5 2.5 0 0 1 5 0V5" fill="none" stroke="currentColor" />
          </svg>
          PRIVATE RECEIPT / WITHHELD
        </span>
      </div>
    </AbsoluteFill>
  )
}
