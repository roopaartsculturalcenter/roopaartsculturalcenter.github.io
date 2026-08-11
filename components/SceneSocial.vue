<script setup lang="ts">
/**
 * HOME SCENE 5 — the live social feed.
 *
 * A real embed, not a link out: Facebook's Page Plugin renders the organisation's
 * actual timeline and keeps itself current. See `socialFeed` in data/site.ts for why
 * Facebook rather than Instagram, and what was tried first.
 *
 * Compact and unpinned. The home page already earned a complaint about endless
 * scrolling, so this sits in one screen and consumes no extra scroll.
 */
import { site } from '~/data/site'

const root = ref<HTMLElement | null>(null)
useEntrance(root, { stagger: 0.07 })

const feed = site.socialFeed

/**
 * The plugin URL, assembled here so the parameters are readable and typo-proof
 * rather than pasted as one long opaque string into config.
 */
const facebookSrc = computed(() => {
  const params = new URLSearchParams({
    href: feed.facebookPage,
    tabs: 'timeline',
    width: '500',
    height: String(feed.height),
    small_header: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'true',
  })
  return `https://www.facebook.com/plugins/page.php?${params.toString()}`
})

/** A provider embed wins when configured; otherwise the Facebook timeline. */
const src = computed(() => feed.embedUrl ?? facebookSrc.value)
</script>

<template>
  <!-- `border-b` because ActOvation below shares this tone. -->
  <section
    ref="root"
    class="border-b border-chalk/10 bg-stage-deep py-24 lg:py-32"
    aria-labelledby="social-heading"
  >
    <div class="stage-pad grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-20">
      <div class="lg:col-span-6">
        <p data-wipe class="rubric">Follow along</p>

        <h2
          id="social-heading"
          data-wipe
          class="mt-6 max-w-xl font-display text-grand text-chalk"
        >
          Announcements land here first.
        </h2>

        <p data-wipe class="mt-7 max-w-md leading-relaxed text-chalk/82">
          New productions, artist announcements and next season's dates go out on social
          before they reach this site. This is the live feed.
        </p>

        <ul data-wipe class="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          <li v-for="s in site.social" :key="s.href">
            <a
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              class="group inline-flex items-center gap-2 border-b border-spot pb-1 text-sm uppercase tracking-rubric text-spot-ink"
            >
              {{ s.label }}
              <span
                class="transition-transform duration-500 ease-silk group-hover:translate-x-1"
                aria-hidden="true"
              >→</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Deliberately NOT sandboxed.
           Tested both ways: with `sandbox="allow-scripts allow-popups"` the plugin
           renders its header and then spins forever, because an opaque origin denies
           it the storage access it needs. Unsandboxed it renders the timeline. The
           attributes below are the ones Facebook documents for this embed.

           The tradeoff is real and worth stating: an unsandboxed Facebook frame can
           set its own cookies. That is the cost of a live feed with no backend, and
           it belongs in a privacy notice if one is ever added. -->
      <div class="lg:col-span-6">
        <div data-wipe class="mx-auto w-full max-w-[500px] overflow-hidden bg-stage-raised ring-1 ring-chalk/10">
          <iframe
            :src="src"
            :title="feed.label"
            :height="feed.height"
            loading="lazy"
            scrolling="no"
            frameborder="0"
            allowfullscreen="true"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            class="block w-full border-0"
          />
        </div>
      </div>
    </div>
  </section>
</template>
