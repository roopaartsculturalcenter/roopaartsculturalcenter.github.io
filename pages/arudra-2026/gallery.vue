<script setup lang="ts">
import { arudra2026 } from '~/data/arudra'

useSeo({
  title: 'Arudra 2026 — All Flyers',
  description:
    'Every flyer, banner, and artist announcement from Arudra 2026 at the Jewish Community Center of Houston.',
  image: '/images/events/all-program-flyer.webp',
})

const all = [...arudra2026.flyers, ...arudra2026.artistCards].map((f) => ({
  src: f.src,
  width: f.w,
  height: f.h,
  alt: f.alt,
}))
</script>

<template>
  <div>
    <PageHero
      kicker="Arudra 2026"
      title="Every flyer"
      :lede="`All ${all.length} announcements, banners, and artist cards from the festival.`"
      image="/images/banners/banner-3.webp"
    />

    <AppSection labelledby="all-flyers-heading">
      <h2 id="all-flyers-heading" class="sr-only">All Arudra 2026 flyers</h2>

      <div data-reveal class="mb-12">
        <AppButton to="/arudra-2026" variant="outline">← Back to Arudra 2026</AppButton>
      </div>

      <PhotoGallery :photos="all" />
    </AppSection>

    <DonateBand />
  </div>
</template>
