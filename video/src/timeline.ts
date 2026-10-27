import rawTimeline from './timeline.json'

export type TimelineScene = {
  id: string
  text: string
  file: string
  from: number
  durationInFrames: number
  voiceFrom: number
  voiceDurationInFrames: number
  seconds: {
    start: number
    duration: number
    voice: number
  }
}

export type Timeline = {
  fps: number
  width: number
  height: number
  totalInFrames: number
  totalSeconds: number
  scenes: TimelineScene[]
}

export const TIMELINE = rawTimeline as Timeline

export function getSceneById(id: string): TimelineScene {
  const scene = TIMELINE.scenes.find((entry) => entry.id === id)
  if (!scene) throw new Error(`Unknown scene: ${id}`)
  return scene
}
