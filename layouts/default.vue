<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-6 focus:py-3 focus:font-semibold focus:text-maroon-deep"
    >
      Skip to content
    </a>

    <SiteHeader />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <SiteFooter />
  </div>
</template>
