<script setup lang="ts">
import { gsap } from 'gsap'
import { site } from '~/data/site'

/**
 * The footer: an oversized outlined call that fills with gold on hover, a
 * velocity-reactive marquee, and social links whose underlines draw in.
 */
const { reduced } = useMotionPreference()

const year = new Date().getFullYear()
const marqueeWords = ['Arudra', 'Concerts', 'Workshops', 'Margazhi', 'Jugalbandi', 'Golu']

const marquee = ref<HTMLElement | null>(null)

// The marquee leans with scroll velocity, the same tic as the filmstrip.
onMounted(() => {
  if (reduced.value || !marquee.value) return

  let last = window.scrollY
  const skewTo = gsap.quickTo(marquee.value, 'skewX', { duration: 0.6, ease: 'power3.out' })

  const onScroll = () => {
    const dy = window.scrollY - last
    last = window.scrollY
    skewTo(gsap.utils.clamp(-6, 6, dy / 8))
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScopeDispose(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <footer class="relative overflow-hidden border-t border-chalk/10 bg-stage">
    <!-- Marquee -->
    <div ref="marquee" class="gpu overflow-hidden border-b border-chalk/10 py-6">
      <div class="flex w-max animate-marquee">
        <ul v-for="pass in 2" :key="pass" class="flex shrink-0" :aria-hidden="pass === 2">
          <li
            v-for="word in marqueeWords"
            :key="`${pass}-${word}`"
            class="flex items-center gap-8 px-8 font-display text-2xl text-chalk/55 sm:text-3xl"
          >
            {{ word }}
            <span class="text-spot" aria-hidden="true">★</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="stage-pad py-24 lg:py-32">
      <!-- Outlined call -->
      <NuxtLink
        to="/support"
        data-cursor="join"
        class="group block"
      >
        <span class="sr-only">Join the audience — support Roopa Arts Cultural Center</span>
        <span
          aria-hidden="true"
          class="block font-display text-colossal leading-[0.85] text-transparent transition-colors duration-700 ease-silk group-hover:text-spot"
          style="-webkit-text-stroke: 1px rgba(242,235,224,0.45)"
        >
          Join the<br >audience
        </span>
      </NuxtLink>

      <div class="mt-24 grid gap-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p class="rubric">Where</p>
          <address class="mt-5 not-italic leading-relaxed text-chalk/60">
            {{ site.location }}<br >
            A {{ site.status }}
          </address>
        </div>

        <div>
          <p class="rubric">Write</p>
          <p class="mt-5">
            <a
              :href="`mailto:${site.email}`"
              class="group relative inline-block break-all text-chalk/70 transition-colors hover:text-chalk"
            >
              {{ site.email }}
              <span
                class="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-spot transition-transform duration-500 ease-silk group-hover:scale-x-100"
              />
            </a>
          </p>
        </div>

        <div>
          <p class="rubric">Follow</p>
          <ul class="mt-5 space-y-3">
            <li v-for="s in site.social" :key="s.href">
              <a
                :href="s.href"
                target="_blank"
                rel="noopener noreferrer"
                class="group relative inline-block text-chalk/70 transition-colors hover:text-chalk"
              >
                {{ s.label }}
                <span
                  class="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-spot transition-transform duration-500 ease-silk group-hover:scale-x-100"
                />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p class="rubric">Programme</p>
          <ul class="mt-5 space-y-3">
            <li v-for="l in site.nav" :key="l.to">
              <NuxtLink
                :to="l.to"
                class="group relative inline-block text-chalk/70 transition-colors hover:text-chalk"
              >
                {{ l.label }}
                <span
                  class="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-spot transition-transform duration-500 ease-silk group-hover:scale-x-100"
                />
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <p class="mt-20 border-t border-chalk/10 pt-8 text-xs text-chalk/55">
        © {{ year }} {{ site.name }}. All donations are tax-deductible to the extent allowed by law.
      </p>
    </div>
  </footer>
</template>
