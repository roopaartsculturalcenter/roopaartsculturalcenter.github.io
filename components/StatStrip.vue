<script setup lang="ts">
import { stats } from '~/data/about'

/**
 * Counters that tick up once, when the strip scrolls into view.
 * With reduced motion they render at their final value immediately.
 */
const { gsap, withGsap, reduced } = useGsap()

const root = ref<HTMLElement | null>(null)
const shown = ref(stats.map((s) => (s.isStatus ? s.value : 0)))

withGsap(() => {
  const el = root.value
  if (!el) return

  stats.forEach((stat, i) => {
    if (stat.isStatus) return
    const counter = { n: 0 }

    gsap.to(counter, {
      n: stat.value,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => {
        shown.value[i] = Math.round(counter.n)
      },
    })
  })
}, root)

onMounted(() => {
  if (reduced.value) shown.value = stats.map((s) => s.value)
})
</script>

<template>
  <section ref="root" class="on-dark relative overflow-hidden bg-maroon-deep text-ivory">
    <MandalaAccent class="absolute -bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 text-gold/[0.06]" :petals="18" />

    <div class="container-page relative py-16 lg:py-20">
      <dl class="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
        <div v-for="(stat, i) in stats" :key="stat.label" data-reveal class="text-center lg:text-left">
          <dt class="sr-only">{{ stat.label }}</dt>
          <dd>
            <span class="block font-display text-4xl text-gold sm:text-5xl">
              <span class="tabular-nums">{{ shown[i] }}</span><span>{{ stat.suffix }}</span>
            </span>
            <span class="mt-3 block text-sm leading-snug text-ivory/65">{{ stat.label }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
