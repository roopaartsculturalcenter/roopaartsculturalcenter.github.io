<script setup lang="ts">
/**
 * Mailing list sign-up. Lives in the footer, so it is on every page.
 *
 * Three states, because a static site has no backend to lean on:
 *
 *  - `endpoint` not set: a mailto: link. Not a placeholder — it genuinely works, so
 *    there is a way to subscribe from the moment this ships, with no account
 *    anywhere and nothing to configure. See `mailingList` in data/site.ts.
 *  - mode 'fetch': posts in the background, thanks the reader in place.
 *  - mode 'native': a plain form POST into a new tab, for providers like Mailchimp
 *    that refuse cross-origin AJAX.
 *
 * The native path is also the no-JavaScript path: the markup is a real <form> with a
 * real action, so it submits without any of this script running.
 */
import { site } from '~/data/site'

const list = site.mailingList

const props = withDefaults(
  defineProps<{
    /** Display heading. The footer gives this real presence; set '' to drop it. */
    heading?: string
  }>(),
  { heading: 'Never miss a date.' },
)
const configured = computed(() => Boolean(list.endpoint))

const email = ref('')
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const message = ref('')

/** Honeypot. Bots fill every field they find; people never see this one. */
const trap = ref('')

const mailto = computed(() => {
  const subject = encodeURIComponent('Add me to the mailing list')
  const body = encodeURIComponent(
    'Please add me to the Roopa Arts Cultural Center mailing list.',
  )
  return `mailto:${site.email}?subject=${subject}&body=${body}`
})

async function onSubmit(e: Event) {
  // The native path must be left alone: preventing default would break the only
  // route that works for Mailchimp and the only one that works without JavaScript.
  if (!configured.value || list.mode === 'native') return
  e.preventDefault()

  if (trap.value) return // silently drop bots
  if (state.value === 'sending') return

  state.value = 'sending'
  message.value = ''

  try {
    const body = new FormData()
    body.append(list.field, email.value)

    const res = await fetch(list.endpoint!, {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    state.value = 'done'
    message.value = 'You are on the list. Watch for the next announcement.'
    email.value = ''
  } catch {
    // Never strand someone who typed their address in: hand them the email route.
    state.value = 'error'
    message.value = 'That did not go through. Email us and we will add you by hand.'
  }
}
</script>

<template>
  <div>
    <p class="rubric">Mailing list</p>

    <!-- `text-recital`, not `text-grand`: this sits in a column that narrows to about
         277px at the lg breakpoint, where grand wrapped the line onto three rows. -->
    <h2 v-if="props.heading" class="mt-5 font-display text-recital text-chalk">
      {{ props.heading }}
    </h2>

    <p class="mt-5 max-w-sm leading-relaxed text-chalk/74">
      Season announcements, new dates and the occasional note from backstage. A few
      times a year, never more.
    </p>

    <!-- Configured: a real form. `action`/`method` are set so it still submits with
         JavaScript disabled. -->
    <form
      v-if="configured"
      :action="list.endpoint!"
      method="POST"
      :target="list.mode === 'native' ? '_blank' : undefined"
      class="mt-7"
      @submit="onSubmit"
    >
      <label :for="'ml-email'" class="sr-only">Email address</label>

      <div class="flex flex-wrap items-stretch gap-2">
        <input
          id="ml-email"
          v-model="email"
          :name="list.field"
          type="email"
          required
          autocomplete="email"
          placeholder="you@example.com"
          class="min-w-0 flex-1 basis-48 border border-chalk/25 bg-stage px-5 py-4 text-chalk placeholder:text-chalk/66 focus-visible:border-spot"
        >
        <button
          type="submit"
          :disabled="state === 'sending'"
          class="shrink-0 bg-spot px-7 py-4 text-xs font-semibold uppercase tracking-rubric text-chalk transition-colors duration-500 hover:bg-spot-warm disabled:opacity-60"
        >
          {{ state === 'sending' ? 'Sending' : 'Sign up' }}
        </button>
      </div>

      <!-- Honeypot: hidden from people, offered to bots. `sr-only` would still be
           read out, so this is taken out of the tree entirely. -->
      <div class="hidden" aria-hidden="true">
        <label for="ml-trap">Leave this empty</label>
        <input id="ml-trap" v-model="trap" name="_gotcha" type="text" tabindex="-1">
      </div>

      <!-- aria-live so the outcome is announced, not just shown. -->
      <p
        v-if="message"
        :class="['mt-4 max-w-sm text-sm leading-relaxed', state === 'error' ? 'text-crimson-lit' : 'text-spot-ink']"
        role="status"
        aria-live="polite"
      >
        {{ message }}
      </p>

      <p class="mt-4 text-xs leading-relaxed text-chalk/70">
        Your address is used for these announcements only. Unsubscribe any time.
      </p>
    </form>

    <!-- Not configured: the mailto route, which works today. -->
    <p v-else class="mt-5">
      <a
        :href="mailto"
        class="group relative inline-block text-sm text-chalk/82 transition-colors hover:text-chalk"
      >
        Email us to join
        <span
          class="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-spot transition-transform duration-500 ease-silk group-hover:scale-x-100"
        />
      </a>
    </p>
  </div>
</template>
