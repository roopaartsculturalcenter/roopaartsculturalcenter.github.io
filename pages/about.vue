<script setup lang="ts">
import { site } from '~/data/site'
import { accordions } from '~/data/about'
import { featuredArtists } from '~/data/arudra'

useSeo({
  title: 'About',
  description:
    'Roopa Arts Cultural Center is a Texas 501(c)(3) public charity built by artists and art lovers — ' +
    'our story, vision, programmes, and community impact.',
  image: '/images/about/racc-about.webp',
})

/** Sentence-style headings for the three sections; the copy itself comes from
 *  the repo's existing published text, one short paragraph each. */
const SECTION_HEADINGS: Record<string, string> = {
  vision: 'We want a room where artists and audiences meet as equals.',
  'what-we-do': 'Four strands, on stages across Texas.',
  'community-impact': 'The work runs on the people who show up for it.',
}

const sections = accordions.map((a) => ({
  id: a.id,
  heading: SECTION_HEADINGS[a.id] ?? a.title,
  body: a.body[0],
  points: a.points,
}))

const root = ref<HTMLElement | null>(null)
useEntrance(root)

const companyRoot = ref<HTMLElement | null>(null)
useEntrance(companyRoot, { stagger: 0.06 })
</script>

<template>
  <div>
    <PageOverture
      title="Built by artists and art lovers."
      lede="A Texas public charity creating stages where the classical arts of India thrive."
      image="/images/home/home-2.webp"
    />

    <!-- How it began — the approved line-by-line recitation. -->
    <ActMission />

    <section ref="root" class="bg-stage-deep py-24 lg:py-32">
      <div class="stage-pad grid gap-20 lg:gap-24">
        <article v-for="s in sections" :key="s.id" :aria-labelledby="`sec-${s.id}`">
          <h2 :id="`sec-${s.id}`" data-wipe class="max-w-2xl font-display text-grand text-chalk">
            {{ s.heading }}
          </h2>
          <p data-wipe class="mt-7 max-w-xl leading-relaxed text-chalk/70">{{ s.body }}</p>

          <ul v-if="s.points" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <li v-for="p in s.points" :key="p.title" data-wipe class="border-l border-spot/40 pl-5">
              <p class="font-display text-lg text-chalk">{{ p.title }}</p>
              <p class="mt-2 text-sm leading-relaxed text-chalk/60">{{ p.text }}</p>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section ref="companyRoot" class="bg-stage py-24 lg:py-32" aria-labelledby="company-heading">
      <div class="stage-pad">
        <h2 id="company-heading" data-wipe class="max-w-2xl font-display text-grand text-chalk">
          Artists who have shared this stage.
        </h2>

        <ul class="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <li v-for="artist in featuredArtists" :key="artist.name" data-wipe>
            <NuxtImg
              :src="artist.src"
              :alt="`Portrait of ${artist.name}`"
              width="800" height="800" loading="lazy"
              sizes="xs:44vw sm:30vw md:30vw lg:15vw xl:15vw xxl:15vw"
              class="aspect-square w-full object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
            />
            <p class="mt-4 font-display text-base leading-snug text-chalk/80">{{ artist.name }}</p>
          </li>
        </ul>

        <!-- Contact lives here and in the footer, nowhere else. -->
        <div data-wipe class="mt-24 border-t border-chalk/12 pt-10">
          <h2 class="max-w-xl font-display text-recital text-chalk">
            Questions, or want to perform with us?
          </h2>
          <p class="mt-5 max-w-md leading-relaxed text-chalk/70">
            {{ site.name }} is based in {{ site.location }}, and is a {{ site.status }}.
          </p>
          <p class="mt-6">
            <a
              :href="`mailto:${site.email}`"
              data-cursor="write"
              class="group inline-flex items-center gap-3 border-b border-spot pb-2 text-sm text-spot"
            >
              {{ site.email }}
              <span class="transition-transform duration-500 ease-silk group-hover:translate-x-2" aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </div>
    </section>

    <ActOvation show-other-ways />
  </div>
</template>
