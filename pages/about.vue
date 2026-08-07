<script setup lang="ts">
import { site } from '~/data/site'
import { story, accordions } from '~/data/about'
import { featuredArtists } from '~/data/arudra'

useSeo({
  title: 'About',
  description:
    'Roopa Arts Cultural Center is a Texas 501(c)(3) public charity built by artists and art lovers — ' +
    'our story, mission, vision, and community impact.',
  image: '/images/about/racc-about.webp',
})
</script>

<template>
  <div>
    <PageHero
      kicker="How It Began"
      title="About Roopa Arts Cultural Center"
      lede="A public charity built by artists and art lovers, creating stages where the classical arts of India thrive."
      image="/images/banners/banner-1.webp"
      image-alt=""
    />

    <!-- Story -->
    <AppSection labelledby="story-heading">
      <div class="grid items-start gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div>
          <p data-reveal class="kicker rule-gold">Our Story</p>
          <h2 id="story-heading" data-reveal class="mt-5 text-display-md">How it began</h2>
          <p
            v-for="(para, i) in story"
            :key="i"
            data-reveal
            class="mt-6 text-lg leading-relaxed text-ink/75"
          >
            {{ para }}
          </p>
        </div>

        <div data-reveal class="relative">
          <MandalaAccent
            class="absolute -left-10 -top-10 h-32 w-32 text-gold-deep/25"
            :petals="12"
          />
          <NuxtImg
            src="/images/about/racc-about.webp"
            alt="Flowers presented on stage at a Roopa Arts Cultural Center performance"
            width="557"
            height="800"
            sizes="sm:80vw lg:40vw"
            loading="lazy"
            class="relative w-full rounded-2xl object-cover shadow-[0_30px_70px_-40px_rgba(42,10,14,0.7)]"
          />
        </div>
      </div>
    </AppSection>

    <!-- Accordions -->
    <AppSection tone="dim" labelledby="more-heading">
      <div class="mx-auto max-w-3xl">
        <p data-reveal class="kicker rule-gold">In Depth</p>
        <h2 id="more-heading" data-reveal class="mt-5 text-display-md">
          Vision, programmes, and impact
        </h2>

        <div class="mt-12">
          <AccordionList :items="accordions" default-open="vision" />
        </div>
      </div>
    </AppSection>

    <!-- Artists -->
    <AppSection labelledby="artists-heading">
      <div class="max-w-prose">
        <p data-reveal class="kicker rule-gold">On Our Stage</p>
        <h2 id="artists-heading" data-reveal class="mt-5 text-display-md">Featured artists</h2>
      </div>

      <ul class="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
        <li v-for="artist in featuredArtists" :key="artist.name" data-reveal class="text-center">
          <NuxtImg
            :src="artist.src"
            :alt="`Portrait of ${artist.name}`"
            width="800"
            height="800"
            sizes="xs:40vw sm:28vw lg:14vw"
            loading="lazy"
            class="aspect-square w-full rounded-full object-cover ring-1 ring-gold/30"
          />
          <p class="mt-4 font-display text-base leading-snug">{{ artist.name }}</p>
        </li>
      </ul>
    </AppSection>

    <!-- Nonprofit status -->
    <AppSection tone="maroon" size="tight" labelledby="charity-heading">
      <div class="mx-auto max-w-2xl text-center">
        <h2 id="charity-heading" data-reveal class="text-display-md">A {{ site.status }}</h2>
        <p data-reveal class="mt-6 text-lg leading-relaxed text-ivory/80">
          Donations to {{ site.name }} are tax-deductible to the extent allowed by law
          and eligible for employer matching.
        </p>
        <div data-reveal class="mt-9">
          <AppButton to="/donate">Support our work</AppButton>
        </div>
      </div>
    </AppSection>
  </div>
</template>
