<script setup lang="ts">
/**
 * ACT 7 — Standing Ovation.
 *
 * The emotional peak, not a footer afterthought: a single spotlight follows the
 * cursor across a dark stage and the Zelle details sit centre stage in it.
 *
 * The spotlight is a fixed-size radial-gradient element moved with translate3d.
 * Animating `background-position` or the gradient's own stops would repaint a
 * full-screen layer every frame; moving a composited layer costs nothing.
 */
import { gsap } from 'gsap'
import { site } from '~/data/site'

const { SplitText, scene, reduced } = useStage()

const root = ref<HTMLElement | null>(null)
const light = ref<HTMLElement | null>(null)
const headingEl = ref<HTMLElement | null>(null)

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(site.donate.zelleEmail)
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 2400)
  } catch {
    // Clipboard blocked — the address is on screen and selectable regardless.
    copied.value = false
  }
}
onScopeDispose(() => clearTimeout(resetTimer))

onMounted(() => {
  if (reduced.value || !light.value) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const xTo = gsap.quickTo(light.value, 'x', { duration: 0.9, ease: 'power3.out' })
  const yTo = gsap.quickTo(light.value, 'y', { duration: 0.9, ease: 'power3.out' })

  const onMove = (e: PointerEvent) => {
    const r = root.value?.getBoundingClientRect()
    if (!r) return
    xTo(e.clientX - r.left)
    yTo(e.clientY - r.top)
  }

  root.value?.addEventListener('pointermove', onMove)
  onScopeDispose(() => root.value?.removeEventListener('pointermove', onMove))
})

scene(
  () => {
    const el = root.value
    const h = headingEl.value
    if (!el || !h) return

    const split = new SplitText(h, { type: 'chars,words' })
    gsap.set(h, { opacity: 1 })

    gsap.from(split.chars, {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.02,
      scrollTrigger: { trigger: el, start: 'top 70%', once: true },
    })

    gsap.from(el.querySelectorAll('[data-ovation]'), {
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 62%', once: true },
    })
  },
  {
    scope: root,
    fallback: () => {
      if (headingEl.value) headingEl.value.style.opacity = '1'
      root.value?.querySelectorAll<HTMLElement>('[data-ovation]').forEach((n) => {
        n.style.opacity = '1'
      })
    },
  },
)
</script>

<template>
  <section
    ref="root"
    class="relative isolate overflow-hidden bg-stage-deep py-32 lg:py-44"
    aria-labelledby="ovation-heading"
  >
    <!-- The spotlight -->
    <div
      ref="light"
      class="pointer-events-none absolute -left-[35rem] -top-[35rem] -z-10 h-[70rem] w-[70rem] gpu"
      aria-hidden="true"
      style="background: radial-gradient(circle closest-side, rgba(212,160,23,0.16), rgba(212,160,23,0.05) 45%, transparent 72%)"
    />

    <div class="stage-pad relative text-center">
      <p data-ovation class="rubric">Act V &nbsp;·&nbsp; Standing Ovation</p>

      <h2
        id="ovation-heading"
        ref="headingEl"
        data-split
        class="mx-auto mt-8 max-w-4xl font-display text-monumental text-chalk"
      >
        Your gift puts artists on stage
      </h2>

      <p data-ovation class="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-chalk/65">
        {{ site.name }} is a {{ site.status }}. We rely on the generosity of our supporters
        to keep our programs running and accessible to all.
      </p>

      <!-- Centre stage -->
      <div data-ovation class="mx-auto mt-16 max-w-md">
        <div class="border border-spot/25 bg-stage/60 p-8 backdrop-blur-sm sm:p-10">
          <p class="rubric">Scan to donate</p>

          <NuxtImg
            :src="site.donate.qr"
            :alt="`Zelle QR code for donating to ${site.name}`"
            width="570"
            height="570"
            loading="lazy"
            sizes="xs:64vw sm:56vw md:260px lg:260px xl:260px xxl:260px"
            class="mx-auto mt-8 w-full max-w-[16rem] bg-white p-3"
          />

          <p class="mt-8 text-xs uppercase tracking-rubric text-chalk/55">Or Zelle to</p>
          <p class="mt-3 break-all font-display text-lg text-chalk">
            <a
              :href="`mailto:${site.donate.zelleEmail}`"
              class="underline decoration-spot decoration-1 underline-offset-8 transition-colors hover:text-spot"
            >{{ site.donate.zelleEmail }}</a>
          </p>

          <button
            type="button"
            data-cursor="copy"
            class="mt-6 border border-chalk/20 px-6 py-3 text-[0.65rem] uppercase tracking-rubric text-chalk/70 transition-colors duration-500 hover:border-spot hover:text-spot"
            @click="copyEmail"
          >
            {{ copied ? 'Copied' : 'Copy address' }}
          </button>
          <span class="sr-only" role="status">{{ copied ? 'Email address copied to clipboard' : '' }}</span>
        </div>

        <a
          :href="site.donate.zelleEnrollUrl"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="open"
          class="mt-8 inline-block bg-spot px-10 py-4 text-xs font-semibold uppercase tracking-rubric text-stage transition-colors duration-500 hover:bg-spot-warm"
        >
          Enroll with Zelle
        </a>

        <p class="mt-6 text-xs text-chalk/55">
          Tax-deductible to the extent allowed by law, and eligible for employer matching.
        </p>
      </div>
    </div>
  </section>
</template>
