<script setup lang="ts">
import { site } from '~/data/site'

/** The homepage donate call-to-action. The full treatment lives on /donate. */
</script>

<template>
  <AppSection tone="maroon" labelledby="donate-band-heading">
    <template #decor>
      <MandalaAccent
        class="absolute -right-24 -top-24 h-80 w-80 text-gold/[0.08] sm:h-[26rem] sm:w-[26rem]"
        :petals="16"
        spin
      />
    </template>

    <div class="mx-auto max-w-2xl text-center">
      <p data-reveal class="kicker">Support</p>
      <h2 id="donate-band-heading" data-reveal class="mt-5 text-display-md">
        Keep the arts accessible to all
      </h2>
      <p data-reveal class="mt-6 text-lg leading-relaxed text-ivory/80">
        {{ site.name }} is a {{ site.status }}. Every contribution keeps our programs running
        and open to the whole community — and donating with Zelle takes seconds.
      </p>
      <div data-reveal class="mt-10 flex flex-wrap justify-center gap-4">
        <AppButton to="/donate">Donate today</AppButton>
        <AppButton to="/about" variant="outline">About our work</AppButton>
      </div>
    </div>
  </AppSection>
</template>
