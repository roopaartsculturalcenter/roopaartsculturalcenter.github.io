<script setup lang="ts">
import { gsap } from 'gsap'
import type { RaccEvent } from '~/data/events'

/**
 * A playbill card: reveals by expanding a slanted shard into the full rectangle,
 * tilts in 3D toward the cursor, and carries its date at a size that breaks the
 * card's own edge.
 *
 * The clip-path reveal is a one-shot on entry, never scrub-linked — clip-path is
 * cheap here but it is not something to run every frame of a pinned scene.
 */
const props = defineProps<{ event: RaccEvent; index: number }>()

const { reduced } = useMotionPreference()

const card = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = card.value
  if (!el || reduced.value) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const rotX = gsap.quickTo(inner.value, 'rotationX', { duration: 0.6, ease: 'power3.out' })
  const rotY = gsap.quickTo(inner.value, 'rotationY', { duration: 0.6, ease: 'power3.out' })
  const lift = gsap.quickTo(inner.value, 'y', { duration: 0.6, ease: 'power3.out' })

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect()
    rotY(((e.clientX - (r.left + r.width / 2)) / r.width) * 14)
    rotX(-((e.clientY - (r.top + r.height / 2)) / r.height) * 14)
    lift(-8)
  }
  const onLeave = () => {
    rotX(0)
    rotY(0)
    lift(0)
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
  onScopeDispose(() => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
  })
})

const rsvp = ref<HTMLElement | null>(null)
useMagnetic(rsvp, 0.3)
</script>

<template>
  <article
    ref="card"
    data-playbill
    class="group relative [perspective:1200px]"
  >
    <div
      ref="inner"
      class="relative gpu [transform-style:preserve-3d]"
    >
      <!-- The flyer -->
      <div class="relative overflow-hidden bg-stage-raised">
        <NuxtImg
          :src="event.image"
          :alt="event.alt"
          :width="event.width"
          :height="event.height"
          loading="lazy"
          sizes="xs:92vw sm:92vw md:46vw lg:38vw xl:38vw xxl:38vw"
          class="aspect-[4/5] w-full object-contain transition-transform duration-700 ease-silk group-hover:scale-[1.03] motion-reduce:transform-none"
        />
        <span
          v-if="event.status === 'upcoming'"
          class="absolute left-0 top-6 bg-spot px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-rubric text-stage"
        >Now booking</span>
      </div>

      <!-- Oversized date, deliberately breaking the card edge -->
      <p
        v-if="event.date"
        class="pointer-events-none absolute -left-3 -top-8 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-chalk mix-blend-difference sm:-left-6"
      >
        <time :datetime="event.isoDate">{{ event.date.split(',')[0] }}</time>
      </p>

      <div class="pt-7">
        <h3 class="font-display text-recital text-chalk">{{ event.title }}</h3>

        <p v-if="event.venue" class="mt-2 text-sm text-chalk/55">{{ event.venue }}</p>

        <p v-if="event.description" class="mt-4 max-w-sm leading-relaxed text-chalk/65">
          {{ event.description }}
        </p>

        <div v-if="event.rsvpUrl" class="mt-8">
          <a
            ref="rsvp"
            :href="event.rsvpUrl"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="rsvp"
            class="inline-flex items-center gap-3 border border-spot px-8 py-4 text-xs font-semibold uppercase tracking-rubric text-spot transition-colors duration-500 hover:bg-spot hover:text-stage"
          >
            {{ event.rsvpLabel ?? 'RSVP' }}
            <span class="sr-only">for {{ event.title }}</span>
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <NuxtLink
          v-else-if="event.to"
          :to="event.to"
          data-cursor="view"
          class="mt-8 inline-block border-b border-chalk/30 pb-1 text-xs uppercase tracking-rubric text-chalk/70 transition-colors hover:border-spot hover:text-spot"
        >
          Festival page
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
