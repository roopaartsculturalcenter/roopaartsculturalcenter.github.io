<script setup lang="ts">
import { site } from '~/data/site'
import { galleryPhotos } from '~/data/gallery'

/** One continuous choreographed scroll, structured as acts. */
useSeo({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  bare: true,
})
useOrganisationSchema()

const curtainDone = ref(false)
</script>

<template>
  <div>
    <TheCurtain @done="curtainDone = true" />

    <ActInvocation :curtain-done="curtainDone" />
    <ActMission />
    <ActPlaybill :show-past="false" heading="Now booking" rubric="Act II · The Playbill" />
    <ActFilmstrip />
    <ActGallery :photos="galleryPhotos" :limit="12" />
    <ActOvation />
  </div>
</template>
