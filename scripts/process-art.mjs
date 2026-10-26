import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const source = path.resolve('art-source/inbox')
const output = path.resolve('public/art/characters')

const portraits = [
  ['the-unnamed-portrait.png.jpg', 'the-unnamed.webp'],
  ['fox-portrait.png.jpg', 'fox.webp'],
  ['moth-portrait.png.jpg', 'moth.webp'],
  ['rook-portrait.png.jpg', 'rook.webp'],
]

await mkdir(output, { recursive: true })

for (const [inputName, outputName] of portraits) {
  await sharp(path.join(source, inputName))
    .rotate()
    .resize(900, 1125, { fit: 'cover', position: 'centre' })
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toFile(path.join(output, outputName))
}

await sharp(path.join(source, 'veil-vault-cast-sheet.png.jpg'))
  .rotate()
  .resize(1600, 900, { fit: 'cover', position: 'centre' })
  .webp({ quality: 86, effort: 6, smartSubsample: true })
  .toFile(path.join(output, 'cast-sheet.webp'))

console.log(`Processed ${portraits.length + 1} local art assets in ${output}`)
