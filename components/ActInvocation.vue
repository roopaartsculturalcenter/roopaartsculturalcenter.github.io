<script setup lang="ts">
/**
 * ACT 1 (Invocation) + ACT 2 (Handover), built as one pinned scene.
 *
 * They are a single ScrollTrigger because Act 2 *is* Act 1 being taken apart —
 * splitting them would mean two pins fighting over the same 180vh.
 *
 * Act 1: masked line reveals, rotating mandala ring, WebGL arch, mouse parallax.
 * Act 2: on scroll, the type shrinks and drifts up while five columns of
 * performance photography parallax in from top and bottom at different rates.
 */
import { photo } from '~/content/gallery'
import { site } from '~/data/site'

const props = defineProps<{ curtainDone: boolean }>()

const { gsap, ScrollTrigger, SplitText, scene, reduced } = useStage()

const root = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const typeEl = ref<HTMLElement | null>(null)
const ringEl = ref<HTMLElement | null>(null)
const cueEl = ref<HTMLElement | null>(null)
const wallEl = ref<HTMLElement | null>(null)

/** Scrolls to scene 2 through Lenis when it is running, natively otherwise. */
function toWhatsOn() {
  const target = document.getElementById('whats-on')
  if (!target) return
  const lenis = (useNuxtApp() as unknown as { $lenis?: { scrollTo: (t: Element) => void } }).$lenis
  if (lenis) lenis.scrollTo(target)
  else target.scrollIntoView({ behavior: 'smooth' })
}

const HERO_IMAGE = '/images/home/home-3.webp'
const arch = useArchCanvas(canvas, HERO_IMAGE)

/**
 * The photo wall: five columns. Odd columns rise, even columns fall, so the
 * wall assembles itself out of counter-moving bands rather than one slab.
 *
 * Hand-picked for dark-stage performance imagery only. Much of the archive is
 * posed group shots against a branded backdrop, lobby snapshots, and award
 * presentations — all fine on the gallery page, all fatal to the lighting here.
 */
const WALL = [
  ['/images/gallery/hg-42.webp', '/images/home/home-4.webp', '/images/gallery/hg-94.webp'],
  ['/images/home/home-7.webp', '/images/gallery/hg-49.webp', '/images/gallery/hg-91.webp'],
  ['/images/home/home-6.webp', '/images/gallery/hg-41.webp', '/images/gallery/hg-89.webp'],
  ['/images/home/home-2.webp', '/images/gallery/hg-87.webp', '/images/home/home-5.webp'],
  ['/images/gallery/hg-92.webp', '/images/gallery/hg-95.webp', '/images/home/home-1.webp'],
].map((col) => col.map((src) => photo(src)))

const COL_SPEED = [1.0, 1.35, 0.8, 1.5, 1.1]

/**
 * The wall sits inside the hero viewport, so `loading="lazy"` does nothing for
 * it on its own — the browser counts all fifteen images as visible and fetches
 * them against the hero, which cost ~0.7s of mobile LCP.
 *
 * The fix is positional, not conditional: the images stay in the markup at all
 * times (removing them meant the prerender never generated their `_ipx`
 * variants, and the deployed static site 404'd on every one), while an outer
 * wrapper holds the whole wall a viewport-and-a-third below the fold. Native
 * lazy-loading then defers them for free. The wrapper snaps back on first
 * scroll, well before the wall is due on stage at 15% progress.
 */
const wallArmed = ref(false)

onMounted(() => {
  const arm = () => {
    if (window.scrollY > window.innerHeight * 0.04) wallArmed.value = true
  }
  // Idle time is the other safe moment: nothing is competing by then.
  const idle = window.requestIdleCallback?.(() => { wallArmed.value = true }, { timeout: 4000 })
    ?? window.setTimeout(() => { wallArmed.value = true }, 2500)

  window.addEventListener('scroll', arm, { passive: true })
  arm()

  onScopeDispose(() => {
    window.removeEventListener('scroll', arm)
    window.cancelIdleCallback?.(idle as number)
  })
})

/** Act 1's entrance. Held until the curtain is out of the way. */
function playIntro() {
  const el = root.value
  if (!el || reduced.value) return

  const heading = typeEl.value?.querySelector<HTMLElement>('[data-split]')
  if (!heading) return

  const split = new SplitText(heading, { type: 'lines', mask: 'lines' })
  gsap.set(heading, { opacity: 1 })

  gsap
    .timeline({ defaults: { ease: 'expo.out' } })
    .from(split.lines, { yPercent: 115, duration: 1.25, stagger: 0.11 })
    .from(el.querySelectorAll('[data-fade]'), { opacity: 0, y: 22, duration: 0.9, stagger: 0.1 }, '-=0.8')
    .from(ringEl.value, { opacity: 0, scale: 0.85, duration: 1.4 }, '-=1.1')
    .from(cueEl.value, { opacity: 0, duration: 0.6 }, '-=0.3')
}

watch(
  () => props.curtainDone,
  (done) => {
    if (done) nextTick(playIntro)
  },
  { immediate: true },
)

// --- Mouse parallax (Act 1) ------------------------------------------------
onMounted(() => {
  if (reduced.value) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const xTo = gsap.quickTo(typeEl.value, 'x', { duration: 0.9, ease: 'power3.out' })
  const yTo = gsap.quickTo(typeEl.value, 'y', { duration: 0.9, ease: 'power3.out' })
  const rxTo = gsap.quickTo(ringEl.value, 'x', { duration: 1.3, ease: 'power3.out' })
  const ryTo = gsap.quickTo(ringEl.value, 'y', { duration: 1.3, ease: 'power3.out' })

  const onMove = (e: PointerEvent) => {
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    xTo(nx * -22)
    yTo(ny * -14)
    rxTo(nx * 36)
    ryTo(ny * 24)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  onScopeDispose(() => window.removeEventListener('pointermove', onMove))
})

// --- ACT 2: the pinned handover -------------------------------------------
scene(
  () => {
    const el = root.value
    if (!el) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const columns = gsap.utils.toArray<HTMLElement>('[data-wall-col]', el)

    // Mobile gets no pin: the wall simply fades up as a stacked grid. Pinning
    // 180vh on a phone costs far more than the effect is worth there.
    if (isMobile) {
      gsap.fromTo(
        columns,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: wallEl.value, start: 'top 85%', once: true },
        },
      )
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=180%',
        pin: stageEl.value ?? true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Fade the shader out as the wall takes over, then stop rendering.
          arch.setFade(gsap.utils.clamp(0, 1, 1 - self.progress * 2.6))
        },
      },
    })

    // Explicit `fromTo` with immediateRender off, deliberately.
    //
    // A plain `.to()` in a scrub timeline captures its start values the moment
    // the timeline is built — which races the Act 1 intro. Building mid-intro
    // captured the ring at opacity 0 and pinned it there permanently. Stating
    // both ends removes the race entirely.
    const noRender = { immediateRender: false }

    // The type recedes and clears out completely. Held at a low opacity it read
    // as a smudge over the photography rather than a deliberate ghost, so it
    // finishes its fade well before the wall owns the screen.
    tl.fromTo(
      typeEl.value,
      { scale: 1, yPercent: 0, opacity: 1 },
      { scale: 0.42, yPercent: -34, ease: 'none', ...noRender },
      0,
    )
      .fromTo(
        typeEl.value,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in', duration: 0.45, ...noRender },
        0,
      )
      .fromTo(
        ringEl.value,
        { scale: 1, opacity: 1 },
        { scale: 2.6, opacity: 0, ease: 'none', ...noRender },
        0,
      )
      .fromTo(
        cueEl.value,
        { opacity: 1 },
        { opacity: 0, ease: 'none', duration: 0.08, ...noRender },
        0,
      )

    // The wall arrives, each column at its own rate. Columns start further out
    // than they need to (±120%) so no edge of one peeks into Act 1 while the
    // hero is still the whole picture.
    columns.forEach((col, i) => {
      const rising = i % 2 === 0
      tl.fromTo(
        col,
        { yPercent: rising ? 120 : -120 },
        { yPercent: rising ? -6 * COL_SPEED[i] : 6 * COL_SPEED[i], ease: 'none' },
        0.15,
      )
    })

    tl.fromTo(
      wallEl.value,
      { opacity: 0 },
      { opacity: 1, ease: 'none', duration: 0.22, ...noRender },
      0.15,
    ).fromTo(
      wallEl.value,
      { scale: 1.12 },
      { scale: 1, ease: 'none', ...noRender },
      0.15,
    )

    ScrollTrigger.refresh()
  },
  {
    scope: root,
    // Reduced motion: no pin, no scrub. The wall is just there, faded in.
    fallback: () => {
      const el = root.value
      if (!el) return
      el.querySelectorAll<HTMLElement>('[data-split], [data-fade]').forEach((n) => {
        n.style.opacity = '1'
      })
      if (wallEl.value) wallEl.value.style.opacity = '1'
    },
  },
)
</script>

<template>
  <section
    ref="root"
    class="relative bg-stage"
    aria-label="Roopa Arts Cultural Center"
  >
    <div ref="stageEl" class="relative h-[100svh] w-full overflow-hidden">
      <!-- WebGL arch, or a masked still where WebGL is not welcome.
           Kept in flow and hidden with opacity rather than `v-show`: with
           `display:none` the canvas measures 0x0 at mount and the renderer gets
           a zero-size drawing buffer that never recovers. -->
      <canvas
        ref="canvas"
        class="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700"
        :class="arch.supported.value ? 'opacity-100' : 'opacity-0'"
        aria-hidden="true"
      />
      <div
        v-if="!arch.supported.value"
        class="pointer-events-none absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[14%]"
        aria-hidden="true"
      >
        <!-- This is the LCP element on every device that declines the shader, so
             `sizes` has to describe the box it actually occupies (70% of the
             viewport, 52% from `sm` up). Describing it as 100vw made the browser
             fetch roughly twice the pixels it could ever display. -->
        <NuxtImg
          :src="HERO_IMAGE"
          alt=""
          width="1600"
          height="900"
          sizes="xs:72vw sm:54vw md:54vw lg:42vw xl:42vw xxl:42vw"
          preload
          fetchpriority="high"
          class="arch h-[72%] w-[70%] max-w-2xl object-cover sm:w-[52%]"
        />
      </div>

      <!-- Mandala ring -->
      <div
        ref="ringEl"
        class="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 gpu"
        aria-hidden="true"
      >
        <TheMandalaRing />
      </div>

      <!-- Light wash under the type.
           Ink type over a dark stage photograph is unreadable, so page colour is
           carried under the text and faded out to the right.

           This is deliberately doing the work rather than tuning the headline to
           dodge the arch: the font scales on `vw` and the arch scales on aspect
           ratio, so any width that clears at 1560px overlaps again at 1024px.
           The wash holds at every width, and reads as type in front of a receding
           image, which is the intent anyway.

           It is a sibling at `z-[4]`, NOT a child of the type container. Nested
           inside that `z-10` stacking context, a negative z could not drop below
           the parent's level, so the whole wash painted over Act 2's photo wall and
           washed out the left two thirds of it as you scrolled. Sitting at 4 it
           still covers the arch (z-auto) and the ring (z-0) for Act 1, while the
           wall at z-[5] passes cleanly in front of it. -->
      <!-- On a phone the wash runs top-to-bottom over the upper band only, not
           left-to-right across the whole screen. Full width at via-stage/88 meant
           88% page colour over the entire arch: the photograph came out bleached,
           which reads as the hero being mostly empty. Sideways washes need a column
           of spare width to fade into, and a 390px viewport has none, so on mobile
           the type sits in a scrimmed band at the top and the image below it is
           left completely alone.

           `sm:via-stage/88 sm:via-50%` must BOTH stay on this element. They do not
           just tune the sideways wash, they reset the mobile stops: the phone band
           puts its 90% stop at 88% of the way DOWN, and once `sm:bg-gradient-to-r`
           flips the axis that same stop means 88% of the way ACROSS, holding the page
           colour at 90% over the full arch. Dropping the sm: overrides and letting
           the mobile stops through is what bleaches the photograph here. -->
      <div
        class="pointer-events-none absolute inset-x-0 top-0 z-[4] h-[66%] bg-gradient-to-b from-stage via-stage/90 via-[88%] to-transparent sm:inset-y-0 sm:left-0 sm:h-auto sm:w-full sm:bg-gradient-to-r sm:via-stage/88 sm:via-50% lg:w-[72%]"
        aria-hidden="true"
      />

      <!-- The type sits in the top band on mobile (clear of the fixed nav), and
           returns to vertically centred from `sm` where the sideways wash takes
           over. -->
      <div class="relative z-10 flex h-full items-start pt-28 sm:items-center sm:pt-0">
        <div ref="typeEl" class="stage-pad w-full gpu">
          <!-- No hard <br>, and a narrower measure from `lg`.
               The hand-broken two-line version ran the last word deep into the
               arch. On the dark theme that was light type over a dark photo and
               it read; as ink on the light theme it vanished. Letting the line
               wrap inside a measure that ends before the arch fixes it at every
               width, which chasing font size against the arch's aspect-driven
               geometry does not. Slightly smaller from `lg` so the extra line
               does not push the lede and CTA out of a short viewport. -->
          <h1
            data-split
            class="max-w-5xl text-monumental lg:max-w-[42rem] lg:text-[clamp(3rem,6.6vw,6.5rem)]"
          >
            Where the classical arts of India take the stage.
          </h1>

          <p data-fade class="mt-9 max-w-lg text-base leading-relaxed text-chalk/82 sm:text-lg">
            {{ site.name }}, {{ site.location }} &nbsp;·&nbsp; a 501(c)(3) nonprofit.
          </p>

          <!-- The single CTA on this screen. -->
          <p data-fade class="mt-11">
            <a
              href="#whats-on"
              data-cursor="scroll"
              class="group inline-flex items-center gap-3 border border-spot px-9 py-4 text-xs font-semibold uppercase tracking-rubric text-spot-ink transition-colors duration-500 hover:bg-spot hover:text-chalk"
              @click.prevent="toWhatsOn"
            >
              See what's on
              <span
                class="transition-transform duration-500 ease-silk group-hover:translate-y-1"
                aria-hidden="true"
              >↓</span>
            </a>
          </p>
        </div>
      </div>

      <!-- Scroll cue -->
      <div
        ref="cueEl"
        class="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center"
        aria-hidden="true"
      >
        <span class="rubric animate-cue-pulse text-chalk/70">Scroll</span>
      </div>

      <!-- ACT 2: the photo wall -->
      <!-- The container is taller than the viewport and hangs above it. The
           columns drift in opposite directions, so without that bleed the ones
           moving down expose a black band along the top edge at rest. -->
      <!-- Outer wrapper: parked below the fold so native lazy-loading holds the
           images back. GSAP never touches this element, only the one inside. -->
      <div
        class="pointer-events-none absolute inset-x-0 -top-[15vh] z-[5] h-[130vh] will-change-transform"
        :class="wallArmed ? 'translate-y-0' : 'translate-y-[130vh]'"
        aria-hidden="true"
      >
        <div
          ref="wallEl"
          class="grid h-full grid-cols-2 gap-3 px-3 opacity-0 sm:gap-4 sm:px-4 md:grid-cols-5"
        >
          <div
            v-for="(col, i) in WALL"
            :key="i"
            data-wall-col
            class="flex flex-col gap-3 gpu sm:gap-4"
            :class="i === 4 && 'hidden md:flex'"
          >
            <NuxtImg
              v-for="shot in col"
              :key="shot.src"
              :src="shot.src"
              :alt="shot.alt"
              :width="shot.width"
              :height="shot.height"
              loading="lazy"
              sizes="xs:50vw sm:50vw md:22vw lg:22vw xl:22vw xxl:22vw"
              class="h-[42vh] w-full shrink-0 rounded-sm object-cover md:h-[44vh]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
