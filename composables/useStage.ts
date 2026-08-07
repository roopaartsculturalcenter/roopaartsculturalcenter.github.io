import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'

let registered = false

/**
 * The single entry point for scroll choreography.
 *
 * Every scene goes through `scene()`, which owns a GSAP context so a route
 * change reverts all of its tweens and kills its ScrollTriggers. Without that,
 * pinned triggers from a previous page keep measuring and the next page's pins
 * land at the wrong scroll offsets.
 */
export function useStage() {
  if (import.meta.client && !registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText, Flip)
    registered = true
  }

  const { reduced } = useMotionPreference()

  /**
   * Build a scene. `build` receives a helper set; anything it creates is scoped.
   * Skipped entirely under reduced motion — callers pass `fallback` for the
   * simple-fade version of the same scene.
   */
  function scene(
    build: (ctx: gsap.Context) => void,
    options: { scope?: Ref<HTMLElement | null>; fallback?: () => void } = {},
  ) {
    if (import.meta.server) return

    onMounted(() => {
      if (reduced.value) {
        options.fallback?.()
        return
      }

      let ctx: gsap.Context | undefined
      // One frame so fonts and layout settle before ScrollTrigger measures pins.
      const raf = requestAnimationFrame(() => {
        ctx = gsap.context((self) => build(self), options.scope?.value ?? undefined)
      })

      onScopeDispose(() => {
        cancelAnimationFrame(raf)
        ctx?.revert()
      })
    })
  }

  return { gsap, ScrollTrigger, SplitText, Flip, scene, reduced }
}

/**
 * Split an element into masked lines and return the line elements.
 *
 * SplitText is re-run on resize because line breaks change with width; the
 * caller is responsible for rebuilding whatever timeline consumed them.
 */
export function splitLines(el: HTMLElement) {
  const split = new SplitText(el, {
    type: 'lines',
    linesClass: 'split-line',
    // Wrap each line so it can slide up from behind its own mask.
    mask: 'lines',
  })
  return split
}

/**
 * The house reveal: children fade and rise once, on entry.
 * Used for every non-scrubbed section so the rhythm stays consistent.
 */
export function useEntrance(
  root: Ref<HTMLElement | null>,
  options: { selector?: string; stagger?: number; y?: number; start?: string } = {},
) {
  const { gsap, scene } = useStage()
  const { selector = '[data-wipe]', stagger = 0.08, y = 32, start = 'top 85%' } = options

  scene(
    () => {
      const el = root.value
      if (!el) return
      const targets = el.querySelectorAll(selector)
      if (!targets.length) return

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger,
          scrollTrigger: { trigger: el, start, once: true },
          clearProps: 'transform',
        },
      )
    },
    {
      scope: root,
      fallback: () => {
        root.value?.querySelectorAll<HTMLElement>(selector).forEach((n) => {
          n.style.opacity = '1'
          n.style.transform = 'none'
        })
      },
    },
  )
}
