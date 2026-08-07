<script setup lang="ts">
/**
 * The inner-page opening: the same masked line reveal and parallax as the home
 * hero, at a shorter height. Keeps every route feeling like the same production.
 */
const props = withDefaults(
  defineProps<{ rubric?: string; title: string; lede?: string; image?: string }>(),
  {},
)

const { gsap, SplitText, scene } = useStage()

const root = ref<HTMLElement | null>(null)
const bg = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)

scene(
  () => {
    const el = root.value
    const h = heading.value
    if (!el || !h) return

    const split = new SplitText(h, { type: 'lines', mask: 'lines' })
    gsap.set(h, { opacity: 1 })

    gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .from(split.lines, { yPercent: 115, duration: 1.15, stagger: 0.1 })
      .from(el.querySelectorAll('[data-over-fade]'), { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, '-=0.75')

    if (props.image && bg.value) {
      gsap.to(bg.value, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    }
  },
  {
    scope: root,
    fallback: () => {
      if (heading.value) heading.value.style.opacity = '1'
      root.value?.querySelectorAll<HTMLElement>('[data-over-fade]').forEach((n) => {
        n.style.opacity = '1'
      })
    },
  },
)
</script>

<template>
  <section
    ref="root"
    class="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-stage"
  >
    <div v-if="image" ref="bg" class="absolute inset-0 -z-10 gpu">
      <NuxtImg
        :src="image"
        alt=""
        width="1600"
        height="900"
        :sizes="SIZES_FULL_BLEED"
        preload
        fetchpriority="high"
        class="h-full w-full object-cover opacity-40"
      />
    </div>
    <div class="absolute inset-0 -z-10 bg-gradient-to-t from-stage via-stage/80 to-stage/40" aria-hidden="true" />

    <div class="stage-pad relative pb-20 pt-40 lg:pb-28">
      <p v-if="rubric" data-over-fade class="rubric mb-7">{{ rubric }}</p>

      <h1 ref="heading" data-split class="max-w-4xl font-display text-monumental text-chalk">
        {{ title }}
      </h1>

      <p v-if="lede" data-over-fade class="mt-8 max-w-xl text-lg leading-relaxed text-chalk/65">
        {{ lede }}
      </p>
    </div>
  </section>
</template>
