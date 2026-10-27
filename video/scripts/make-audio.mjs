import fs from 'node:fs'
import { execFileSync } from 'node:child_process'

const timeline = JSON.parse(fs.readFileSync('src/timeline.json', 'utf8'))
const sampleRate = 48000
const totalSamples = Math.ceil(timeline.totalSeconds * sampleRate)
const sceneById = Object.fromEntries(timeline.scenes.map((scene) => [scene.id, scene]))

const music = new Float32Array(totalSamples * 2)
const sfx = new Float32Array(totalSamples * 2)
const voice = new Float32Array(totalSamples * 2)
const activity = new Float32Array(totalSamples)

const twoPi = Math.PI * 2
const chords = [
  { root: 73.42, notes: [146.83, 174.61, 220.0, 293.66] },
  { root: 58.27, notes: [116.54, 146.83, 174.61, 233.08] },
  { root: 49.0, notes: [98.0, 116.54, 146.83, 196.0] },
  { root: 55.0, notes: [110.0, 130.81, 164.81, 220.0] },
]
const chordDuration = 8

console.log('Generating ambient bed…')
for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate
  const chordIndex = Math.floor(t / chordDuration)
  const chord = chords[chordIndex % chords.length]
  const local = t - chordIndex * chordDuration
  const envelope = Math.min(1, local / 1.4) * Math.min(1, (chordDuration - local) / 1.4)
  let value = Math.sin(twoPi * chord.root * t) * 0.018 * (0.72 + 0.28 * Math.sin(twoPi * 0.05 * t))
  for (let n = 0; n < chord.notes.length; n++) {
    const frequency = chord.notes[n]
    value += Math.sin(twoPi * frequency * t + n * 0.6) * 0.009
    value += Math.sin(twoPi * frequency * 1.003 * t + n * 1.7) * 0.006
  }
  value *= envelope
  music[i * 2] += value
  music[i * 2 + 1] += value * 0.94
}

function addTone(startSeconds, duration, frequency, amplitude, decay = 2.2, stereoSpread = 0) {
  const start = Math.max(0, Math.round(startSeconds * sampleRate))
  const end = Math.min(totalSamples, Math.round((startSeconds + duration) * sampleRate))
  for (let i = start; i < end; i++) {
    const t = (i - start) / sampleRate
    const envelope = Math.min(1, t / 0.006) * Math.exp(-t / decay)
    const value = Math.sin(twoPi * frequency * t) * amplitude * envelope
    sfx[i * 2] += value
    sfx[i * 2 + 1] += value * (1 - stereoSpread) + Math.sin(twoPi * frequency * 1.002 * t) * amplitude * envelope * stereoSpread
  }
}

function addBell(startSeconds, amplitude = 0.08, base = 196) {
  const partials = [1, 2, 2.99, 4.05, 5.43]
  partials.forEach((ratio, index) => {
    addTone(startSeconds, 3.4, base * ratio, amplitude / (index + 1.2), 2.6 / Math.sqrt(ratio), 0.16)
  })
  addTone(startSeconds, 2.2, base / 2, amplitude * 0.7, 2.8, 0.1)
}

function addThump(startSeconds, amplitude = 0.08) {
  const start = Math.max(0, Math.round(startSeconds * sampleRate))
  const end = Math.min(totalSamples, start + Math.round(0.5 * sampleRate))
  for (let i = start; i < end; i++) {
    const t = (i - start) / sampleRate
    const frequency = 58 - 20 * Math.min(1, t / 0.22)
    const envelope = Math.min(1, t / 0.004) * Math.exp(-t / 0.16)
    const value = Math.sin(twoPi * frequency * t) * amplitude * envelope
    sfx[i * 2] += value
    sfx[i * 2 + 1] += value
  }
}

function addNoise(startSeconds, duration, amplitude, rise = false) {
  const start = Math.max(0, Math.round(startSeconds * sampleRate))
  const end = Math.min(totalSamples, start + Math.round(duration * sampleRate))
  let smoothed = 0
  for (let i = start; i < end; i++) {
    const t = (i - start) / sampleRate
    const progress = t / duration
    const envelope = rise ? progress * progress * Math.min(1, (1 - progress) * 8) : Math.exp(-t / 0.3)
    smoothed = smoothed * 0.86 + (Math.random() * 2 - 1) * 0.14
    const value = smoothed * amplitude * envelope
    sfx[i * 2] += value
    sfx[i * 2 + 1] += value * 0.85
  }
}

function addRiser(startSeconds, duration, amplitude = 0.05) {
  addNoise(startSeconds, duration, amplitude, true)
  const start = Math.max(0, Math.round(startSeconds * sampleRate))
  const end = Math.min(totalSamples, start + Math.round(duration * sampleRate))
  for (let i = start; i < end; i++) {
    const t = (i - start) / sampleRate
    const progress = t / duration
    const frequency = 180 + 760 * progress * progress
    const envelope = progress * progress * Math.min(1, (1 - progress) * 10)
    const value = Math.sin(twoPi * frequency * t) * amplitude * envelope
    sfx[i * 2] += value
    sfx[i * 2 + 1] += value
  }
}

console.log('Placing sound effects…')
addBell(0, 0.22, 196)
for (const scene of timeline.scenes) {
  if (scene.id === 'cold-open' || scene.id === 'cta') continue
  addBell(scene.seconds.start, 0.045, 220)
}
addRiser(sceneById.reveal.seconds.start - 2.1, 2.1, 0.07)
addNoise(sceneById.reveal.seconds.start, 1.2, 0.16)
addTone(sceneById.reveal.seconds.start, 2.2, 46, 0.22, 1.4, 0.1)
addBell(sceneById.reveal.seconds.start, 0.14, 146.83)

const ctaStart = sceneById.cta.seconds.start
;[293.66, 369.99, 440, 587.33].forEach((frequency, index) => {
  addBell(ctaStart + index * 0.16, 0.09, frequency)
})

const pulseTimes = []
for (let t = 6; t < timeline.totalSeconds - 4; t += 2.4) {
  if (t > sceneById.reveal.seconds.start && t < sceneById.zcash.seconds.start) continue
  pulseTimes.push(t)
}
for (let t = sceneById.reveal.seconds.start + 1; t < sceneById.zcash.seconds.start - 1; t += 1.2) {
  pulseTimes.push(t)
}
pulseTimes.forEach((t, index) => addThump(t, index % 4 === 0 ? 0.055 : 0.035))

console.log('Laying voiceover…')
for (const scene of timeline.scenes) {
  const buffer = execFileSync(
    'ffmpeg',
    ['-v', 'error', '-i', `public/${scene.file}`, '-ar', String(sampleRate), '-ac', '2', '-f', 'f32le', '-acodec', 'pcm_f32le', 'pipe:1'],
    { maxBuffer: 64 * 1024 * 1024 },
  )
  const aligned = new Float32Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  const start = Math.round(((scene.from + scene.voiceFrom) / timeline.fps) * sampleRate)
  const fadeSamples = Math.round(0.012 * sampleRate)
  for (let i = 0; i < aligned.length / 2; i++) {
    const target = start + i
    if (target >= totalSamples) break
    const fade = Math.min(1, i / fadeSamples, (aligned.length / 2 - i) / fadeSamples)
    voice[target * 2] += aligned[i * 2] * fade
    voice[target * 2 + 1] += aligned[i * 2 + 1] * fade
    if (Math.abs(aligned[i * 2]) > 0.002) activity[target] = 1
  }
}

console.log('Ducking and mixing…')
let envelope = 0
const attack = 1 - Math.exp(-1 / (0.025 * sampleRate))
const release = 1 - Math.exp(-1 / (0.4 * sampleRate))
for (let i = 0; i < totalSamples; i++) {
  const target = activity[i]
  envelope += (target - envelope) * (target > envelope ? attack : release)
  const musicGain = 0.13 + 0.09 * (1 - envelope)
  const fadeIn = Math.min(1, i / (1.4 * sampleRate))
  const fadeOut = Math.min(1, (totalSamples - i) / (4 * sampleRate))
  const master = fadeIn * fadeOut
  for (let channel = 0; channel < 2; channel++) {
    const index = i * 2 + channel
    const value = (voice[index] * 0.92 + music[index] * musicGain + sfx[index] * 0.52) * master
    music[index] = value
  }
}

let peak = 0
for (let i = 0; i < music.length; i++) peak = Math.max(peak, Math.abs(music[i]))
const gain = peak > 0 ? 0.89 / peak : 1
console.log(`peak ${peak.toFixed(3)} → gain ${gain.toFixed(3)}`)

const dataSize = totalSamples * 4
const wav = Buffer.alloc(44 + dataSize)
wav.write('RIFF', 0)
wav.writeUInt32LE(36 + dataSize, 4)
wav.write('WAVE', 8)
wav.write('fmt ', 12)
wav.writeUInt32LE(16, 16)
wav.writeUInt16LE(1, 20)
wav.writeUInt16LE(2, 22)
wav.writeUInt32LE(sampleRate, 24)
wav.writeUInt32LE(sampleRate * 4, 28)
wav.writeUInt16LE(4, 32)
wav.writeUInt16LE(16, 34)
wav.write('data', 36)
wav.writeUInt32LE(dataSize, 40)
for (let i = 0; i < totalSamples * 2; i++) {
  const sample = Math.max(-1, Math.min(1, Math.tanh(music[i] * gain * 1.05)))
  wav.writeInt16LE(Math.round(sample * 32767), 44 + i * 2)
}
fs.writeFileSync('public/audio/soundtrack.wav', wav)
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', 'public/audio/soundtrack.wav', '-codec:a', 'libmp3lame', '-b:a', '192k', 'public/audio/soundtrack.mp3'])
console.log('Wrote public/audio/soundtrack.mp3')
