<script setup lang="ts">
import { upcomingEvents, pastEvents } from '~/content/events'

useSeo({
  title: 'Events',
  description:
    'Everything currently booking at Roopa Arts Cultural Center, and everything we have staged: ' +
    'the Arudra Festival, concerts, jugalbandis, and workshops across Texas.',
  image: upcomingEvents[0]?.flyerImage ?? '/images/events/arudhara-2026.webp',
})
</script>

<template>
  <div>
    <PageOverture
      title="Everything currently booking, and everything we have staged."
      lede="Every event below is drawn from one list, so a date passing moves it into Past on its own."
      image="/images/home/home-4.webp"
    />

    <EventGrid
      :events="upcomingEvents"
      heading="Next on our stage."
      empty="Our next season is being programmed now. The first announcement goes to Instagram."
    />

    <EventGrid :events="pastEvents" heading="Previously on this stage." tone="deep" />

    <ActOvation show-other-ways />
  </div>
</template>
