<script setup lang="ts">
import { arudraEvents } from '~/content/events'
import { arudraCollateral } from '~/content/gallery'
import { arudra2026 } from '~/data/arudra'

useSeo({
  title: 'Arudra',
  description:
    'Arudra is our signature festival, held each year around the Thiruvadhirai season, ' +
    'dancers, musicians, and the community on one stage at the Jewish Community Center of Houston.',
  image: '/images/events/all-program-flyer.webp',
})

const storyRoot = ref<HTMLElement | null>(null)
useEntrance(storyRoot)

// Posters and artist cards, straight from the source list. This used to look the
// group up in `galleryGroups` by the name 'Arudra 2026' — a lookup that returned
// an empty array the moment that group left the photo gallery, silently emptying
// this page. Named import instead, so the same mistake becomes a build error.
const arudraImages = arudraCollateral
</script>

<template>
  <div>
    <PageOverture
      title="Arudra is where our whole year points."
      lede="Held each season around Thiruvadhirai (Arudra Darshanam), our signature festival brings dancers, musicians, and the community onto one stage."
      image="/images/misc/final.webp"
    />

    <section ref="storyRoot" class="bg-stage py-24 lg:py-32" aria-labelledby="arudra-story">
      <div class="stage-pad grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <div>
          <h2 id="arudra-story" data-wipe class="max-w-2xl font-display text-grand text-chalk">
            One afternoon, four experiences.
          </h2>

          <p data-wipe class="mt-8 max-w-lg leading-relaxed text-chalk/82">
            {{ arudra2026.intro }}
          </p>

          <p data-wipe class="mt-5 max-w-lg leading-relaxed text-chalk/82">
            The 2026 edition opened with Trilokya Nada, an invocation by Musicians of Houston,
            and closed with Thiruvadhirai Threads. Between them sat a Veena-Violin duet and the
            festival's featured production.
          </p>

          <p data-wipe class="mt-5 max-w-lg leading-relaxed text-chalk/82">
            {{ arudra2026.featured.body }}
          </p>
        </div>

        <ol class="lg:pt-4">
          <li
            v-for="(item, i) in arudra2026.programme"
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

    <EventGrid
      :events="arudraEvents"
      heading="Every Arudra we have staged."
      tone="deep"
      empty="Arudra dates for the coming season are still being confirmed."
    />

    <ActGallery
      :photos="arudraImages"
      heading="The festival, on paper."
      rubric="Flyers, banners, and every artist announcement"
    />

    <ActOvation show-other-ways />
  </div>
</template>
