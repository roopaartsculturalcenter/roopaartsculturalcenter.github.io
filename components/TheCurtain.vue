<script setup lang="ts">
import { gsap } from 'gsap'

/**
 * ACT 0 — the curtain.
 *
 * A mandala mark draws itself in stroke, then two panels slide apart to reveal
 * the hero. Runs once per session.
 *
 * Deliberately an *overlay* over an already-rendered hero rather than a gate in
 * front of it: Chrome's LCP does not account for occlusion, so the hero heading
 * still registers its true paint time and the curtain costs us nothing on LCP.
 */
const emit = defineEmits<{ done: [] }>()

const SESSION_KEY = 'racc:curtain-seen'

const { reduced } = useMotionPreference()
const root = ref<HTMLElement | null>(null)
const visible = ref(false)

let tl: gsap.core.Timeline | undefined

function finish() {
  emit('done')
  visible.value = false
  document.documentElement.classList.remove('lenis-stopped')
}

/** Any input skips the rest of the curtain. */
function skip() {
  if (!tl) return finish()
  tl.progress(1)
}

/**
 * On a constrained connection the curtain is the wrong trade.
 *
 * Measured: it is worth ~0.8s of Largest Contentful Paint on a throttled phone,
 * because the hero's paint as the largest element is deferred until the panels
 * open. Someone on a slow link or in data-saver mode wants the content, not the
 * flourish — so they get the content.
 */
function connectionCanAfford() {
  const c = (navigator as { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (!c) return true
  if (c.saveData) return false
  return !['slow-2g', '2g', '3g'].includes(c.effectiveType ?? '')
}

onMounted(() => {
  const seen = sessionStorage.getItem(SESSION_KEY)

  if (seen || reduced.value || !connectionCanAfford()) {
    finish()
    return
  }

  sessionStorage.setItem(SESSION_KEY, '1')
  visible.value = true
  // Hold scroll for the 1.4s the curtain owns; released in onComplete.
  document.documentElement.classList.add('lenis-stopped')

  nextTick(() => {
    const el = root.value
    if (!el) return finish()

    const strokes = el.querySelectorAll<SVGPathElement>('[data-draw]')
    const panels = el.querySelectorAll<HTMLElement>('[data-curtain-panel]')
    const mark = el.querySelector('[data-mark]')

    tl = gsap.timeline({ onComplete: finish })

    tl.set(strokes, { strokeDasharray: (i, t) => t.getTotalLength?.() ?? 400 })
      .fromTo(
        strokes,
        { strokeDashoffset: (i, t) => t.getTotalLength?.() ?? 400 },
        { strokeDashoffset: 0, duration: 0.52, ease: 'power2.inOut', stagger: 0.04 },
      )
      .to(mark, { opacity: 0, scale: 1.08, duration: 0.3, ease: 'power2.in' }, '+=0.08')
      .to(
        panels,
        {
          xPercent: (i) => (i === 0 ? -100 : 100),
          duration: 0.62,
          ease: 'expo.inOut',
        },
        '-=0.1',
      )

    window.addEventListener('pointerdown', skip, { once: true })
    window.addEventListener('keydown', skip, { once: true })
    window.addEventListener('wheel', skip, { once: true, passive: true })
  })
})

onScopeDispose(() => {
  tl?.kill()
  window.removeEventListener('pointerdown', skip)
  window.removeEventListener('keydown', skip)
  window.removeEventListener('wheel', skip)
  document.documentElement.classList.remove('lenis-stopped')
})
</script>

<template>
  <div
    v-if="visible"
    ref="root"
    class="pointer-events-none fixed inset-0 z-[200]"
    aria-hidden="true"
  >
    <!-- Two halves of the curtain -->
    <div data-curtain-panel class="absolute inset-y-0 left-0 w-1/2 bg-stage-deep gpu" />
    <div data-curtain-panel class="absolute inset-y-0 right-0 w-1/2 bg-stage-deep gpu" />

    <!-- The mark that draws itself -->
    <div data-mark class="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 200 200" class="h-28 w-28 sm:h-36 sm:w-36" fill="none">
        <g stroke="#D4A017" stroke-width="1.1" stroke-linecap="round">
          <circle data-draw cx="100" cy="100" r="52" />
          <circle data-draw cx="100" cy="100" r="34" opacity="0.65" />
          <g v-for="i in 8" :key="i" :transform="`rotate(${(360 / 8) * i} 100 100)`">
            <path data-draw d="M100 30 C112 56, 112 72, 100 92 C88 72, 88 56, 100 30 Z" />
          </g>
          <circle data-draw cx="100" cy="100" r="7" />
        </g>
      </svg>
    </div>
  </div>
</template>
