/**
 * Writes sitemap.xml into the build output. Runs as `postbuild`, so it covers
 * every build path: Vercel (.vercel/output/static) and GitHub Pages via
 * NITRO_PRESET=github_pages (.output/public).
 *
 * It walks the prerendered HTML rather than the source routes, so the sitemap
 * can never list a page that was not actually generated — and never misses one
 * that was. Redirect stubs (about.html and friends) are not index.html files,
 * so they are excluded by construction.
 */
import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const SITE = 'https://roopaartsculturalcenter.org'
const OUT_DIRS = ['.output/public', '.vercel/output/static'].filter((d) => existsSync(d))

if (OUT_DIRS.length === 0) {
  console.error('generate-sitemap: no build output found; run `npm run build` first')
  process.exit(1)
}

const lastmod = new Date().toISOString().slice(0, 10)

for (const dir of OUT_DIRS) {
  const routes = []
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) {
        // _nuxt, _ipx and friends hold assets, never pages.
        if (!name.startsWith('_')) walk(p)
      } else if (name === 'index.html') {
        const rel = relative(dir, d).split('\\').join('/')
        routes.push(rel === '' ? '/' : `/${rel}/`)
      }
    }
  }
  walk(dir)
  routes.sort()

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.map((r) => `  <url><loc>${SITE}${r}</loc><lastmod>${lastmod}</lastmod></url>`),
    '</urlset>',
    '',
  ].join('\n')

  writeFileSync(join(dir, 'sitemap.xml'), xml)
  console.log(`generate-sitemap: ${routes.length} URLs -> ${join(dir, 'sitemap.xml')}`)
}
