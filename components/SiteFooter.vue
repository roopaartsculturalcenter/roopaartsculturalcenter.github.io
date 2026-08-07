<script setup lang="ts">
import { site, logo } from '~/data/site'

const year = new Date().getFullYear()

const explore = [
  { label: 'About', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Arudra 2026', to: '/arudra-2026' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Donate', to: '/donate' },
]
</script>

<template>
  <footer class="on-dark relative overflow-hidden bg-oxblood text-ivory">
    <MandalaAccent
      class="absolute -right-24 -top-28 h-80 w-80 text-gold/[0.07] sm:h-96 sm:w-96"
      :petals="20"
      spin
    />

    <div class="container-page relative py-20 lg:py-24">
      <div class="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <NuxtImg
            :src="logo.light"
            :width="logo.width"
            :height="logo.height"
            :alt="site.name"
            sizes="220px"
            loading="lazy"
            class="h-11 w-auto"
          />
          <p class="mt-6 max-w-sm text-sm leading-relaxed text-ivory/70">
            {{ site.description }}
          </p>
          <address class="mt-6 not-italic text-sm text-ivory/70">
            <p>{{ site.location }}</p>
            <p class="mt-1">
              <a
                :href="`mailto:${site.email}`"
                class="underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold"
              >{{ site.email }}</a>
            </p>
          </address>
        </div>

        <nav aria-label="Footer">
          <h2 class="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-gold">Explore</h2>
          <ul class="mt-6 space-y-3.5 text-sm">
            <li v-for="item in explore" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="text-ivory/75 transition-colors duration-300 hover:text-gold"
              >{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <div>
          <h2 class="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-gold">Follow</h2>
          <ul class="mt-6 space-y-3.5 text-sm">
            <li v-for="link in site.social" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-ivory/75 transition-colors duration-300 hover:text-gold"
              >
                {{ link.label }}
                <svg
                  class="h-3 w-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </li>
          </ul>

          <AppButton to="/donate" :magnetic="false" class="mt-8 !px-6 !py-3 text-xs">
            Donate via Zelle
          </AppButton>
        </div>
      </div>

      <div
        class="mt-16 flex flex-col gap-3 border-t border-ivory/10 pt-8 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} {{ site.name }}. A {{ site.status }}.</p>
        <p>All donations are tax-deductible to the extent allowed by law.</p>
      </div>
    </div>
  </footer>
</template>
