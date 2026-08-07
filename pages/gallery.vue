<script setup lang="ts">
import { galleryPhotos } from '~/data/gallery'

useSeo({
  title: 'Gallery',
  description:
    'Photographs from Roopa Arts Cultural Center productions — dance, music, and community celebrations ' +
    'on stages across Texas.',
  image: '/images/gallery/racc-gallery1.webp',
})
</script>

<template>
  <div>
    <PageHero
      kicker="Moments"
      title="Gallery"
      :lede="`${galleryPhotos.length} photographs from our stage — dancers, musicians, and the community that fills the hall.`"
      image="/images/banners/banner-2.webp"
    />

    <AppSection labelledby="gallery-heading">
      <h2 id="gallery-heading" class="sr-only">Performance photographs</h2>
      <p data-reveal class="mb-12 max-w-prose text-sm text-ink/70">
        Select any photograph to open it larger. Use the arrow keys to move between photographs
        and Escape to close.
      </p>

      <PhotoGallery :photos="galleryPhotos" />
    </AppSection>

    <DonateBand />
  </div>
</template>
