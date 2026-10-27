import fs from 'node:fs'
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'

const tts = new MsEdgeTTS()
await tts.setMetadata('en-US-ChristopherNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3)
const { audioStream } = tts.toStream('In the city of Veyr, every choice is written down.', { rate: '-5%', pitch: '-3Hz' })
const chunks = []
for await (const chunk of audioStream) chunks.push(chunk)
const buffer = Buffer.concat(chunks)
fs.writeFileSync('public/audio/test-voice.mp3', buffer)
console.log('bytes', buffer.length)
