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
  script: [
    {
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
    },
  ],
})

/** The masonry gallery shows a slice; the rest live on the View All page. */
const preview = [...arudra2026.flyers, ...arudra2026.artistCards].slice(0, 10)
</script>

<template>
  <div>
    <PageHero
      kicker="Signature Festival"
      title="Arudra 2026"
      :lede="`${arudra2026.date} · ${arudra2026.venue}`"
      image="/images/misc/final.webp"
    />

    <!-- Programme -->
    <AppSection labelledby="programme-heading">
      <div class="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div data-reveal>
          <NuxtImg
            src="/images/events/all-program-flyer.webp"
            alt="Arudra 2026 full programme flyer"
            width="1080"
            height="1080"
            sizes="sm:85vw lg:45vw"
            loading="lazy"
            class="w-full rounded-2xl shadow-[0_30px_70px_-40px_rgba(42,10,14,0.7)]"
          />
        </div>

        <div>
          <p data-reveal class="kicker rule-gold">The Programme</p>
          <h2 id="programme-heading" data-reveal class="mt-5 text-display-md">
            One afternoon, four experiences
          </h2>
          <p data-reveal class="mt-6 text-lg leading-relaxed text-ink/75">
            {{ arudra2026.intro }}
          </p>

          <ol data-reveal class="mt-9 space-y-0">
            <li
              v-for="(item, i) in arudra2026.programme"
              :key="item.title"
              class="flex gap-5 border-t border-ink/10 py-5"
            >
              <span class="mt-1 font-display text-sm tabular-nums text-gold-deep">
                {{ String(i + 1).padStart(2, '0') }}
              </span>
              <span>
                <span class="block font-display text-xl">{{ item.title }}</span>
                <span v-if="item.note" class="mt-1 block text-sm text-ink/70">{{ item.note }}</span>
              </span>
            </li>
          </ol>
        </div>
      </div>
    </AppSection>

    <!-- Featured production -->
    <AppSection tone="dark" size="tight" labelledby="featured-heading">
      <template #decor>
        <MandalaAccent
          class="absolute -left-24 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 text-gold/[0.07]"
          :petals="18"
          spin
        />
      </template>

      <div class="mx-auto max-w-3xl text-center">
        <p data-reveal class="kicker">Featured Production</p>
        <h2 id="featured-heading" data-reveal class="mt-5 text-display-md">
          {{ arudra2026.featured.title }}
        </h2>
        <p data-reveal class="mt-6 text-lg leading-relaxed text-ivory/80">
          {{ arudra2026.featured.body }}
        </p>
      </div>

      <div data-reveal class="mt-14 -mx-5 sm:-mx-8 lg:-mx-12">
        <FlyerMarquee :items="arudra2026.artistCards" :speed="70" />
      </div>
    </AppSection>

    <!-- Masonry gallery -->
    <AppSection tone="dim" labelledby="flyers-heading">
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div class="max-w-prose">
          <p data-reveal class="kicker rule-gold">Announcements</p>
          <h2 id="flyers-heading" data-reveal class="mt-5 text-display-md">Festival flyers</h2>
        </div>
        <div data-reveal>
          <AppButton to="/arudra-2026/gallery" variant="outline">View all</AppButton>
        </div>
      </div>

      <div class="mt-14">
        <PhotoGallery
          :photos="preview.map((f) => ({ src: f.src, width: f.w, height: f.h, alt: f.alt }))"
          columns="columns-2 sm:columns-3 lg:columns-4"
        />
      </div>

      <div data-reveal class="mt-10">
        <AppButton to="/arudra-2026/gallery">See every flyer</AppButton>
      </div>
    </AppSection>

    <DonateBand />
  </div>
</template>
