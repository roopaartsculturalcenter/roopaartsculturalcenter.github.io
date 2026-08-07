<script setup lang="ts">
withDefaults(
  defineProps<{
    kicker?: string
    title: string
    lede?: string
    align?: 'left' | 'center'
    /** Heading level — sections below the page <h1> should stay h2. */
    as?: 'h2' | 'h3'
  }>(),
  { align: 'left', as: 'h2' },
)
</script>

<template>
  <div :class="['max-w-prose', align === 'center' && 'mx-auto text-center']">
    <p v-if="kicker" data-reveal class="kicker rule-gold" :class="align === 'center' && 'flex flex-col items-center'">
      {{ kicker }}
    </p>
    <component :is="as" data-reveal class="mt-5 text-display-md">
      {{ title }}
    </component>
    <p v-if="lede" data-reveal class="mt-5 text-lg leading-relaxed opacity-80">
      {{ lede }}
    </p>
  </div>
</template>
