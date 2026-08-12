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

/**
 * Frames held back from the gallery.
 *
 * Nothing is deleted — every file stays in the archive and in the manifest. This
 * is a curation list, so putting a name back is a one-line change.
 *
 * The gallery is meant to be the work on stage. These are not that: they are the
 * lobby, the paperwork and the misfires around it. Grouped by why.
 */
const HELD_BACK = new Set<string>([
  // Posed against the branded step-and-repeat, or in a lobby. Not performances.
  'hg-3', 'hg-4', 'hg-5', 'hg-6', 'hg', 'hg-7', 'hg-8', 'hg-9',
  'racc-gallery1', 'racc-gallery2',

  // Award presentations and posed line-ups in front of the event screen.
  'hg-28', 'hg-29', 'hg-30', 'hg-31', 'hg-46', 'hg-47', 'hg-48',

  // No performers in frame: a doorway, an empty hall, a standee, an idol on a table.
  'gallery3', 'gallery4', 'hg-32', 'img-9549-1',

  // Weak frames: subjects lost behind stage monitors, or so wide they read as an
  // empty stage. `hg-91` and `hg-92` measure mean luminance 15-16 of 255 — about
  // half the next-darkest frame kept — with the performers in a thin band, so in a
  // thumbnail grid they read as black rectangles.
  'hg-37', 'hg-43', 'hg-38', 'hg-40', 'hg-93', 'hg-91', 'hg-92',

  // Duplicate of hg-242 — identical perceptual hash, so the wall showed the same
  // frame twice. It was the only duplicate pair in the 63.
  'hg-242-1',
])

const fileName = (src: string) => src.split('/').pop()!.replace('.webp', '')

/**
 * The performance archive: everything under /images/gallery that earns a wall.
 *
 * Deliberately photographs only. Event posters, save-the-dates and artist
 * announcement cards used to sit in here too, which made the gallery half
 * marketing collateral — they belong on /events and /arudra, and that is where
 * they now live. The flyer lists below are kept for the homepage Arudra fan.
 */
const archive: GalleryImage[] = manifest
  .filter((i) => i.src.startsWith('/images/gallery/') && !HELD_BACK.has(fileName(i.src)))
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
  ['/images/events/arudra-2026-artist-25.webp', 'Mithra Arun, dancer (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-26.webp', 'Rohita Kaimal, dancer (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-27.webp', 'Varsha Vasu, dancer (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-30.webp', 'Saivignesh Ramakrishnan, vocal (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-31.webp', 'Vaishnavi Narasimhan, vocals (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-32.webp', 'Dr. Maheetha Bharadwaj, keys and vocals (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-33.webp', 'Shashank Iswara, solkattu and nattuvangam (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-34.webp', 'Naga Srinidhi Kuruvada, mridangam (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-35.webp', 'Visveshwar Nagarajan, flute (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-36.webp', 'Jahnavi Murali, cello and vocals (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-37.webp', 'Achi Bala, violin, vocals and narration (Arudra 2026)'],
  ['/images/events/arudra-2026-artist-38.webp', 'Roopa Bala, narration (Arudra 2026)'],
]

export const galleryGroups: GalleryGroup[] = [
  {
    eventName: 'Company archive',
    date: null,
    images: archive,
  },
]

/** Flat list, and the order the lightbox counts through. */
export const allGalleryImages: GalleryImage[] = galleryGroups.flatMap((g) => g.images)

/**
 * The Arudra posters, for the homepage fan.
 *
 * Sourced from the flyer list directly, not from `galleryGroups[0]` as before —
 * that coupling meant the gallery's first group had to be the Arudra flyers, which
 * is exactly the arrangement that put marketing collateral on the photo wall.
 */
export const arudraTeaserImages: GalleryImage[] =
  ARUDRA_2026_FLYERS.map(([src, alt]) => pick(src, alt))

/**
 * Arudra 2025's banners and flyer.
 *
 * These were sitting unused in the archive while /arudra showed 2026 only, which
 * is part of why the festival page looked like it had no history.
 */
const ARUDRA_2025: [string, string][] = [
  ['/images/events/main-flyerarudra-festival-2025.webp', 'Arudra Festival 2025 programme flyer'],
  ['/images/events/arudra-2025.webp', 'Arudra Festival 2025 announcement'],
  ['/images/events/arudra-2025-mobile-view-banner.webp', 'Arudra Festival 2025 banner'],
  ['/images/banners/arudra-2025-banner.webp', 'Arudra Festival 2025 stage banner'],
  ['/images/banners/arudra-2025-banner01.webp', 'Arudra Festival 2025 stage banner'],
  ['/images/banners/arudra-2025-banner02.webp', 'Arudra Festival 2025 stage banner'],
]

/** Additional 2026 collateral not in the original flyer set. */
const ARUDRA_2026_EXTRA: [string, string][] = [
  ['/images/events/arudra-2026-flyers-24.webp', 'Arudra 2026 festival flyer'],
  ['/images/events/save-the-date.webp', 'Arudra 2026 save the date'],
]

/** Everything Arudra: posters, banners and artist cards, newest edition first. */
export const arudraCollateral: GalleryImage[] = [
  ...ARUDRA_2026_FLYERS,
  ...ARUDRA_2026_EXTRA,
  ...ARUDRA_2026_ARTISTS,
  ...ARUDRA_2025,
].map(([src, alt]) => pick(src, alt))

/**
 * The rest of the Arudra 2026 announcement cards: the Veena-Violin Duet trio and
 * the dance company.
 *
 * These name their own subject, so the alt text names the artist and the
 * instrument or role rather than saying "performance photograph". They are cards,
 * not photographs of the evening: each is a green mandala panel with the artist
 * cut out over it, the programme title, and the date and venue along the foot.
 *
 * One spelling to reconcile: this card reads SOUNDARYA DALIPARTHY, while the
 * credit block in content/events.ts has "Soundarya Dalipatti", taken from the
 * organisation's own published page. The alt below describes the card, so it
 * follows the card. Someone who knows should settle which is right.
 */
const ARUDRA_2026_CAST: [string, string][] = [
  ['/images/arudra-2026/arudra-01.webp', 'Hrishikesh Chary, veena, Veena-Violin Duet (Arudra 2026)'],
  ['/images/arudra-2026/arudra-02.webp', 'Samarth Rao, kanjira, Veena-Violin Duet (Arudra 2026)'],
  ['/images/arudra-2026/arudra-03.webp', 'Krish Mohan, mridangam, Veena-Violin Duet (Arudra 2026)'],
  ['/images/arudra-2026/arudra-04.webp', 'Shashank Iswara, dance director and choreographer (Arudra 2026)'],
  ['/images/arudra-2026/arudra-05.webp', 'Soundarya Daliparthy, dancer (Arudra 2026)'],
  ['/images/arudra-2026/arudra-06.webp', 'Aditya Subramaniam, dancer (Arudra 2026)'],
  ['/images/arudra-2026/arudra-07.webp', 'Maanya Varma, dancer (Arudra 2026)'],
  ['/images/arudra-2026/arudra-08.webp', 'Aditya Iswara, dancer (Arudra 2026)'],
  ['/images/arudra-2026/arudra-09.webp', 'Srinidhi Subash, dancer (Arudra 2026)'],
  ['/images/arudra-2026/arudra-10.webp', 'Akhila Rajesh, dancer (Arudra 2026)'],
  ['/images/arudra-2026/arudra-11.webp', 'Milind Soman, dancer (Arudra 2026)'],
]

/** The programme flyers, minus the one the event page already shows up top. */
const ARUDRA_2026_PROGRAMME_FLYERS: [string, string][] = [
  ['/images/events/arudra-2026-flyers-38.webp', 'Navagrahamum Navakailasamum flyer (Arudra 2026)'],
  ['/images/events/arudra-2026-flyers-39.webp', 'Arudra 2026 festival flyer'],
  ['/images/events/arudra-2026-flyers-42.webp', 'Arudra 2026 festival flyer'],
]

/**
 * Arudra Festival 2025's artist spotlight cards: maroon panels carrying the artist,
 * the discipline, and the March 1st date and venue.
 *
 * Six of these people also appear in `arudra2025Artists` (data/arudra.ts) from
 * public/images/artists, which is the same artwork at maxEdge 800 for the small
 * cards on /arudra. These are the 1080px originals, for the lightbox. See the
 * `arudra-festival-2025` rule in scripts/optimize-images.mjs.
 *
 * Numbering follows the source folder's alphabetical order so a file can be traced
 * back to what was delivered.
 */
const ARUDRA_2025_SPOTLIGHTS: [string, string][] = [
  ['/images/arudra-festival-2025/arudra-2025-01.webp', 'Achi Bala, violin (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-02.webp', 'Sindhu Sathees, Mohiniattam (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-03.webp', 'Naga Srinidhi Kuruvada, mridangam (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-04.webp', 'Ritvik Yaparpalvi, tabla (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-05.webp', 'Saliya Ilankoon, dancer (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-06.webp', 'Jin Won, Kathak (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-07.webp', 'Sachita Chaliki, Kuchipudi (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-08.webp', 'Souryadeep Bhattacharyya, sarod (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-09.webp', 'Shashank Iswara, Bharatanatyam (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-10.webp', 'Dr. Rathna Kumar, choreographer (Arudra Festival 2025)'],
  ['/images/arudra-festival-2025/arudra-2025-11.webp', 'Thiruvathirai Threads, a walk through tradition and elegance (Arudra Festival 2025)'],
]

/**
 * Arudra Festival 2024's artist introduction cards: pale blue panels carrying the
 * artist, the instrument or discipline, and which of the evening's five programmes
 * they appear in (Akasa, Ananda, Nritya Seva, Shiva Sagara, Trilokya Nada).
 *
 * Names and roles are read off the cards, not off the filenames. Nine of the
 * twenty arrived under generic names ("RACC provides a platform for...") so the
 * filename identifies nothing; the remaining eleven do name their artist, and
 * every one of those matched the card, which is what makes the other nine
 * trustworthy. One correction: file 16 is delivered as "Ajai Gopi" and the card
 * reads AJAY GOPI, so the card wins.
 *
 * The poster in the source folder is left out: it is this event's `flyerImage`,
 * already at the top of the page.
 */
const ARUDRA_2024_SPOTLIGHTS: [string, string][] = [
  ['/images/arudra-festival-2024/arudra-2024-01.webp', 'Dr. Surabi Veeraragavan, nattuvangam, Akasa (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-02.webp', 'Smt Padmini Chari, guru and nattuvangam, Nritya Seva (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-03.webp', 'Abhishek Balakrishnan, violin, Trilokya Nada (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-04.webp', 'Smt. Anuradha Subramanian, Kuchipudi, Nritya Seva (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-05.webp', 'Kamalakiran Vinjamuri, violin, Shiva Sagara (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-06.webp', 'Smt. Ayshwarya Srinivasan, Bharatanatyam, Ananda (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-07.webp', 'Smt. Anitha Dhinesh, Bharatanatyam, Ananda (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-08.webp', 'Vaishnavi Narasimhan, vocal, Akasa (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-09.webp', 'Pranav Praveen, violin, Akasa (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-10.webp', 'Manasa Udthawar, Bharatanatyam, Ananda (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-11.webp', 'Naga Srinidhi Kuruvada, mridangam, Akasa (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-12.webp', 'Ramya S. Kapadia, Bharatanatyam, Akasa (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-13.webp', 'Samyuktha Sreeram, ghatam, Shiva Sagara (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-14.webp', 'Sanvi Kumpatla, Bharatanatyam, Ananda (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-15.webp', 'Advitha Udthawar, Bharatanatyam, Ananda (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-16.webp', 'Ajay Gopi, mridangam, Shiva Sagara (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-17.webp', 'Smt. Kausalya Shankar Nambi, Bharatanatyam, Ananda (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-18.webp', 'Kaviya Ravikumar, Bharatanatyam, Ananda (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-19.webp', 'Kishore Iyer, violin, Ananda (Arudra Festival 2024)'],
  ['/images/arudra-festival-2024/arudra-2024-20.webp', 'Varsha Vasu, vocal, Ananda (Arudra Festival 2024)'],
]

export interface EventGallery {
  heading: string
  rubric: string
  images: GalleryImage[]
}

/**
 * Galleries that belong to a single event, keyed by slug.
 *
 * The event page is one template shared by every event, so it reads this map
 * rather than rendering a gallery unconditionally: an event with no entry here
 * gets no gallery section and is left exactly as it was. The heading and rubric
 * live here too, because the template cannot hold copy for one edition without
 * putting it on every other edition as well.
 *
 * Each event's own `flyerImage` is deliberately absent from its gallery: it is
 * already the first thing on that page, and repeating it a screen further down
 * reads as a bug. That is `all-program-flyer.webp` for 2026 and
 * `main-flyerarudra-festival-2025.webp` for 2025.
 */
export const eventGalleries: Record<string, EventGallery> = {
  'arudra-2026': {
    heading: 'The company, card by card.',
    rubric: 'Select any card to open it larger',
    images: [
      ...ARUDRA_2026_CAST,
      ...ARUDRA_2026_ARTISTS,
      ...ARUDRA_2026_PROGRAMME_FLYERS,
    ].map(([src, alt]) => pick(src, alt)),
  },
  'arudra-festival-2025': {
    heading: 'The 2025 company, card by card.',
    rubric: 'Select any card to open it larger',
    images: ARUDRA_2025_SPOTLIGHTS.map(([src, alt]) => pick(src, alt)),
  },

  'arudra-festival-2024': {
    heading: 'The 2024 company, card by card.',
    rubric: 'Select any card to open it larger',
    images: ARUDRA_2024_SPOTLIGHTS.map(([src, alt]) => pick(src, alt)),
  },
}

/**
 * Look a single image up by path. Used by the homepage photo wall, which names
 * its frames explicitly rather than taking whatever the archive happens to hold.
 */
export function photo(src: string, alt = 'Performance photograph from a Roopa Arts Cultural Center production'): GalleryImage {
  return pick(src, alt)
}

/** Alias kept so gallery components can speak in one type name. */
export type GalleryPhoto = GalleryImage
