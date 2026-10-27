import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { KokoroTTS } from 'kokoro-js'

const FPS = 30
const VOICE = 'af_heart'
const SPEED = 0.85
const LEAD_IN_FRAMES = 24
const TAIL_FRAMES = 51

const segments = [
  {
    id: 'cold-open',
    text: 'In Veyr, the city writes everything down. What you buy. Where you go. Who you give your word to. And once privacy becomes evidence of guilt, silence starts to look like a confession.',
  },
  {
    id: 'problem',
    text: 'So the Night Runners built the Veil: a way to lock a choice in public without showing it. Commit before the final bell. Reveal only when no one can change course.',
  },
  {
    id: 'rules',
    text: 'Veil Vault is a bluffing game for four runners. Three vaults hold three, five, and eight relics. Pick one door, and hope no rival picks it too. A shared door trips the alarm. The highest lone claim takes the round.',
  },
  {
    id: 'chamber',
    text: 'This is the practice chamber. No wallet, no account, no payment. Just four runners, three vaults, and one choice you keep to yourself.',
  },
  {
    id: 'briefing',
    text: 'First, the briefing. Three relics are about to burn. Your rivals have already sealed their moves, so the house cannot react to yours.',
  },
  {
    id: 'choose',
    text: 'Now choose a vault. Copper is the quiet three. Moon is the middle five. The Sun Crown is worth eight, and everyone can see it coming. Read the tendencies, then trust your read.',
  },
  {
    id: 'seal',
    text: 'Seal your move. Your choice is mixed with a random secret and hashed into a commitment. Four commitments go public, but zero choices do. Keep the receipt private. It is the key that opens your commitment later.',
  },
  {
    id: 'reveal',
    text: 'When the veil lifts, every runner reveals. The browser checks each reveal against its commitment, then recomputes the round. A forged winner gets rejected. That is browser-side verification, not on-chain verification.',
  },
  {
    id: 'zcash',
    text: 'The same commit-then-reveal pattern can travel through Zcash. The testnet lab prepares shielded wallet requests, and your wallet signs them. The site never sees your keys. It is a supporting appendix for judges, not a finished payment flow.',
  },
  {
    id: 'honesty',
    text: 'Browser practice, not chain evidence. The audit sample is fabricated. And the site keeps no accounts, no analytics, no cookies, and no browser storage. We would rather state that boundary plainly than oversell the demo.',
  },
  {
    id: 'cta',
    text: 'Play the practice vault. Choose a vault, keep it hidden, and see if your read holds. veil-vault-game.vercel.app.',
  },
]

const outDir = 'public/audio/voice'
const tempDir = path.join(process.env.TEMP ?? '.', 'veil-vault-voice')
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(tempDir, { recursive: true })

const force = process.argv.includes('--force')
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
  dtype: 'q8',
  device: 'cpu',
})

const manifest = []
for (const segment of segments) {
  const mp3 = path.join(outDir, `${segment.id}.mp3`)
  if (force || !fs.existsSync(mp3)) {
    console.log(`Generating ${segment.id} with Kokoro ${VOICE}…`)
    const audio = await tts.generate(segment.text, { voice: VOICE, speed: SPEED })
    const wav = path.join(tempDir, `${segment.id}.wav`)
    await audio.save(wav)
    execFileSync('ffmpeg', [
      '-y', '-v', 'error', '-i', wav,
      '-ar', '48000', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '192k',
      mp3,
    ])
    fs.rmSync(wav, { force: true })
  }
  const duration = Number.parseFloat(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString(),
  )
  manifest.push({ ...segment, file: `audio/voice/${segment.id}.mp3`, duration })
  console.log(`${segment.id}: ${duration.toFixed(2)}s`)
}

fs.writeFileSync('src/voice-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`)

const timelinePath = 'src/timeline.json'
const previous = JSON.parse(fs.readFileSync(timelinePath, 'utf8'))
let from = 0
const scenes = previous.scenes.map((scene) => {
  const voice = manifest.find((entry) => entry.id === scene.id)
  if (!voice) throw new Error(`Missing voice segment for ${scene.id}`)
  const voiceDurationInFrames = Math.ceil(voice.duration * FPS)
  const durationInFrames = Math.max(scene.durationInFrames, voiceDurationInFrames + TAIL_FRAMES)
  const entry = {
    id: scene.id,
    text: voice.text,
    file: voice.file,
    from,
    durationInFrames,
    voiceFrom: LEAD_IN_FRAMES,
    voiceDurationInFrames,
    seconds: {
      start: from / FPS,
      duration: durationInFrames / FPS,
      voice: voice.duration,
    },
  }
  from += durationInFrames
  return entry
})

const timeline = {
  fps: FPS,
  width: previous.width,
  height: previous.height,
  totalInFrames: from,
  totalSeconds: from / FPS,
  scenes,
}
fs.writeFileSync(timelinePath, `${JSON.stringify(timeline, null, 2)}\n`)

const total = manifest.reduce((sum, segment) => sum + segment.duration, 0)
console.log(`total voice: ${total.toFixed(2)}s`)
console.log(`timeline: ${timeline.totalSeconds.toFixed(2)}s / ${timeline.totalInFrames} frames`)
