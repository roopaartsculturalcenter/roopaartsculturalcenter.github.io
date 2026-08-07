<script setup lang="ts">
/**
 * ACT 4 — The Playbill.
 *
 * Cards arrive by expanding a slanted shard into the full rectangle. The shard
 * is a `clip-path` polygon; it runs once on entry and never inside a scrub, so
 * the one non-composited property on the page is confined to a single 0.9s
 * animation per card.
 */
import { upcomingEvents, pastEvents } from '~/data/events'

const props = withDefaults(
  defineProps<{ heading?: string; rubric?: string; showPast?: boolean }>(),
  { heading: 'Upcoming', rubric: 'Act II · The Playbill', showPast: true },
)

const { gsap, scene } = useStage()
const root = ref<HTMLElement | null>(null)

// A slanted sliver, then the whole card.
const SHARD = 'polygon(0% 42%, 22% 30%, 22% 58%, 0% 70%)'
const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

scene(
  () => {
    const el = root.value
    if (!el) return

    gsap.utils.toArray<HTMLElement>('[data-playbill]', el).forEach((card, i) => {
      // Reveal with clip-path alone, no opacity.
      //
      // A partly-transparent card blends its text and its gold badge against the
      // near-black stage, and an automated contrast check reads that blended
      // colour as the real one — three false failures. The clip-path hides the
      // card completely on its own, so the opacity was never needed.
      gsap.fromTo(
        card,
        { clipPath: SHARD },
        {
          clipPath: FULL,
          duration: 0.95,
          ease: 'power3.inOut',
          delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          // Leaving a clip-path behind would clip the 3D hover tilt.
          clearProps: 'clipPath',
        },
      )
    })

    gsap.from(el.querySelectorAll('[data-bill-head]'), {
      yPercent: 110,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 78%', once: true },
    })
  },
  {
    scope: root,
    fallback: () => {
      root.value?.querySelectorAll<HTMLElement>('[data-playbill]').forEach((n) => {
        n.style.clipPath = 'none'
      })
    },
  },
)
</script>

<template>
  <section ref="root" class="relative bg-stage py-28 lg:py-40" aria-labelledby="playbill-heading">
    <div class="stage-pad">
      <div class="mask-line">
        <p data-bill-head class="rubric">{{ rubric }}</p>
      </div>
      <h2 id="playbill-heading" class="mask-line mt-6">
        <span data-bill-head class="block font-display text-monumental text-chalk">
          {{ heading }}
        </span>
      </h2>

      <div v-if="upcomingEvents.length" class="mt-20 grid gap-x-10 gap-y-24 md:grid-cols-2">
        <PlaybillCard
          v-for="(event, i) in upcomingEvents"
          :key="event.slug"
          :event="event"
          :index="i"
        />
      </div>

      <p v-else class="mt-16 max-w-xl text-lg text-chalk/55">
        Nothing is on sale at this moment. The next announcement comes first to Instagram.
      </p>

      <template v-if="showPast">
        <div class="mask-line mt-32">
          <p data-bill-head class="rubric">Previously on this stage</p>
        </div>

        <div class="mt-14 grid gap-x-10 gap-y-24 md:grid-cols-2">
          <PlaybillCard
            v-for="(event, i) in pastEvents"
            :key="event.slug"
            :event="event"
            :index="i"
          />
        </div>
      </template>
    </div>
  </section>
</template>
