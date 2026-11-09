<script setup lang="ts">
import { upcomingEvents, pastEvents, liveEvents } from '~/content/events'

useSeo({
  title: 'Events',
  description:
    'Everything currently booking at Roopa Arts Cultural Center, and everything we have staged: ' +
    'the Arudra Festival, concerts, jugalbandis, and workshops across Texas.',
  image: upcomingEvents[0]?.flyerImage ?? '/images/events/arudhara-2026.webp',
})

/**
 * Build-time split for SSR, hydration and no-JS readers; corrected against the
 * browser's clock after mount (ISSUE-11), so a finished event moves itself to
 * "Previously on this stage" even when the scheduled rebuild is hours late.
 */
const upcoming = shallowRef(upcomingEvents)
const past = shallowRef(pastEvents)
onMounted(() => {
  const live = liveEvents()
  upcoming.value = live.upcoming
  past.value = live.past
})
</script>

<template>
  <div>
    <PageOverture
      title="Everything currently booking, and everything we have staged."
      lede="From the Arudra Festival to intimate concerts: what's on stage next, and everything that came before."
      image="/images/home/home-4.webp"
    />

    <EventGrid
      :events="upcoming"
      heading="Next on our stage."
      empty="Our next season is being programmed now. The first announcement goes to Instagram."
    />

    <EventGrid :events="past" heading="Previously on this stage." tone="deep" />

    <ActOvation show-other-ways />
  </div>
</template>
