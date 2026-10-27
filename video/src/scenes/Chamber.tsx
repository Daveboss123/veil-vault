import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { BrowserWindow } from '../components/BrowserWindow'
import { Chip } from '../components/Panel'
import { RevealText } from '../components/RevealText'
import { ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, withAlpha } from '../theme'

export function Chamber() {
  const frame = useCurrentFrame()
  const browserIn = useEnter(18, { damping: 24 })
  const statsIn = useEnter(280)
  const tagIn = useEnter(330)

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.lime} glowX={24} glowY={30} intensity={0.9} watermark="bell" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 154,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          font: `400 13px/1 ${FONT.pixel}`,
          letterSpacing: '0.13em',
          color: COLORS.inkMute,
          opacity: ramp(frame, 8, 22),
        }}
      >
        <span style={{ width: 34, height: 1, backgroundColor: COLORS.lime }} />
        THE PRACTICE CHAMBER / NO CHAIN
      </div>

      <div style={{ position: 'absolute', left: 120, top: 206, width: 400 }}>
        <RevealText
          text={'NO WALLET.\nNO ACCOUNT.\nNO PAYMENT.'}
          delay={22}
          stagger={2}
          distance={30}
          style={{ font: `600 48px/1.06 ${FONT.display}`, color: COLORS.ink }}
        />

        <div
          style={{
            marginTop: 28,
            font: `400 17px/1.7 ${FONT.body}`,
            color: COLORS.inkSoft,
            opacity: ramp(frame, 96, 26),
          }}
        >
          Four runners. Three vaults. One hidden choice. This is a browser simulation; no
          transaction is sent.
        </div>

        <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {['SAME-ORIGIN ONLY', 'NO WALLET RELAY', 'NO BROWSER STORAGE'].map((item, index) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: ramp(frame, 150 + index * 16, 22),
                font: `400 12px/1 ${FONT.pixel}`,
                color: COLORS.inkMute,
                letterSpacing: '0.06em',
              }}
            >
              <span style={{ width: 5, height: 5, backgroundColor: COLORS.lime }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 1260,
          opacity: ramp(frame, 30, 24),
          font: `400 11px/1 ${FONT.pixel}`,
          color: COLORS.inkMute,
          letterSpacing: '0.1em',
        }}
      >
        <span>LIVE SITE / CANONICAL URL</span>
        <span style={{ color: withAlpha(COLORS.lime, 0.8) }}>PRACTICE MODE / NO SIGN-IN</span>
      </div>

      <BrowserWindow
        src="shots/home.png"
        imgW={1920}
        imgH={1080}
        width={1260}
        height={800}
        style={{
          left: 540,
          top: 128,
          opacity: browserIn,
          transform: `translateY(${(1 - browserIn) * 34}px) scale(${0.985 + browserIn * 0.015})`,
          transformOrigin: '50% 50%',
        }}
        focus={[
          { at: 0, rect: { x: 80, y: 20, w: 1200, h: 724 } },
          { at: 100, rect: { x: 80, y: 20, w: 1200, h: 724 } },
          { at: 260, rect: { x: 80, y: 20, w: 1200, h: 724 } },
          { at: 380, rect: { x: 100, y: 30, w: 1180, h: 712 } },
        ]}
      />

      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 946,
          display: 'flex',
          gap: 10,
          opacity: tagIn,
          transform: `translateY(${(1 - tagIn) * 12}px)`,
        }}
      >
        <Chip accent={COLORS.lime} solid>NO TRANSACTION SENT</Chip>
        <Chip accent={COLORS.ink}>PRACTICE SIMULATION</Chip>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 706,
          width: 370,
          borderTop: `1px solid ${withAlpha(COLORS.ink, 0.14)}`,
          paddingTop: 20,
          display: 'flex',
          gap: 22,
          opacity: statsIn,
          transform: `translateY(${(1 - statsIn) * 16}px)`,
        }}
      >
        {[
          { value: '4', label: 'RUNNERS' },
          { value: '3', label: 'VAULTS' },
          { value: '1', label: 'CHOICE' },
        ].map((stat) => (
          <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <span style={{ font: `600 54px/1 ${FONT.display}`, color: COLORS.lime }}>{stat.value}</span>
            <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.08em' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}
