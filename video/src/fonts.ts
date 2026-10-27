import { loadFont } from '@remotion/fonts'
import { staticFile } from 'remotion'

let started = false

export function ensureFonts(): void {
  if (started) return
  started = true
  void loadFont({
    family: 'Jacquard24',
    url: staticFile('fonts/Jacquard24-Regular.ttf'),
    weight: '400',
    style: 'normal',
  })
  void loadFont({
    family: 'Silkscreen',
    url: staticFile('fonts/Silkscreen-Regular.ttf'),
    weight: '400',
    style: 'normal',
  })
  void loadFont({
    family: 'Silkscreen',
    url: staticFile('fonts/Silkscreen-Bold.ttf'),
    weight: '700',
    style: 'normal',
  })
}
