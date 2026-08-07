<script setup lang="ts">
import { site } from '~/data/site'
import { upcomingEvents, pastEvents } from '~/data/events'

useSeo({
  title: 'Events',
  description:
    'Upcoming performances and past productions from Roopa Arts Cultural Center — the Arudra Festival, ' +
    'concerts, jugalbandis, and workshops across Texas.',
  image: upcomingEvents[0]?.image ?? '/images/events/arudhara-2026.webp',
})
</script>

<template>
  <div>
    <PageHero
      kicker="What's On"
      title="Events"
      lede="Performances, festivals, and workshops — from our signature Arudra Festival to intimate concerts."
      image="/images/banners/banner-4.webp"
    />

    <!-- Upcoming -->
    <AppSection labelledby="upcoming-heading">
      <div class="max-w-prose">
        <p data-reveal class="kicker rule-gold">Next On Stage</p>
        <h2 id="upcoming-heading" data-reveal class="mt-5 text-display-md">Upcoming events</h2>
      </div>

      <div
        v-if="upcomingEvents.length"
        class="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <EventCard
          v-for="(event, i) in upcomingEvents"
          :key="event.slug"
          :event="event"
          :priority="i === 0"
        />
      </div>

      <p v-else data-reveal class="mt-10 max-w-prose text-lg leading-relaxed text-ink/70">
        Nothing is on sale right now. Follow us on
        <a
          :href="site.social[0].href"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-gold underline-offset-4 hover:text-maroon"
        >Instagram</a>
        for the next announcement.
      </p>
    </AppSection>

    <!-- Past -->
    <AppSection tone="dim" labelledby="past-heading">
      <div class="max-w-prose">
        <p data-reveal class="kicker rule-gold">The Archive</p>
        <h2 id="past-heading" data-reveal class="mt-5 text-display-md">Past productions</h2>
        <p data-reveal class="mt-5 text-lg leading-relaxed text-ink/70">
          Festivals, concerts, and workshops we have staged.
        </p>
      </div>

      <div class="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <EventCard v-for="event in pastEvents" :key="event.slug" :event="event" />
      </div>
    </AppSection>

    <DonateBand />
  </div>
</template>
