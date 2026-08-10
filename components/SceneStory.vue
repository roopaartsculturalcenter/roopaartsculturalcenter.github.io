<script setup lang="ts">
/**
 * SCENE 3 — Who we are.
 *
 * The archive's one leadership photograph beside the published story copy. Stands
 * in for the verse recitation on the home page, where a photograph earns its place
 * more than a third full-viewport type treatment does; /about still recites it.
 */
import { storyScene } from '~/data/about'

withDefaults(defineProps<{ cta?: boolean }>(), { cta: false })

const root = ref<HTMLElement | null>(null)
useEntrance(root)
</script>

<template>
  <section
    ref="root"
    class="border-b border-chalk/10 bg-stage-deep py-24 lg:py-32"
    aria-labelledby="story-heading"
  >
    <div class="stage-pad grid gap-14 lg:grid-cols-12 lg:gap-20">
      <figure data-wipe class="lg:col-span-5">
        <NuxtImg
          :src="storyScene.image"
          :alt="storyScene.imageAlt"
          width="557"
          height="800"
          loading="lazy"
          sizes="xs:88vw sm:88vw md:70vw lg:40vw xl:38vw xxl:38vw"
          class="w-full object-cover"
        />
      </figure>

      <div class="lg:col-span-7 lg:self-center">
        <h2 id="story-heading" data-wipe class="max-w-xl font-display text-grand text-chalk">
          {{ storyScene.heading }}
        </h2>

        <p
          v-for="(para, i) in storyScene.body"
          :key="i"
          data-wipe
          class="mt-7 max-w-xl leading-relaxed text-chalk/80"
        >
          {{ para }}
        </p>

        <NuxtLink
          v-if="cta"
          to="/about"
          data-wipe
          data-cursor="view"
          class="group mt-12 inline-flex items-center gap-3 border-b border-spot pb-2 text-sm uppercase tracking-rubric text-spot-ink"
        >
          Our story
          <span
            class="transition-transform duration-500 ease-silk group-hover:translate-x-2"
            aria-hidden="true"
          >→</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
