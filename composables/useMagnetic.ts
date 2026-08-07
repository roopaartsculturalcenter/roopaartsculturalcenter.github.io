import { gsap } from 'gsap'

/**
 * The magnetic hover effect: an element drifts toward the cursor and springs
 * back on leave.
 *
 * Pointer-based only — it binds nothing on touch devices, where there is no
 * hover state to respond to, and nothing when reduced motion is preferred.
 */
type MagneticTarget = HTMLElement | { $el?: unknown } | null

/** A template ref on a component resolves to its instance, not its element. */
function toElement(target: MagneticTarget): HTMLElement | null {
  if (!target) return null
  if (target instanceof HTMLElement) return target
  const inner = (target as { $el?: unknown }).$el
  return inner instanceof HTMLElement ? inner : null
}

export function useMagnetic(el: Ref<MagneticTarget>, strength = 0.28) {
  const { reduced } = useMotionPreference()

  onMounted(() => {
    const node = toElement(el.value)
    if (!node) return
    if (reduced.value) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const quickX = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'power3.out' })
    const quickY = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      const r = node.getBoundingClientRect()
      quickX((e.clientX - (r.left + r.width / 2)) * strength)
      quickY((e.clientY - (r.top + r.height / 2)) * strength)
    }

    const onLeave = () => {
      quickX(0)
      quickY(0)
    }

    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    // Keyboard users get the focus ring, not the drift; make sure it is centred.
    node.addEventListener('blur', onLeave)

    onScopeDispose(() => {
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
      node.removeEventListener('blur', onLeave)
      gsap.set(node, { x: 0, y: 0 })
    })
  })
}
