<script setup lang="ts">
/**
 * ACT 6 — Applause.
 *
 * Masonry grid, staggered clip-path wipes on entry, and a lightbox that grows
 * out of the thumbnail it came from using GSAP Flip: the real element is moved
 * to the overlay, so the image the reader clicked is the image that expands —
 * no crossfade between two copies, no flash of a different crop.
 */
import type { GalleryPhoto } from '~/content/gallery'

const props = withDefaults(
  defineProps<{
    photos: GalleryPhoto[]
    heading?: string
    rubric?: string
    limit?: number
    /** Section background, named as EventGrid names it. Defaults to the lighter
     *  stage so /gallery and /arudra are unchanged. */
    tone?: 'stage' | 'deep'
    /** Distinguishes the heading id when a page has more than one gallery. */
    id?: string
  }>(),
  { heading: 'From the stage.', rubric: 'Select any photograph to open it', tone: 'stage', id: 'applause' },
)

const headingId = computed(() => `${props.id}-heading`)

const { gsap, Flip, scene, reduced } = useStage()

const root = ref<HTMLElement | null>(null)
const overlay = ref<HTMLElement | null>(null)
const openIndex = ref<number | null>(null)
let lastFocused: HTMLElement | null = null

const shown = computed(() => (props.limit ? props.photos.slice(0, props.limit) : props.photos))
const current = computed(() => (openIndex.value === null ? null : shown.value[openIndex.value]))

scene(
  () => {
    const el = root.value
    if (!el) return

    gsap.fromTo(
      gsap.utils.toArray<HTMLElement>('[data-frame]', el),
      { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        clearProps: 'clipPath',
      },
    )
  },
  {
    scope: root,
    fallback: () => {
      root.value?.querySelectorAll<HTMLElement>('[data-frame]').forEach((n) => {
        n.style.opacity = '1'
        n.style.clipPath = 'none'
      })
    },
  },
)

async function open(i: number) {
  lastFocused = document.activeElement as HTMLElement
  const thumb = root.value?.querySelectorAll<HTMLElement>('[data-frame] img')[i]
  openIndex.value = i
  document.documentElement.classList.add('lenis-stopped')

  await nextTick()
  const target = overlay.value?.querySelector<HTMLElement>('[data-hero-img]')
  overlay.value?.querySelector<HTMLElement>('[data-close]')?.focus()

  if (reduced.value || !thumb || !target) return

  // Grow from exactly where the thumbnail sits.
  const state = Flip.getState(thumb)
  Flip.fit(target, state, { scale: true, duration: 0 })
  gsap.to(target, { scale: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.inOut' })
  gsap.fromTo(
    overlay.value!.querySelector('[data-scrim]'),
    { opacity: 0 },
    { opacity: 1, duration: 0.4 },
  )
}

function close() {
  openIndex.value = null
  document.documentElement.classList.remove('lenis-stopped')
  lastFocused?.focus()
}

function step(d: number) {
  if (openIndex.value === null) return
  openIndex.value = (openIndex.value + d + shown.value.length) % shown.value.length
}

onScopeDispose(() => {
  if (import.meta.client) document.documentElement.classList.remove('lenis-stopped')
})

function onKeydown(e: KeyboardEvent) {
  if (openIndex.value === null) return
  if (e.key === 'Escape') { e.preventDefault(); close(); return }
  if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return }
  if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return }
  if (e.key !== 'Tab' || !overlay.value) return

  const items = [...overlay.value.querySelectorAll<HTMLElement>('button')]
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}
</script>

<template>
  <section
    ref="root"
    :class="['relative py-28 lg:py-40', tone === 'deep' ? 'bg-stage-deep' : 'bg-stage']"
    :aria-labelledby="headingId"
  >
    <div class="stage-pad">
      <p class="rubric">{{ rubric }}</p>
      <h2 :id="headingId" class="mt-6 font-display text-monumental text-chalk">
        {{ heading }}
      </h2>

      <div class="mt-16 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 lg:gap-5">
        <button
          v-for="(p, i) in shown"
          :key="p.src"
          data-frame
          data-cursor="view"
          type="button"
          class="group relative mb-3 block w-full overflow-hidden bg-stage-raised ring-1 ring-chalk/10 transition-shadow duration-500 hover:shadow-xl sm:mb-4 lg:mb-5"
          @click="open(i)"
        >
          <span class="sr-only">Open photograph {{ i + 1 }} of {{ shown.length }}</span>

          <!-- In colour, not grayscale.
               These are stage photographs of costume and light; desaturating them by
               default threw away the only thing that makes the wall worth looking
               at, and on the light theme the grey read as washed out rather than
               restrained. The hover now lifts rather than reveals. -->
          <NuxtImg
            :src="p.src"
            :alt="p.alt"
            :width="p.width"
            :height="p.height"
            loading="lazy"
            sizes="xs:46vw sm:46vw md:30vw lg:23vw xl:23vw xxl:23vw"
            class="w-full transition-transform duration-700 ease-silk group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="opacity-0"
      >
        <div
          v-if="current"
          ref="overlay"
          class="fixed inset-0 z-[150] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          @keydown="onKeydown"
        >
          <div data-scrim class="absolute inset-0 bg-[#17120F]/97" />

          <div class="relative flex items-center justify-between px-6 py-5 sm:px-10">
            <p class="text-xs tabular-nums tracking-rubric text-chalk/66">
              {{ (openIndex ?? 0) + 1 }} / {{ shown.length }}
            </p>
            <button
              data-close
              type="button"
              class="flex h-11 w-11 items-center justify-center text-chalk transition-colors hover:text-spot-ink"
              @click="close"
            >
              <span class="sr-only">Close viewer</span>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div class="relative flex flex-1 items-center justify-center gap-4 px-4 pb-10 sm:gap-8 sm:px-10">
            <button
              type="button"
              class="flex h-12 w-12 shrink-0 items-center justify-center text-chalk transition-colors hover:text-spot-ink"
              @click="step(-1)"
            >
              <span class="sr-only">Previous photograph</span>
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <NuxtImg
              :key="current.src"
              data-hero-img
              :src="current.src"
              :alt="current.alt"
              :width="current.width"
              :height="current.height"
              sizes="xs:88vw sm:88vw md:80vw lg:72vw xl:72vw xxl:72vw"
              class="max-h-[78svh] w-auto max-w-full object-contain"
            />

            <button
              type="button"
              class="flex h-12 w-12 shrink-0 items-center justify-center text-chalk transition-colors hover:text-spot-ink"
              @click="step(1)"
            >
              <span class="sr-only">Next photograph</span>
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
