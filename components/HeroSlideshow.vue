<script setup lang="ts">
import { heroSlides } from '~/data/gallery'

/**
 * Full-screen hero: a slow crossfade between stage photographs, each drifting
 * with a Ken Burns push, plus a parallax offset driven by scroll.
 *
 * Under reduced motion the slideshow holds on the first photograph — no
 * crossfade, no zoom, no parallax.
 */
const { gsap, withGsap, reduced } = useGsap()

const root = ref<HTMLElement | null>(null)
const layers = ref<HTMLElement | null>(null)
const active = ref(0)

const HOLD = 6500

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (reduced.value || heroSlides.length < 2) return
  timer = setInterval(() => {
    active.value = (active.value + 1) % heroSlides.length
  }, HOLD)
})

// Pause the slideshow while the tab is hidden — no point burning frames.
onMounted(() => {
  const onVisibility = () => {
    if (document.hidden) {
      clearInterval(timer)
      timer = undefined
    } else if (!timer && !reduced.value && heroSlides.length > 1) {
      timer = setInterval(() => {
        active.value = (active.value + 1) % heroSlides.length
      }, HOLD)
    }
  }
  document.addEventListener('visibilitychange', onVisibility)
  onScopeDispose(() => document.removeEventListener('visibilitychange', onVisibility))
})

onScopeDispose(() => clearInterval(timer))

// Hero entrance + scroll parallax.
withGsap(() => {
  const el = root.value
  if (!el) return

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.from(el.querySelectorAll('[data-hero-line]'), {
    yPercent: 115,
    duration: 1.15,
    stagger: 0.11,
  })
    .from(el.querySelectorAll('[data-hero-fade]'), {
      opacity: 0,
      y: 24,
      duration: 0.9,
      stagger: 0.12,
    }, '-=0.65')
    .from(el.querySelector('[data-hero-hint]'), { opacity: 0, duration: 0.6 }, '-=0.3')

  // Background drifts slower than the page; text drifts faster.
  gsap.to(layers.value, {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
  })

  gsap.to(el.querySelector('[data-hero-content]'), {
    yPercent: -12,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
  })
}, root)
</script>

<template>
  <section
    ref="root"
    class="on-dark relative isolate flex min-h-[100svh] items-end overflow-hidden bg-oxblood text-ivory"
    aria-label="Introduction"
  >
    <!-- Photographs -->
    <div ref="layers" class="absolute inset-0 -z-10 will-change-transform">
      <div
        v-for="(slide, i) in heroSlides"
        :key="slide.src"
        class="absolute inset-0 transition-opacity duration-[2200ms] ease-silk"
        :style="{ opacity: active === i ? 1 : 0 }"
        aria-hidden="true"
      >
        <NuxtImg
          :src="slide.src"
          :alt="i === 0 ? slide.alt : ''"
          :preload="i === 0"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'auto'"
          :sizes="SIZES_FULL_BLEED"
          class="h-full w-full object-cover motion-safe:animate-kenburns"
          :class="active === i ? '' : 'motion-safe:[animation-play-state:paused]'"
          width="1600"
          height="900"
        />
      </div>
    </div>

    <!-- Legibility scrim: heavier at the bottom where the text sits -->
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-t from-oxblood via-oxblood/70 to-oxblood/35"
      aria-hidden="true"
    />
    <div
      class="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_100%,rgba(74,18,32,0.65),transparent)]"
      aria-hidden="true"
    />

    <MandalaAccent
      class="absolute -left-20 top-24 -z-10 h-72 w-72 text-gold/[0.09] sm:h-96 sm:w-96 lg:left-auto lg:right-[-6rem] lg:top-16 lg:h-[34rem] lg:w-[34rem]"
      :petals="24"
      spin
    />

    <div data-hero-content class="container-page relative pb-24 pt-36 sm:pb-28 lg:pb-32">
      <p data-hero-fade class="kicker">
        Sugar Land, Texas · 501(c)(3) Nonprofit
      </p>

      <h1 class="mt-7 max-w-5xl text-display-xl text-shadow-hero">
        <span class="block overflow-hidden pb-[0.12em]">
          <span data-hero-line class="block">Roopa Arts</span>
        </span>
        <span class="block overflow-hidden pb-[0.12em]">
          <span data-hero-line class="block">Cultural Center</span>
        </span>
      </h1>

      <p data-hero-fade class="mt-8 max-w-xl text-lg leading-relaxed text-ivory/85 sm:text-xl">
        Where the classical arts of India take the stage — and the whole community gathers
        to experience them.
      </p>

      <div data-hero-fade class="mt-10 flex flex-wrap items-center gap-4">
        <AppButton to="/events">Upcoming Events</AppButton>
        <AppButton to="/donate" variant="outline">Support Our Mission</AppButton>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div
      data-hero-hint
      class="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      aria-hidden="true"
    >
      <span class="flex flex-col items-center gap-2 text-ivory/50">
        <span class="text-[0.65rem] font-semibold uppercase tracking-[0.28em]">Scroll</span>
        <svg
          class="h-5 w-5 motion-safe:animate-scroll-hint" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </span>
    </div>
  </section>
</template>
