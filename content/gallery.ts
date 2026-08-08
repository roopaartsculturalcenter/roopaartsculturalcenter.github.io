import manifest from '~/data/image-manifest.json'

/**
 * Gallery images, grouped by event.
 *
 * A note on what is honestly known: the ~63 performance photographs in the
 * archive carry no attribution — filenames are `hg-*`, `racc-gallery*`,
 * `img-*`, and nothing in the repository records which event any of them came
 * from. So they sit in one "Company archive" group rather than being assigned to
 * events on a guess.
 *
 * The Arudra 2026 group is different: those flyers and artist cards name their
 * own event, so they are grouped with confidence.
 *
 * To split the archive later, move filenames out of `archive` into a new group.
 * No component changes are needed — /gallery builds its filter from this array.
 */

export interface GalleryImage {
  src: string
  width: number
  height: number
  alt: string
}

export interface GalleryGroup {
  eventName: string
  /** ISO date, or null where the group spans several years. */
  date: string | null
  images: GalleryImage[]
}

function pick(src: string, alt: string): GalleryImage {
  const found = manifest.find((i) => i.src === src)
  if (!found) throw new Error(`Image not in manifest: ${src} — run \`npm run images\``)
  return { src, width: found.width, height: found.height, alt }
}

/** Everything under /images/gallery — the unattributed performance archive. */
const archive: GalleryImage[] = manifest
  .filter((i) => i.src.startsWith('/images/gallery/'))
  .map((i) => ({
    src: i.src,
    width: i.width,
    height: i.height,
    alt: 'Performance photograph from a Roopa Arts Cultural Center production',
  }))

const ARUDRA_2026_FLYERS: [string, string][] = [
  ['/images/events/all-program-flyer.webp', 'Arudra 2026 full programme flyer'],
  ['/images/events/save-date-arudhra-2026-3.webp', 'Arudra 2026 save the date'],
  ['/images/events/invocation-flyer.webp', 'Trilokya Nada invocation flyer'],
  ['/images/events/arudra-2026-flyers-38.webp', 'Navagrahamum Navakailasamum flyer'],
  ['/images/events/arudra-2026-flyers-39.webp', 'Arudra 2026 festival flyer'],
  ['/images/events/arudra-2026-flyers-42.webp', 'Arudra 2026 festival flyer'],
  ['/images/events/arudra-2026-flyers.webp', 'Arudra 2026 festival banner'],
  ['/images/events/arudhara-2026.webp', 'Arudra 2026 banner'],
  ['/images/events/racc-save-date.webp', 'Roopa Arts Cultural Center save the date'],
]

/** The twelve artist announcement cards, in the order they were released. */
const ARUDRA_2026_ARTISTS: [string, string][] = [
  ['/images/events/arudra-2026-artist-25.webp', 'Mithra Arun, dancer — Arudra 2026'],
  ['/images/events/arudra-2026-artist-26.webp', 'Rohitha Kaimal, dancer — Arudra 2026'],
  ['/images/events/arudra-2026-artist-27.webp', 'Varsha Vasu, dancer — Arudra 2026'],
  ['/images/events/arudra-2026-artist-30.webp', 'Sai Vignesh, vocals — Arudra 2026'],
  ['/images/events/arudra-2026-artist-31.webp', 'Vaishnavi Narasimhan, vocals — Arudra 2026'],
  ['/images/events/arudra-2026-artist-32.webp', 'Dr. Maheetha Bharadwaj, keys and vocals — Arudra 2026'],
  ['/images/events/arudra-2026-artist-33.webp', 'Shashank Iswara, solkattu and nattuvangam — Arudra 2026'],
  ['/images/events/arudra-2026-artist-34.webp', 'Naga Srinidhi Kuruvada, mridangam — Arudra 2026'],
  ['/images/events/arudra-2026-artist-35.webp', 'Visveshwar Nagarajan, flute — Arudra 2026'],
  ['/images/events/arudra-2026-artist-36.webp', 'Jahnavi Murali, cello and vocals — Arudra 2026'],
  ['/images/events/arudra-2026-artist-37.webp', 'Achi Bala, violin, vocals and narration — Arudra 2026'],
  ['/images/events/arudra-2026-artist-38.webp', 'Roopa Bala, narration — Arudra 2026'],
]

export const galleryGroups: GalleryGroup[] = [
  {
    eventName: 'Arudra 2026',
    date: '2026-02-08',
    images: [...ARUDRA_2026_FLYERS, ...ARUDRA_2026_ARTISTS].map(([src, alt]) => pick(src, alt)),
  },
  {
    eventName: 'Company archive',
    date: null,
    images: archive,
  },
]

/** Flat list, for the lightbox's index arithmetic when "All" is selected. */
export const allGalleryImages: GalleryImage[] = galleryGroups.flatMap((g) => g.images)

/** The eight-image strip on the homepage Arudra teaser. */
export const arudraTeaserImages: GalleryImage[] =
  galleryGroups[0].images.slice(0, 8)

/**
 * Look a single image up by path. Used by the homepage photo wall, which names
 * its frames explicitly rather than taking whatever the archive happens to hold.
 */
export function photo(src: string, alt = 'Performance photograph from a Roopa Arts Cultural Center production'): GalleryImage {
  return pick(src, alt)
}

/** Alias kept so gallery components can speak in one type name. */
export type GalleryPhoto = GalleryImage
