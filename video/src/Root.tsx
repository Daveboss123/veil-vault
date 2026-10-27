import { Composition } from 'remotion'
import { ensureFonts } from './fonts'
import { Thumbnail } from './Thumbnail'
import { VeilVaultDemo } from './Video'
import { TIMELINE } from './timeline'

ensureFonts()

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="VeilVaultDemo"
        component={VeilVaultDemo}
        durationInFrames={TIMELINE.totalInFrames}
        fps={TIMELINE.fps}
        width={TIMELINE.width}
        height={TIMELINE.height}
      />
      <Composition
        id="VeilVaultThumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
