<script setup lang="ts">
import { arudra2026 } from '~/data/arudra'

useSeo({
  title: 'Arudra 2026 — All Flyers',
  description:
    'Every flyer, banner, and artist announcement from Arudra 2026 at the Jewish Community Center of Houston.',
  image: '/images/events/all-program-flyer.webp',
})

const all = [...arudra2026.flyers, ...arudra2026.artistCards]
  .map((f) => ({ src: f.src, width: f.w, height: f.h, alt: f.alt }))
</script>

<template>
  <div>
    <PageOverture
      rubric="Arudra 2026"
      title="Every flyer"
      :lede="`All ${all.length} announcements, banners, and artist cards from the festival.`"
      image="/images/home/home-7.webp"
    />
    <ActGallery :photos="all" heading="The full set" rubric="Archive" />
    <ActOvation />
  </div>
</template>
