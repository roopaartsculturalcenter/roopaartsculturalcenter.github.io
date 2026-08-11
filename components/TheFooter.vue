<script setup lang="ts">
import { gsap } from 'gsap'
import { logo, site } from '~/data/site'

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
            class="flex items-center gap-8 px-8 font-display text-2xl text-chalk/70 sm:text-3xl"
          >
            {{ word }}
            <span class="text-spot-ink" aria-hidden="true">★</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="stage-pad py-24 lg:py-32">
      <!-- Outlined call, and the sign-up in the space it leaves.
           The call used to run full width, which left the right-hand 40% of the
           footer empty at every desktop size while the sign-up was squeezed into a
           fifth link column. Pairing them fills that gap and gives the sign-up the
           weight it needs to actually be used. -->
      <!-- `auto` for the type, `1fr` for the panel: the headline column sizes to the
           width of "audience" at whatever `text-colossal` currently computes to, and
           the sign-up absorbs the remainder. A fixed 7/12 split instead forced a
           choice between clipping the type at wide viewports and shrinking it at
           narrow ones, because the content width caps at max-w-stage while 15vw
           keeps growing. `minmax(0,1fr)` so the panel may shrink below min-content
           rather than push the row wider than the container. -->
      <div class="grid gap-16 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-20">
        <NuxtLink
          to="/support"
          data-cursor="join"
          class="group block"
        >
          <span class="sr-only">Join the audience: support Roopa Arts Cultural Center</span>
          <span
            aria-hidden="true"
            class="block font-display text-colossal leading-[0.85] text-transparent transition-colors duration-700 ease-silk group-hover:text-spot-ink"
            style="-webkit-text-stroke: 1px rgba(31,26,22,0.55)"
          >
            Join the<br >audience
          </span>
        </NuxtLink>

        <!-- The footer is mounted in layouts/default.vue, so putting the sign-up
             here puts it on every page with one insertion. -->
        <div class="border border-chalk/12 bg-stage-raised p-8 xl:p-10">
          <MailingListForm />
        </div>
      </div>

      <!-- The Write column gets a wider track: the contact address is a single
           unbreakable 271px token, and in equal quarters it wrapped to "…gmail.c /
           om". Four equal columns also do not fit between lg and xl, so that band
           stays at two. -->
      <div class="mt-24 grid gap-14 sm:grid-cols-2 xl:grid-cols-[1fr_1.35fr_1fr_1fr]">
        <div>
          <p class="rubric">Where</p>
          <address class="mt-5 not-italic leading-relaxed text-chalk/74">
            {{ site.location }}<br >
            A {{ site.status }}
          </address>
        </div>

        <div>
          <p class="rubric">Write</p>
          <p class="mt-5">
            <a
              :href="`mailto:${site.email}`"
              class="group relative inline-block break-all text-chalk/82 transition-colors hover:text-chalk"
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
                class="group relative inline-block text-chalk/82 transition-colors hover:text-chalk"
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
                class="group relative inline-block text-chalk/82 transition-colors hover:text-chalk"
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

      <!-- Sign-off: the full lockup at a size where "Cultural Center" is
           actually readable, which the nav's height cannot give it.

           `self-start` on the logo is load-bearing. This is a column flex container
           on mobile with no `items-*`, so align-items defaults to stretch, and in a
           column stretch acts on the WIDTH — the lockup was being pulled to the full
           container width against its fixed `h-11`, distorting it. `sm:items-center`
           masked the bug above 640px, which is why it only showed on phones. -->
      <div
        class="mt-20 flex flex-col gap-8 border-t border-chalk/10 pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-12"
      >
        <img
          :src="logo.dark"
          :width="logo.width"
          :height="logo.height"
          :alt="site.name"
          loading="lazy"
          decoding="async"
          class="h-11 w-auto shrink-0 self-start"
        >

        <p class="text-xs leading-relaxed text-chalk/70 sm:max-w-sm sm:text-right">
          © {{ year }} {{ site.name }}. All donations are tax-deductible to the extent allowed by law.
        </p>
      </div>
    </div>
  </footer>
</template>
