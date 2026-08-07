<script setup lang="ts">
/**
 * One button, three surfaces. Renders as <NuxtLink> for internal routes,
 * <a> for external URLs, and <button> otherwise — so it is always the right
 * element for the job semantically.
 */
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    variant?: 'gold' | 'outline'
    magnetic?: boolean
    /** Opens in a new tab; rel is set automatically. */
    external?: boolean
  }>(),
  { variant: 'gold', magnetic: true, external: false },
)

const el = ref<any>(null)
if (props.magnetic) useMagnetic(el, 0.22)

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : props.href ? 'a' : 'button'))

const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    const isExternal = props.external || /^https?:/.test(props.href)
    return {
      href: props.href,
      ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    }
  }
  return { type: 'button' as const }
})
</script>

<template>
  <component
    :is="tag"
    ref="el"
    v-bind="attrs"
    :class="variant === 'gold' ? 'btn-gold' : 'btn-outline'"
  >
    <slot />
    <svg
      v-if="href && external !== false && /^https?:/.test(href ?? '')"
      class="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  </component>
</template>
