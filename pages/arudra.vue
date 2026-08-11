<script setup lang="ts">
/**
 * /arudra — the festival in general, across every edition.
 *
 * Deliberately carries NO single year's cast, scene list or credits. Those sat here
 * before, which meant a visitor asking "what is Arudra" got the 2026 programme
 * notes instead. Per-edition depth lives on the edition's own page, reached from the
 * grid below: /events/arudra-2026 carries the full Navagrahamum Navakailasamum
 * scenes and credits.
 */
import { arudraEvents } from '~/content/events'
import { arudraCollateral } from '~/content/gallery'
import { arudraFestival } from '~/data/arudra'
import { site } from '~/data/site'

useSeo({
  title: 'Arudra',
  description:
    'Arudra is our signature festival, held each year around the Thiruvadhirai season: ' +
    'an invocation, two feature programmes, and a closing sequence, on one stage.',
  image: '/images/events/all-program-flyer.webp',
})

const storyRoot = ref<HTMLElement | null>(null)
useEntrance(storyRoot)

const socialRoot = ref<HTMLElement | null>(null)
useEntrance(socialRoot)
</script>

<template>
  <div>
    <!-- `object-right`: the figure sits right of centre in a square source, and the
         arch's 3:4 crop keeps the horizontal middle by default, which pushed it to
         the edge. -->
    <PageOverture
      title="Arudra is where our whole year points."
      lede="Held each season around Thiruvadhirai (Arudra Darshanam), our signature festival brings dancers, musicians, and the community onto one stage."
      image="/images/misc/final.webp"
      image-focus="object-right"
    />

    <section ref="storyRoot" class="bg-stage py-24 lg:py-32" aria-labelledby="arudra-story">
      <div class="stage-pad grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div>
          <h2 id="arudra-story" data-wipe class="max-w-2xl font-display text-grand text-chalk">
            One afternoon, four experiences.
          </h2>

          <p data-wipe class="mt-8 max-w-lg leading-relaxed text-chalk/82">
            {{ arudraFestival.intro }}
          </p>

          <p data-wipe class="mt-5 max-w-lg leading-relaxed text-chalk/82">
            Every edition follows the same four-part shape. What changes each year is
            the repertoire, the ensemble, and the production that anchors it. Open any
            edition below for its full programme and credits.
          </p>
        </div>

        <!-- The playbill: the festival's structure, not one year's line-up. -->
        <ol class="lg:pt-4">
          <li
            v-for="(item, i) in arudraFestival.playbill"
            :key="item.title"
            data-wipe
            class="flex gap-6 border-t border-chalk/12 py-6"
          >
            <span class="font-display text-sm tabular-nums text-spot-ink">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span>
              <span class="block font-display text-recital text-chalk">{{ item.title }}</span>
              <span v-if="item.note" class="mt-1 block text-sm text-chalk/70">{{ item.note }}</span>
            </span>
          </li>
        </ol>
      </div>
    </section>

    <!-- Every edition. Each card links to that year's page. -->
    <EventGrid
      :events="arudraEvents"
      heading="Every Arudra we have staged."
      tone="deep"
      empty="Arudra dates for the coming season are still being confirmed."
    />

    <ActGallery
      :photos="arudraCollateral"
      heading="The festival, on paper."
      rubric="Flyers, banners, and every artist announcement"
    />

    <section ref="socialRoot" class="bg-stage-deep py-20 lg:py-24" aria-labelledby="arudra-social">
      <div class="stage-pad">
        <h2 id="arudra-social" data-wipe class="max-w-xl font-display text-recital text-chalk">
          Next season's dates go out on social first.
        </h2>
        <ul data-wipe class="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <li v-for="s in site.social" :key="s.href">
            <a
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              class="group inline-flex items-center gap-2 border-b border-spot pb-1 text-sm uppercase tracking-rubric text-spot-ink"
            >
              {{ s.label }}
              <span
                class="transition-transform duration-500 ease-silk group-hover:translate-x-1"
                aria-hidden="true"
              >→</span>
            </a>
          </li>
        </ul>
      </div>
    </section>

    <ActOvation show-other-ways />
  </div>
</template>
