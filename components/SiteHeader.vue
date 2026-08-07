<script setup lang="ts">
import { site, logo } from '~/data/site'

const open = ref(false)
const route = useRoute()
const scrolled = ref(false)
const panel = ref<HTMLElement | null>(null)
const toggleBtn = ref<HTMLButtonElement | null>(null)

// The header turns opaque once the hero is behind it.
onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 24
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScopeDispose(() => window.removeEventListener('scroll', onScroll))
})

watch(() => route.fullPath, () => {
  open.value = false
})

// Lock the page and trap focus while the drawer is open.
watch(open, async (isOpen) => {
  if (!import.meta.client) return
  document.documentElement.style.overflow = isOpen ? 'hidden' : ''

  if (isOpen) {
    await nextTick()
    panel.value?.querySelector<HTMLElement>('a, button')?.focus()
  } else {
    toggleBtn.value?.focus()
  }
})

onScopeDispose(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return

  if (e.key === 'Escape') {
    open.value = false
    return
  }

  if (e.key !== 'Tab' || !panel.value) return

  const focusable = [
    ...panel.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  ].filter((el) => el.offsetParent !== null)
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
  <header
    class="on-dark fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-500 ease-silk"
    :class="
      scrolled || open
        ? 'bg-oxblood/90 shadow-[0_1px_0_0_rgba(240,168,56,0.18)] backdrop-blur-md'
        : 'bg-gradient-to-b from-oxblood/70 to-transparent'
    "
    @keydown="onKeydown"
  >
    <div class="container-page flex h-[var(--header-h)] items-center justify-between gap-6">
      <NuxtLink to="/" class="shrink-0" :aria-label="`${site.name} — home`">
        <NuxtImg
          :src="logo.light"
          :width="logo.width"
          :height="logo.height"
          alt=""
          sizes="180px"
          preload
          class="h-9 w-auto sm:h-10"
        />
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-9 lg:flex" aria-label="Main">
        <NuxtLink
          v-for="item in site.nav"
          :key="item.to"
          :to="item.to"
          class="group relative py-2 text-sm font-medium tracking-wide text-ivory/85 transition-colors duration-300 hover:text-ivory"
          active-class="text-ivory"
        >
          {{ item.label }}
          <span
            class="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 ease-silk group-hover:scale-x-100"
            :class="route.path.startsWith(item.to) && 'scale-x-100'"
          />
        </NuxtLink>
        <AppButton to="/donate" class="!px-6 !py-2.5">Donate</AppButton>
      </nav>

      <!-- Mobile toggle -->
      <button
        ref="toggleBtn"
        type="button"
        class="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ivory lg:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        @click="open = !open"
      >
        <span class="sr-only">{{ open ? 'Close menu' : 'Open menu' }}</span>
        <span class="relative block h-4 w-6" aria-hidden="true">
          <span
            class="absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-300 ease-silk"
            :class="open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'"
          />
          <span
            class="absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity duration-200"
            :class="open && 'opacity-0'"
          />
          <span
            class="absolute left-0 block h-0.5 w-6 bg-current transition-transform duration-300 ease-silk"
            :class="open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'"
          />
        </span>
      </button>
    </div>

    <!-- Mobile drawer -->
    <Transition
      enter-active-class="transition-[opacity,transform] duration-300 ease-silk"
      enter-from-class="opacity-0 -translate-y-3"
      leave-active-class="transition-[opacity,transform] duration-200 ease-in"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div
        v-show="open"
        id="mobile-nav"
        ref="panel"
        class="border-t border-gold/15 bg-oxblood/95 backdrop-blur-md lg:hidden"
      >
        <nav class="container-page flex flex-col gap-1 py-6" aria-label="Main">
          <NuxtLink
            v-for="item in site.nav"
            :key="item.to"
            :to="item.to"
            class="rounded-xl px-3 py-3.5 font-display text-2xl text-ivory/90 transition-colors hover:bg-ivory/5 hover:text-ivory"
            active-class="text-gold"
          >
            {{ item.label }}
          </NuxtLink>
          <AppButton to="/donate" :magnetic="false" class="mt-4 w-full">Donate</AppButton>
        </nav>
      </div>
    </Transition>
  </header>
</template>
