export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  devtools: { enabled: false },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@vueuse/motion/nuxt'],

  css: ['~/assets/css/fonts.css', '~/assets/css/main.css'],

  // Images are pre-compressed to WebP by `npm run images`, so the optimizer only
  // has to produce the responsive widths.
  //
  // The provider is pinned deliberately. Left to auto-detect, @nuxt/image picks
  // `vercel` when it sees the Vercel preset and emits `/_vercel/image?url=...`
  // URLs — which the prerenderer then tries to crawl and 404s on, failing the
  // build. That never reproduces locally, where it picks `ipx`. `ipxStatic`
  // generates every variant as a real file at build time, so the deployed site
  // is plain static assets and behaves identically in both places.
  image: {
    provider: 'ipxStatic',
    quality: 78,
    format: ['webp'],
    screens: { xs: 360, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536, '2xl': 1536 },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0D0A08' },
      ],
      link: [
        { rel: 'icon', type: 'image/webp', href: '/images/logo/racc-logo.webp' },
        // Fonts are self-hosted (assets/css/fonts.css) but deliberately NOT
        // preloaded. Measured: preloading them competes with the hero image for
        // bandwidth on a throttled connection and cost ~1s of LCP. `font-display:
        // swap` already paints text immediately in the fallback face.
      ],
      script: [
        {
          // Runs before first paint so scroll-reveal targets start hidden without
          // a flash. Deliberately skipped when the user prefers reduced motion, and
          // never runs at all with JS disabled — in both cases content stays visible.
          innerHTML:
            "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)" +
            "document.documentElement.classList.add('js-motion')",
          tagPosition: 'head',
        },
      ],
    },
  },

  // Static output: no server functions needed, so Vercel serves it from the CDN.
  nitro: {
    preset: 'vercel-static',
    prerender: { crawlLinks: true, routes: ['/'] },
  },

  hooks: {
    /**
     * Three.js is dynamically imported, but Nuxt still emits a `modulepreload`
     * for it because it can see the import statically — which put 115KB back on
     * the hero's critical path, exactly what the dynamic import was avoiding.
     *
     * Demoted to prefetch: fetched at idle priority, after the page is usable,
     * and ready by the time the shader asks for it.
     */
    'build:manifest'(manifest) {
      const three = manifest['node_modules/three/build/three.module.js']
      if (three) {
        three.preload = false
        three.prefetch = true
      }
    },
  },

  routeRules: {
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },

    // The previous static site used .html URLs. Keep any existing links and
    // search results working rather than dropping them on the 404 page.
    // Note: no rule for /index.html — on a static host that file *is* `/`, so a
    // redirect there overwrites the homepage with a loop back to itself.
    '/about.html': { redirect: { to: '/about', statusCode: 301 } },
    '/events.html': { redirect: { to: '/events', statusCode: 301 } },
    '/gallery.html': { redirect: { to: '/gallery', statusCode: 301 } },
    '/donate.html': { redirect: { to: '/donate', statusCode: 301 } },
    '/programs.html': { redirect: { to: '/about', statusCode: 301 } },
    '/archive.html': { redirect: { to: '/events', statusCode: 301 } },
    '/contact.html': { redirect: { to: '/about', statusCode: 301 } },
    '/productions/arudra-2026.html': { redirect: { to: '/arudra-2026', statusCode: 301 } },
    '/productions/arudra-2025.html': { redirect: { to: '/events', statusCode: 301 } },
  },
})
