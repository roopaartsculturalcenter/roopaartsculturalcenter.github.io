<script setup lang="ts">
/**
 * A kolam-inspired decorative motif: concentric rings of petals over a dotted
 * grid, the way a kolam is drawn around a lattice of points.
 *
 * Purely decorative — aria-hidden, and it never carries meaning that is not also
 * in the text beside it.
 */
withDefaults(
  defineProps<{
    /** Petal count for the outer ring. Higher reads finer. */
    petals?: number
    spin?: boolean
  }>(),
  { petals: 16, spin: false },
)

const RING = 44
</script>

<template>
  <svg
    viewBox="0 0 200 200"
    fill="none"
    aria-hidden="true"
    focusable="false"
    :class="['pointer-events-none select-none', spin && 'motion-safe:animate-spin-slow']"
  >
    <g stroke="currentColor" stroke-width="0.75" opacity="0.9">
      <!-- Outer petal ring -->
      <g v-for="i in petals" :key="`p${i}`" :transform="`rotate(${(360 / petals) * i} 100 100)`">
        <path d="M100 22 C112 44, 112 58, 100 74 C88 58, 88 44, 100 22 Z" />
      </g>

      <!-- Inner petal ring, offset by half a step so the two interleave -->
      <g
        v-for="i in Math.round(petals / 2)"
        :key="`q${i}`"
        :transform="`rotate(${(360 / Math.round(petals / 2)) * i + 360 / petals} 100 100)`"
      >
        <path d="M100 62 C107 74, 107 82, 100 92 C93 82, 93 74, 100 62 Z" />
      </g>

      <circle cx="100" cy="100" :r="RING" opacity="0.5" />
      <circle cx="100" cy="100" :r="RING - 8" opacity="0.35" />
      <circle cx="100" cy="100" r="9" />
    </g>

    <!-- The kolam dot lattice -->
    <g fill="currentColor" opacity="0.55">
      <circle v-for="i in 12" :key="`d${i}`" cx="100" cy="16" r="1.5"
        :transform="`rotate(${(360 / 12) * i} 100 100)`" />
    </g>
  </svg>
</template>
