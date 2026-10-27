import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'

const segments = [
  {
    id: 'cold-open',
    text: 'In the city of Veyr, every choice is written down. Every purchase. Every passage. Every promise. Privacy became evidence of guilt.',
  },
  {
    id: 'problem',
    text: 'So the Night Runners built the Veil: a way to lock a choice in public without revealing it. Commit before the final bell. Reveal only when no one can change course.',
  },
  {
    id: 'rules',
    text: 'Veil Vault is a four-runner bluffing game. Three vaults hold three, five, and eight relics. Choose one door and hope no rival chooses it too. A shared door wakes the alarm. The highest lone claim wins.',
  },
  {
    id: 'chamber',
    text: 'This is the practice chamber. No wallet, no account, no payment. Just four runners, three vaults, and one hidden choice.',
  },
  {
    id: 'briefing',
    text: 'First, the briefing. Three relics are about to burn. Your rivals have already sealed their moves, so the house cannot react to yours.',
  },
  {
    id: 'choose',
    text: 'Choose a vault. Copper is the quiet three. Moon is the middle five. The Sun Crown is worth eight, and everyone sees it. Read the tendencies, then trust your read.',
  },
  {
    id: 'seal',
    text: 'Seal your move. Your choice is mixed with a random secret and hashed into a commitment. Four commitments go public. Zero choices. Keep the receipt private; it is the key that opens your commitment later.',
  },
  {
    id: 'reveal',
    text: 'When the veil lifts, every runner reveals. The browser checks each reveal against its commitment, then recomputes the round. A forged winner is rejected. This is browser-side verification, not on-chain verification.',
  },
  {
    id: 'zcash',
    text: 'The same commit-then-reveal pattern can travel through Zcash. The testnet lab prepares shielded wallet requests. Your wallet signs; the site never sees keys. No live testnet round has been run.',
  },
  {
    id: 'honesty',
    text: 'Browser practice, not chain evidence. The audit demo uses fabricated sample records, and the site keeps no accounts, analytics, cookies, or browser storage.',
  },
  {
    id: 'cta',
    text: 'Play the practice vault. Choose a vault. Keep it hidden. veil-vault-game.vercel.app.',
  },
]

const outDir = 'public/audio/voice'
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync('src', { recursive: true })

const manifest = []
for (const segment of segments) {
  const file = `${outDir}/${segment.id}.mp3`
  if (!fs.existsSync(file)) {
    const tts = new MsEdgeTTS()
    await tts.setMetadata('en-US-ChristopherNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3)
    const { audioStream } = tts.toStream(segment.text, { rate: '-8%', pitch: '-3Hz' })
    const chunks = []
    for await (const chunk of audioStream) chunks.push(chunk)
    fs.writeFileSync(file, Buffer.concat(chunks))
  }
  const duration = Number.parseFloat(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString(),
  )
  manifest.push({ ...segment, file: `audio/voice/${segment.id}.mp3`, duration })
  console.log(`${segment.id}: ${duration.toFixed(2)}s`)
}

fs.writeFileSync('src/voice-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`)
const total = manifest.reduce((sum, segment) => sum + segment.duration, 0)
console.log(`total voice: ${total.toFixed(2)}s`)
