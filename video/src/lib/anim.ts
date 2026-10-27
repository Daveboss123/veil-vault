import type { CSSProperties } from 'react'
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  type SpringConfig,
} from 'remotion'

export const CLAMP = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const

export function ramp(frame: number, start: number, duration: number): number {
  return interpolate(frame, [start, start + duration], [0, 1], CLAMP)
}

export function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3)
}

export function easeInOutCubic(value: number): number {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
}

export function smoothRamp(frame: number, start: number, duration: number): number {
  return easeInOutCubic(ramp(frame, start, duration))
}

export function useEnter(delay = 0, config: Partial<SpringConfig> = {}): number {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 200,
      stiffness: 110,
      mass: 0.7,
      ...config,
    },
  })
}

export function usePop(delay = 0): number {
  return useEnter(delay, { damping: 14, stiffness: 180, mass: 0.55 })
}

export function fadeUp(progress: number, distance = 28): CSSProperties {
  return {
    opacity: Math.max(0, Math.min(1, progress)),
    transform: `translateY(${(1 - progress) * distance}px)`,
  }
}

export function seeded(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

export function hashString(seed: string, length = 64): string {
  const chars = '0123456789abcdef'
  let hash = 2166136261
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  let output = ''
  for (let index = 0; index < length; index++) {
    hash = Math.imul(hash ^ (hash >>> 15), 2246822507)
    hash ^= hash >>> 13
    output += chars[(hash >>> 0) % chars.length]
  }
  return output
}

export function scrambleText(text: string, progress: number, seed: string): string {
  const chars = '0123456789abcdef'
  const revealed = Math.floor(text.length * Math.max(0, Math.min(1, progress)))
  let output = ''
  for (let index = 0; index < text.length; index++) {
    if (index < revealed || text[index] === ' ' || text[index] === '…' || text[index] === '.') {
      output += text[index]
    } else {
      const pick = hashString(`${seed}-${index}-${revealed}`, 2)
      output += chars[Number.parseInt(pick, 16) % chars.length]
    }
  }
  return output
}

export function truncateHash(hash: string): string {
  return `${hash.slice(0, 12)}…${hash.slice(-8)}`
}

export function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0')
}

export function formatTimecode(frame: number, fps: number): string {
  const totalSeconds = Math.max(0, frame) / fps
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const frames = Math.floor(frame % fps)
  return `${pad(minutes)}:${pad(seconds)}:${pad(frames)}`
}

export type Rect = { x: number; y: number; w: number; h: number }
export type FocusKeyframe = { at: number; rect: Rect; ease?: boolean }

export function focusAt(keyframes: FocusKeyframe[], frame: number): Rect {
  if (keyframes.length === 0) return { x: 0, y: 0, w: 1920, h: 1080 }
  if (keyframes.length === 1) return keyframes[0].rect
  if (frame <= keyframes[0].at) return keyframes[0].rect
  const last = keyframes[keyframes.length - 1]
  if (frame >= last.at) return last.rect
  for (let index = 0; index < keyframes.length - 1; index++) {
    const current = keyframes[index]
    const next = keyframes[index + 1]
    if (frame >= current.at && frame <= next.at) {
      const raw = (frame - current.at) / Math.max(1, next.at - current.at)
      const eased = current.ease === false ? raw : easeInOutCubic(raw)
      return {
        x: interpolate(eased, [0, 1], [current.rect.x, next.rect.x]),
        y: interpolate(eased, [0, 1], [current.rect.y, next.rect.y]),
        w: interpolate(eased, [0, 1], [current.rect.w, next.rect.w]),
        h: interpolate(eased, [0, 1], [current.rect.h, next.rect.h]),
      }
    }
  }
  return last.rect
}
