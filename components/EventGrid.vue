<script setup lang="ts">
/**
 * A grid of event cards, in the approved Playbill style. Every card links to
 * /events/[slug] — the card itself is no longer a dead end.
 *
 * Keeps the clip-path shard reveal, which runs once on entry and never inside a
 * scrub, and carries no opacity so card text is never blended against the stage
 * for a contrast check.
 */
import type { RaccEvent } from '~/content/events'
import { formatEventDate } from '~/content/events'

withDefaults(
  defineProps<{
    events: RaccEvent[]
    heading: string
    empty?: string
    tone?: 'stage' | 'deep'
  }>(),
  { tone: 'stage' },
)

const { gsap, scene } = useStage()
const root = ref<HTMLElement | null>(null)

const SHARD = 'polygon(0% 42%, 22% 30%, 22% 58%, 0% 70%)'
const FULL = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

scene(
  () => {
    const el = root.value
    if (!el) return

    gsap.utils.toArray<HTMLElement>('[data-event-card]', el).forEach((card, i) => {
      gsap.fromTo(
        card,
        { clipPath: SHARD },
        {
          clipPath: FULL,
          duration: 0.95,
          ease: 'power3.inOut',
          delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          clearProps: 'clipPath',
        },
      )
    })

    gsap.from(el.querySelectorAll('[data-grid-head]'), {
      yPercent: 110,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    })
  },
  {
    scope: root,
    fallback: () => {
      root.value?.querySelectorAll<HTMLElement>('[data-event-card]').forEach((n) => {
        n.style.clipPath = 'none'
      })
    },
  },
)
</script>

<template>
  <section
    ref="root"
    :class="['relative py-24 lg:py-32', tone === 'deep' ? 'bg-stage-deep' : 'bg-stage']"
  >
    <div class="stage-pad">
      <h2 class="mask-line">
        <span data-grid-head class="block max-w-3xl font-display text-grand text-chalk">
          {{ heading }}
        </span>
      </h2>

      <p v-if="!events.length && empty" class="mt-10 max-w-xl leading-relaxed text-chalk/65">
        {{ empty }}
      </p>

      <ul v-else class="mt-16 grid gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
        <li v-for="event in events" :key="event.slug" data-event-card class="group">
          <NuxtLink :to="`/events/${event.slug}`" data-cursor="view" class="block">
            <div class="overflow-hidden bg-stage-raised">
              <!-- Flyers are artwork with text to the edges, so they are fitted,
                   never cropped. -->
              <NuxtImg
                :src="event.flyerImage"
                :alt="`Flyer for ${event.title}`"
                width="1400"
                height="1400"
                loading="lazy"
                sizes="xs:88vw sm:88vw md:44vw lg:30vw xl:30vw xxl:30vw"
                class="aspect-[4/5] w-full object-contain transition-transform duration-700 ease-silk group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            </div>

            <p class="mt-6 text-sm text-spot">
              <time v-if="event.date" :datetime="event.date">
                {{ formatEventDate(event.date) }}
              </time>
              <span v-else>Recurring series</span>
            </p>

            <h3 class="mt-2 font-display text-recital text-chalk transition-colors duration-300 group-hover:text-spot">
              {{ event.title }}
            </h3>

            <p v-if="event.venue" class="mt-2 text-sm text-chalk/55">{{ event.venue }}</p>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
