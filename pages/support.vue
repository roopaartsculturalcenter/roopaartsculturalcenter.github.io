<script setup lang="ts">
import { site } from '~/data/site'

useSeo({
  title: 'Support',
  description:
    'Support Roopa Arts Cultural Center, a Texas 501(c)(3) public charity. Donate with Zelle, ' +
    'volunteer at a festival, or partner with us as a sponsor.',
  image: '/images/misc/zelle-qr.webp',
})

const helpRoot = ref<HTMLElement | null>(null)
useEntrance(helpRoot)
</script>

<template>
  <div>
    <PageOverture
      title="Keep the music playing."
      lede="A Texas 501(c)(3) public charity. Donations are tax-deductible and eligible for employer matching."
      image="/images/home/home-1.webp"
    />

    <!-- The ovation keeps its own heading so the page does not say the same
         sentence twice — the overture above now carries the headline. -->
    <ActOvation heading="Donate in under a minute." />

    <section ref="helpRoot" class="bg-stage py-24 lg:py-32" aria-labelledby="help-heading">
      <div class="stage-pad grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <h2 id="help-heading" data-wipe class="max-w-lg font-display text-grand text-chalk">
            Volunteers make our production days possible.
          </h2>
          <p data-wipe class="mt-8 max-w-md leading-relaxed text-chalk/82">
            From front-of-house at festivals to backstage hands on show days, the work runs on
            people who turn up. Tell us what you would like to do and we will find you a place.
          </p>
          <p data-wipe class="mt-10">
            <a
              :href="`mailto:${site.email}?subject=Volunteering with Roopa Arts Cultural Center`"
              data-cursor="write"
              class="group inline-flex items-center gap-3 border-b border-spot pb-2 text-sm uppercase tracking-rubric text-spot-ink"
            >
              Volunteer with us
              <span class="transition-transform duration-500 ease-silk group-hover:translate-x-2" aria-hidden="true">→</span>
            </a>
          </p>
        </div>

        <div>
          <h2 data-wipe class="max-w-lg font-display text-grand text-chalk">
            Sponsors put a season on its feet.
          </h2>
          <p data-wipe class="mt-8 max-w-md leading-relaxed text-chalk/82">
            In-kind support and corporate partnerships underwrite venues, recording, and
            production. Donations are tax-deductible to the extent allowed by law and are
            eligible for employer matching.
          </p>
          <p data-wipe class="mt-10">
            <a
              :href="`mailto:${site.email}?subject=Sponsorship enquiry`"
              data-cursor="write"
              class="group inline-flex items-center gap-3 border-b border-chalk/30 pb-2 text-sm uppercase tracking-rubric text-chalk/82 transition-colors hover:border-spot hover:text-spot-ink"
            >
              Talk to us about sponsorship
              <span class="transition-transform duration-500 ease-silk group-hover:translate-x-2" aria-hidden="true">→</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
