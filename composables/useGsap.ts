import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

/**
 * Client-only GSAP access with a scoped context.
 *
 * `ctx` collects every tween created inside it so unmounting a page reverts all
 * of them — without this, ScrollTriggers from a previous route keep firing and
 * leak memory on navigation.
 */
export function useGsap() {
  if (import.meta.client && !registered) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }

  const { reduced } = useMotionPreference()

  /**
   * Run `build` inside a GSAP context once the DOM is ready, skipping entirely
   * when the user prefers reduced motion.
   */
  function withGsap(build: (ctx: gsap.Context) => void, scope?: Ref<HTMLElement | null>) {
    if (import.meta.server) return

    onMounted(() => {
      if (reduced.value) return

      let ctx: gsap.Context | undefined
      // Wait a frame so fonts/layout settle before ScrollTrigger measures positions.
      const raf = requestAnimationFrame(() => {
        ctx = gsap.context((self) => build(self), scope?.value ?? undefined)
        ScrollTrigger.refresh()
      })

      onScopeDispose(() => {
        cancelAnimationFrame(raf)
        ctx?.revert()
      })
    })
  }

  return { gsap, ScrollTrigger, withGsap, reduced }
}

/**
 * The standard section reveal: children fade and rise as the section enters view.
 * Used by nearly every section so the rhythm is consistent site-wide.
 */
export function useSectionReveal(
  root: Ref<HTMLElement | null>,
  options: { selector?: string; stagger?: number; y?: number; start?: string } = {},
) {
  const { gsap, withGsap } = useGsap()
  const { selector = '[data-reveal]', stagger = 0.09, y = 32, start = 'top 82%' } = options

  withGsap(() => {
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
        duration: 0.85,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start, once: true },
        // Clear the transform so hover effects are not fighting it, but leave the
        // inline opacity in place — it is what keeps the element visible against
        // the `.js-motion [data-reveal]` resting rule.
        clearProps: 'transform',
      },
    )
  }, root)
}
