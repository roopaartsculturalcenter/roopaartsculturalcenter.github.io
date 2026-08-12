/**
 * One-time image pipeline.
 *
 * Reads the original photography and flyers from legacy/assets/img (untouched,
 * still tracked in git) and writes web-ready WebP into public/images.
 *
 * The originals total ~85 MB, which is far too heavy to ship. Each folder gets a
 * max edge suited to how it is displayed: banners run full-bleed behind the hero,
 * flyers are read at card width, headshots are small circles.
 *
 *   npm run images
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, 'legacy/assets/img')
const OUT = join(root, 'public/images')

// maxEdge is the longest side in CSS pixels at 2x, quality is the WebP quality.
const RULES = {
  banners: { maxEdge: 2400, quality: 72 },
  home: { maxEdge: 1600, quality: 74 },
  gallery: { maxEdge: 1600, quality: 74 },
  events: { maxEdge: 1400, quality: 78 },
  // Artist announcement cards: square, and the artist's name and role are set on
  // the card itself, so this is text as much as photography. Same treatment as
  // events, which is where the rest of the Arudra collateral lives.
  'arudra-2026': { maxEdge: 1400, quality: 78 },
  // Same treatment for the 2025 spotlight cards. Note public/images/artists holds
  // six of these same cards at maxEdge 800, because there they are small cards on
  // /arudra; the gallery lightbox opens them at up to 72vw, so it needs the full
  // size. Two rules, two uses, deliberately.
  'arudra-festival-2025': { maxEdge: 1400, quality: 78 },
  'arudra-2024': { maxEdge: 1400, quality: 78 },
  'arudra-festival-2024': { maxEdge: 1400, quality: 78 },
  artists: { maxEdge: 800, quality: 80 },
  about: { maxEdge: 1400, quality: 78 },
  misc: { maxEdge: 1600, quality: 78 },
  logo: { maxEdge: 600, quality: 90 },
}
const DEFAULT_RULE = { maxEdge: 1600, quality: 76 }

// Animated GIFs would have to be re-encoded frame by frame; they are decorative
// duplicates of the banner stills, so they are simply left out of the build.
const SKIP = new Set(['.gif'])

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const manifest = []
let before = 0
let after = 0
let skipped = 0

const files = (await walk(SRC)).sort()

for (const file of files) {
  const rel = relative(SRC, file)
  const ext = extname(file).toLowerCase()
  if (SKIP.has(ext)) {
    skipped++
    continue
  }

  const folder = rel.split('/')[0]
  const rule = RULES[folder] ?? DEFAULT_RULE
  const dest = join(OUT, rel.replace(/\.[^.]+$/, '.webp'))
  await mkdir(dirname(dest), { recursive: true })

  const input = sharp(file, { failOn: 'none' })
  const meta = await input.metadata()

  // The logo needs its transparency; photographs are flattened for a smaller file.
  const keepAlpha = folder === 'logo' || folder === 'misc'

  await input
    .rotate() // honour EXIF orientation before resizing
    .resize({
      width: rule.maxEdge,
      height: rule.maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: rule.quality, effort: 6, alphaQuality: keepAlpha ? 90 : 100 })
    .toFile(dest)

  const [srcStat, destStat] = await Promise.all([stat(file), stat(dest)])
  before += srcStat.size
  after += destStat.size

  const resized = await sharp(dest).metadata()
  manifest.push({
    src: `/images/${rel.replace(/\.[^.]+$/, '.webp')}`,
    width: resized.width,
    height: resized.height,
    original: `legacy/assets/img/${rel}`,
    originalWidth: meta.width,
    originalHeight: meta.height,
  })
}

await writeFile(
  join(root, 'data/image-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
)

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`
console.log(
  `${manifest.length} images  ${mb(before)} -> ${mb(after)} ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller, ${skipped} skipped)`,
)
