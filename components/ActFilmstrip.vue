<script setup lang="ts">
/**
 * ACT 5 — Arudra 2026, walked through sideways.
 *
 * The section pins and the filmstrip translates horizontally by exactly the
 * amount it overflows, so vertical scrolling walks you along the strip. Each
 * flyer skews slightly with scroll velocity and settles when you stop.
 *
 * On a phone this becomes a real horizontal scroll region with snap points —
 * swiping sideways is the native gesture there, and pinning would take it away.
 */
import { arudra2026 } from '~/data/arudra'

const { gsap, ScrollTrigger, scene } = useStage()

const root = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)

const items = [...arudra2026.flyers, ...arudra2026.artistCards]

scene(
  () => {
    const el = root.value
    const trackEl = track.value
    if (!el || !trackEl) return

    if (window.matchMedia('(max-width: 768px)').matches) {
      gsap.from(el.querySelectorAll('[data-strip-head]'), {
        yPercent: 110,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })
      return
    }

    // Recomputed on refresh so a resize or a late-loading image cannot leave the
    // strip stopping short of its own end.
    const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 96)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: stageEl.value ?? true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Velocity skew: lean into the direction of travel, settle at rest.
          const skew = gsap.utils.clamp(-8, 8, self.getVelocity() / 320)
          gsap.to('[data-flyer]', {
            skewX: skew,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        },
      },
    })

    tl.to(trackEl, { x: () => -distance(), ease: 'none' }, 0)
      .fromTo(bar.value, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
  },
  {
    scope: root,
    fallback: () => {
      if (bar.value) bar.value.style.transform = 'scaleX(1)'
    },
  },
)
</script>

<template>
  <section ref="root" class="relative bg-stage-deep" aria-labelledby="strip-heading">
    <div ref="stageEl" class="flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
      <div class="stage-pad">
        <div class="mask-line">
          <p data-strip-head class="rubric">Act III &nbsp;·&nbsp; The Signature Festival</p>
        </div>
        <h2 id="strip-heading" class="mask-line mt-5">
          <span data-strip-head class="block font-display text-monumental text-chalk">
            Arudra 2026
          </span>
        </h2>
        <p class="mt-6 max-w-md text-chalk/60">
          {{ arudra2026.date }} &nbsp;·&nbsp; {{ arudra2026.venue }}
        </p>
      </div>

      <!-- The strip. Pinned on desktop, natively swipeable on touch. -->
      <div
        class="mt-14 w-full overflow-x-auto pb-4 md:overflow-visible"
        role="region"
        aria-label="Arudra 2026 flyers"
        tabindex="0"
      >
        <ul
          ref="track"
          class="flex w-max gap-6 px-6 [scroll-snap-type:x_mandatory] sm:px-10 lg:px-16 md:[scroll-snap-type:none]"
        >
          <li
            v-for="item in items"
            :key="item.src"
            data-flyer
            class="w-[68vw] shrink-0 snap-center gpu sm:w-[42vw] md:w-[26vw] lg:w-[22vw]"
          >
            <NuxtImg
              :src="item.src"
              :alt="item.alt"
              :width="item.w"
              :height="item.h"
              loading="lazy"
              sizes="xs:68vw sm:42vw md:26vw lg:22vw xl:22vw xxl:22vw"
              class="aspect-square w-full bg-stage-raised object-contain"
            />
          </li>
        </ul>
      </div>

      <!-- Progress -->
      <div class="stage-pad mt-10">
        <div class="h-px w-full bg-chalk/12">
          <div ref="bar" class="h-px origin-left bg-spot" style="transform: scaleX(0)" />
        </div>
        <p class="mt-4 text-xs uppercase tracking-rubric text-chalk/55">
          {{ items.length }} announcements
          <span class="md:hidden"> — swipe</span>
          <span class="hidden md:inline"> — keep scrolling</span>
        </p>
      </div>
    </div>
  </section>
</template>
