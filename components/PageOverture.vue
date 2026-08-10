<script setup lang="ts">
/**
 * The inner-page opening — the home hero's composition, on every route.
 *
 * Same parts in the same places: ink headline left on a narrow measure over a
 * light wash, the page's photograph framed in the torana arch to the right, the
 * mandala ring turning behind it.
 *
 * The arch here is the shared `.arch` clip-path, NOT the home hero's WebGL shader.
 * The shader pulls in three.js, which `nuxt.config` deliberately keeps off the
 * critical path for one route — putting it on all five would cost every page ~115KB
 * to draw a silhouette CSS already gives for free. Same shape, same mark, no bundle.
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
        yPercent: 12,
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
  <!-- Shorter than the home hero's full 100svh: these pages have content to get to,
       and a full viewport of header on every route buries it. -->
  <section
    ref="root"
    class="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-stage"
  >
    <!-- Ring sits behind the arch, offset to the same side. -->
    <div
      class="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 lg:left-[70%]"
      aria-hidden="true"
    >
      <TheMandalaRing size="h-[78vmin] w-[78vmin]" />
    </div>

    <!-- The photograph, arch-framed, right of the type on landscape and centred
         behind it on a phone — exactly how the home hero places it. -->
    <div
      v-if="image"
      ref="bg"
      class="pointer-events-none absolute inset-y-0 right-0 z-[1] flex w-full items-center justify-center gpu lg:w-[56%] lg:justify-start"
      aria-hidden="true"
    >
      <NuxtImg
        :src="image"
        alt=""
        width="1200"
        height="1400"
        sizes="xs:72vw sm:60vw md:58vw lg:48vw xl:44vw xxl:44vw"
        preload
        fetchpriority="high"
        class="arch h-[74%] w-[74%] max-w-xl object-cover sm:w-[58%] lg:w-[82%]"
      />
    </div>

    <!-- Light wash: ink type over a dark stage photograph is unreadable, so page
         colour is carried under the text and faded out to the right. Painted above
         the image and below the type. -->
    <div
      class="pointer-events-none absolute inset-y-0 left-0 z-[2] w-full bg-gradient-to-r from-stage via-stage/88 to-transparent lg:w-[72%]"
      aria-hidden="true"
    />

    <div class="stage-pad relative z-10 py-28 lg:py-32">
      <p v-if="rubric" data-over-fade class="rubric mb-7">{{ rubric }}</p>

      <h1
        ref="heading"
        data-split
        class="max-w-3xl font-display text-monumental text-chalk lg:max-w-[42rem] lg:text-[clamp(3rem,6.6vw,6.5rem)]"
      >
        {{ title }}
      </h1>

      <p v-if="lede" data-over-fade class="mt-8 max-w-xl text-lg leading-relaxed text-chalk/78">
        {{ lede }}
      </p>
    </div>
  </section>
</template>
