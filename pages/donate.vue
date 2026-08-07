<script setup lang="ts">
import { site } from '~/data/site'

useSeo({
  title: 'Donate',
  description:
    'Support Roopa Arts Cultural Center, a Texas 501(c)(3) public charity. Donate in seconds with Zelle ' +
    'to roopaartsculturalcenter@gmail.com.',
  image: '/images/misc/zelle-qr.webp',
})

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(site.donate.zelleEmail)
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 2400)
  } catch {
    // Clipboard permission denied — the address is visible and selectable anyway.
    copied.value = false
  }
}

onScopeDispose(() => clearTimeout(resetTimer))

// Element-level micro-animations for the hero block (@vueuse/motion).
const { rise, settle } = useMotionPreset()
const copyMotion = rise(80)
const headingMotion = rise(0, 34)
const cardMotion = settle(180)

const steps = [
  { n: 1, text: 'Open your banking app and choose Send with Zelle®.' },
  { n: 2, text: `Enter ${site.donate.zelleEmail} as the recipient — or scan the QR code.` },
  { n: 3, text: 'Enter your amount and send. That is the whole process.' },
]
</script>

<template>
  <div>
    <!-- The donate page leads with the action, not a decorative hero. -->
    <section class="on-dark relative isolate overflow-hidden bg-oxblood text-ivory">
      <NuxtImg
        src="/images/banners/banner-5.webp"
        alt=""
        width="1368"
        height="666"
        :sizes="SIZES_FULL_BLEED"
        preload
        fetchpriority="high"
        class="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
      />
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-b from-oxblood/85 via-oxblood/90 to-maroon-deep"
        aria-hidden="true"
      />
      <MandalaAccent
        class="absolute -left-32 top-1/2 -z-10 h-[30rem] w-[30rem] -translate-y-1/2 text-gold/[0.08]"
        :petals="24"
        spin
      />

      <div class="container-page relative pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div class="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <!-- Copy -->
          <div v-motion="headingMotion">
            <p class="kicker">Support the Arts</p>
            <h1 class="mt-6 text-display-lg text-shadow-hero">
              Your gift puts artists on stage
            </h1>
            <p class="mt-7 max-w-xl text-lg leading-relaxed text-ivory/85">
              {{ site.name }} is a {{ site.status }}. As a non-profit organization, we rely on the
              generosity of our supporters to keep our programs running and accessible to all.
              If you believe in the power of art to transform communities, consider making a
              donation or becoming a volunteer. Your support makes a difference.
            </p>

            <ol v-motion="copyMotion" class="mt-10 space-y-5">
              <li v-for="step in steps" :key="step.n" class="flex gap-4">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-sm text-gold"
                  aria-hidden="true"
                >{{ step.n }}</span>
                <span class="pt-1 leading-relaxed text-ivory/80">{{ step.text }}</span>
              </li>
            </ol>

            <p class="mt-9 text-sm text-ivory/60">
              Donations are tax-deductible to the extent allowed by law and eligible for
              employer matching.
            </p>
          </div>

          <!-- The card -->
          <div
            v-motion="cardMotion"
            class="relative rounded-3xl bg-ivory p-8 text-ink shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] sm:p-10"
          >
            <div class="text-center">
              <p class="font-display text-2xl">Donate with Zelle<sup class="text-xs">®</sup></p>
              <p class="mt-2 text-sm text-ink/70">Scan to donate</p>
            </div>

            <NuxtImg
              :src="site.donate.qr"
              :alt="`Zelle QR code for donating to ${site.name}`"
              width="570"
              height="570"
              sizes="xs:70vw sm:60vw md:272px lg:272px xl:272px xxl:272px"
              loading="lazy"
              class="mx-auto mt-7 w-full max-w-[17rem] rounded-2xl ring-1 ring-ink/10"
            />

            <div class="mt-8 rounded-2xl bg-ivory-dim/70 p-5 text-center">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink/70">
                Or send to
              </p>
              <p class="mt-2 break-all font-medium">
                <a
                  :href="`mailto:${site.donate.zelleEmail}`"
                  class="underline decoration-gold decoration-2 underline-offset-4 hover:text-maroon"
                >{{ site.donate.zelleEmail }}</a>
              </p>
              <button
                type="button"
                class="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-maroon-deep"
                @click="copyEmail"
              >
                <svg
                  class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
                >
                  <rect x="9" y="9" width="12" height="12" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                </svg>
                {{ copied ? 'Copied' : 'Copy address' }}
              </button>
              <span class="sr-only" role="status">{{ copied ? 'Email address copied to clipboard' : '' }}</span>
            </div>

            <div class="mt-7 text-center">
              <AppButton :href="site.donate.zelleEnrollUrl" class="w-full">
                Enroll with Zelle
              </AppButton>
              <p class="mt-3 text-xs text-ink/70">
                New to Zelle? Enrol once, then donate from your own bank.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Other ways to help -->
    <AppSection labelledby="help-heading">
      <div class="mx-auto max-w-2xl text-center">
        <p data-reveal class="kicker rule-gold flex flex-col items-center">Other Ways to Help</p>
        <h2 id="help-heading" data-reveal class="mt-5 text-display-md">Volunteer &amp; partner</h2>
        <p data-reveal class="mt-6 text-lg leading-relaxed text-ink/75">
          From front-of-house at festivals to backstage hands on production days, volunteers make
          our work possible. In-kind support and corporate partnerships are always welcome too.
        </p>
        <div data-reveal class="mt-9">
          <AppButton :href="`mailto:${site.email}`">Get in touch</AppButton>
        </div>
      </div>
    </AppSection>
  </div>
</template>
