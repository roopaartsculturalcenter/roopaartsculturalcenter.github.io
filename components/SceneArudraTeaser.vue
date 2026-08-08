<script setup lang="ts">
/**
 * HOME SCENE 4 — the Arudra teaser.
 *
 * Eight images, one sentence, one secondary link. The full festival lives at
 * /arudra; this scene exists only to point there.
 *
 * Reuses the approved filmstrip motion: pinned horizontal travel on desktop,
 * native swipe on touch, velocity skew on the frames.
 */
import { arudraTeaserImages } from '~/content/gallery'

const { gsap, scene } = useStage()

const root = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)

scene(
  () => {
    const el = root.value
    const trackEl = track.value
    if (!el || !trackEl) return

    gsap.from(el.querySelectorAll('[data-teaser]'), {
      yPercent: 110,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 78%', once: true },
    })

    if (window.matchMedia('(max-width: 768px)').matches) return

    const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth + 96)

    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: stageEl.value ?? true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.to('[data-teaser-frame]', {
            skewX: gsap.utils.clamp(-8, 8, self.getVelocity() / 320),
            duration: 0.5,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        },
      },
    }).to(trackEl, { x: () => -distance(), ease: 'none' }, 0)
  },
  { scope: root },
)
</script>

<template>
  <section ref="root" class="relative bg-stage-deep" aria-labelledby="teaser-heading">
    <div ref="stageEl" class="flex min-h-[100svh] flex-col justify-center overflow-hidden py-24">
      <div class="stage-pad">
        <h2 id="teaser-heading" class="mask-line">
          <span data-teaser class="block max-w-3xl font-display text-grand text-chalk">
            Arudra 2026 — our signature festival.
          </span>
        </h2>
      </div>

      <div
        class="mt-14 w-full overflow-x-auto pb-4 md:overflow-visible"
        role="region"
        aria-label="Arudra 2026 images"
        tabindex="0"
      >
        <ul
          ref="track"
          class="flex w-max gap-6 px-6 [scroll-snap-type:x_mandatory] sm:px-10 lg:px-16 md:[scroll-snap-type:none]"
        >
          <li
            v-for="img in arudraTeaserImages"
            :key="img.src"
            data-teaser-frame
            class="w-[68vw] shrink-0 snap-center gpu sm:w-[42vw] md:w-[26vw] lg:w-[22vw]"
          >
            <NuxtImg
              :src="img.src"
              :alt="img.alt"
              :width="img.width"
              :height="img.height"
              loading="lazy"
              sizes="xs:68vw sm:42vw md:26vw lg:22vw xl:22vw xxl:22vw"
              class="aspect-square w-full bg-stage-raised object-contain"
            />
          </li>
        </ul>
      </div>

      <div class="stage-pad mt-12">
        <NuxtLink
          to="/arudra"
          data-cursor="view"
          class="group inline-flex items-center gap-3 border-b border-spot pb-2 text-sm uppercase tracking-rubric text-spot"
        >
          Explore the festival
          <span class="transition-transform duration-500 ease-silk group-hover:translate-x-2" aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
