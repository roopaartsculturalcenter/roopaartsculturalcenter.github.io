/**
 * THE SINGLE SOURCE OF TRUTH FOR EVENTS.
 *
 * Every event surface on the site — the homepage featured scene, /events,
 * /events/[slug], and the Arudra listings — renders from this array. There is no
 * second list anywhere.
 *
 * `status` is never written by hand. It is derived from `date` against today:
 * anything in the past becomes 'past' automatically and moves itself into the
 * Past section. Adding a future-dated event here is all it takes to make it the
 * featured event on the homepage.
 *
 * To add an event: drop the flyer into public/images/events/, copy a block
 * below, give it a unique `slug`. That is the whole job.
 */

export interface RaccEventSource {
  title: string
  slug: string
  /** ISO date. `null` only for recurring/undated series — those sort last. */
  date: string | null
  artists: string[]
  description: string
  venue: string | null
  flyerImage: string
  rsvpUrl?: string
  /**
   * Forces this event to show as upcoming regardless of its date, and to be the
   * homepage's featured event.
   *
   * Set on Navtar by explicit request. Note the card still displays its real
   * date (July 12, 2025) — the flag overrides placement, not the truth. Remove
   * it once a genuinely future-dated event exists and everything reverts to
   * automatic behaviour.
   */
  pinned?: boolean
}

export interface RaccEvent extends RaccEventSource {
  status: 'upcoming' | 'past'
}

const source: RaccEventSource[] = [
  {
    title: 'Navtar Violin Jugalbandi',
    slug: 'navtar-violin-jugalbandi',
    date: '2025-07-12',
    artists: ['Vishnu Navtar', 'Achi Bala — violin', 'Karun Salvady — mridangam'],
    description:
      'Compositions presented on the navtar, violin, and mridangam — three voices ' +
      'trading phrases across a single evening.',
    venue: null,
    flyerImage: '/images/events/navtar-violin-jugalbandi.webp',
    rsvpUrl: 'https://evite.me/NVtRUQfHnt',
    pinned: true,
  },
  {
    title: 'Arudra 2026',
    slug: 'arudra-2026',
    date: '2026-02-08',
    artists: [
      'Mithra Arun — dancer',
      'Rohitha Kaimal — dancer',
      'Varsha Vasu — dancer',
      'Achi Bala — violin, vocals & narration',
      'Roopa Bala — narration',
      'Shashank Iswara — solkattu & nattuvangam',
      'Vaishnavi Narasimhan — vocals',
      'Dr. Maheetha Bharadwaj — keys & vocals',
      'Jahnavi Murali — cello & vocals',
      'Sai Vignesh — vocals',
      'Visveshwar Nagarajan — flute',
      'Naga Srinidhi Kuruvada — mridangam',
    ],
    description:
      'Our signature festival: an invocation by Musicians of Houston, a veena-violin ' +
      'duet, the featured production Navagrahamum Navakailasamum, and Thiruvadhirai ' +
      'Threads — one afternoon, four experiences.',
    venue: 'Jewish Community Center of Houston',
    flyerImage: '/images/events/all-program-flyer.webp',
  },
  {
    title: 'Guruguha Vaibhavam',
    slug: 'guruguha-vaibhavam-2025',
    date: '2025-12-01',
    artists: [],
    description: 'A December concert in the Margazhi season.',
    venue: null,
    flyerImage: '/images/events/racc-guruguha-vaibhavam-2025-15-1.webp',
  },
  {
    title: 'Bollywood Night ft. Arjun Adapalli',
    slug: 'bollywood-night',
    date: '2025-05-30',
    artists: ['Arjun Adapalli'],
    description: 'An evening away from the classical repertoire, with playback singer Arjun Adapalli.',
    venue: null,
    flyerImage: '/images/events/bollywood-night-ft-arjun-adapalli.webp',
  },
  {
    title: 'The Baroque – Carnatic Connection',
    slug: 'baroque-carnatic-connection',
    date: '2025-03-16',
    artists: [],
    description:
      'A cross-cultural programme setting the European baroque repertoire against Carnatic form.',
    venue: 'Dallas',
    flyerImage: '/images/events/the-baroque-carnatic-connection.webp',
  },
  {
    title: 'Arudra Festival 2025',
    slug: 'arudra-festival-2025',
    date: '2025-03-01',
    artists: [],
    description: 'The 2025 edition of our signature festival — an evening of music and dance.',
    venue: 'Jewish Community Center of Houston',
    flyerImage: '/images/events/main-flyerarudra-festival-2025.webp',
  },
  {
    title: 'Sound Workshop',
    slug: 'sound-workshop',
    date: null,
    artists: [],
    description: 'A hands-on session on sound for the stage, run with visiting and local artists.',
    venue: null,
    flyerImage: '/images/events/racc-sound-workshop.webp',
  },
  {
    title: 'Margazhi',
    slug: 'margazhi',
    date: null,
    artists: [],
    description: 'Our December season, marking Margazhi with concerts across Texas.',
    venue: 'Texas',
    flyerImage: '/images/events/margazhi.webp',
  },
]

/** Midnight today, so an event on today's date still counts as upcoming. */
function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function deriveStatus(e: RaccEventSource): 'upcoming' | 'past' {
  if (e.pinned) return 'upcoming'
  if (!e.date) return 'past'
  return new Date(e.date) >= startOfToday() ? 'upcoming' : 'past'
}

export const events: RaccEvent[] = source.map((e) => ({ ...e, status: deriveStatus(e) }))

/** Soonest first — that is the order an audience reads a "what's next" list in. */
export const upcomingEvents = events
  .filter((e) => e.status === 'upcoming')
  .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'))

/** Most recent first, undated series last. */
export const pastEvents = events
  .filter((e) => e.status === 'past')
  .sort((a, b) => (b.date ?? '0000').localeCompare(a.date ?? '0000'))

/** Drives the homepage featured scene. A pinned event always wins. */
export const featuredEvent: RaccEvent | undefined =
  upcomingEvents.find((e) => e.pinned) ?? upcomingEvents[0] ?? pastEvents[0]

export const getEvent = (slug: string) => events.find((e) => e.slug === slug)

/** Everything under the Arudra banner, for /arudra. */
export const arudraEvents = events.filter((e) => e.slug.includes('arudra'))

/** Human-readable date. Undated series render their own label instead. */
export function formatEventDate(date: string | null): string | null {
  if (!date) return null
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
