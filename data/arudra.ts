/**
 * Arudra 2026 — the festival section and its "View All" gallery page.
 * Programme and venue details come from the existing site's production page.
 */
export const arudra2026 = {
  title: 'Arudra 2026',
  date: 'Sunday, February 8, 2026 · 1 PM CST',
  isoDate: '2026-02-08',
  venue: 'Jewish Community Center of Houston',
  intro:
    'Our flagship annual celebration of South Indian classical arts, held each year around the ' +
    'Thiruvadhirai (Arudra Darshanam) season — bringing dancers, musicians, and the community ' +
    'together on one stage.',

  programme: [
    { title: 'Trilokya Nada', note: 'Invocation by Musicians of Houston' },
    { title: 'Veena-Violin Duet', note: null },
    { title: 'Navagrahamum Navakailasamum', note: 'Featured dance production' },
    { title: 'Thiruvadhirai Threads', note: null },
  ],

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

/** Named performers who have appeared on the RACC stage. */
export const featuredArtists = [
  { name: 'Jin Won', src: '/images/artists/jin-won.webp' },
  { name: 'Ritvik Yaparpalvi', src: '/images/artists/ritvik-yaparpalvi.webp' },
  { name: 'Sachita Chaliki', src: '/images/artists/sachita-chaliki.webp' },
  { name: 'Saliya Ilankoon', src: '/images/artists/saliya-ilankoon.webp' },
  { name: 'Sindhu Sathees', src: '/images/artists/sindhu-sathees.webp' },
  { name: 'Souryadeep Bhattacharyya', src: '/images/artists/souryadeep-bhattacharyya.webp' },
]
