<script setup lang="ts">
/**
 * The photo wall.
 *
 * Photographs only. Event posters and artist announcement cards used to be mixed
 * in here, which made half the gallery marketing collateral; they live on /events
 * and /arudra now.
 *
 * The filter row is gone with them. It offered "Everything" and one group, which
 * after the posters left would have been the same set twice — a control that
 * cannot change anything is worse than no control.
 */
import { allGalleryImages } from '~/content/gallery'

useSeo({
  title: 'Gallery',
  description:
    'Photographs from Roopa Arts Cultural Center productions: dance, music, and ' +
    'community celebrations on stages across Texas.',
  image: '/images/gallery/racc-gallery5.webp',
})
</script>

<template>
  <div>
    <PageOverture
      title="Every frame we have kept."
      :lede="`${allGalleryImages.length} photographs from our stage. Select any to open it larger; arrow keys move between them.`"
      image="/images/home/home-6.webp"
    />

    <ActGallery
      :photos="allGalleryImages"
      heading="From the stage."
      rubric="Select any photograph to open it"
    />
  </div>
</template>
