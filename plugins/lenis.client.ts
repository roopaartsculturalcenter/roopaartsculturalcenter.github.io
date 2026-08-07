import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

/**
 * Smooth scrolling, wired into GSAP's ticker so ScrollTrigger and Lenis share
 * one rAF loop rather than each running their own.
 *
 * Disabled outright when the user prefers reduced motion — smooth scroll is a
 * motion effect like any other, and hijacking the scroll wheel is exactly what
 * that preference is asking us not to do.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    smoothWheel: true,
    // Native momentum scrolling on touch is better than anything we can emulate.
    syncTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const onTick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(onTick)
  gsap.ticker.lagSmoothing(0)

  // Route changes must reset scroll position and re-measure every trigger.
  nuxtApp.hook('page:finish', () => {
    lenis.scrollTo(0, { immediate: true })
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })

  nuxtApp.hook('app:beforeMount', () => {
    ScrollTrigger.refresh()
  })

  return {
    provide: { lenis },
  }
})
