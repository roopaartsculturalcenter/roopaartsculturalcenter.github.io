<script setup lang="ts">
import { site } from '~/data/site'
import { accordions } from '~/data/about'
import { featuredArtists } from '~/data/arudra'

useSeo({
  title: 'How It Began',
  description:
    'Roopa Arts Cultural Center is a Texas 501(c)(3) public charity built by artists and art lovers — ' +
    'our story, mission, vision, and community impact.',
  image: '/images/about/racc-about.webp',
})

const artistsRoot = ref<HTMLElement | null>(null)
useEntrance(artistsRoot, { selector: '[data-wipe]', stagger: 0.06 })
</script>

<template>
  <div>
    <PageOverture
      rubric="Act I · How It Began"
      title="Built by artists and art lovers"
      lede="A Texas public charity creating stages where the classical arts of India thrive."
      image="/images/home/home-2.webp"
    />

    <!-- The story, recited -->
    <ActMission />

    <!-- In depth -->
    <section class="bg-stage-deep py-28 lg:py-36" aria-labelledby="depth-heading">
      <div class="stage-pad">
        <p class="rubric">In depth</p>
        <h2 id="depth-heading" class="mt-6 max-w-2xl font-display text-monumental text-chalk">
          Vision, programmes, impact
        </h2>

        <div class="mt-16 max-w-3xl">
          <AccordionList :items="accordions" default-open="vision" />
        </div>
      </div>
    </section>

    <!-- Company -->
    <section ref="artistsRoot" class="bg-stage py-28 lg:py-36" aria-labelledby="company-heading">
      <div class="stage-pad">
        <p data-wipe class="rubric">On our stage</p>
        <h2 id="company-heading" data-wipe class="mt-6 font-display text-monumental text-chalk">
          The company
        </h2>

        <ul class="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <li v-for="artist in featuredArtists" :key="artist.name" data-wipe>
            <NuxtImg
              :src="artist.src"
              :alt="`Portrait of ${artist.name}`"
              width="800"
              height="800"
              loading="lazy"
              sizes="xs:44vw sm:30vw md:30vw lg:15vw xl:15vw xxl:15vw"
              class="aspect-square w-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
            />
            <p class="mt-4 font-display text-base leading-snug text-chalk/80">{{ artist.name }}</p>
          </li>
        </ul>

        <p class="mt-20 max-w-xl text-sm leading-relaxed text-chalk/55">
          {{ site.name }} is a {{ site.status }}. Donations are tax-deductible to the extent
          allowed by law and eligible for employer matching.
        </p>
      </div>
    </section>

    <ActOvation />
  </div>
</template>
