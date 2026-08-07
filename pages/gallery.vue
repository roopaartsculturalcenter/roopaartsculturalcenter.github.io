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
    <PageOverture
      rubric="Applause"
      title="Gallery"
      :lede="`${galleryPhotos.length} photographs from our stage. Select any to open it larger; arrow keys move between them.`"
      image="/images/home/home-6.webp"
    />
    <ActGallery :photos="galleryPhotos" heading="Every frame" rubric="The archive" />
  </div>
</template>
