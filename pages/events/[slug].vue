<script setup lang="ts">
import { events, getEvent, eventDateLabel, flyerSize } from '~/content/events'
import { eventGalleries } from '~/content/gallery'
import { site } from '~/data/site'

const route = useRoute()
const event = getEvent(String(route.params.slug))

// A slug that is not in events.ts is a 404, not an empty page.
if (!event) {
  throw createError({ statusCode: 404, statusMessage: 'Event not found', fatal: true })
}

const readableDate = eventDateLabel(event)
// Real flyer dimensions, so the optimizer never crops it to a square.
const flyer = flyerSize(event.flyerImage)

/**
 * The season, as data, for the overview page (ISSUE-3): every dated event from
 * July 2026 through June 2027, soonest first. Rendered only on the
 * `seasonOverview` entry, so ordinary event pages are untouched. The window is
 * a constant because the page itself is about one named season.
 */
const seasonEvents = event.seasonOverview
  ? events
      .filter((e) => e.date && e.date >= '2026-07-01' && e.date <= '2027-06-30')
      .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
  : []

useSeo({
  title: event.title,
  description: event.description,
  image: event.flyerImage,
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      ...(event.date ? { startDate: event.date } : {}),
      description: event.description,
      ...(event.venue ? { location: { '@type': 'Place', name: event.venue } } : {}),
      // "with live band" and similar ensemble notes are billing, not people.
      ...(event.artists.filter((a) => !a.startsWith('with ')).length
        ? {
            performer: event.artists
              .filter((a) => !a.startsWith('with '))
              .map((a) => ({ '@type': 'Person', name: a.split(',')[0].trim() })),
          }
        : {}),
      organizer: { '@type': 'NGO', name: site.name },
      eventStatus: 'https://schema.org/EventScheduled',
    }),
  }],
})

const root = ref<HTMLElement | null>(null)
useEntrance(root)

const rsvp = ref<HTMLElement | null>(null)
useMagnetic(rsvp, 0.3)

// Reveal scopes for the optional production sections below.
const sceneRoot = ref<HTMLElement | null>(null)
useEntrance(sceneRoot, { stagger: 0.06 })

const creditRoot = ref<HTMLElement | null>(null)
useEntrance(creditRoot, { stagger: 0.04 })

// Only events listed in `eventGalleries` get a gallery; every other event page is
// untouched. Heading and rubric come from the data, not the template, so one
// edition's copy cannot leak onto another's page. See content/gallery.ts.
const gallery = computed(() => eventGalleries[String(route.params.slug)] ?? null)

// No prerender hint needed: nitro.prerender.crawlLinks follows the links from
// /events, so every event page is generated at build time.
</script>

<template>
  <div v-if="event">
    <section ref="root" class="relative bg-stage pb-24 pt-40 lg:pb-32 lg:pt-48">
      <div class="stage-pad">
        <NuxtLink
          to="/events/"
          class="group inline-flex items-center gap-2 text-xs uppercase tracking-rubric text-chalk/70 transition-colors hover:text-spot-ink"
        >
          <span class="transition-transform duration-500 ease-silk group-hover:-translate-x-1" aria-hidden="true">←</span>
          Back to events
        </NuxtLink>

        <div class="mt-12 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <!-- Click-to-enlarge. Flyers carry dense text — dates, venues, the bill —
               so opening the original at native resolution is worth a click. This is
               a plain link to the asset rather than a lightbox: the site's only
               lightbox is ActGallery's, which grows the clicked element with GSAP
               Flip against its own masonry markup and does not lift out cleanly. -->
          <div data-wipe>
            <a
              :href="event.flyerImage"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              class="group block"
              :aria-label="`Open the full-size flyer for ${event.title} in a new tab`"
            >
              <NuxtImg
                :src="event.flyerImage"
                :alt="event.flyerAlt ?? `Flyer for ${event.title}, ${readableDate}`"
                :width="flyer.width"
                :height="flyer.height"
                sizes="xs:88vw sm:88vw md:80vw lg:45vw xl:45vw xxl:45vw"
                preload
                fetchpriority="high"
                class="w-full bg-stage-raised object-contain"
              />
            </a>
          </div>

          <div>
            <!-- ISSUE-1: a page for a finished event says so before it says
                 anything else, and sells nothing below. -->
            <p v-if="event.status === 'past'" data-wipe class="rubric mb-5 text-chalk/75">
              Past event
            </p>

            <h1 data-wipe class="font-display text-monumental text-chalk">{{ event.title }}</h1>

            <dl data-wipe class="mt-10 grid gap-5 border-y border-chalk/12 py-8 sm:grid-cols-2">
              <div>
                <dt class="text-xs uppercase tracking-rubric text-chalk/66">Date</dt>
                <dd class="mt-2 font-display text-recital text-spot-ink">
                  <!-- `<time>` only when there is a real ISO date to put in
                       `datetime`. A season label like "2026–2027 Season" is not a
                       parseable datetime, and a bare <time> whose text is not a
                       valid date is invalid HTML. -->
                  <time v-if="event.date" :datetime="event.date">{{ readableDate }}</time>
                  <span v-else>{{ readableDate }}</span>
                </dd>
              </div>
              <div v-if="event.venue">
                <dt class="text-xs uppercase tracking-rubric text-chalk/66">Venue</dt>
                <dd class="mt-2 text-chalk/80">{{ event.venue }}</dd>
              </div>
            </dl>

            <p data-wipe class="mt-8 max-w-lg leading-relaxed text-chalk/82">
              {{ event.description }}
            </p>

            <p v-if="event.recap" data-wipe class="mt-6 max-w-lg leading-relaxed text-chalk/82">
              {{ event.recap }}
            </p>

            <!-- Suppressed when a full credit block exists further down the page,
                 where the same names appear with their real roles and ordering. Events
                 without credits still need this as their only artist listing. -->
            <div
              v-if="event.artists.length && !event.production?.credits"
              data-wipe
              class="mt-10"
            >
              <h2 class="text-xs uppercase tracking-rubric text-chalk/66">On stage</h2>
              <ul class="mt-4 grid gap-2 sm:grid-cols-2">
                <li v-for="a in event.artists" :key="a" class="text-chalk/85">{{ a }}</li>
              </ul>
            </div>

            <div v-if="event.tickets && event.status !== 'past'" data-wipe class="mt-10">
              <h2 class="text-xs uppercase tracking-rubric text-chalk/66">Tickets</h2>
              <p class="mt-4 text-chalk/85">{{ event.tickets }}</p>
            </div>

            <div v-if="event.rsvpUrl && event.status !== 'past'" data-wipe class="mt-12">
              <a
                ref="rsvp"
                :href="event.rsvpUrl"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="rsvp"
                class="inline-flex items-center gap-3 bg-spot px-10 py-5 text-xs font-semibold uppercase tracking-rubric text-chalk transition-colors duration-500 hover:bg-spot-warm"
              >
                {{ event.actionLabel ?? 'RSVP' }}<span class="sr-only"> for {{ event.title }}</span>
                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The season, date by date (ISSUE-3). Only the `seasonOverview` entry has
         rows here; every other event page skips this section entirely. Rows come
         from the same events data as every other surface, so this list can never
         disagree with the cards. -->
    <section
      v-if="seasonEvents.length"
      class="bg-stage-deep py-24 lg:py-32"
      aria-labelledby="season-list-heading"
    >
      <div class="stage-pad">
        <p class="rubric">Date by date</p>
        <h2 id="season-list-heading" class="mt-6 max-w-2xl font-display text-grand text-chalk">
          The season, date by date.
        </h2>

        <ul class="mt-12 border-y border-chalk/12">
          <li v-for="e in seasonEvents" :key="e.slug" class="border-b border-chalk/12 last:border-b-0">
            <NuxtLink
              :to="`/events/${e.slug}/`"
              data-cursor="view"
              class="group grid gap-2 py-6 sm:grid-cols-[11rem_1fr_auto] sm:items-baseline sm:gap-8"
            >
              <time v-if="e.date" :datetime="e.date" class="font-display text-lg text-spot-ink">
                {{ eventDateLabel(e) }}
              </time>
              <span>
                <span class="font-display text-lg text-chalk transition-colors duration-300 group-hover:text-spot-ink">
                  {{ e.title }}
                </span>
                <span v-if="e.meta ?? e.venue" class="mt-1 block text-sm text-chalk/70">
                  {{ e.meta ?? e.venue }}
                </span>
              </span>
              <span class="rubric" :class="e.status === 'past' ? 'text-chalk/60' : 'text-spot-ink'">
                {{ e.status === 'past' ? 'Past' : 'Upcoming' }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- The featured production, in depth.
         Only rendered for events that carry a `production` block, so every other
         event page is unchanged. This is where per-edition detail belongs: it used
         to sit on /arudra, which made the general festival page read as a report on
         one year. -->
    <template v-if="event.production">
      <ProductionProgramme
        v-if="event.production.programme"
        :programme="event.production.programme"
        :title="event.production.title"
      />

      <!-- Credits render exactly as ordered in the data. A credit block is a
           contract with the people in it: no reordering to suit the grid, no
           alphabetising. -->
      <section
        v-if="event.production.credits?.length"
        ref="creditRoot"
        class="bg-stage py-24 lg:py-32"
        aria-labelledby="event-credits-heading"
      >
        <div class="stage-pad">
          <p data-wipe class="rubric">Credits</p>
          <h2
            id="event-credits-heading"
            data-wipe
            class="mt-6 max-w-2xl font-display text-grand text-chalk"
          >
            Everyone who made it.
          </h2>

          <dl class="mt-14 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="group in event.production.credits" :key="group.role" data-wipe>
              <dt class="text-xs uppercase tracking-rubric text-chalk/66">{{ group.role }}</dt>
              <dd class="mt-3">
                <ul class="space-y-1.5">
                  <li v-for="n in group.names" :key="n" class="leading-snug text-chalk/85">
                    {{ n }}
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </template>

    <!-- The edition's own gallery, for events that have one. `tone="deep"` because
         the credits block above is bg-stage and two flat sections in a row read as
         one. Reuses ActGallery, so this gets the site's existing lightbox: click to
         grow from the thumbnail, arrow keys between frames, Escape to close. -->
    <ActGallery
      v-if="gallery"
      :id="`${event.slug}-gallery`"
      :photos="gallery.images"
      :heading="gallery.heading"
      :rubric="gallery.rubric"
      tone="deep"
    />

    <ActOvation show-other-ways />
  </div>
</template>
