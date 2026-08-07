import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Smooth scroll, sharing one rAF loop with GSAP.
 *
 * Native scroll always drives — Lenis only smooths the delta it is already
 * given. Nothing here hijacks or redirects the user's scroll.
 *
 * Disabled outright under reduced motion: smoothing IS motion, and taking over
 * the wheel is exactly what that preference asks us not to do.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    // Native momentum on touch beats anything we can emulate, and syncing it
    // fights the browser's own overscroll handling.
    syncTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  // Pins are measured in pixels, so every route change has to re-measure after
  // the new page has laid out — otherwise pin start/end land on stale offsets.
  nuxtApp.hook('page:finish', () => {
    lenis.scrollTo(0, { immediate: true })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
  })

  // Late-loading images change document height and therefore every pin offset.
  if (import.meta.client) {
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
  }

  return { provide: { lenis } }
})
