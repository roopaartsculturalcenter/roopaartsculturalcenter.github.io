/**
 * Shared `sizes` strings for NuxtImg.
 *
 * @nuxt/image v2 only understands breakpoint-prefixed values. A bare `100vw`
 * silently produces a 1-pixel srcset (`s_1x1`), so every breakpoint has to be
 * spelled out. Keep these here rather than inline so that trap is fixed once.
 */

/** Edge-to-edge background images: heroes, page headers. */
export const SIZES_FULL_BLEED =
  'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw'

/** The lightbox image, which sits inside padding on large screens. */
export const SIZES_LIGHTBOX =
  'xs:92vw sm:92vw md:88vw lg:75vw xl:75vw xxl:75vw'
