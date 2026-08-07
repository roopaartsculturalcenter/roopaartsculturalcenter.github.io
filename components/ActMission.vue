<script setup lang="ts">
/**
 * ACT 3 — How It Began.
 *
 * A pinned recitation: verses rise into place one at a time, scrub-linked, the
 * way lines are delivered rather than dumped on a page. One phrase lights gold
 * as it passes centre.
 *
 * The gold is a second, stacked copy of the same words whose opacity is tweened —
 * not a colour tween. Colour animates on the main thread; opacity composites.
 */
import { verses } from '~/data/about'

const { gsap, scene } = useStage()

const root = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)

scene(
  () => {
    const el = root.value
    if (!el) return

    const lines = gsap.utils.toArray<HTMLElement>('[data-verse]', el)
    const gold = el.querySelector('[data-gold]')
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    // On a phone the verses simply arrive; a second 140vh pin on top of Act 2's
    // is a lot of scroll to ask for on a small screen.
    if (isMobile) {
      gsap.fromTo(
        lines,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        },
      )
      if (gold) {
        gsap.to(gold, {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: { trigger: gold, start: 'top 70%', once: true },
        })
      }
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=140%',
        pin: stageEl.value ?? true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    // Each verse gets its own slice of the scroll, so reading pace is set by
    // how fast the reader chooses to scroll.
    tl.fromTo(
      lines,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: 'power2.out', stagger: 0.6, duration: 1.4 },
      0,
    )

    if (gold) {
      tl.fromTo(gold, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.5 }, '>-0.9')
    }
  },
  {
    scope: root,
    fallback: () => {
      root.value?.querySelectorAll<HTMLElement>('[data-verse], [data-gold]').forEach((n) => {
        n.style.opacity = '1'
        n.style.transform = 'none'
      })
    },
  },
)
</script>

<template>
  <section ref="root" class="relative bg-stage" aria-labelledby="mission-heading">
    <div ref="stageEl" class="flex min-h-[100svh] items-center overflow-hidden py-16">
      <div class="stage-pad w-full">
        <p class="rubric mb-10 sm:mb-14">Act I &nbsp;·&nbsp; How It Began</p>
        <h2 id="mission-heading" class="sr-only">How it began</h2>

        <div class="max-w-4xl">
          <p v-for="(verse, i) in verses" :key="i" class="mask-line font-display text-verse">
            <span data-verse class="relative block gpu">
              <span :class="verse.gold ? 'text-chalk/55' : 'text-chalk'">{{ verse.text }}</span>

              <!-- The lit copy, stacked exactly over the dim one. -->
              <span
                v-if="verse.gold"
                data-gold
                aria-hidden="true"
                class="absolute inset-0 text-spot opacity-0"
              >{{ verse.text }}</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
