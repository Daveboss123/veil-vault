import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useEnter } from '../lib/anim'

export function RevealText({
  text,
  delay = 0,
  stagger = 3,
  style,
  lineStyle,
  wordStyle,
  as = 'div',
  distance = 34,
  blur = true,
}: {
  text: string
  delay?: number
  stagger?: number
  style?: CSSProperties
  lineStyle?: CSSProperties
  wordStyle?: CSSProperties
  as?: ElementType
  distance?: number
  blur?: boolean
}) {
  const Tag = as
  let wordIndex = 0

  return (
    <Tag style={style}>
      {text.split('\n').map((line, lineIndex) => (
        <span key={lineIndex} style={{ display: 'block', ...lineStyle }}>
          {line.split(' ').map((word) => {
            const current = wordIndex
            wordIndex += 1
            return (
              <Word
                key={`${lineIndex}-${current}`}
                delay={delay + current * stagger}
                distance={distance}
                blur={blur}
                style={wordStyle}
              >
                {word}
              </Word>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

function Word({
  children,
  delay,
  distance,
  blur,
  style,
}: {
  children: ReactNode
  delay: number
  distance: number
  blur: boolean
  style?: CSSProperties
}) {
  const progress = useEnter(delay, { damping: 26, stiffness: 120, mass: 0.8 })
  return (
    <span
      style={{
        display: 'inline-block',
        marginRight: '0.22em',
        opacity: progress,
        transform: `translateY(${(1 - progress) * distance}px)`,
        filter: blur && progress < 0.98 ? `blur(${(1 - progress) * 5}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
