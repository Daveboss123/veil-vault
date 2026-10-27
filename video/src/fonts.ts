import { loadFont } from '@remotion/fonts'
import { staticFile } from 'remotion'

let started = false

const FONTS = [
  { family: 'Spectral', file: 'Spectral-Medium.woff2', weight: '500' },
  { family: 'Spectral', file: 'Spectral-SemiBold.woff2', weight: '600' },
  { family: 'Spectral', file: 'Spectral-Bold.woff2', weight: '700' },
  { family: 'Manrope', file: 'Manrope-Regular.woff2', weight: '400' },
  { family: 'Manrope', file: 'Manrope-Medium.woff2', weight: '500' },
  { family: 'Manrope', file: 'Manrope-SemiBold.woff2', weight: '600' },
  { family: 'Manrope', file: 'Manrope-Bold.woff2', weight: '700' },
  { family: 'IBM Plex Mono', file: 'IBMPlexMono-Regular.woff2', weight: '400' },
  { family: 'IBM Plex Mono', file: 'IBMPlexMono-Medium.woff2', weight: '500' },
  { family: 'IBM Plex Mono', file: 'IBMPlexMono-SemiBold.woff2', weight: '600' },
] as const

export function ensureFonts(): void {
  if (started) return
  started = true
  for (const font of FONTS) {
    void loadFont({
      family: font.family,
      url: staticFile(`fonts/${font.file}`),
      weight: font.weight,
      style: 'normal',
    })
  }
}
