<script setup lang="ts">
import { gsap } from 'gsap'
import { logo, site } from '~/data/site'

/**
 * Persistent nav: the four sections plus a visually distinct Donate button.
 *
 * Donate is deliberately not a nav link — it is the only primary action in the
 * chrome, so it is filled gold while everything else stays quiet text.
 *
 * The bar carries no blend mode. `mix-blend-difference` was how the dark theme
 * stayed legible over an unknown backdrop, but on a light ground it inverts the
 * page colour to near-black and the chrome reads as a dark smear over white. The
 * light theme gets contrast from an actual backdrop instead.
 */
const open = ref(false)
const route = useRoute()
const { reduced } = useMotionPreference()

/**
 * Past the hero the bar takes a solid backdrop.
 *
 * This is what stops headings sliding *underneath* the lockup — two sets of words
 * in the same place, both readable, which is what the overlap looked like. The
 * bar also tightens as it lands, so it covers less.
 *
 * Over the hero it is transparent: the top of the hero is page colour on the
 * light theme, so the ink lockup already reads there without help.
 */
const scrolled = ref(false)

onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 64 }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScopeDispose(() => window.removeEventListener('scroll', onScroll))
})

const panel = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

// One nav list, shared by the header and the overlay, from the single site file.
const links = site.nav

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
      class="pointer-events-none fixed inset-x-0 top-0 z-[120] transition-colors duration-500 ease-silk"
      :class="!open && scrolled && 'border-b border-chalk/12 bg-stage/92 backdrop-blur-md'"
    >
      <div
        class="stage-pad flex items-center justify-between transition-all duration-500 ease-silk"
        :class="scrolled ? 'py-4' : 'py-6 sm:py-8'"
      >
        <!-- `logo.dark` is the full-colour lockup — brown wordmark, gold mark —
             which is the variant meant for light grounds. The white-on-transparent
             one it replaced is invisible here.

             A plain <img>, not NuxtImg: the asset is 28KB and appears in the
             chrome of every route, so there is nothing for the optimizer to save
             and no reason to route site-wide furniture through ipx. -->
        <NuxtLink
          to="/"
          class="pointer-events-auto"
          :aria-label="`${site.name}, home`"
        >
          <img
            :src="logo.dark"
            :width="logo.width"
            :height="logo.height"
            alt=""
            decoding="async"
            class="w-auto transition-all duration-500 ease-silk"
            :class="scrolled ? 'h-6 sm:h-7' : 'h-7 sm:h-9'"
          >
        </NuxtLink>

        <div class="flex items-center gap-6 sm:gap-8">
          <nav class="hidden items-center gap-8 lg:flex" aria-label="Main">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="pointer-events-auto text-sm text-chalk/75 transition-colors duration-300 hover:text-chalk"
              active-class="text-chalk"
            >{{ link.label }}</NuxtLink>
          </nav>

          <NuxtLink
            :to="site.donateTo"
            data-cursor="donate"
            class="pointer-events-auto bg-spot px-5 py-2.5 text-[0.62rem] font-semibold uppercase tracking-rubric text-chalk transition-colors duration-500 hover:bg-spot-warm sm:px-6 sm:py-3"
          >Donate</NuxtLink>

        <button
          ref="trigger"
          type="button"
          class="pointer-events-auto -mr-2 flex items-center gap-3 px-2 py-2 text-chalk lg:hidden"
          :aria-expanded="open"
          aria-controls="stage-menu"
          @click="open = !open"
        >
          <span class="sr-only">{{ open ? 'Close menu' : 'Open menu' }}</span>
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
        class="fixed inset-0 z-[110] flex flex-col justify-center bg-stage-deep lg:hidden"
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
                class="block py-1 font-display text-monumental text-chalk transition-colors duration-300 hover:text-spot-ink sm:py-2"
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
              class="rubric text-chalk/74 transition-colors hover:text-spot-ink"
            >{{ s.label }}</a>
          </div>
        </nav>
      </div>
    </Transition>
  </div>
</template>
