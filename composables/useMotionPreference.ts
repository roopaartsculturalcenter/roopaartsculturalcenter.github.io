/**
 * Single source of truth for "should we animate?".
 *
 * Every GSAP timeline, ScrollTrigger, Lenis instance, and hover effect asks this
 * first. It reacts live, so a user toggling the OS setting does not have to reload.
 */
export function useMotionPreference() {
  const reduced = useState('prefers-reduced-motion', () => false)

  onMounted(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = mq.matches

    const onChange = (e: MediaQueryListEvent) => {
      reduced.value = e.matches
    }
    mq.addEventListener('change', onChange)
    onScopeDispose(() => mq.removeEventListener('change', onChange))
  })

  return { reduced: readonly(reduced) }
}
