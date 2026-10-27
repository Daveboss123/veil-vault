import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Backdrop } from '../components/Backdrop'
import { Emblem } from '../components/Emblem'
import { Chip } from '../components/Panel'
import { RunnerChip, type RunnerId } from '../components/RunnerChip'
import { Stamp } from '../components/Stamp'
import { easeInOutCubic, ramp, useEnter } from '../lib/anim'
import { COLORS, FONT, VAULTS, withAlpha, type VaultKey } from '../theme'

const CARD_X: Record<VaultKey, number> = { copper: 120, moon: 690, crown: 1260 }
const CARD_W = 540
const CARD_Y = 352
const CARD_H = 324

const TOKENS: {
  id: RunnerId
  vault: VaultKey
  start: { x: number; y: number }
  end: { x: number; y: number }
  delay: number
}[] = [
  { id: 'you', vault: 'crown', start: { x: 220, y: 742 }, end: { x: 1600, y: 596 }, delay: 300 },
  { id: 'fox', vault: 'moon', start: { x: 440, y: 742 }, end: { x: 1122, y: 558 }, delay: 316 },
  { id: 'moth', vault: 'copper', start: { x: 660, y: 742 }, end: { x: 470, y: 596 }, delay: 332 },
  { id: 'rook', vault: 'moon', start: { x: 880, y: 742 }, end: { x: 1048, y: 622 }, delay: 348 },
]

export function Rules() {
  const frame = useCurrentFrame()
  const headlineIn = useEnter(22)
  const cardsIn = useEnter(54)
  const runnersIn = useEnter(168)
  const ruleIn = useEnter(470)
  const alarmIn = useEnter(410, { damping: 14, stiffness: 180 })
  const scoreIn = useEnter(486)
  const moveProgress = TOKENS.map((token) => easeInOutCubic(ramp(frame, token.delay, 46)))

  return (
    <AbsoluteFill>
      <Backdrop accent={COLORS.lime} glowX={52} glowY={12} intensity={1} watermark="arch" />

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 128,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          font: `400 12px/1 ${FONT.pixel}`,
          letterSpacing: '0.16em',
          color: COLORS.inkMute,
          opacity: ramp(frame, 8, 20),
        }}
      >
        <span style={{ width: 34, height: 1, backgroundColor: COLORS.lime }} />
        THE THIRTEENTH BELL / RULES OF THE CHAMBER
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 176,
          width: 1400,
          opacity: headlineIn,
          transform: `translateY(${(1 - headlineIn) * 24}px)`,
        }}
      >
        <h1 style={{ margin: 0, font: `400 82px/0.78 ${FONT.display}`, color: COLORS.ink, letterSpacing: '0.002em' }}>
          FOUR RUNNERS.<br />
          THREE VAULTS.{' '}
          <span
            style={{
              color: COLORS.lime,
              opacity: ramp(frame, 70, 30),
              display: 'inline-block',
              transform: `translateY(${(1 - ramp(frame, 70, 30)) * 18}px)`,
            }}
          >
            ONE RULE.
          </span>
        </h1>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 330,
          font: `400 15px/1.4 ${FONT.pixel}`,
          color: COLORS.inkDim,
          opacity: ramp(frame, 120, 30),
        }}
      >
        Choose one door. A shared door wakes the alarm. The highest lone claim wins.
      </div>

      {(Object.keys(VAULTS) as VaultKey[]).map((key, index) => {
        const vault = VAULTS[key]
        const cardIn = easeInOutCubic(ramp(frame, 54 + index * 12, 30))
        const isAlarm = key === 'moon' && frame >= 400
        const isWinner = key === 'crown' && frame >= 440
        const isClaimed = key === 'copper' && frame >= 440
        const borderColor = isAlarm ? COLORS.alarm : isWinner ? COLORS.lime : withAlpha(vault.accent, 0.42)
        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              left: CARD_X[key],
              top: CARD_Y,
              width: CARD_W,
              height: CARD_H,
              opacity: cardIn,
              transform: `translateY(${(1 - cardIn) * 46}px)`,
              border: `1px solid ${borderColor}`,
              background: isAlarm
                ? `linear-gradient(145deg, ${withAlpha(COLORS.alarmDeep, 0.3)}, rgba(9,15,11,0.92))`
                : isWinner
                  ? `linear-gradient(145deg, ${withAlpha(COLORS.lime, 0.09)}, rgba(9,15,11,0.92))`
                  : `linear-gradient(145deg, ${withAlpha(vault.accent, 0.07)}, rgba(9,15,11,0.92))`,
              boxShadow: isAlarm
                ? `0 0 50px ${withAlpha(COLORS.alarm, 0.18)}`
                : isWinner
                  ? `0 0 50px ${withAlpha(COLORS.lime, 0.12)}`
                  : '0 26px 60px rgba(0,0,0,0.32)',
              overflow: 'visible',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(${withAlpha(vault.accent, 0.05)} 1px, transparent 1px)`,
                backgroundSize: '100% 44px',
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 26,
                top: 26,
                opacity: 0.9,
                transform: `rotate(${Math.sin((frame + index * 40) / 46) * 1.6}deg)`,
              }}
            >
              <Emblem id={key} size={148} glow={isWinner} style={{ opacity: isAlarm ? 0.42 : 1 }} />
            </div>

            <div style={{ position: 'absolute', left: 28, top: 26 }}>
              <Chip accent={vault.accent}>{vault.value} RELICS</Chip>
            </div>

            <div style={{ position: 'absolute', left: 28, top: 102, width: 300 }}>
              <h2 style={{ margin: 0, font: `400 56px/0.82 ${FONT.display}`, color: isAlarm ? COLORS.inkDim : COLORS.ink }}>
                {vault.name}
              </h2>
              <p style={{ margin: '14px 0 0', font: `400 14px/1.5 ${FONT.pixel}`, color: COLORS.inkMute }}>
                {vault.line}
              </p>
            </div>

            <div
              style={{
                position: 'absolute',
                left: 28,
                right: 28,
                bottom: 22,
                paddingTop: 14,
                borderTop: `1px solid ${withAlpha(COLORS.ink, 0.12)}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ font: `400 10px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.1em' }}>
                DOOR 0{index + 1} / {key === 'copper' ? 'QUIET' : key === 'moon' ? 'MIDDLE' : 'EXPOSED'}
              </span>
              {isClaimed && <Chip accent={COLORS.copper} solid>CLAIMED +3</Chip>}
              {isWinner && <Chip accent={COLORS.lime} solid>WINNER +8</Chip>}
            </div>

            {isAlarm && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at 60% 40%, ${withAlpha(COLORS.alarm, 0.26)}, transparent 65%)`,
                  opacity: alarmIn * (0.6 + 0.4 * Math.sin(frame / 4)),
                }}
              />
            )}

            {isWinner && (
              <div
                style={{
                  position: 'absolute',
                  inset: -1,
                  border: `2px solid ${COLORS.lime}`,
                  boxShadow: `0 0 30px ${withAlpha(COLORS.lime, 0.35)} inset`,
                  pointerEvents: 'none',
                }}
              />
            )}

            {isAlarm && (
              <div style={{ position: 'absolute', right: 18, top: -30 }}>
                <Stamp label="ALARM" sub="SHARED DOOR" delay={410} rotate={-8} />
              </div>
            )}
          </div>
        )
      })}

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 710,
          width: 940,
          height: 1,
          backgroundColor: withAlpha(COLORS.ink, 0.12),
          opacity: runnersIn,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 682,
          font: `400 10px/1 ${FONT.pixel}`,
          color: COLORS.inkMute,
          letterSpacing: '0.12em',
          opacity: runnersIn,
        }}
      >
        FOUR RUNNERS / ONE HIDDEN CHOICE
      </div>

      <div
        style={{
          position: 'absolute',
          left: 1080,
          top: 710,
          width: 720,
          height: 1,
          backgroundColor: withAlpha(COLORS.ink, 0.12),
          opacity: runnersIn,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 1080,
          top: 682,
          font: `400 10px/1 ${FONT.pixel}`,
          color: withAlpha(COLORS.lime, 0.8),
          letterSpacing: '0.12em',
          opacity: runnersIn,
        }}
      >
        RIVALS LOCK BEFORE YOUR CHOICE
      </div>

      {TOKENS.map((token, index) => {
        const progress = moveProgress[index]
        const x = token.start.x + (token.end.x - token.start.x) * progress
        const y = token.start.y + (token.end.y - token.start.y) * progress
        const isOnAlarm = token.vault === 'moon' && frame >= 400
        const dim = isOnAlarm ? 0.38 : 1
        return (
          <div
            key={token.id}
            style={{
              position: 'absolute',
              left: x - 38,
              top: y - 38,
              width: 76,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 7,
              opacity: runnersIn * dim,
              transform: `scale(${1 + (1 - progress) * 0.03})`,
              zIndex: 6,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                padding: 3,
                border: `1px solid ${token.vault === 'moon' && isOnAlarm ? COLORS.alarm : withAlpha(COLORS.ink, 0.24)}`,
                background: withAlpha(COLORS.bgDeep, 0.85),
                boxShadow: `0 8px 22px rgba(0,0,0,0.45)`,
              }}
            >
              <RunnerChip id={token.id} size={68} />
            </div>
            <span
              style={{
                font: `700 11px/1 ${FONT.pixel}`,
                letterSpacing: '0.08em',
                color: token.id === 'you' ? COLORS.lime : COLORS.inkSoft,
                textTransform: 'uppercase',
                textShadow: '0 2px 6px rgba(0,0,0,0.8)',
              }}
            >
              {token.id === 'you' ? 'YOU' : token.id.toUpperCase()}
            </span>
          </div>
        )
      })}

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 842,
          width: 820,
          opacity: ruleIn,
          transform: `translateY(${(1 - ruleIn) * 18}px)`,
        }}
      >
        <div style={{ font: `400 38px/0.9 ${FONT.display}`, color: COLORS.ink }}>
          A shared door wakes the alarm.
        </div>
        <div style={{ marginTop: 6, font: `400 38px/0.9 ${FONT.display}`, color: COLORS.lime }}>
          The highest lone claim wins.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 824,
          width: 690,
          opacity: scoreIn,
          transform: `translateY(${(1 - scoreIn) * 18}px)`,
          border: `1px solid ${withAlpha(COLORS.ink, 0.16)}`,
          background: withAlpha(COLORS.panel, 0.86),
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '9px 14px',
            borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.1)}`,
            font: `400 9px/1 ${FONT.pixel}`,
            color: COLORS.inkMute,
            letterSpacing: '0.1em',
          }}
        >
          <span>ROUND COMPLETE / SCORE</span>
          <span style={{ color: COLORS.lime }}>WINNER: YOU</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { id: 'you' as RunnerId, score: '+8', accent: COLORS.lime },
            { id: 'moth' as RunnerId, score: '+3', accent: COLORS.copper },
            { id: 'fox' as RunnerId, score: '0', accent: COLORS.alarm },
            { id: 'rook' as RunnerId, score: '0', accent: COLORS.alarm },
          ].map((entry) => (
            <div
              key={entry.id}
              style={{
                padding: '12px 12px 10px',
                borderRight: `1px solid ${withAlpha(COLORS.ink, 0.08)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <RunnerChip id={entry.id} size={34} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ font: `400 9px/1 ${FONT.pixel}`, color: COLORS.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {entry.id === 'you' ? 'YOU' : entry.id}
                </span>
                <span style={{ font: `700 20px/1 ${FONT.pixel}`, color: entry.accent }}>{entry.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
