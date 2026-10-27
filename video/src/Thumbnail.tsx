import { AbsoluteFill } from 'remotion'
import { Backdrop } from './components/Backdrop'
import { Emblem } from './components/Emblem'
import { LogoLockup } from './components/Logo'
import { COLORS, FONT, VAULTS, withAlpha, type VaultKey } from './theme'

const ORDER: VaultKey[] = ['copper', 'moon', 'crown']

export function Thumbnail() {
  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.lime} glowX={38} glowY={32} intensity={1.2} watermark="arch" />

      <div style={{ position: 'absolute', left: 110, top: 82 }}>
        <LogoLockup size={54} />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 110,
          top: 94,
          textAlign: 'right',
          font: `400 13px/1.6 ${FONT.pixel}`,
          letterSpacing: '0.12em',
          color: COLORS.inkMute,
        }}
      >
        <div style={{ color: COLORS.lime }}>ZECATHON 2026</div>
        <div>WILDCARD ENTRY</div>
      </div>

      <div style={{ position: 'absolute', left: 110, top: 246, width: 1160 }}>
        <div
          style={{
            font: `400 13px/1 ${FONT.pixel}`,
            letterSpacing: '0.18em',
            color: COLORS.lime,
          }}
        >
          ONE ROUND / FOUR RUNNERS / THREE VAULTS
        </div>
        <div
          style={{
            marginTop: 24,
            font: `600 108px/1.02 ${FONT.display}`,
            color: COLORS.ink,
            letterSpacing: '-0.015em',
          }}
        >
          CHOOSE A VAULT.
          <br />
          <span style={{ color: COLORS.lime }}>KEEP IT HIDDEN.</span>
        </div>
        <div
          style={{
            marginTop: 26,
            maxWidth: 940,
            font: `400 29px/1.5 ${FONT.body}`,
            color: COLORS.inkSoft,
          }}
        >
          A shielded bluffing game. Commit your choice, then reveal only after the
          doors close.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 110,
          top: 250,
          width: 430,
          border: `1px solid ${withAlpha(COLORS.lime, 0.26)}`,
          background: `linear-gradient(150deg, ${withAlpha(COLORS.lime, 0.05)}, rgba(9,15,11,0.9))`,
          padding: '22px 26px 8px',
        }}
      >
        <div
          style={{
            font: `400 11px/1 ${FONT.pixel}`,
            letterSpacing: '0.12em',
            color: COLORS.inkMute,
            paddingBottom: 14,
          }}
        >
          THE THREE VAULTS / RELICS
        </div>
        {ORDER.map((key) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '16px 0',
              borderTop: `1px solid ${withAlpha(COLORS.ink, 0.09)}`,
            }}
          >
            <Emblem id={key} size={112} glow />
            <div style={{ flex: 1 }}>
              <div style={{ font: `700 23px/1 ${FONT.body}`, color: COLORS.ink }}>
                {VAULTS[key].short.toUpperCase()}
              </div>
              <div
                style={{
                  marginTop: 8,
                  font: `400 10px/1.35 ${FONT.pixel}`,
                  letterSpacing: '0.06em',
                  color: COLORS.inkMute,
                }}
              >
                {VAULTS[key].line.toUpperCase()}
              </div>
            </div>
            <div style={{ font: `600 54px/1 ${FONT.display}`, color: VAULTS[key].accent }}>
              {VAULTS[key].value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 700,
          width: 1000,
          height: 96,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '0 22px',
          border: `1px solid ${withAlpha(COLORS.lime, 0.34)}`,
          background: withAlpha(COLORS.lime, 0.055),
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
          <span
            style={{
              font: `400 10px/1 ${FONT.pixel}`,
              color: COLORS.inkMute,
              letterSpacing: '0.12em',
            }}
          >
            CANONICAL URL / HTTPS
          </span>
          <span style={{ font: `600 30px/1 ${FONT.pixel}`, color: COLORS.ink }}>
            veil-vault-game.vercel.app
          </span>
        </div>
        <div
          style={{
            height: 60,
            padding: '0 24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            background: COLORS.lime,
            color: COLORS.bgDeep,
            font: `700 16px/1 ${FONT.body}`,
            whiteSpace: 'nowrap',
          }}
        >
          PLAY FREE <span style={{ fontFamily: 'sans-serif', fontSize: 22 }}>→</span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 110, top: 828, display: 'flex', gap: 10 }}>
        {['NO WALLET', 'NO ACCOUNT', 'NO PAYMENT'].map((label, index) => (
          <span
            key={label}
            style={{
              border: `1px solid ${withAlpha(index === 0 ? COLORS.lime : index === 1 ? COLORS.moon : COLORS.crown, 0.42)}`,
              background: withAlpha(index === 0 ? COLORS.lime : index === 1 ? COLORS.moon : COLORS.crown, 0.06),
              color: index === 0 ? COLORS.lime : index === 1 ? COLORS.moon : COLORS.crown,
              padding: '8px 12px',
              font: `500 10px/1 ${FONT.pixel}`,
              letterSpacing: '0.1em',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 958,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 18,
          borderTop: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
          font: `400 11px/1.4 ${FONT.pixel}`,
          letterSpacing: '0.08em',
          color: COLORS.inkMute,
        }}
      >
        <span style={{ color: COLORS.lime }}>BROWSER PRACTICE / NO WALLET REQUIRED</span>
        <span>BROWSER PRACTICE / NOT CHAIN EVIDENCE</span>
      </div>
    </AbsoluteFill>
  )
}
