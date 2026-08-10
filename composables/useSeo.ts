import { site } from '~/data/site'

/**
 * Per-page title, description, canonical, and Open Graph/Twitter cards.
 * `image` should be a path under /public; it is made absolute for the OG tag.
 */
export function useSeo(options: {
  title: string
  description: string
  image?: string
  /** Set on the one page that should not append the org name. */
  bare?: boolean
}) {
  const route = useRoute()
  const url = `${site.url}${route.path === '/' ? '' : route.path}`
  const image = `${site.url}${options.image ?? '/images/home/home-3.webp'}`
  const title = options.bare ? options.title : `${options.title} · ${site.name}`

  useHead({
    title,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: options.description },

      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:title', content: title },
      { property: 'og:description', content: options.description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:locale', content: 'en_US' },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: options.description },
      { name: 'twitter:image', content: image },
    ],
  })
}

/** Organisation structured data — emitted once, from the homepage. */
export function useOrganisationSchema() {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NGO',
          name: site.name,
          alternateName: site.shortName,
          url: site.url,
          email: site.email,
          description: site.description,
          address: {
            '@type': 'PostalAddress',
            addressRegion: 'TX',
            addressCountry: 'US',
          },
          sameAs: site.social.map((s) => s.href),
        }),
      },
    ],
  })
}
