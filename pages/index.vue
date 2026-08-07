<script setup lang="ts">
import { site } from '~/data/site'
import { upcomingEvents } from '~/data/events'
import { arudra2026 } from '~/data/arudra'
import { homeStrip } from '~/data/gallery'
import { story } from '~/data/about'

useSeo({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  bare: true,
})
useOrganisationSchema()
</script>

<template>
  <div>
    <HeroSlideshow />

    <!-- Mission -->
    <AppSection labelledby="mission-heading">
      <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p data-reveal class="kicker rule-gold">Our Mission</p>
          <h2 id="mission-heading" data-reveal class="mt-5 text-display-md">
            Promote. Produce. Provide access.
          </h2>
          <p data-reveal class="mt-6 text-lg leading-relaxed text-ink/75">
            {{ story[0] }}
          </p>
          <div data-reveal class="mt-9">
            <AppButton to="/about" variant="outline">Read our story</AppButton>
          </div>
        </div>

        <div data-reveal class="relative">
          <MandalaAccent
            class="absolute -right-8 -top-8 h-28 w-28 text-gold-deep/25 sm:h-36 sm:w-36"
            :petals="12"
          />
          <NuxtImg
            src="/images/home/home-1.webp"
            alt="The full Roopa Arts Cultural Center company on stage in traditional dress"
            width="1600"
            height="900"
            sizes="sm:100vw lg:50vw"
            loading="lazy"
            class="relative w-full rounded-2xl object-cover shadow-[0_30px_70px_-40px_rgba(42,10,14,0.7)]"
          />
        </div>
      </div>
    </AppSection>

    <StatStrip />

    <!-- Upcoming events -->
    <AppSection tone="dim" labelledby="events-heading">
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div class="max-w-prose">
          <p data-reveal class="kicker rule-gold">What's On</p>
          <h2 id="events-heading" data-reveal class="mt-5 text-display-md">Upcoming events</h2>
        </div>
        <div data-reveal>
          <AppButton to="/events" variant="outline">All events</AppButton>
        </div>
      </div>

      <div class="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <EventCard v-for="event in upcomingEvents" :key="event.slug" :event="event" />

        <!-- The events file drives this section; an empty one is a valid state. -->
        <p v-if="!upcomingEvents.length" data-reveal class="text-lg text-ink/70">
          No events are on sale right now — follow us on
          <a :href="site.social[0].href" class="underline decoration-gold underline-offset-4">Instagram</a>
          for announcements.
        </p>
      </div>
    </AppSection>

    <!-- Arudra festival -->
    <AppSection tone="dark" labelledby="arudra-heading">
      <template #decor>
        <MandalaAccent
          class="absolute -left-28 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 text-gold/[0.06]"
          :petals="22"
          spin
        />
      </template>

      <div class="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div data-reveal class="order-2 lg:order-1">
          <NuxtImg
            src="/images/events/all-program-flyer.webp"
            alt="Arudra 2026 programme flyer — Trilokya Nada, Veena-Violin Duet, Navagrahamum Navakailasamum, Thiruvadhirai Threads"
            width="1080"
            height="1080"
            sizes="sm:80vw lg:45vw"
            loading="lazy"
            class="mx-auto w-full max-w-md rounded-2xl shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
          />
        </div>

        <div class="order-1 lg:order-2">
          <p data-reveal class="kicker rule-gold">Signature Festival</p>
          <h2 id="arudra-heading" data-reveal class="mt-5 text-display-md">{{ arudra2026.title }}</h2>
          <p data-reveal class="mt-4 text-sm font-medium text-gold">
            {{ arudra2026.date }} · {{ arudra2026.venue }}
          </p>
          <p data-reveal class="mt-6 text-lg leading-relaxed text-ivory/80">
            {{ arudra2026.intro }}
          </p>

          <ul data-reveal class="mt-8 space-y-3.5">
            <li
              v-for="item in arudra2026.programme"
              :key="item.title"
              class="flex items-baseline gap-3 border-b border-ivory/10 pb-3.5"
            >
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              <span class="font-display text-lg">{{ item.title }}</span>
              <span v-if="item.note" class="text-sm text-ivory/55">{{ item.note }}</span>
            </li>
          </ul>

          <div data-reveal class="mt-9">
            <AppButton to="/arudra-2026">Explore Arudra 2026</AppButton>
          </div>
        </div>
      </div>
    </AppSection>

    <!-- Gallery preview -->
    <AppSection labelledby="moments-heading">
      <div class="flex flex-wrap items-end justify-between gap-8">
        <div class="max-w-prose">
          <p data-reveal class="kicker rule-gold">Moments</p>
          <h2 id="moments-heading" data-reveal class="mt-5 text-display-md">From our stage</h2>
        </div>
        <div data-reveal>
          <AppButton to="/gallery" variant="outline">View gallery</AppButton>
        </div>
      </div>

      <ul class="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <li
          v-for="(photo, i) in homeStrip"
          :key="photo.src"
          data-reveal
          :class="i === 0 && 'col-span-2 sm:col-span-1'"
        >
          <NuxtImg
            :src="photo.src"
            :alt="photo.alt"
            :width="photo.width"
            :height="photo.height"
            sizes="xs:45vw sm:30vw lg:18vw"
            loading="lazy"
            class="h-52 w-full rounded-xl object-cover sm:h-64"
          />
        </li>
      </ul>
    </AppSection>

    <DonateBand />
  </div>
</template>
