import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svg = readFileSync(join(root, 'public/icon.svg'))

const sizes = [192, 512]

await Promise.all(
  sizes.map(async (size) => {
    const out = join(root, 'public', `icon-${size}.png`)
    await sharp(svg).resize(size, size).png().toFile(out)
    console.log(`wrote ${out}`)
  }),
)
