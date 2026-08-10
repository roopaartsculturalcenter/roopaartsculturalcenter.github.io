<script setup lang="ts">
import { site } from '~/data/site'

/** Home is a five-scene trailer. Anything that is not one of those five lives on
 *  its own page — no section is duplicated here. */
useSeo({
  title: `${site.name} · ${site.tagline}`,
  description: site.description,
  bare: true,
})
useOrganisationSchema()

const curtainDone = ref(false)
</script>

<template>
  <div>
    <TheCurtain @done="curtainDone = true" />

    <ActInvocation :curtain-done="curtainDone" />   <!-- 1 Hero -->
    <SceneFeatured />                               <!-- 2 Featured event -->
    <SceneStory cta />                              <!-- 3 Who we are -->
    <SceneArudraTeaser />                           <!-- 4 Arudra teaser -->
    <ActOvation show-other-ways />                  <!-- 5 The ask -->
  </div>
</template>
