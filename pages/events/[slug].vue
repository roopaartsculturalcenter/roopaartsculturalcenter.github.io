<script setup lang="ts">
import { events, getEvent, formatEventDate } from '~/content/events'
import { site } from '~/data/site'

const route = useRoute()
const event = getEvent(String(route.params.slug))

// A slug that is not in events.ts is a 404, not an empty page.
if (!event) {
  throw createError({ statusCode: 404, statusMessage: 'Event not found', fatal: true })
}

const readableDate = formatEventDate(event.date)

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
        ? { performer: event.artists.map((a) => ({ '@type': 'Person', name: a.split(' — ')[0] })) }
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
          class="group inline-flex items-center gap-2 text-xs uppercase tracking-rubric text-chalk/55 transition-colors hover:text-spot"
        >
          <span class="transition-transform duration-500 ease-silk group-hover:-translate-x-1" aria-hidden="true">←</span>
          Back to events
        </NuxtLink>

        <div class="mt-12 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div data-wipe>
            <NuxtImg
              :src="event.flyerImage"
              :alt="`Flyer for ${event.title}`"
              width="1400"
              height="1400"
              sizes="xs:88vw sm:88vw md:80vw lg:45vw xl:45vw xxl:45vw"
              preload
              fetchpriority="high"
              class="w-full bg-stage-raised object-contain"
            />
          </div>

          <div>
            <h1 data-wipe class="font-display text-monumental text-chalk">{{ event.title }}</h1>

            <dl data-wipe class="mt-10 grid gap-5 border-y border-chalk/12 py-8 sm:grid-cols-2">
              <div v-if="readableDate">
                <dt class="text-xs uppercase tracking-rubric text-chalk/50">Date</dt>
                <dd class="mt-2 font-display text-recital text-spot">
                  <time :datetime="event.date!">{{ readableDate }}</time>
                </dd>
              </div>
              <div v-if="event.venue">
                <dt class="text-xs uppercase tracking-rubric text-chalk/50">Venue</dt>
                <dd class="mt-2 text-chalk/80">{{ event.venue }}</dd>
              </div>
            </dl>

            <p data-wipe class="mt-8 max-w-lg leading-relaxed text-chalk/70">
              {{ event.description }}
            </p>

            <div v-if="event.artists.length" data-wipe class="mt-10">
              <h2 class="text-xs uppercase tracking-rubric text-chalk/50">On stage</h2>
              <ul class="mt-4 grid gap-2 sm:grid-cols-2">
                <li v-for="a in event.artists" :key="a" class="text-chalk/75">{{ a }}</li>
              </ul>
            </div>

            <div v-if="event.rsvpUrl" data-wipe class="mt-12">
              <a
                ref="rsvp"
                :href="event.rsvpUrl"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="rsvp"
                class="inline-flex items-center gap-3 bg-spot px-10 py-5 text-xs font-semibold uppercase tracking-rubric text-stage transition-colors duration-500 hover:bg-spot-warm"
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
