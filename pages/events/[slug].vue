<script setup lang="ts">
import { events, getEvent, eventDateLabel, flyerSize } from '~/content/events'
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
      ...(event.artists.length
        ? { performer: event.artists.map((a) => ({ '@type': 'Person', name: a.split(',')[0].trim() })) }
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

// No prerender hint needed: nitro.prerender.crawlLinks follows the links from
// /events, so every event page is generated at build time.
</script>

<template>
  <div v-if="event">
    <section ref="root" class="relative bg-stage pb-24 pt-40 lg:pb-32 lg:pt-48">
      <div class="stage-pad">
        <NuxtLink
          to="/events"
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
                :alt="`Flyer for ${event.title}, ${readableDate}`"
                :width="flyer.width"
                :height="flyer.height"
                sizes="xs:88vw sm:88vw md:80vw lg:45vw xl:45vw xxl:45vw"
                preload
                fetchpriority="high"
                class="w-full bg-stage-raised object-contain"
              />
              <span
                class="mt-4 inline-block border-b border-spot pb-1 text-xs uppercase tracking-rubric text-spot-ink opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              >Enlarge flyer</span>
            </a>
          </div>

          <div>
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

            <div v-if="event.artists.length" data-wipe class="mt-10">
              <h2 class="text-xs uppercase tracking-rubric text-chalk/66">On stage</h2>
              <ul class="mt-4 grid gap-2 sm:grid-cols-2">
                <li v-for="a in event.artists" :key="a" class="text-chalk/85">{{ a }}</li>
              </ul>
            </div>

            <div v-if="event.rsvpUrl" data-wipe class="mt-12">
              <a
                ref="rsvp"
                :href="event.rsvpUrl"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="rsvp"
                class="inline-flex items-center gap-3 bg-spot px-10 py-5 text-xs font-semibold uppercase tracking-rubric text-chalk transition-colors duration-500 hover:bg-spot-warm"
              >
                RSVP<span class="sr-only"> for {{ event.title }}</span>
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

    <ActOvation show-other-ways />
  </div>
</template>
