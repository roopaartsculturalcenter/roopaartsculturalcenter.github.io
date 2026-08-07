<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

useHead({ title: is404.value ? 'Page not found' : 'Something went wrong' })
</script>

<template>
  <div class="on-dark flex min-h-screen flex-col items-center justify-center overflow-hidden bg-oxblood px-6 text-center text-ivory">
    <MandalaAccent
      class="pointer-events-none absolute h-[34rem] w-[34rem] text-gold/[0.07]"
      :petals="24"
      spin
    />

    <div class="relative">
      <p class="kicker">{{ error?.statusCode ?? 500 }}</p>
      <h1 class="mt-6 text-display-lg">
        {{ is404 ? 'This page has left the stage' : 'Something went wrong' }}
      </h1>
      <p class="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ivory/75">
        {{
          is404
            ? 'The page you were looking for is not here — it may have moved when we rebuilt the site.'
            : 'An unexpected error occurred. Please try again.'
        }}
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <AppButton to="/">Back to home</AppButton>
        <AppButton to="/events" variant="outline">See events</AppButton>
      </div>
    </div>
  </div>
</template>
