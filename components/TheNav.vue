<script setup lang="ts">
import { gsap } from 'gsap'
import { site } from '~/data/site'

/**
 * Minimal fixed nav that inverts over whatever is behind it, plus a full-screen
 * overlay menu with staggered link reveals.
 *
 * `mix-blend-mode: difference` is dropped while the overlay is open — blending
 * the menu against itself produces mud, and the overlay is its own surface.
 */
const open = ref(false)
const route = useRoute()
const { reduced } = useMotionPreference()

const panel = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

const links = [
  { label: 'How It Began', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Arudra 2026', to: '/arudra-2026' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Donate', to: '/donate' },
]

watch(() => route.fullPath, () => { open.value = false })

watch(open, async (isOpen) => {
  if (!import.meta.client) return
  document.documentElement.classList.toggle('lenis-stopped', isOpen)

  if (!isOpen) {
    trigger.value?.focus()
    return
  }

  await nextTick()
  const el = panel.value
  if (!el) return
  el.querySelector<HTMLElement>('a')?.focus()

  if (reduced.value) return
  gsap.fromTo(
    el.querySelectorAll('[data-menu-line]'),
    { yPercent: 110 },
    { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 },
  )
})

onScopeDispose(() => {
  if (import.meta.client) document.documentElement.classList.remove('lenis-stopped')
})

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') { open.value = false; return }
  if (e.key !== 'Tab' || !panel.value) return

  const items = [...panel.value.querySelectorAll<HTMLElement>('a[href], button')]
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]

  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}
</script>

<template>
  <div @keydown="onKeydown">
    <header
      class="pointer-events-none fixed inset-x-0 top-0 z-[120]"
      :class="!open && 'mix-blend-difference'"
    >
      <div class="stage-pad flex items-center justify-between py-6 sm:py-8">
        <NuxtLink
          to="/"
          class="pointer-events-auto font-display text-lg tracking-tight text-white sm:text-xl"
          :aria-label="`RACC — ${site.name}, home`"
        >
          RACC
        </NuxtLink>

        <button
          ref="trigger"
          type="button"
          class="pointer-events-auto -mr-2 flex items-center gap-3 px-2 py-2 text-white"
          :aria-expanded="open"
          aria-controls="stage-menu"
          @click="open = !open"
        >
          <span class="rubric text-white">{{ open ? 'Close' : 'Menu' }}</span>
          <span class="relative block h-3 w-6" aria-hidden="true">
            <span
              class="absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ease-curtain"
              :class="open ? 'top-1/2 rotate-45' : 'top-0'"
            />
            <span
              class="absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ease-curtain"
              :class="open ? 'top-1/2 -rotate-45' : 'bottom-0'"
            />
          </span>
        </button>
      </div>
    </header>

    <Transition
      enter-active-class="transition-opacity duration-500 ease-curtain"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-400 ease-curtain"
      leave-to-class="opacity-0"
    >
      <div
        v-show="open"
        id="stage-menu"
        ref="panel"
        class="fixed inset-0 z-[110] flex flex-col justify-center bg-stage-deep"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <nav class="stage-pad">
          <ul>
            <li v-for="link in links" :key="link.to" class="mask-line">
              <NuxtLink
                :to="link.to"
                data-menu-line
                class="block py-1 font-display text-monumental text-chalk transition-colors duration-300 hover:text-spot sm:py-2"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>

          <div class="mt-16 flex flex-wrap gap-x-8 gap-y-3">
            <a
              v-for="s in site.social"
              :key="s.href"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="rubric text-chalk/60 transition-colors hover:text-spot"
            >{{ s.label }}</a>
          </div>
        </nav>
      </div>
    </Transition>
  </div>
</template>
