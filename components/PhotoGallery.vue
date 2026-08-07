<script setup lang="ts">
import type { GalleryPhoto } from '~/data/gallery'

/**
 * Masonry photo grid with a keyboard-accessible lightbox.
 *
 * Each thumbnail is a real <button>, so tab order and Enter/Space come for free.
 * The dialog traps focus, closes on Escape, moves with the arrow keys, and
 * returns focus to the thumbnail that opened it.
 */
const props = withDefaults(
  defineProps<{ photos: GalleryPhoto[]; columns?: string }>(),
  { columns: 'columns-2 sm:columns-3 lg:columns-4' },
)

const root = ref<HTMLElement | null>(null)
useSectionReveal(root, { selector: '[data-photo]', stagger: 0.035, y: 24 })

const openIndex = ref<number | null>(null)
const dialog = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

const current = computed(() =>
  openIndex.value === null ? null : props.photos[openIndex.value],
)

function open(i: number) {
  lastFocused = document.activeElement as HTMLElement
  openIndex.value = i
}

function close() {
  openIndex.value = null
  lastFocused?.focus()
}

function step(delta: number) {
  if (openIndex.value === null) return
  const n = props.photos.length
  openIndex.value = (openIndex.value + delta + n) % n
}

watch(openIndex, async (i) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = i === null ? '' : 'hidden'
  if (i !== null) {
    await nextTick()
    dialog.value?.querySelector<HTMLElement>('[data-close]')?.focus()
  }
})

onScopeDispose(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})

function onDialogKeydown(e: KeyboardEvent) {
  if (openIndex.value === null) return

  switch (e.key) {
    case 'Escape':
      e.preventDefault()
      close()
      return
    case 'ArrowRight':
      e.preventDefault()
      step(1)
      return
    case 'ArrowLeft':
      e.preventDefault()
      step(-1)
      return
  }

  if (e.key !== 'Tab' || !dialog.value) return

  const focusable = [...dialog.value.querySelectorAll<HTMLElement>('button:not([disabled])')]
  if (!focusable.length) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
</script>

<template>
  <div>
    <div ref="root" :class="[columns, 'gap-4 [column-fill:_balance]']">
      <button
        v-for="(photo, i) in photos"
        :key="photo.src"
        data-photo
        type="button"
        class="group mb-4 block w-full overflow-hidden rounded-xl bg-ivory-dim ring-offset-2 ring-offset-ivory transition-shadow duration-500 hover:shadow-[0_18px_50px_-24px_rgba(42,10,14,0.6)]"
        @click="open(i)"
      >
        <span class="sr-only">Open photograph {{ i + 1 }} of {{ photos.length }} in a larger view</span>
        <NuxtImg
          :src="photo.src"
          :alt="photo.alt"
          :width="photo.width"
          :height="photo.height"
          loading="lazy"
          sizes="xs:45vw sm:30vw lg:23vw"
          class="w-full transition-transform duration-700 ease-silk group-hover:scale-[1.05] motion-reduce:transform-none"
        />
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="opacity-0"
      >
        <div
          v-if="current"
          ref="dialog"
          class="on-dark fixed inset-0 z-[100] flex flex-col bg-oxblood/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          @keydown="onDialogKeydown"
        >
          <div class="flex items-center justify-between px-5 py-4 text-ivory sm:px-8">
            <p class="text-sm tabular-nums text-ivory/60">
              {{ (openIndex ?? 0) + 1 }} / {{ photos.length }}
            </p>
            <button
              data-close
              type="button"
              class="flex h-11 w-11 items-center justify-center rounded-full text-ivory transition-colors hover:bg-ivory/10"
              @click="close"
            >
              <span class="sr-only">Close viewer</span>
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div class="flex flex-1 items-center justify-center gap-3 px-3 pb-6 sm:gap-6 sm:px-6">
            <button
              type="button"
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ivory transition-colors hover:bg-ivory/10"
              @click="step(-1)"
            >
              <span class="sr-only">Previous photograph</span>
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <NuxtImg
              :key="current.src"
              :src="current.src"
              :alt="current.alt"
              :width="current.width"
              :height="current.height"
              :sizes="SIZES_LIGHTBOX"
              class="max-h-[78svh] w-auto max-w-full rounded-lg object-contain"
            />

            <button
              type="button"
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-ivory transition-colors hover:bg-ivory/10"
              @click="step(1)"
            >
              <span class="sr-only">Next photograph</span>
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
