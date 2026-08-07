<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Route changes wipe with a curtain panel rather than cross-fading.
 *
 * GSAP drives it through Vue's JS transition hooks so the outgoing page is not
 * torn down until the panel has covered the screen. `done()` is always called —
 * a transition hook that never resolves leaves the router stuck forever.
 */
const { reduced } = useMotionPreference()
const panel = ref<HTMLElement | null>(null)

function onLeave(_el: Element, done: () => void) {
  if (reduced.value || !panel.value) return done()

  gsap.fromTo(
    panel.value,
    { xPercent: -100 },
    { xPercent: 0, duration: 0.5, ease: 'power3.inOut', onComplete: done },
  )
}

function onEnter(_el: Element, done: () => void) {
  if (reduced.value || !panel.value) return done()

  // Every pin was measured against the previous page's height.
  ScrollTrigger.refresh()

  gsap.to(panel.value, {
    xPercent: 100,
    duration: 0.55,
    ease: 'power3.inOut',
    onComplete: () => {
      gsap.set(panel.value, { xPercent: -100 })
      ScrollTrigger.refresh()
      done()
    },
  })
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage
        :transition="{
          mode: 'out-in',
          css: false,
          onLeave,
          onEnter,
        }"
      />
    </NuxtLayout>

    <!-- The wipe panel, parked off-stage left. -->
    <div
      ref="panel"
      class="pointer-events-none fixed inset-0 z-[250] -translate-x-full bg-stage-deep"
      aria-hidden="true"
    />

    <TheCursor />
  </div>
</template>
