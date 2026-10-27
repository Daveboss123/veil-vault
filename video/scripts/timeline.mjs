import fs from 'node:fs'

const manifest = JSON.parse(fs.readFileSync('src/voice-manifest.json', 'utf8'))
const fps = 30
const lead = 0.8
const tail = 0.9

let frame = 0
const scenes = manifest.map((segment) => {
  const durationInFrames = Math.round((lead + segment.duration + tail) * fps)
  const scene = {
    id: segment.id,
    text: segment.text,
    file: segment.file,
    from: frame,
    durationInFrames,
    voiceFrom: Math.round(lead * fps),
    voiceDurationInFrames: Math.round(segment.duration * fps),
    seconds: {
      start: frame / fps,
      duration: durationInFrames / fps,
      voice: segment.duration,
    },
  }
  frame += durationInFrames
  return scene
})

const timeline = {
  fps,
  width: 1920,
  height: 1080,
  totalInFrames: frame,
  totalSeconds: frame / fps,
  scenes,
}

fs.writeFileSync('src/timeline.json', `${JSON.stringify(timeline, null, 2)}\n`)
for (const scene of scenes) {
  console.log(`${scene.id.padEnd(10)} ${(scene.seconds.start).toFixed(2)}s  +${scene.seconds.duration.toFixed(2)}s  voice ${scene.seconds.voice.toFixed(2)}s`)
}
console.log(`total ${timeline.totalSeconds.toFixed(2)}s / ${frame} frames`)
