<script setup lang="ts">
import { upcomingEvents } from '~/data/events'

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
    <PageOverture
      rubric="What's on"
      title="Events"
      lede="Festivals, concerts, and workshops — everything currently booking, and everything we have staged."
      image="/images/home/home-4.webp"
    />
    <ActPlaybill heading="Now booking" rubric="Upcoming" :show-past="true" />
    <ActOvation />
  </div>
</template>
