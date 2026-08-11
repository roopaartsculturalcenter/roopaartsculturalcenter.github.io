<template>
  <div class="min-h-screen bg-stage">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[300] focus:bg-spot focus:px-6 focus:py-3 focus:font-semibold focus:text-chalk"
    >
      Skip to content
    </a>

    <TheNav />

    <main id="main">
      <slot />
    </main>

    <TheFooter />
  </div>
</template>
