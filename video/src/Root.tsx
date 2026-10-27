import { Composition } from 'remotion'
import { ensureFonts } from './fonts'
import { VeilVaultDemo } from './Video'
import { TIMELINE } from './timeline'

ensureFonts()

export function RemotionRoot() {
  return (
    <Composition
      id="VeilVaultDemo"
      component={VeilVaultDemo}
      durationInFrames={TIMELINE.totalInFrames}
      fps={TIMELINE.fps}
      width={TIMELINE.width}
      height={TIMELINE.height}
    />
  )
}
