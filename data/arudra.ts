import programme from '~/data/arudra-2026-programme.json'

/**
 * Arudra, split two ways.
 *
 * `arudraFestival` is what every edition has in common and is what /arudra shows.
 * Everything named `arudra2026` belongs to that one edition and renders on
 * /events/arudra-2026 instead. Keeping them apart is the point: the general page
 * had filled up with a single year's cast and scene list, so a visitor looking for
 * "what is Arudra" got the 2026 programme notes.
 */
export const arudraFestival = {
  intro:
    'Our flagship annual celebration of South Indian classical arts, held each year around the ' +
    'Thiruvadhirai (Arudra Darshanam) season, bringing dancers, musicians, and the community ' +
    'together on one stage.',

  /**
   * The four-part shape every edition follows, in running order. Generic on
   * purpose — the titles are the festival's structure, not one year's line-up.
   */
  playbill: [
    { title: 'Trilokya Nada', note: 'The invocation' },
    { title: 'Feature Programme: Jugalbandhi', note: 'Two instruments in dialogue' },
    { title: 'Feature Programme: Dance Drama', note: 'The season\'s premiere production' },
    { title: 'Thiruvadhirai Threads', note: 'The closing sequence' },
  ],
}

/** Arudra 2026 — this edition only. Rendered on its event page. */
export const arudra2026 = {
  title: 'Arudra 2026',
  date: 'Sunday, February 8, 2026 · 1 PM CST',
  isoDate: '2026-02-08',
  venue: 'Jewish Community Center of Houston',

  featured: {
    title: 'Navagrahamum Navakailasamum',
    body:
      'The featured production of Arudra 2026 journeys through the nine celestial Navagrahas and the ' +
      'nine sacred Kailasam temples, told through classical dance with an originally recorded score.',
  },

  /** Flyers and announcements — the marquee strip and the masonry gallery. */
  flyers: [
    { src: '/images/events/all-program-flyer.webp', w: 1080, h: 1080, alt: 'Arudra 2026 full programme flyer' },
    { src: '/images/events/save-date-arudhra-2026-3.webp', w: 1400, h: 1400, alt: 'Arudra 2026 save the date' },
    { src: '/images/events/invocation-flyer.webp', w: 1080, h: 1080, alt: 'Trilokya Nada invocation flyer' },
    { src: '/images/events/arudra-2026-flyers-38.webp', w: 1080, h: 1080, alt: 'Navagrahamum Navakailasamum flyer' },
    { src: '/images/events/arudra-2026-flyers-39.webp', w: 1080, h: 1080, alt: 'Arudra 2026 festival flyer' },
    { src: '/images/events/arudra-2026-flyers-42.webp', w: 1080, h: 1080, alt: 'Arudra 2026 festival flyer' },
    { src: '/images/events/arudra-2026-flyers.webp', w: 1400, h: 788, alt: 'Arudra 2026 festival banner' },
    { src: '/images/events/arudhara-2026.webp', w: 1400, h: 486, alt: 'Arudra 2026 banner' },
    { src: '/images/events/racc-save-date.webp', w: 1080, h: 1350, alt: 'Roopa Arts Cultural Center save the date' },
  ],

  /** Artist announcement cards for the featured production. */
  artistCards: [
    25, 26, 27, 30, 31, 32, 33, 34, 35, 36, 37, 38,
  ].map((n) => ({
    src: `/images/events/arudra-2026-artist-${n}.webp`,
    w: 1080,
    h: 1080,
    alt: `Navagrahamum Navakailasamum artist announcement ${n}`,
  })),
}

/**
 * Credits for Navagrahamum Navakailasamum, transcribed from the organisation's own
 * published page for the production:
 * https://roopaartsculturalcenter.org/arudra-2026/
 *
 * That page is the authority, so this is its wording, its role labels and its
 * ORDER — concept, then direction, then cast, then the music team by instrument,
 * then production. The site previously carried a flat twelve-name list read off
 * the artist announcement cards, which was both incomplete (eleven cast members
 * were missing entirely) and out of order, and had two names wrong: "Rohitha
 * Kaimal" is Rohita Kaimal, and "Sai Vignesh" is Saivignesh Ramakrishnan.
 *
 * A credit block is a contract with the people in it. Do not reorder it to suit a
 * layout, and do not add a name that is not on that page.
 */
export interface CreditGroup {
  role: string
  names: string[]
}

export const arudra2026Credits: CreditGroup[] = [
  { role: 'Concept and music composition', names: ['Achi Bala'] },
  {
    role: 'Dance direction, screenplay and choreography',
    names: ['Shashank Iswara'],
  },
  {
    role: 'Cast',
    names: [
      'Shashank Iswara',
      'Srinidhi Subash',
      'Aditya Subramaniam',
      'Maanya Varma',
      'Akhila Rajesh',
      'Mithra Arun',
      'Rohita Kaimal',
      'Varsha Vasu',
      'Soundarya Dalipatti',
      'Milind Soman',
      'Aditya Iswara',
    ],
  },
  {
    role: 'Vocal',
    names: [
      'Saivignesh Ramakrishnan',
      'Vaishnavi Narasimhan',
      'Jahnavi Murali',
      'Achi Bala',
    ],
  },
  { role: 'Nattuvangam', names: ['Shashank Iswara'] },
  { role: 'Solkattu', names: ['Shashank Iswara', 'Rohita Kaimal'] },
  { role: 'Cello', names: ['Jahnavi Murali'] },
  { role: 'Violin', names: ['Achi Bala'] },
  { role: 'Keys', names: ['Dr. Maheetha Bharadwaj'] },
  { role: 'Mridangam', names: ['Naga Srinidhi Kuruvada', 'Aditya Iswara'] },
  { role: 'Flute', names: ['Visveshwar Nagarajan'] },
  {
    role: 'Lyrics',
    names: ['Achi Bala', 'Dr. Maheetha Bharadwaj', 'Srinivas Prabhala'],
  },
  {
    role: 'Recorded, mixed and mastered by',
    names: ['Kathivaran Natarajan, Aura Studios'],
  },
  { role: 'Recorded at', names: ['R Srinivasan Hall'] },
]

/**
 * The full programme book for Navagrahamum Navakailasamum.
 *
 * Transcribed from the organisation's own published page,
 * https://roopaartsculturalcenter.org/arudra-2026/ — narrative, transliterated
 * verses, translations and raga attributions, in document order.
 *
 * It lives in JSON rather than TypeScript because it is 195 blocks of transcribed
 * devotional text in Sanskrit, Tamil and English transliteration. Hand-retyping
 * that into source would invite exactly the kind of silent corruption a credit
 * block must never have, and JSON needs no escaping decisions.
 *
 * `verse` blocks are the ones the source marks with `div.tiro-devanagari`; `raga`
 * blocks are its "Set to Raga …" labels; everything else is prose, which on that
 * page covers both narration and the English translations that follow a verse.
 */
export type ProgrammeBlock =
  | { kind: 'prose'; text: string }
  | { kind: 'raga'; text: string }
  | { kind: 'verse'; lines: string[] }
  /**
   * A run of short narration lines that the source stored as separate paragraphs
   * but which read as one poetic passage. Kept as one block so it renders with line
   * breaks instead of sixteen paragraph gaps — Scene 1's opening was 16 one-line
   * paragraphs, which on the page was a column of text adrift in whitespace.
   */
  | { kind: 'stanza'; lines: string[] }

export interface ProgrammeScene {
  n: number
  title: string
  /** One line, shown while the scene is collapsed. */
  summary: string
  blocks: ProgrammeBlock[]
}

export interface ArudraProgramme {
  /** The welcome that opens the printed programme. */
  invitation: string
  scenes: ProgrammeScene[]
}

export const arudra2026Programme = programme as ArudraProgramme

/** Named performers who have appeared on the RACC stage. */
export const featuredArtists = [
  { name: 'Jin Won', src: '/images/artists/jin-won.webp' },
  { name: 'Ritvik Yaparpalvi', src: '/images/artists/ritvik-yaparpalvi.webp' },
  { name: 'Sachita Chaliki', src: '/images/artists/sachita-chaliki.webp' },
  { name: 'Saliya Ilankoon', src: '/images/artists/saliya-ilankoon.webp' },
  { name: 'Sindhu Sathees', src: '/images/artists/sindhu-sathees.webp' },
  { name: 'Souryadeep Bhattacharyya', src: '/images/artists/souryadeep-bhattacharyya.webp' },
]
