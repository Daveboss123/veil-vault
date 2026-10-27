import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion'

export function Grain() {
  const frame = useCurrentFrame()
  const index = (Math.floor(frame / 3) % 4) + 1
  const offsetX = (frame % 5) * 7
  const offsetY = (frame % 7) * 5

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill className="vv-scanlines" style={{ opacity: 0.55 }} />
      <Img
        src={staticFile(`grain/grain-${index}.png`)}
        style={{
          position: 'absolute',
          width: '108%',
          height: '108%',
          left: -offsetX,
          top: -offsetY,
          objectFit: 'cover',
          mixBlendMode: 'overlay',
          opacity: 0.075,
        }}
      />
      <AbsoluteFill className="vv-vignette" />
    </AbsoluteFill>
  )
}
