<script setup lang="ts">
/**
 * The shared inner-page hero: a shorter, parallaxing version of the homepage
 * hero with a single background photograph.
 */
const props = withDefaults(
  defineProps<{
    kicker?: string
    title: string
    lede?: string
    image?: string
    imageAlt?: string
  }>(),
  { imageAlt: '' },
)

const { gsap, withGsap } = useGsap()
const root = ref<HTMLElement | null>(null)
const bg = ref<HTMLElement | null>(null)

withGsap(() => {
  const el = root.value
  if (!el) return

  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(el.querySelectorAll('[data-hero-line]'), { yPercent: 115, duration: 1, stagger: 0.1 })
    .from(el.querySelectorAll('[data-hero-fade]'), { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, '-=0.6')

  if (props.image && bg.value) {
    gsap.to(bg.value, {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
  }
}, root)
</script>

<template>
  <section
    ref="root"
    class="on-dark relative isolate flex min-h-[58svh] items-end overflow-hidden bg-oxblood text-ivory sm:min-h-[64svh]"
  >
    <div v-if="image" ref="bg" class="absolute inset-0 -z-10 will-change-transform">
      <NuxtImg
        :src="image"
        :alt="imageAlt"
        width="1600"
        height="900"
        :sizes="SIZES_FULL_BLEED"
        preload
        fetchpriority="high"
        class="h-full w-full object-cover"
      />
    </div>

    <div
      class="absolute inset-0 -z-10 bg-gradient-to-t from-oxblood via-oxblood/80 to-oxblood/45"
      aria-hidden="true"
    />

    <MandalaAccent
      class="absolute -right-20 top-8 -z-10 h-72 w-72 text-gold/[0.08] lg:h-[26rem] lg:w-[26rem]"
      :petals="20"
      spin
    />

    <div class="container-page relative pb-16 pt-32 sm:pb-20 lg:pb-24">
      <p v-if="kicker" data-hero-fade class="kicker">{{ kicker }}</p>

      <h1 class="mt-6 max-w-4xl text-display-lg text-shadow-hero">
        <span class="block overflow-hidden pb-[0.1em]">
          <span data-hero-line class="block">{{ title }}</span>
        </span>
      </h1>

      <p v-if="lede" data-hero-fade class="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
        {{ lede }}
      </p>

      <slot name="actions" />
    </div>
  </section>
</template>
