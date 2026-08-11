<script setup lang="ts">
/**
 * HOME SCENE 4 — the Arudra teaser.
 *
 * The festival announced as a poster board: an oversized wordmark and one line of
 * facts on the left, three flyers fanned and pinned on the right. The full festival
 * lives at /arudra; this scene exists only to point there.
 *
 * DELIBERATELY NOT PINNED. This was once a pinned horizontal filmstrip whose scroll
 * length was `trackEl.scrollWidth - innerWidth` — eight frames at 22vw bought about
 * 1,486px of scrolling during which the page did not advance. Stacked on Act 1's
 * 180vh pin, the home page felt endless. This reads in one screen.
 *
 * `bg-stage`, not `bg-stage-deep`: SceneStory above and ActOvation below are both
 * deep, so the deep tone here made three tinted bands run together.
 *
 * The edition is derived, never hardcoded. Naming "Arudra 2026" in markup is what
 * left the homepage advertising a festival that had already happened.
 */
import { arudraTeaserImages } from '~/content/gallery'
import { arudraEvents, eventDateLabel } from '~/content/events'
import { arudraFestival } from '~/data/arudra'

const root = ref<HTMLElement | null>(null)
useEntrance(root, { stagger: 0.09 })

/** Next Arudra if one is booked, else the most recent, so the label stays honest. */
const next = arudraEvents
  .filter((e) => e.status === 'upcoming')
  .sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999'))[0]

const latest = arudraEvents
  .filter((e) => e.status === 'past' && e.date)
  .sort((a, b) => (b.date ?? '0000').localeCompare(a.date ?? '0000'))[0]

const edition = next ?? latest
const editionLabel = computed(() => (next ? 'Next edition' : 'Last staged'))
const editionDate = computed(() => (edition ? eventDateLabel(edition) : 'To be announced'))
const editionCount = arudraEvents.filter((e) => e.status === 'past' && e.date).length

/**
 * Three flyers, fanned. Each keeps `object-contain` — these are square artwork with
 * text to the edges, so filling the frame would crop the very thing being shown.
 * The tilt comes from the wrapper, so the image itself is never distorted.
 */
const posters = arudraTeaserImages.slice(0, 3)
const TILT = ['-rotate-6', 'rotate-3', '-rotate-2']
const PLACE = [
  'left-0 top-[6%] z-10',
  'right-0 top-0 z-0',
  'bottom-0 left-[26%] z-20',
]
</script>

<template>
  <section ref="root" class="bg-stage py-24 lg:py-32" aria-labelledby="teaser-heading">
    <div class="stage-pad grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-20">
      <div class="lg:col-span-5">
        <p data-wipe class="rubric">Our signature festival</p>

        <!-- The wordmark carries the section; the sentence explains it. -->
        <h2
          id="teaser-heading"
          data-wipe
          class="mt-6 font-display text-monumental leading-[0.85] text-chalk"
        >
          Arudra
        </h2>

        <p data-wipe class="mt-8 max-w-md leading-relaxed text-chalk/82">
          {{ arudraFestival.intro }}
        </p>

        <!-- One line, not a stacked table: both figures are derived from the events
             list, so neither can go stale the way the old hardcoded year did. -->
        <p data-wipe class="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <span class="rubric">{{ editionLabel }}</span>
          <span class="font-display text-lg text-spot-ink">{{ editionDate }}</span>
          <span class="text-chalk/70">
            · {{ editionCount }} {{ editionCount === 1 ? 'edition' : 'editions' }} staged
          </span>
        </p>

        <NuxtLink
          to="/arudra"
          data-wipe
          data-cursor="view"
          class="group mt-10 inline-flex items-center gap-3 border-b border-spot pb-2 text-sm uppercase tracking-rubric text-spot-ink"
        >
          Explore the festival
          <span
            class="transition-transform duration-500 ease-silk group-hover:translate-x-2"
            aria-hidden="true"
          >→</span>
        </NuxtLink>
      </div>

      <!-- The poster board. Absolute placement inside a fixed-ratio box so the fan
           holds its composition at every width, and the tilt straightens on hover. -->
      <!-- The reveal sits on the wrapper, not the tilted figures. `useEntrance`
           animates `y` inline, which outranks the rotate utility until `clearProps`
           fires at the end — so animating the figures made the fan travel upright
           and then snap into its tilt. -->
      <div class="lg:col-span-7">
        <div data-wipe class="relative mx-auto aspect-[6/5] w-full max-w-xl">
          <figure
            v-for="(img, i) in posters"
            :key="img.src"
            :class="[
              'absolute w-[56%] transition-transform duration-700 ease-silk hover:rotate-0 motion-reduce:transform-none',
              PLACE[i],
              TILT[i],
            ]"
          >
            <NuxtImg
              :src="img.src"
              :alt="img.alt"
              :width="img.width"
              :height="img.height"
              loading="lazy"
              sizes="xs:52vw sm:52vw md:34vw lg:26vw xl:24vw xxl:24vw"
              class="w-full bg-stage-raised object-contain shadow-xl ring-1 ring-chalk/10"
            />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>
