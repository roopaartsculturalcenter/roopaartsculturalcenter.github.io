<script setup lang="ts">
import { galleryGroups, allGalleryImages } from '~/content/gallery'

useSeo({
  title: 'Gallery',
  description:
    'Photographs and flyers from Roopa Arts Cultural Center productions — dance, music, and ' +
    'community celebrations on stages across Texas.',
  image: '/images/gallery/racc-gallery1.webp',
})

const active = ref<string>('all')

const filters = computed(() => [
  { key: 'all', label: 'Everything', count: allGalleryImages.length },
  ...galleryGroups.map((g) => ({ key: g.eventName, label: g.eventName, count: g.images.length })),
])

const shown = computed(() =>
  active.value === 'all'
    ? allGalleryImages
    : galleryGroups.find((g) => g.eventName === active.value)?.images ?? [],
)
</script>

<template>
  <div>
    <PageOverture
      title="Every frame we have kept."
      :lede="`${allGalleryImages.length} photographs and flyers from our stage. Select any to open it larger; arrow keys move between them.`"
      image="/images/home/home-6.webp"
    />

    <section class="bg-stage pt-16" aria-label="Filter the gallery">
      <div class="stage-pad flex flex-wrap gap-3">
        <button
          v-for="f in filters"
          :key="f.key"
          type="button"
          :aria-pressed="active === f.key"
          class="border px-5 py-2.5 text-xs uppercase tracking-rubric transition-colors duration-300"
          :class="active === f.key
            ? 'border-spot bg-spot text-stage'
            : 'border-chalk/20 text-chalk/70 hover:border-spot hover:text-spot'"
          @click="active = f.key"
        >
          {{ f.label }}
          <span class="ml-2 tabular-nums opacity-60">{{ f.count }}</span>
        </button>
      </div>
    </section>

    <!-- Keying on the filter rebuilds the grid so the reveal and the lightbox's
         index arithmetic both restart cleanly against the new set. -->
    <ActGallery
      :key="active"
      :photos="shown"
      heading="From the stage."
      rubric="Select any photograph to open it"
    />
  </div>
</template>
