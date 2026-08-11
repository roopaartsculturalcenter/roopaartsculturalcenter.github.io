<script setup lang="ts">
/**
 * The programme book for a production: narrative, verses, translations, ragas.
 *
 * Built as a playbill rather than a plain accordion. The first version was a bare
 * list of six titles behind a "+", which told a reader nothing about what was inside
 * and looked nothing like the rest of the site. Three things fix that:
 *
 *  - a collapsed scene still carries its one-line synopsis, so the closed state is
 *    informative and the whole production can be read at a glance
 *  - the scene number is set in the display face at display size, the same device
 *    the featured scene and the event cards use, and a gold rule runs down the list
 *    like a running order on a playbill
 *  - the affordance says "Read the scene" instead of showing a bare "+"
 *
 * Verses keep their line breaks exactly: devotional text in Sanskrit and Tamil
 * transliteration, where the break is part of the metre.
 */
import type { ArudraProgramme } from '~/data/arudra'

const props = defineProps<{ programme: ArudraProgramme; title: string }>()

const root = ref<HTMLElement | null>(null)
useEntrance(root)

/** Which scene is expanded. One at a time: six open at once buries the credits. */
const open = ref<number | null>(props.programme.scenes[0]?.n ?? null)

/**
 * Spacing for a run of short lines.
 *
 * The source page uses <p> for BOTH paragraph breaks and line breaks, making no
 * distinction, so no rule can classify every block correctly. The data pass that
 * merges obvious poetic runs into stanzas therefore leaves strays — a 49-character
 * line was one over its threshold and split a translation into fragments, each then
 * taking a full paragraph gap.
 *
 * So spacing is decided here instead of by mutating the transcription: a short line
 * following another short line is a continuation and closes up. Getting it wrong
 * costs a few pixels of margin rather than a garbled verse.
 */
const SHORT = 70
type Block = ArudraProgramme['scenes'][number]['blocks'][number]

const isShortLine = (b?: Block) =>
  !!b && ((b.kind === 'prose' && b.text.length <= SHORT) || b.kind === 'stanza')

/** Tight when this line continues a run, roomy when it opens one. */
function gap(blocks: Block[], i: number): string {
  const self = blocks[i]
  if (!isShortLine(self)) return 'mt-5'
  return isShortLine(blocks[i - 1]) ? 'mt-1.5' : 'mt-6'
}
</script>

<template>
  <section ref="root" class="bg-stage-deep py-24 lg:py-32" aria-labelledby="programme-heading">
    <div class="stage-pad">
      <div class="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
        <div class="lg:col-span-8">
          <p data-wipe class="rubric">The programme</p>
          <h2
            id="programme-heading"
            data-wipe
            class="mt-6 max-w-2xl font-display text-grand text-chalk"
          >
            {{ title }}
          </h2>
        </div>
        <p data-wipe class="text-sm text-chalk/70 lg:col-span-4 lg:text-right">
          {{ programme.scenes.length }} scenes
        </p>
      </div>

      <p data-wipe class="mt-8 max-w-2xl leading-relaxed text-chalk/82">
        {{ programme.invitation }}
      </p>

      <!-- The running order. A gold rule down the left edge ties the scenes into one
           sequence, the way a playbill lists them. Native <details> so it works with
           JavaScript off and is keyboard-operable for free. -->
      <div data-wipe class="mt-16 border-l border-spot/30 pl-6 sm:pl-10">
        <details
          v-for="scene in programme.scenes"
          :key="scene.n"
          :open="open === scene.n"
          class="group border-b border-chalk/12 first:border-t"
          @toggle="(e: Event) => { if ((e.target as HTMLDetailsElement).open) open = scene.n }"
        >
          <summary
            data-cursor="view"
            class="grid cursor-pointer list-none grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-8 marker:hidden sm:grid-cols-[auto_1fr_auto] [&::-webkit-details-marker]:hidden"
          >
            <!-- Scene numeral in the display face, the site's own device for numbers.
                 Full `text-spot-ink`, not /70: at 36px the faded version measured
                 2.97:1 against the 3:1 large-text floor. The hover cue lives on the
                 title instead, which does not need to carry contrast. -->
            <span class="font-display text-3xl leading-none text-spot-ink sm:text-4xl">
              {{ String(scene.n).padStart(2, '0') }}
            </span>

            <span class="min-w-0">
              <span
                class="block font-display text-recital text-chalk transition-colors duration-300 group-hover:text-spot-ink"
              >
                {{ scene.title }}
              </span>
              <!-- Visible while collapsed, so the closed list reads as a synopsis of
                   the whole production rather than six opaque titles. -->
              <span class="mt-2 block max-w-xl text-sm leading-relaxed text-chalk/70">
                {{ scene.summary }}
              </span>
            </span>

            <span
              class="col-start-2 flex items-center gap-2 text-xs uppercase tracking-rubric text-spot-ink sm:col-start-3 sm:self-center"
            >
              <span class="group-open:hidden">Read the scene</span>
              <span class="hidden group-open:inline">Close</span>
              <svg
                class="h-3 w-3 shrink-0 transition-transform duration-500 ease-silk group-open:rotate-180"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </summary>

          <div class="max-w-2xl pb-14 pt-2">
            <template v-for="(block, i) in scene.blocks" :key="i">
              <p v-if="block.kind === 'raga'" class="mt-10 rubric">{{ block.text }}</p>

              <!-- Consecutive verses are one passage with stanza breaks, not separate
                   quotations, so they close up. Scene 6's thillana arrives as fifteen
                   one-line verse blocks and at full margin it fell apart down the
                   page. -->
              <p
                v-else-if="block.kind === 'verse'"
                :class="[
                  'whitespace-pre-line border-l-2 border-spot/40 pl-6 font-display text-lg leading-relaxed text-chalk/85',
                  scene.blocks[i - 1]?.kind === 'verse' ? 'mt-2' : 'mt-7',
                ]"
              >{{ block.lines.join('\n') }}</p>

              <!-- A poetic run: line breaks preserved, no gap between the lines. -->
              <p
                v-else-if="block.kind === 'stanza'"
                :class="['whitespace-pre-line leading-relaxed text-chalk/82', gap(scene.blocks, i)]"
              >{{ block.lines.join('\n') }}</p>

              <p
                v-else
                :class="['leading-relaxed text-chalk/82', gap(scene.blocks, i)]"
              >{{ block.text }}</p>
            </template>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
