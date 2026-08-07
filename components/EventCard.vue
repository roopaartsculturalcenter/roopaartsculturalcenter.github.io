<script setup lang="ts">
import type { RaccEvent } from '~/data/events'

const props = defineProps<{ event: RaccEvent; priority?: boolean }>()

const card = ref<HTMLElement | null>(null)
useMagnetic(card, 0.05)

const isUpcoming = computed(() => props.event.status === 'upcoming')
</script>

<template>
  <article
    ref="card"
    data-reveal
    class="card-lift group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_24px_-12px_rgba(42,10,14,0.35)] ring-1 ring-ink/5"
  >
    <!-- Flyers are designed artwork with text to the edges, so they are fitted
         rather than cropped. The maroon field behind the letterboxing is
         deliberate; cropping would cut off artist names and dates. -->
    <div class="relative overflow-hidden bg-maroon-deep">
      <NuxtImg
        :src="event.image"
        :alt="event.alt"
        :width="event.width"
        :height="event.height"
        :loading="priority ? 'eager' : 'lazy'"
        :preload="priority"
        sizes="xs:100vw sm:50vw md:50vw lg:33vw xl:33vw xxl:33vw"
        class="aspect-[4/5] w-full object-contain transition-transform duration-700 ease-silk group-hover:scale-[1.03] motion-reduce:transform-none"
      />
      <span
        v-if="isUpcoming"
        class="absolute left-4 top-4 rounded-full bg-gold px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-maroon-deep"
      >
        Upcoming
      </span>
    </div>

    <div class="flex flex-1 flex-col p-6 sm:p-7">
      <h3 class="text-2xl leading-tight">
        <NuxtLink v-if="event.to" :to="event.to" class="after:absolute after:inset-0">
          {{ event.title }}
        </NuxtLink>
        <template v-else>{{ event.title }}</template>
      </h3>

      <p v-if="event.date || event.venue" class="mt-3 text-sm font-medium text-gold-deep">
        <time v-if="event.date" :datetime="event.isoDate">{{ event.date }}</time>
        <span v-if="event.date && event.venue" aria-hidden="true"> · </span>
        <span v-if="event.venue">{{ event.venue }}</span>
      </p>

      <p v-if="event.description" class="mt-4 flex-1 leading-relaxed text-ink/70">
        {{ event.description }}
      </p>

      <div v-if="event.rsvpUrl" class="relative z-10 mt-7">
        <AppButton :href="event.rsvpUrl" class="w-full sm:w-auto">
          {{ event.rsvpLabel ?? 'RSVP' }}
          <span class="sr-only"> for {{ event.title }}</span>
        </AppButton>
      </div>
    </div>
  </article>
</template>
