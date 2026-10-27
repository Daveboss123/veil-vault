import type { ReactNode } from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { seeded } from '../lib/anim'
import { COLORS, withAlpha } from '../theme'

type BackdropProps = {
  accent?: string
  glowX?: number
  glowY?: number
  intensity?: number
  grid?: boolean
  watermark?: 'bell' | 'arch' | 'none'
  children?: ReactNode
}

const DUST = (() => {
  const random = seeded(20261026)
  return Array.from({ length: 30 }, (_, index) => ({
    x: random() * 1920,
    y: random() * 1200,
    size: index % 6 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
    speed: 0.08 + random() * 0.22,
    opacity: 0.08 + random() * 0.24,
    drift: -18 + random() * 36,
  }))
})()

export function Backdrop({
  accent = COLORS.lime,
  glowX = 68,
  glowY = 18,
  intensity = 1,
  grid = true,
  watermark = 'bell',
  children,
}: BackdropProps) {
  const frame = useCurrentFrame()
  const scanY = ((frame * 1.35) % 1380) - 160

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${withAlpha(accent, 0.13 * intensity)} 0%, transparent 46%),
            radial-gradient(circle at 16% 88%, ${withAlpha(accent, 0.05 * intensity)} 0%, transparent 38%),
            linear-gradient(160deg, #0d1710 0%, #0a110c 46%, #060b08 100%)`,
        }}
      />

      {grid && (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${withAlpha(COLORS.lime, 0.032)} 1px, transparent 1px),
              linear-gradient(90deg, ${withAlpha(COLORS.lime, 0.032)} 1px, transparent 1px),
              linear-gradient(${withAlpha(COLORS.lime, 0.018)} 1px, transparent 1px),
              linear-gradient(90deg, ${withAlpha(COLORS.lime, 0.018)} 1px, transparent 1px)`,
            backgroundSize: '320px 320px, 320px 320px, 64px 64px, 64px 64px',
            maskImage: 'radial-gradient(ellipse at 52% 42%, black 18%, transparent 82%)',
          }}
        />
      )}

      {watermark === 'bell' && (
        <svg
          viewBox="0 0 700 900"
          style={{
            position: 'absolute',
            left: -190,
            top: -80,
            width: 780,
            height: 1000,
            opacity: 0.075,
            color: accent,
          }}
          aria-hidden="true"
        >
          <path
            d="M350 110c-118 0-190 88-190 235v190l-72 105h524l-72-105V345c0-147-72-235-190-235z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M280 640h140M310 690h80" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="350" cy="86" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M210 535h280" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      )}

      {watermark === 'arch' && (
        <svg
          viewBox="0 0 700 900"
          style={{
            position: 'absolute',
            right: -210,
            top: -60,
            width: 860,
            height: 1100,
            opacity: 0.07,
            color: accent,
          }}
          aria-hidden="true"
        >
          <path d="M90 860V330C90 178 208 60 350 60s260 118 260 270v530" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M160 860V340c0-112 85-200 190-200s190 88 190 200v520" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <path d="M350 140v660M210 860h280" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      )}

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          background: `linear-gradient(to bottom, transparent 0%, ${withAlpha(accent, 0.055)} 48%, transparent 100%)`,
          height: 180,
          top: scanY,
          opacity: 0.55,
        }}
      />

      {DUST.map((particle, index) => {
        const y = ((particle.y - frame * particle.speed) % 1300 + 1300) % 1300 - 110
        const x = particle.x + Math.sin((frame + index * 17) / 90) * particle.drift
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: particle.size,
              height: particle.size,
              backgroundColor: index % 5 === 0 ? accent : COLORS.ink,
              opacity: particle.opacity,
              boxShadow: index % 5 === 0 ? `0 0 8px ${accent}` : undefined,
            }}
          />
        )
      })}

      <AbsoluteFill
        style={{
          borderTop: `1px solid ${withAlpha(COLORS.ink, 0.06)}`,
          borderBottom: `1px solid ${withAlpha(COLORS.ink, 0.04)}`,
          margin: 28,
          pointerEvents: 'none',
        }}
      />

      {children}
    </AbsoluteFill>
  )
}
