/**
 * THE EVENTS FILE.
 *
 * This is the only file you need to edit to add, remove, or reorder an event.
 * The /events page and the homepage preview both read from it.
 *
 * To add an event:
 *   1. Drop the flyer into legacy/assets/img/events/ and run `npm run images`
 *      (or put an already-web-sized .webp straight into public/images/events/).
 *   2. Copy one of the objects below, change the fields, and give it a new `slug`.
 *   3. Set `status: 'upcoming'` to show it in the Upcoming section.
 *
 * Only `slug`, `title`, `status`, and `image` are required. Anything omitted is
 * simply not rendered — an event with no `date` shows no date line, an event with
 * no `rsvpUrl` shows no button.
 */

export interface RaccEvent {
  slug: string
  title: string
  status: 'upcoming' | 'past'
  /** Path under /public. Portrait flyers and square flyers both work. */
  image: string
  /** Intrinsic size of the flyer, used to reserve layout space (avoids CLS). */
  width: number
  height: number
  alt: string
  /** Human-readable — shown verbatim, so any format is fine. */
  date?: string
  /** ISO date, used only for sorting and for <time datetime>. */
  isoDate?: string
  venue?: string
  description?: string
  rsvpUrl?: string
  rsvpLabel?: string
  /** Optional internal link to a fuller page for this event. */
  to?: string
  featured?: boolean
}

export const events: RaccEvent[] = [
  {
    slug: 'navtar-violin-jugalbandi',
    title: 'Navtar Violin Jugalbandi',
    status: 'upcoming',
    image: '/images/events/navtar-violin-jugalbandi.webp',
    width: 1400,
    height: 1400,
    alt: 'Flyer for the Navtar Violin Jugalbandi presented by Roopa Arts Cultural Center',
    date: 'July 12, 2025',
    isoDate: '2025-07-12',
    description:
      'Compositions presented on the Navtar, violin, and mridangam.',
    rsvpUrl: 'https://evite.me/NVtRUQfHnt',
    rsvpLabel: 'RSVP',
    featured: true,
  },

  // ---- Past ---------------------------------------------------------------
  {
    slug: 'arudra-2026',
    title: 'Arudra 2026',
    status: 'past',
    image: '/images/events/arudhara-2026.webp',
    width: 1400,
    height: 486,
    alt: 'Arudra 2026 festival banner',
    date: 'February 8, 2026',
    isoDate: '2026-02-08',
    venue: 'Jewish Community Center of Houston',
    description:
      'Trilokya Nada, a Veena-Violin duet, Navagrahamum Navakailasamum, and Thiruvadhirai Threads — ' +
      'one afternoon, four experiences.',
    to: '/arudra-2026',
  },
  {
    slug: 'guruguha-vaibhavam-2025',
    title: 'Guruguha Vaibhavam',
    status: 'past',
    image: '/images/events/racc-guruguha-vaibhavam-2025-15-1.webp',
    width: 1400,
    height: 486,
    alt: 'Guruguha Vaibhavam 2025 banner',
    date: 'December 2025',
    isoDate: '2025-12-01',
  },
  {
    slug: 'bollywood-night',
    title: 'Bollywood Night ft. Arjun Adapalli',
    status: 'past',
    image: '/images/events/bollywood-night-ft-arjun-adapalli.webp',
    width: 1400,
    height: 1400,
    alt: 'Flyer for Bollywood Night featuring Arjun Adapalli',
    date: 'May 30, 2025',
    isoDate: '2025-05-30',
  },
  {
    slug: 'baroque-carnatic-connection',
    title: 'The Baroque – Carnatic Connection',
    status: 'past',
    image: '/images/events/the-baroque-carnatic-connection.webp',
    width: 1080,
    height: 1080,
    alt: 'Flyer for The Baroque – Carnatic Connection',
    date: 'March 16, 2025',
    isoDate: '2025-03-16',
    venue: 'Dallas',
  },
  {
    slug: 'arudra-festival-2025',
    title: 'Arudra Festival 2025',
    status: 'past',
    image: '/images/events/main-flyerarudra-festival-2025.webp',
    width: 1080,
    height: 1080,
    alt: 'Arudra Festival 2025 main flyer',
    date: 'March 1, 2025',
    isoDate: '2025-03-01',
    venue: 'Jewish Community Center of Houston',
    description: 'An evening of music and dance.',
  },
  {
    slug: 'sound-workshop',
    title: 'Sound Workshop',
    status: 'past',
    image: '/images/events/racc-sound-workshop.webp',
    width: 1082,
    height: 1400,
    alt: 'Flyer for the Roopa Arts Cultural Center sound workshop',
  },
  {
    slug: 'margazhi',
    title: 'Margazhi',
    status: 'past',
    image: '/images/events/margazhi.webp',
    width: 788,
    height: 1400,
    alt: 'Flyer for the Margazhi season',
    date: 'December',
    venue: 'Texas',
  },
]

export const upcomingEvents = events.filter((e) => e.status === 'upcoming')
export const pastEvents = events.filter((e) => e.status === 'past')
