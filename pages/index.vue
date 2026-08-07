<script setup lang="ts">
import { site } from '~/data/site'

/**
 * The home page is one continuous choreographed scroll, structured as acts.
 * Acts 0–2 are built; 3–7 follow.
 */
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

    <!-- ACT 1 + ACT 2 -->
    <ActInvocation :curtain-done="curtainDone" />

    <!-- Acts 3–7 land here. This placeholder exists so the pinned scene above
         has real scroll runway beneath it to hand off into. -->
    <section class="relative flex min-h-[70svh] items-center bg-stage">
      <div class="stage-pad">
        <p class="rubric mb-6">Act III</p>
        <p class="max-w-xl font-display text-recital text-chalk/40">
          How It Began, the Playbill, Arudra 2026, the Gallery, and the Standing
          Ovation are next.
        </p>
      </div>
    </section>
  </div>
</template>
