<script setup lang="ts">
/**
 * The turning mandala ring.
 *
 * Extracted from the home hero so inner-page headers carry the same mark from one
 * definition rather than a copy that drifts. Decorative only — always aria-hidden,
 * and it inherits `animate-ring-turn`, which reduced motion already flattens.
 */
withDefaults(defineProps<{ size?: string }>(), { size: 'h-[85vmin] w-[85vmin]' })
</script>

<template>
  <svg
    viewBox="0 0 200 200"
    :class="['animate-ring-turn text-spot-dim/40', size]"
    fill="none"
    aria-hidden="true"
  >
    <g stroke="currentColor" stroke-width="0.35">
      <circle cx="100" cy="100" r="92" />
      <circle cx="100" cy="100" r="78" opacity="0.5" />
      <g v-for="i in 36" :key="i" :transform="`rotate(${(360 / 36) * i} 100 100)`">
        <line x1="100" y1="8" x2="100" y2="18" />
      </g>
    </g>
  </svg>
</template>
