import type { ReactNode } from 'react'
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion'
import { Chrome } from './components/Chrome'
import { Grain } from './components/Grain'
import { ramp } from './lib/anim'
import { COLORS } from './theme'
import { TIMELINE } from './timeline'
import { Briefing } from './scenes/Briefing'
import { Chamber } from './scenes/Chamber'
import { Choose } from './scenes/Choose'
import { ColdOpen } from './scenes/ColdOpen'
import { CTA } from './scenes/CTA'
import { Honesty } from './scenes/Honesty'
import { Problem } from './scenes/Problem'
import { Reveal } from './scenes/Reveal'
import { Rules } from './scenes/Rules'
import { Seal } from './scenes/Seal'
import { Zcash } from './scenes/Zcash'

const SCENE_COMPONENTS: Record<string, () => ReactNode> = {
  'cold-open': ColdOpen,
  problem: Problem,
  rules: Rules,
  chamber: Chamber,
  briefing: Briefing,
  choose: Choose,
  seal: Seal,
  reveal: Reveal,
  zcash: Zcash,
  honesty: Honesty,
  cta: CTA,
}

function SceneFade({ durationInFrames, children }: { durationInFrames: number; children: ReactNode }) {
  const frame = useCurrentFrame()
  const opacity = Math.min(ramp(frame, 0, 12), 1 - ramp(frame, durationInFrames - 14, 14))
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>
}

export function VeilVaultDemo() {
  return (
    <AbsoluteFill className="vv-root" style={{ backgroundColor: COLORS.bgDeep }}>
      <Audio src={staticFile('audio/soundtrack.mp3')} />

      {TIMELINE.scenes.map((scene) => {
        const Scene = SCENE_COMPONENTS[scene.id]
        if (!Scene) return null
        return (
          <Sequence
            key={scene.id}
            from={scene.from}
            durationInFrames={scene.durationInFrames}
            name={scene.id}
          >
            <SceneFade durationInFrames={scene.durationInFrames}>
              <Scene />
            </SceneFade>
          </Sequence>
        )
      })}

      <Grain />
      <Chrome />
    </AbsoluteFill>
  )
}
