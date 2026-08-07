/**
 * Reduced-motion-safe variants for @vueuse/motion's `v-motion` directive.
 *
 * @vueuse/motion does not consult prefers-reduced-motion on its own, so binding
 * variants directly would animate for everyone. These helpers return an empty
 * object when motion is not wanted, which makes the directive a no-op and leaves
 * the element in its natural state.
 */
export function useMotionPreset() {
  const { reduced } = useMotionPreference()

  /** Fade and rise into place on mount. */
  const rise = (delay = 0, y = 28) =>
    computed(() =>
      reduced.value
        ? {}
        : {
            initial: { opacity: 0, y },
            enter: { opacity: 1, y: 0, transition: { duration: 700, delay, ease: [0.22, 1, 0.36, 1] } },
          },
    )

  /** A settle-in for cards: slight lift plus a touch of scale. */
  const settle = (delay = 0) =>
    computed(() =>
      reduced.value
        ? {}
        : {
            initial: { opacity: 0, y: 36, scale: 0.98 },
            enter: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 800, delay, ease: [0.22, 1, 0.36, 1] },
            },
          },
    )

  /** Fires when the element scrolls into view rather than on mount. */
  const riseOnVisible = (delay = 0) =>
    computed(() =>
      reduced.value
        ? {}
        : {
            initial: { opacity: 0, y: 24 },
            visibleOnce: {
              opacity: 1,
              y: 0,
              transition: { duration: 650, delay, ease: [0.22, 1, 0.36, 1] },
            },
          },
    )

  return { rise, settle, riseOnVisible, reduced }
}
