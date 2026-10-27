import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { Emblem } from '../components/Emblem'
import { Chip } from '../components/Panel'
import { LogoLockup } from '../components/Logo'
import { RevealText } from '../components/RevealText'
import { ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, VAULTS, withAlpha, type VaultKey } from '../theme'

export function CTA() {
  const frame = useCurrentFrame()
  const logoIn = useEnter(10)
  const urlIn = useEnter(100)
  const qrIn = useEnter(150)
  const emblemsIn = useEnter(200)
  const footerIn = useEnter(250)
  const fadeOut = 1 - ramp(frame, 300, 33)

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Backdrop accent={COLORS.lime} glowX={50} glowY={30} intensity={1.15} watermark="arch" />

      <div style={{ position: 'absolute', left: 120, top: 112, opacity: logoIn, transform: `translateY(${(1 - logoIn) * 18}px)` }}>
        <LogoLockup size={46} />
      </div>

      <div style={{ position: 'absolute', left: 120, top: 236, width: 1060 }}>
        <RevealText
          text={'CHOOSE A VAULT.\nKEEP IT HIDDEN.'}
          delay={26}
          stagger={2}
          distance={38}
          style={{ font: `600 76px/1.03 ${FONT.display}`, color: COLORS.ink }}
        />
        <p style={{ margin: '24px 0 0', font: `400 19px/1.6 ${FONT.body}`, color: COLORS.inkSoft }}>
          Four runners. Three vaults. One hidden choice. Browser practice, no wallet required.
        </p>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 524,
          width: 1010,
          height: 104,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 22px',
          border: `1px solid ${withAlpha(COLORS.lime, 0.34)}`,
          background: withAlpha(COLORS.lime, 0.055),
          opacity: urlIn,
          transform: `translateY(${(1 - urlIn) * 20}px)`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
          <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.12em' }}>
            CANONICAL URL / HTTPS
          </span>
          <span style={{ font: `600 30px/1 ${FONT.pixel}`, color: COLORS.ink, letterSpacing: '0' }}>
            veil-vault-game.vercel.app
          </span>
        </div>
        <div
          style={{
            height: 62,
            padding: '0 24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            background: COLORS.lime,
            color: COLORS.bgDeep,
            font: `700 16px/1 ${FONT.body}`,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          PLAY PRACTICE <span style={{ fontFamily: 'sans-serif', fontSize: 22 }}>→</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 120, top: 664, display: 'flex', gap: 10, opacity: urlIn }}>
        <Chip accent={COLORS.lime}>NO WALLET</Chip>
        <Chip accent={COLORS.moon}>NO ACCOUNT</Chip>
        <Chip accent={COLORS.crown}>NO PAYMENT</Chip>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 224,
          width: 400,
          padding: 26,
          background: COLORS.cream,
          color: COLORS.bgDeep,
          opacity: qrIn,
          transform: `translateY(${(1 - qrIn) * 24}px) rotate(1.2deg)`,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ font: `700 11px/1 ${FONT.body}`, letterSpacing: '0.08em' }}>SCAN TO PLAY</span>
          <span style={{ font: `400 9px/1 ${FONT.pixel}`, color: '#4c5a50', letterSpacing: '0.06em' }}>PRACTICE / NO WALLET</span>
        </div>
        <Img src={staticFile('cta-qr.png')} style={{ width: 348, height: 348, display: 'block' }} />
        <div style={{ marginTop: 14, font: `400 10px/1.4 ${FONT.pixel}`, color: '#435047', letterSpacing: '0.02em' }}>
          POINTS TO THE CANONICAL URL. NO TRACKING PARAMETERS.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 700,
          width: 400,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          opacity: emblemsIn,
          transform: `translateY(${(1 - emblemsIn) * 18}px)`,
        }}
      >
        {(Object.keys(VAULTS) as VaultKey[]).map((key) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <Emblem id={key} size={86} glow />
            <span style={{ font: `400 9px/1 ${FONT.pixel}`, color: VAULTS[key].accent, letterSpacing: '0.06em' }}>
              {VAULTS[key].short.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          right: 120,
          top: 914,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 18,
          borderTop: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
          opacity: footerIn,
          font: `400 11px/1.4 ${FONT.pixel}`,
          letterSpacing: '0.08em',
          color: COLORS.inkMute,
        }}
      >
        <span style={{ color: COLORS.lime }}>ZECATHON 2026 / WILDCARD</span>
        <span>BROWSER PRACTICE / NOT CHAIN EVIDENCE</span>
      </div>
    </AbsoluteFill>
  )
}
