<script setup lang="ts">
/**
 * The season's headline act, on every page.
 *
 * The owner's direction (2026-11-17) is that the whole site points at Arudra
 * 2027 until it is staged, so this slim band rides above the nav sitewide.
 * Everything in it comes from the next upcoming Arudra entry in
 * content/events.ts: no copy of its own to go stale, and it retires itself
 * the day after the edition through the same build-time/live-status handoff
 * as every other event surface (ISSUE-11).
 */
import { arudraEvents, liveEvents, eventDateLabel } from '~/content/events'

const pick = (list: typeof arudraEvents) =>
  list
    .filter((e) => e.status === 'upcoming' && e.date)
    .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'))[0]

const next = shallowRef(pick(arudraEvents))
onMounted(() => {
  next.value = pick(liveEvents().arudra)
})
</script>

<template>
  <!-- bg-spot with text-chalk is the site's established text-on-gold pairing
       (every primary button and the skip link); gold-as-text stays banned. -->
  <a
    v-if="next"
    :href="next.rsvpUrl ?? `/events/${next.slug}/`"
    :target="next.rsvpUrl ? '_blank' : undefined"
    :rel="next.rsvpUrl ? 'noopener noreferrer' : undefined"
    data-cursor="rsvp"
    class="pointer-events-auto block bg-spot px-4 py-2 text-center text-xs font-semibold uppercase tracking-rubric text-chalk transition-colors duration-300 hover:bg-spot-warm"
  >
    {{ next.title }} · {{ eventDateLabel(next) }}<template v-if="next.venue"> · {{ next.venue }}</template>
    <span v-if="next.rsvpUrl" class="underline underline-offset-4"> RSVP</span>
  </a>
</template>
