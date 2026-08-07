<script setup lang="ts">
import type { AccordionItem } from '~/data/about'

/**
 * Disclosure list. Uses real <button aria-expanded> + region semantics rather
 * than <details>, so the open/close height can be animated.
 */
const props = defineProps<{ items: AccordionItem[]; defaultOpen?: string }>()

const openId = ref<string | null>(props.defaultOpen ?? props.items[0]?.id ?? null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div class="divide-y divide-ink/10 border-y border-ink/10">
    <div v-for="item in items" :key="item.id" data-reveal>
      <h3>
        <button
          :id="`acc-btn-${item.id}`"
          type="button"
          class="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-maroon"
          :aria-expanded="openId === item.id"
          :aria-controls="`acc-panel-${item.id}`"
          @click="toggle(item.id)"
        >
          <span class="font-display text-xl sm:text-2xl">{{ item.title }}</span>
          <span
            class="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 transition-colors duration-300"
            :class="openId === item.id && 'border-gold bg-gold text-maroon-deep'"
            aria-hidden="true"
          >
            <span class="block h-px w-3.5 bg-current" />
            <span
              class="absolute block h-3.5 w-px bg-current transition-transform duration-300 ease-silk"
              :class="openId === item.id && 'scale-y-0'"
            />
          </span>
        </button>
      </h3>

      <div
        :id="`acc-panel-${item.id}`"
        role="region"
        :aria-labelledby="`acc-btn-${item.id}`"
        class="grid transition-[grid-template-rows] duration-500 ease-silk"
        :style="{ gridTemplateRows: openId === item.id ? '1fr' : '0fr' }"
      >
        <div class="overflow-hidden">
          <div class="pb-8 pr-4 sm:pr-14">
            <p
              v-for="(para, i) in item.body"
              :key="i"
              class="max-w-prose leading-relaxed text-ink/75"
              :class="i > 0 && 'mt-4'"
            >
              {{ para }}
            </p>

            <ul v-if="item.points" class="mt-7 grid gap-5 sm:grid-cols-2">
              <li
                v-for="point in item.points"
                :key="point.title"
                class="rounded-xl bg-ivory-dim/60 p-5"
              >
                <p class="font-display text-lg">{{ point.title }}</p>
                <p class="mt-2 text-sm leading-relaxed text-ink/70">{{ point.text }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
