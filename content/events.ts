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

import manifest from '~/data/image-manifest.json'
import { arudra2026Credits, arudra2026Programme } from '~/data/arudra'

export interface RaccEventSource {
  title: string
  slug: string
  /**
   * ISO date, and the only thing that decides upcoming vs past.
   *
   * For a multi-day run this is the FIRST day, so the event stays upcoming for
   * its whole length and sorts by when it opens. `null` only for undated series.
   */
  date: string | null
  /**
   * Overrides the displayed date text when `date` alone would misrepresent it —
   * a run across several days, or a whole season. `date` still drives sorting and
   * the `<time datetime>` attribute, so the machine-readable value stays honest.
   */
  dateLabel?: string
  artists: string[]
  description: string
  venue: string | null
  /**
   * One line under the title on a card: schedule, city, or the bill. Free text,
   * because what matters most differs per event — two cities for one, the
   * performers for another. Falls back to `venue` when absent.
   */
  meta?: string
  flyerImage: string
  /**
   * Overrides the card's generated image alt. Left unset for every event whose
   * poster is adequately described by "Flyer for {title}, {date}", which is all of
   * them so far bar one; supplying it per event avoids rewording the default and
   * changing the alt on cards nobody asked to touch.
   */
  flyerAlt?: string
  rsvpUrl?: string
  /** Overrides the default "RSVP" text for ticketed events. */
  actionLabel?: string
  /**
   * Long-form detail for the featured production of an event, rendered on its own
   * page rather than on a landing page.
   *
   * This exists because /arudra had filled up with one edition's scene list and
   * cast, so the general festival page answered "what happened in 2026" instead of
   * "what is Arudra". Per-edition depth belongs on the edition.
   */
  production?: {
    title: string
    intro?: string
    scenes?: { title: string; body: string }[]
    credits?: { role: string; names: string[] }[]
    /** The full programme book: narrative, verses, translations, ragas. */
    programme?: typeof arudra2026Programme
    /** Where the detail was transcribed from, for whoever checks it next. */
    sourceUrl?: string
  }
  /**
   * An undated, forward-looking summary of the season.
   *
   * Shows as upcoming despite having no date, and always sorts last among the
   * upcoming events — it is a signpost to everything else, so it reads as the
   * closing card rather than the next thing on stage. Never becomes the
   * homepage's featured event.
   */
  seasonOverview?: boolean
  /**
   * Forces an event to show as upcoming regardless of its date, and to be the
   * homepage's featured event.
   *
   * Currently unused, and that is the healthy state — it existed only to hold
   * Navtar in the featured slot while the site had no future-dated events. Real
   * ones now exist, so the flag came off and placement is fully automatic again.
   * Kept as the escape hatch for a genuine "this is the headline act" override.
   */
  pinned?: boolean
}

export interface RaccEvent extends RaccEventSource {
  status: 'upcoming' | 'past'
}

const source: RaccEventSource[] = [
  // --- 2026–27 season -------------------------------------------------------
  {
    title: 'An Evening of Celebrating Bhagyaraj',
    slug: 'evening-celebrating-bhagyaraj',
    date: '2026-09-19',
    artists: [],
    description:
      "A tribute to the legend behind timeless stories and memorable music. An evening " +
      "honoring K. Bhagyaraj's cinema and songs.",
    venue: 'Houston',
    meta: '7:00 PM · Houston',
    flyerImage: '/images/events/evening-celebrating-bhagyaraj.webp',
    rsvpUrl: 'https://www.zeffy.com/en-US/ticketing/an-evening-of-celebrating-bhagyaraj',
  },
  {
    title: 'Navarathri Seva Series',
    slug: 'navarathri-seva-series',
    // First day of the run; the label carries the full span.
    date: '2026-10-15',
    dateLabel: 'October 15–19, 2026',
    artists: [],
    description:
      'Five evenings of devotional music offered in the spirit of seva, celebrating ' +
      'Navarathri across two cities.',
    venue: 'Houston & Austin',
    meta: 'Houston · Oct 15–17 | Austin · Oct 19',
    flyerImage: '/images/events/navarathri-seva-series.webp',
  },
  {
    title: 'Ilaiyaraaja Night',
    slug: 'ilaiyaraaja-night',
    date: '2026-10-23',
    artists: [
      'Arjun, vocals (Super Singer 5 fame)',
      'Akhila, vocals (ETV title winner)',
      'Achi, violin',
      'with live band',
    ],
    description:
      "An intimate live concert of timeless Tamil melodies: the maestro's classics, " +
      'reimagined on stage in Austin. 8:00–10:00 PM.',
    venue: 'Austin',
    meta:
      'Arjun, vocals (Super Singer 5 fame) · Akhila, vocals (ETV title winner) · ' +
      'Achi, violin · with live band',
    flyerImage: '/images/events/ilaiyaraaja-night-venue.webp',
    rsvpUrl: 'https://www.zeffy.com/en-US/ticketing/ilaiyaraaja-night-timeless-tamil-melodies',
    actionLabel: 'Buy tickets',
  },
  {
    // Everything here is read off the save-the-date poster and nothing more: day,
    // date and venue. `artists` stays empty because the poster announces no bill,
    // and there is no `production` because no programme exists yet. Both fill in
    // the same way 2026's did, once the line-up is confirmed.
    //
    // Slug follows arudra-2026, the edition immediately before it, rather than the
    // older arudra-festival-YYYY form.
    title: 'Arudra 2027',
    slug: 'arudra-2027',
    date: '2027-02-27',
    // The poster leads with the day of the week and gives no start time, so the
    // label carries the day and stops there rather than inventing an hour.
    dateLabel: 'Saturday, February 27, 2027',
    artists: [],
    description:
      'Our signature annual production returns. Save the date: the programme, cast ' +
      'and credits are announced closer to the day.',
    venue: 'Jewish Community Center of Houston',
    meta: 'Save the date · Jewish Community Center of Houston',
    flyerImage: '/images/events/arudra-2027.webp',
    // The default "Flyer for Arudra 2027, Saturday, February 27, 2027" would repeat
    // the line of text directly above the card. This describes what the poster
    // shows instead. The figure is deliberately not named: the lotus and the parrot
    // fit more than one goddess, and the poster itself names none.
    flyerAlt:
      'Save-the-date poster for Arudra 2027 at the Jewish Community Center of Houston, ' +
      'with a goddess holding a lotus, a parrot at her shoulder, between two temple gopurams',
    rsvpUrl: 'https://www.zeffy.com/en-US/ticketing/arudra-2027-raccs-signature-annual-production',
  },
  {
    // Aug 2 2026 — already run, so this derives as past on its own and appears
    // under "Previously on this stage". Nothing marks it by hand.
    title: 'Rule of N: A Chamber Music Experience',
    slug: 'rule-of-n',
    date: '2026-08-02',
    artists: [],
    description:
      'Each ensemble builds its program around one number, through composers, ragas, ' +
      'talas, languages, and rhythms. One number, infinite musical possibilities.',
    venue: 'Austin, TX',
    meta: '2:00 PM onwards · Austin, TX',
    flyerImage: '/images/events/rule-of-n.webp',
  },
  {
    title: 'Season at a Glance',
    slug: 'season-at-a-glance',
    date: null,
    dateLabel: '2026–2027 Season',
    artists: [],
    description:
      'Our full season lineup, from Rule of N to Arudra 2027, with more announcements ' +
      'coming this fall.',
    venue: null,
    meta: 'Music · Culture · Community',
    flyerImage: '/images/events/season-at-a-glance.webp',
    seasonOverview: true,
  },

  // --- Archive --------------------------------------------------------------
  {
    title: 'Navtar Violin Jugalbandi',
    slug: 'navtar-violin-jugalbandi',
    date: '2025-07-12',
    artists: ['Vishnu Navtar', 'Achi Bala, violin', 'Karun Salvady, mridangam'],
    description:
      'Compositions presented on the navtar, violin, and mridangam: three voices ' +
      'trading phrases across a single evening.',
    venue: null,
    flyerImage: '/images/events/navtar-violin-jugalbandi.webp',
    rsvpUrl: 'https://evite.me/NVtRUQfHnt',
  },
  {
    title: 'Arudra 2026',
    slug: 'arudra-2026',
    date: '2026-02-08',
    // Order and spellings follow the organisation's own page for the production,
    // https://roopaartsculturalcenter.org/arudra-2026/ — concept, then direction,
    // then cast, then the music team. The previous list was read off the artist
    // announcement cards: it missed eleven cast members and misspelled two names.
    // The full credit block lives in data/arudra.ts as `arudra2026Credits`.
    artists: [
      'Achi Bala, concept, music composition and violin',
      'Shashank Iswara, dance direction, screenplay and choreography',
      'Srinidhi Subash, cast',
      'Aditya Subramaniam, cast',
      'Maanya Varma, cast',
      'Akhila Rajesh, cast',
      'Mithra Arun, cast',
      'Rohita Kaimal, cast',
      'Varsha Vasu, cast',
      'Soundarya Dalipatti, cast',
      'Milind Soman, cast',
      'Aditya Iswara, cast and mridangam',
      'Saivignesh Ramakrishnan, vocal',
      'Vaishnavi Narasimhan, vocal',
      'Jahnavi Murali, vocal and cello',
      'Dr. Maheetha Bharadwaj, keys',
      'Naga Srinidhi Kuruvada, mridangam',
      'Visveshwar Nagarajan, flute',
    ],
    description:
      'Our signature festival: an invocation by Musicians of Houston, a veena-violin ' +
      'duet, the featured production Navagrahamum Navakailasamum, and Thiruvadhirai ' +
      'Threads: one afternoon, four experiences.',
    venue: 'Jewish Community Center of Houston',
    flyerImage: '/images/events/all-program-flyer.webp',
    production: {
      title: 'Navagrahamum Navakailasamum',
      // No `intro` or `scenes` here: the programme below carries the organisation's
      // own invitation and the full six scenes, so setting either would print the
      // same material twice.
      credits: arudra2026Credits,
      programme: arudra2026Programme,
      sourceUrl: 'https://roopaartsculturalcenter.org/arudra-2026/',
    },
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
    description: 'The 2025 edition of our signature festival: an evening of music and dance.',
    venue: 'Jewish Community Center of Houston',
    flyerImage: '/images/events/main-flyerarudra-festival-2025.webp',
  },
  {
    // Date, time and venue read off the poster: Sunday, March 3 2024, 3:00 PM CT,
    // Stafford Civic Center. Venue is given as name plus city, matching the other
    // entries; the poster's full street address is detail for a ticket, not a card.
    // `artists` stays empty because the poster names none, and guessing at a 2024
    // bill is not something a credit list can be wrong about quietly.
    //
    // Slug follows arudra-festival-2025, not arudra-2026: the two conventions
    // already coexist, and matching the neighbouring year is the lesser surprise.
    title: 'Arudra Festival 2024',
    slug: 'arudra-festival-2024',
    date: '2024-03-03',
    dateLabel: 'Sunday, March 3, 2024, 3:00 PM CT',
    artists: [],
    description:
      'The 2024 edition of our signature festival: an evening of Indian classical music and dance.',
    venue: 'Stafford Civic Center, Stafford, TX',
    flyerImage: '/images/arudra-2024/arudra-2024-poster.webp',
    flyerAlt: 'Arudra 2024 – Indian classical music and dance evening',
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
  // A season summary has no date but is not history.
  if (e.seasonOverview) return 'upcoming'
  if (!e.date) return 'past'
  return new Date(e.date) >= startOfToday() ? 'upcoming' : 'past'
}

export const events: RaccEvent[] = source.map((e) => ({ ...e, status: deriveStatus(e) }))

/**
 * Soonest first — that is the order an audience reads a "what's next" list in.
 * The season summary is pushed to the end regardless of anything else.
 */
export const upcomingEvents = events
  .filter((e) => e.status === 'upcoming')
  .sort((a, b) => {
    if (a.seasonOverview !== b.seasonOverview) return a.seasonOverview ? 1 : -1
    return (a.date ?? '9999').localeCompare(b.date ?? '9999')
  })

/** Most recent first, undated series last. */
export const pastEvents = events
  .filter((e) => e.status === 'past')
  .sort((a, b) => (b.date ?? '0000').localeCompare(a.date ?? '0000'))

/**
 * Drives the homepage featured scene. A pinned event always wins; the season
 * summary never does, since "next on our stage" has to name one actual night.
 */
export const featuredEvent: RaccEvent | undefined =
  upcomingEvents.find((e) => e.pinned)
  ?? upcomingEvents.find((e) => !e.seasonOverview)
  ?? pastEvents[0]

export const getEvent = (slug: string) => events.find((e) => e.slug === slug)

/** Everything under the Arudra banner, for /arudra. */
export const arudraEvents = events.filter((e) => e.slug.includes('arudra'))

/**
 * A flyer's true pixel size, from the build manifest.
 *
 * Not cosmetic. `@nuxt/image` takes the aspect ratio of the variants it generates
 * from the width/height it is handed, and ipx's `s_WxH` crops to cover. Every
 * flyer render used to hardcode a square `1400x1400`, so a 1050x1400 poster was
 * emitted as a physically cropped 1050x1050 file — a quarter of its height gone
 * before any CSS ran, which `object-contain` cannot undo. The 1400x486 Guruguha
 * banner fared worse, shipping as 486x486.
 *
 * Throws rather than guessing. A flyer missing here means `npm run images` has not
 * been run, and a silent fallback would quietly reintroduce the crop.
 */
export function flyerSize(src: string): { width: number; height: number } {
  const found = manifest.find((i) => i.src === src)
  if (!found) throw new Error(`Flyer not in manifest: ${src} — run \`npm run images\``)
  return { width: found.width, height: found.height }
}

/** Human-readable date. Undated series render their own label instead. */
export function formatEventDate(date: string | null): string | null {
  if (!date) return null
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * What to print where a date goes, for any event.
 *
 * `dateLabel` wins when set, so a multi-day run or a whole season reads correctly
 * while `date` keeps driving sorting and `<time datetime>`. Everything routes
 * through here so the card, the detail page and the featured scene can never
 * disagree about how one event is dated.
 */
export function eventDateLabel(e: RaccEventSource): string {
  return e.dateLabel ?? formatEventDate(e.date) ?? 'Recurring series'
}
