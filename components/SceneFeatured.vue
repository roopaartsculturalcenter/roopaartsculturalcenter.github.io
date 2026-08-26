<script setup lang="ts">
/**
 * HOME SCENE 2 — the featured event.
 *
 * Always the next upcoming event from content/events.ts. Deliberately shows one
 * event and one flyer: the old homepage put six flyers here and none of them
 * read as the thing to act on.
 *
 * The RSVP is the only primary action on this screen. "All upcoming events" is a
 * secondary link by design.
 */
import { featuredEvent, upcomingEvents, eventDateLabel, flyerSize } from '~/content/events'

const { gsap, SplitText, scene } = useStage()

const root = ref<HTMLElement | null>(null)
const dateEl = ref<HTMLElement | null>(null)

const event = featuredEvent
const readableDate = computed(() => (event ? eventDateLabel(event) : null))

/**
 * Real flyer dimensions, so the optimizer keeps the whole frame instead of
 * cropping it square. Safe to fall back to a square when there is no event at
 * all — nothing renders in that case.
 */
const flyer = computed(() =>
  event ? flyerSize(event.flyerImage) : { width: 1400, height: 1400 },
)

/** A pinned past event is still "on stage next"; anything else is honest. */
const label = computed(() => {
  if (!event) return null
  return event.status === 'upcoming' ? 'Next on our stage' : 'Most recently on our stage'
})

const rsvp = ref<HTMLElement | null>(null)
useMagnetic(rsvp, 0.3)

scene(
  () => {
    const el = root.value
    if (!el) return

    // The date is the loudest thing on the screen, so it arrives first.
    if (dateEl.value) {
      const split = new SplitText(dateEl.value, { type: 'chars' })
      gsap.set(dateEl.value, { opacity: 1 })
      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.03,
        scrollTrigger: { trigger: el, start: 'top 72%', once: true },
      })
    }

    gsap.from(el.querySelectorAll('[data-feat]'), {
      opacity: 0,
      y: 28,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 68%', once: true },
    })

    gsap.fromTo(
      el.querySelector('[data-feat-flyer]'),
      { clipPath: 'inset(0% 0% 100% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        clearProps: 'clipPath',
      },
    )
  },
  {
    scope: root,
    fallback: () => {
      if (dateEl.value) dateEl.value.style.opacity = '1'
      root.value?.querySelectorAll<HTMLElement>('[data-feat], [data-feat-flyer]').forEach((n) => {
        n.style.opacity = '1'
        n.style.clipPath = 'none'
      })
    },
  },
)
</script>

<template>
  <section
    id="whats-on"
    ref="root"
    class="relative bg-stage py-28 lg:py-40"
    aria-labelledby="featured-heading"
  >
    <div v-if="event" class="stage-pad">
      <p data-feat class="rubric">{{ label }}</p>

      <div class="mt-10 grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-24">
        <div>
          <p
            v-if="readableDate"
            ref="dateEl"
            data-split
            class="font-display text-monumental leading-none text-spot-ink"
          >
            {{ readableDate }}
          </p>

          <h2 id="featured-heading" data-feat class="mt-8 font-display text-grand text-chalk">
            {{ event.title }}
          </h2>

          <p v-if="event.venue" data-feat class="mt-4 text-chalk/74">{{ event.venue }}</p>

          <ul
            v-if="event.artists.length"
            data-feat
            class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-chalk/82"
          >
            <li v-for="a in event.artists.slice(0, 6)" :key="a">{{ a }}</li>
          </ul>

          <p data-feat class="mt-8 max-w-lg leading-relaxed text-chalk/82">
            {{ event.description }}
          </p>

          <!-- The one primary action on this screen. -->
          <div data-feat class="mt-12">
            <a
              v-if="event.rsvpUrl"
              ref="rsvp"
              :href="event.rsvpUrl"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="rsvp"
              class="inline-flex items-center gap-3 bg-spot px-10 py-5 text-xs font-semibold uppercase tracking-rubric text-chalk transition-colors duration-500 hover:bg-spot-warm"
            >
              {{ event.actionLabel ?? 'RSVP' }}<span class="sr-only"> for {{ event.title }}</span>
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>

            <NuxtLink
              v-else
              :to="`/events/${event.slug}`"
              data-cursor="view"
              class="inline-flex items-center gap-3 bg-spot px-10 py-5 text-xs font-semibold uppercase tracking-rubric text-chalk transition-colors duration-500 hover:bg-spot-warm"
            >
              Event details
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          :to="`/events/${event.slug}`"
          data-feat-flyer
          data-cursor="view"
          class="block"
        >
          <NuxtImg
            :src="event.flyerImage"
            :alt="`Flyer for ${event.title}`"
            :width="flyer.width"
            :height="flyer.height"
            loading="lazy"
            sizes="xs:88vw sm:88vw md:70vw lg:42vw xl:42vw xxl:42vw"
            class="w-full bg-stage-raised object-contain"
          />
        </NuxtLink>
      </div>

      <!-- Slim secondary strip, not a second primary action. -->
      <NuxtLink
        v-if="upcomingEvents.length"
        to="/events"
        data-feat
        class="group mt-20 flex items-center justify-between border-t border-chalk/12 pt-7 text-chalk/82 transition-colors hover:text-spot-ink"
      >
        <span class="text-sm uppercase tracking-rubric">All upcoming events</span>
        <span class="transition-transform duration-500 ease-silk group-hover:translate-x-2" aria-hidden="true">→</span>
      </NuxtLink>
    </div>

    <!-- events.ts drives this section; an empty one is a valid state. -->
    <div v-else class="stage-pad">
      <p class="rubric">Next on our stage</p>
      <h2 id="featured-heading" class="mt-8 max-w-2xl font-display text-grand text-chalk">
        Our next season is being programmed now.
      </h2>
      <NuxtLink to="/events" class="mt-10 inline-block border-b border-spot pb-1 text-sm uppercase tracking-rubric text-spot-ink">
        See past events
      </NuxtLink>
    </div>
  </section>
</template>
