export type GameSound = 'hover' | 'select' | 'seal' | 'reveal' | 'alarm' | 'win' | 'reject'

let audioContext: AudioContext | null = null
let ambient: { master: GainNode; oscillators: OscillatorNode[] } | null = null

function context(): AudioContext | null {
  if (typeof window === 'undefined' || !window.AudioContext) return null
  audioContext ??= new AudioContext()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

function tone(ctx: AudioContext, frequency: number, start: number, duration: number, gainValue: number, type: OscillatorType = 'sine') {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

function noise(ctx: AudioContext, start: number, duration: number, gainValue: number) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let index = 0; index < length; index += 1) data[index] = (Math.random() * 2 - 1) * (1 - index / length)
  const source = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  source.buffer = buffer
  filter.type = 'lowpass'
  filter.frequency.value = 900
  gain.gain.setValueAtTime(gainValue, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  source.connect(filter).connect(gain).connect(ctx.destination)
  source.start(start)
}

export function playGameSound(sound: GameSound, enabled: boolean) {
  if (!enabled) return
  const ctx = context()
  if (!ctx) return
  const now = ctx.currentTime + 0.01
  if (sound === 'hover') tone(ctx, 520, now, 0.035, 0.018, 'square')
  if (sound === 'select') {
    tone(ctx, 330, now, 0.12, 0.04, 'triangle')
    tone(ctx, 495, now + 0.045, 0.13, 0.035, 'sine')
  }
  if (sound === 'seal') {
    noise(ctx, now, 0.16, 0.035)
    tone(ctx, 124, now, 0.42, 0.07, 'triangle')
    tone(ctx, 248, now + 0.18, 0.25, 0.035, 'sine')
  }
  if (sound === 'reveal') {
    ;[196, 247, 330, 494].forEach((frequency, index) => tone(ctx, frequency, now + index * 0.075, 0.32, 0.035, 'triangle'))
  }
  if (sound === 'alarm') {
    noise(ctx, now, 0.24, 0.045)
    tone(ctx, 155, now, 0.42, 0.06, 'sawtooth')
    tone(ctx, 164, now, 0.42, 0.045, 'sawtooth')
  }
  if (sound === 'win') {
    ;[262, 330, 392, 523].forEach((frequency, index) => tone(ctx, frequency, now + index * 0.085, 0.5, 0.045, 'triangle'))
  }
  if (sound === 'reject') {
    tone(ctx, 220, now, 0.16, 0.055, 'square')
    tone(ctx, 147, now + 0.12, 0.3, 0.055, 'square')
  }
}

export function setAmbientMusic(enabled: boolean) {
  if (!enabled) {
    if (!ambient || !audioContext) return
    const now = audioContext.currentTime
    ambient.master.gain.cancelScheduledValues(now)
    ambient.master.gain.setValueAtTime(Math.max(ambient.master.gain.value, 0.0001), now)
    ambient.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)
    ambient.oscillators.forEach((oscillator) => oscillator.stop(now + 0.85))
    ambient = null
    return
  }

  if (ambient) return
  const ctx = context()
  if (!ctx) return
  const now = ctx.currentTime
  const master = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(0.032, now + 1.8)
  filter.type = 'lowpass'
  filter.frequency.value = 780
  filter.Q.value = 0.8
  master.connect(filter).connect(ctx.destination)

  const oscillators: OscillatorNode[] = []
  const addDrone = (frequency: number, gainValue: number, type: OscillatorType, detune = 0) => {
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency
    oscillator.detune.value = detune
    gain.gain.value = gainValue
    oscillator.connect(gain).connect(master)
    oscillator.start(now)
    oscillators.push(oscillator)
  }

  addDrone(55, 0.42, 'sine')
  addDrone(82.41, 0.22, 'triangle', -4)
  addDrone(110, 0.08, 'sine', 5)

  const pulse = ctx.createOscillator()
  const pulseDepth = ctx.createGain()
  const pulseVoice = ctx.createOscillator()
  const pulseGain = ctx.createGain()
  pulse.frequency.value = 0.095
  pulseDepth.gain.value = 0.055
  pulseVoice.type = 'triangle'
  pulseVoice.frequency.value = 220
  pulseGain.gain.value = 0.058
  pulse.connect(pulseDepth).connect(pulseGain.gain)
  pulseVoice.connect(pulseGain).connect(master)
  pulse.start(now)
  pulseVoice.start(now)
  oscillators.push(pulse, pulseVoice)

  const shimmer = ctx.createOscillator()
  const shimmerLfo = ctx.createOscillator()
  const shimmerDepth = ctx.createGain()
  const shimmerGain = ctx.createGain()
  shimmer.type = 'sine'
  shimmer.frequency.value = 659.25
  shimmerLfo.frequency.value = 0.047
  shimmerDepth.gain.value = 0.012
  shimmerGain.gain.value = 0.0121
  shimmerLfo.connect(shimmerDepth).connect(shimmerGain.gain)
  shimmer.connect(shimmerGain).connect(master)
  shimmer.start(now)
  shimmerLfo.start(now)
  oscillators.push(shimmer, shimmerLfo)

  ambient = { master, oscillators }
}
