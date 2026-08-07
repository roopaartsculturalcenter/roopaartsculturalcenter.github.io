<script setup lang="ts">
/**
 * An edge-to-edge scrolling strip of flyers.
 *
 * The list is duplicated so the CSS translate can loop seamlessly at -50%;
 * the duplicate is aria-hidden so screen readers announce each flyer once.
 * Hovering pauses it, and reduced motion turns it into a normal horizontal
 * scroll region the user drives themselves.
 */
const props = withDefaults(
  defineProps<{
    items: { src: string; w: number; h: number; alt: string }[]
    /** Seconds for one full pass. */
    speed?: number
  }>(),
  { speed: 55 },
)

const { reduced } = useMotionPreference()
</script>

<template>
  <div
    class="group relative w-full overflow-x-auto py-2 motion-reduce:snap-x"
    :class="!reduced && 'overflow-hidden'"
    :role="reduced ? 'region' : undefined"
    :aria-label="reduced ? 'Festival flyers' : undefined"
    :tabindex="reduced ? 0 : undefined"
  >
    <div
      class="flex w-max gap-5 motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused] motion-safe:group-focus-within:[animation-play-state:paused]"
      :style="{ animationDuration: `${props.speed}s` }"
    >
      <ul v-for="pass in 2" :key="pass" class="flex shrink-0 gap-5" :aria-hidden="pass === 2">
        <li
          v-for="item in items"
          :key="`${pass}-${item.src}`"
          class="w-52 shrink-0 sm:w-64"
        >
          <NuxtImg
            :src="item.src"
            :alt="pass === 1 ? item.alt : ''"
            :width="item.w"
            :height="item.h"
            loading="lazy"
            sizes="256px"
            class="aspect-square w-full rounded-xl bg-maroon-deep object-contain shadow-[0_10px_40px_-20px_rgba(42,10,14,0.6)]"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
