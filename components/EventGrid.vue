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
import { eventDateLabel, flyerSize } from '~/content/events'

const props = withDefaults(
  defineProps<{
    events: RaccEvent[]
    heading: string
    empty?: string
    tone?: 'stage' | 'deep'
  }>(),
  { tone: 'stage' },
)

/**
 * Each card carries its flyer's real dimensions, resolved once here rather than
 * per render. Handing NuxtImg a square size is what made the optimizer ship
 * cropped flyers — see `flyerSize`.
 */
const cards = computed(() =>
  props.events.map((event) => ({ event, flyer: flyerSize(event.flyerImage) })),
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

      <p v-if="!events.length && empty" class="mt-10 max-w-xl leading-relaxed text-chalk/78">
        {{ empty }}
      </p>

      <ul v-else class="mt-16 grid gap-x-10 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
        <li v-for="{ event, flyer } in cards" :key="event.slug" data-event-card class="group">
          <NuxtLink :to="`/events/${event.slug}`" data-cursor="view" class="block">
            <div class="bg-stage-raised">
              <!-- Flyers are artwork with text to the edges, so they are fitted and
                   never cropped: real intrinsic size so the optimizer keeps the whole
                   frame, `object-contain` to letterbox it inside a consistent box.
                   The box stays fixed so the text below every card aligns, and these
                   flyers run from 0.56 to 2.9 in aspect.

                   No hover scale here. A 3% zoom inside `overflow-hidden` shaved the
                   edges off artwork whose text runs to the border — the title colour
                   change carries the hover instead. -->
              <NuxtImg
                :src="event.flyerImage"
                :alt="event.flyerAlt ?? `Flyer for ${event.title}, ${eventDateLabel(event)}`"
                :width="flyer.width"
                :height="flyer.height"
                loading="lazy"
                sizes="xs:88vw sm:88vw md:44vw lg:30vw xl:30vw xxl:30vw"
                class="aspect-[4/5] w-full object-contain"
              />
            </div>

            <p class="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
              <!-- `datetime` stays the raw ISO date even when the visible label is a
                   range or a season, so the machine-readable value is never a guess. -->
              <time v-if="event.date" :datetime="event.date" class="text-spot-ink">
                {{ eventDateLabel(event) }}
              </time>
              <span v-else class="text-spot-ink">{{ eventDateLabel(event) }}</span>

              <!-- /75, not /60: at 12px the badge needs 4.5:1 and /60 measured
                   4.27:1 against the deep band this grid uses for past events. -->
              <span v-if="event.status === 'past'" class="rubric text-chalk/75">Past event</span>
            </p>

            <h3 class="mt-2 font-display text-recital text-chalk transition-colors duration-300 group-hover:text-spot-ink">
              {{ event.title }}
            </h3>

            <!-- `meta` is the schedule-or-bill line; `venue` is the fallback for the
                 archive entries that predate it. -->
            <p v-if="event.meta ?? event.venue" class="mt-2 text-sm leading-relaxed text-chalk/70">
              {{ event.meta ?? event.venue }}
            </p>

            <p class="mt-3 text-sm leading-relaxed text-chalk/78">{{ event.description }}</p>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
