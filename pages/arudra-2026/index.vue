<script setup lang="ts">
import { arudra2026 } from '~/data/arudra'

useSeo({
  title: 'Arudra 2026',
  description:
    'Arudra 2026 — Trilokya Nada, a Veena-Violin duet, Navagrahamum Navakailasamum, and Thiruvadhirai ' +
    'Threads, at the Jewish Community Center of Houston.',
  image: '/images/events/all-program-flyer.webp',
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Festival',
      name: arudra2026.title,
      startDate: arudra2026.isoDate,
      description: arudra2026.intro,
      location: { '@type': 'Place', name: arudra2026.venue },
      organizer: { '@type': 'NGO', name: 'Roopa Arts Cultural Center' },
      eventStatus: 'https://schema.org/EventScheduled',
    }),
  }],
})

const programmeRoot = ref<HTMLElement | null>(null)
useEntrance(programmeRoot)

const flyers = arudra2026.flyers.map((f) => ({ src: f.src, width: f.w, height: f.h, alt: f.alt }))
</script>

<template>
  <div>
    <PageOverture
      rubric="The signature festival"
      title="Arudra 2026"
      :lede="`${arudra2026.date} · ${arudra2026.venue}`"
      image="/images/misc/final.webp"
    />

    <section ref="programmeRoot" class="bg-stage py-28 lg:py-36" aria-labelledby="prog-heading">
      <div class="stage-pad grid gap-16 lg:grid-cols-[1fr_1.15fr] lg:gap-24">
        <div data-wipe>
          <NuxtImg
            src="/images/events/all-program-flyer.webp"
            alt="Arudra 2026 full programme flyer"
            width="1080" height="1080" loading="lazy"
            sizes="xs:88vw sm:88vw md:80vw lg:45vw xl:45vw xxl:45vw"
            class="w-full bg-stage-raised object-contain"
          />
        </div>

        <div>
          <p data-wipe class="rubric">The programme</p>
          <h2 id="prog-heading" data-wipe class="mt-6 font-display text-monumental text-chalk">
            One afternoon,<br >four experiences
          </h2>
          <p data-wipe class="mt-8 max-w-lg leading-relaxed text-chalk/65">{{ arudra2026.intro }}</p>

          <ol class="mt-12">
            <li
              v-for="(item, i) in arudra2026.programme"
              :key="item.title"
              data-wipe
              class="flex gap-6 border-t border-chalk/12 py-6"
            >
              <span class="font-display text-sm tabular-nums text-spot">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span>
                <span class="block font-display text-recital text-chalk">{{ item.title }}</span>
                <span v-if="item.note" class="mt-1 block text-sm text-chalk/50">{{ item.note }}</span>
              </span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <ActFilmstrip />

    <section class="bg-stage py-28 lg:py-36" aria-labelledby="featured-heading">
      <div class="stage-pad mx-auto max-w-3xl text-center">
        <p class="rubric">Featured production</p>
        <h2 id="featured-heading" class="mt-6 font-display text-monumental text-chalk">
          {{ arudra2026.featured.title }}
        </h2>
        <p class="mt-8 leading-relaxed text-chalk/65">{{ arudra2026.featured.body }}</p>
        <NuxtLink
          to="/arudra-2026/gallery"
          data-cursor="view"
          class="mt-12 inline-block border border-spot px-10 py-4 text-xs font-semibold uppercase tracking-rubric text-spot transition-colors duration-500 hover:bg-spot hover:text-stage"
        >
          Every flyer
        </NuxtLink>
      </div>
    </section>

    <ActGallery :photos="flyers" heading="Announcements" rubric="The paper trail" />
    <ActOvation />
  </div>
</template>
