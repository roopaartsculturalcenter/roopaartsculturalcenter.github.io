<script setup lang="ts">
import { gsap } from 'gsap'

/**
 * Dot plus trailing ring. The ring swells over anything interactive and can
 * carry a one-word label supplied by `data-cursor`.
 *
 * Only mounts for a fine pointer that can hover, and never under reduced motion.
 * The system cursor is restored the instant someone reaches for the keyboard —
 * hiding it from a keyboard user would be taking away the thing they navigate by.
 */
const { reduced } = useMotionPreference()

const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
const label = ref('')
const active = ref(false)

onMounted(() => {
  if (reduced.value) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const html = document.documentElement
  html.classList.add('has-cursor')

  const dx = gsap.quickTo(dot.value, 'x', { duration: 0.12, ease: 'power3.out' })
  const dy = gsap.quickTo(dot.value, 'y', { duration: 0.12, ease: 'power3.out' })
  const rx = gsap.quickTo(ring.value, 'x', { duration: 0.5, ease: 'power3.out' })
  const ry = gsap.quickTo(ring.value, 'y', { duration: 0.5, ease: 'power3.out' })

  const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, [data-cursor]'

  const onMove = (e: PointerEvent) => {
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)

    const hit = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null
    active.value = !!hit
    label.value = hit?.dataset.cursor ?? ''
  }

  // Any keyboard use hands control back to the native cursor and focus ring.
  const onKey = () => html.classList.add('using-keyboard')
  const onPointerDown = () => html.classList.remove('using-keyboard')

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('pointerdown', onPointerDown)

  onScopeDispose(() => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('pointerdown', onPointerDown)
    html.classList.remove('has-cursor', 'using-keyboard')
  })
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[300] hidden [@media(hover:hover)and(pointer:fine)]:block" aria-hidden="true">
    <div
      ref="dot"
      class="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-spot transition-opacity duration-300"
      :class="active && 'opacity-0'"
    />
    <div
      ref="ring"
      class="absolute flex items-center justify-center rounded-full border border-chalk/50 transition-[width,height,margin,background-color,border-color] duration-300 ease-silk"
      :class="active
        ? '-ml-12 -mt-12 h-24 w-24 border-spot/70 bg-spot/10'
        : '-ml-5 -mt-5 h-10 w-10'"
    >
      <span
        class="text-[0.6rem] uppercase tracking-rubric text-spot transition-opacity duration-200"
        :class="active && label ? 'opacity-100' : 'opacity-0'"
      >{{ label }}</span>
    </div>
  </div>
</template>
