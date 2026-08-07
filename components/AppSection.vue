<script setup lang="ts">
/**
 * A page section that reveals its `data-reveal` children on scroll.
 * Wrapping this up keeps the reveal rhythm identical everywhere.
 */
withDefaults(
  defineProps<{
    tone?: 'ivory' | 'dim' | 'dark' | 'maroon'
    /** Vertical rhythm. `tight` for bands, `default` for full sections. */
    size?: 'default' | 'tight'
    labelledby?: string
  }>(),
  { tone: 'ivory', size: 'default' },
)

const root = ref<HTMLElement | null>(null)
useSectionReveal(root)

const TONES = {
  ivory: 'bg-ivory text-ink',
  dim: 'bg-ivory-dim/50 text-ink',
  dark: 'on-dark bg-oxblood text-ivory',
  maroon: 'on-dark bg-maroon-deep text-ivory',
} as const
</script>

<template>
  <section
    ref="root"
    :aria-labelledby="labelledby"
    :class="[TONES[tone], size === 'tight' ? 'py-16 lg:py-20' : 'py-24 lg:py-32', 'relative overflow-hidden']"
  >
    <slot name="decor" />
    <div class="container-page relative">
      <slot />
    </div>
  </section>
</template>
