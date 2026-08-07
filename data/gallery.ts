import manifest from './image-manifest.json'

export interface GalleryPhoto {
  src: string
  width: number
  height: number
  alt: string
}

/**
 * The gallery is built from the image manifest rather than a hand-written list,
 * so dropping new photos into legacy/assets/img/gallery/ and running
 * `npm run images` is enough to publish them.
 *
 * Per-photo captions were never recorded on the old site; until they are, every
 * photo gets the same descriptive alt text. See README "Content still needed".
 */
const GENERIC_ALT = 'Performance photograph from a Roopa Arts Cultural Center production'

export const galleryPhotos: GalleryPhoto[] = manifest
  .filter((img) => img.src.startsWith('/images/gallery/'))
  .map((img) => ({
    src: img.src,
    width: img.width,
    height: img.height,
    alt: GENERIC_ALT,
  }))

/** Stage photographs used for the homepage hero slideshow. */
export const heroSlides = [
  { src: '/images/home/home-3.webp', alt: 'Dancers in a seated formation, arms raised, under warm stage light' },
  { src: '/images/home/home-2.webp', alt: 'Ensemble performing on stage in traditional costume' },
  { src: '/images/home/home-5.webp', alt: 'A moment from a Roopa Arts Cultural Center performance' },
  { src: '/images/home/home-4.webp', alt: 'Dancers in a group formation on stage' },
  { src: '/images/home/home-7.webp', alt: 'Performers on stage during a classical production' },
]

/** Look a photo up in the manifest so its real intrinsic size is used. */
function photo(src: string, alt = GENERIC_ALT): GalleryPhoto {
  const found = manifest.find((img) => img.src === src)
  if (!found) throw new Error(`Image not in manifest: ${src} — run \`npm run images\``)
  return { src, width: found.width, height: found.height, alt }
}

/** A short strip of photos for the homepage preview. */
export const homeStrip: GalleryPhoto[] = [
  '/images/home/home-6.webp',
  '/images/gallery/racc-gallery1.webp',
  '/images/gallery/racc-gallery2.webp',
  '/images/gallery/hg-30.webp',
  '/images/gallery/hg-42.webp',
].map((src) => photo(src))

export { photo }
