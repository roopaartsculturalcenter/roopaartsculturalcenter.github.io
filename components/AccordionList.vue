<script setup lang="ts">
import type { AccordionItem } from '~/data/about'

/**
 * Disclosure list using real `button` + `aria-expanded` + region semantics
 * rather than `<details>`, so the panel height can be animated.
 *
 * The open/close animates `grid-template-rows` between 0fr and 1fr — the one
 * way to transition to an element's intrinsic height without measuring it in JS.
 */
const props = defineProps<{ items: AccordionItem[]; defaultOpen?: string }>()

const openId = ref<string | null>(props.defaultOpen ?? props.items[0]?.id ?? null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div class="divide-y divide-chalk/12 border-y border-chalk/12">
    <div v-for="item in items" :key="item.id">
      <h3>
        <button
          :id="`acc-btn-${item.id}`"
          type="button"
          class="flex w-full items-center justify-between gap-8 py-7 text-left transition-colors duration-300 hover:text-spot"
          :aria-expanded="openId === item.id"
          :aria-controls="`acc-panel-${item.id}`"
          @click="toggle(item.id)"
        >
          <span class="font-display text-recital text-chalk">{{ item.title }}</span>
          <span
            class="relative flex h-8 w-8 shrink-0 items-center justify-center border transition-colors duration-500"
            :class="openId === item.id ? 'border-spot bg-spot text-stage' : 'border-chalk/25 text-chalk'"
            aria-hidden="true"
          >
            <span class="block h-px w-3 bg-current" />
            <span
              class="absolute block h-3 w-px bg-current transition-transform duration-500 ease-silk"
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
          <div class="pb-10 pr-2 sm:pr-16">
            <p
              v-for="(para, i) in item.body"
              :key="i"
              class="max-w-prose leading-relaxed text-chalk/65"
              :class="i > 0 && 'mt-5'"
            >
              {{ para }}
            </p>

            <ul v-if="item.points" class="mt-9 grid gap-6 sm:grid-cols-2">
              <li
                v-for="point in item.points"
                :key="point.title"
                class="border-l border-spot/40 pl-5"
              >
                <p class="font-display text-lg text-chalk">{{ point.title }}</p>
                <p class="mt-2 text-sm leading-relaxed text-chalk/60">{{ point.text }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
