/**
 * Organisation-wide facts. Every component reads from here so a change to an
 * email address or social handle only has to be made once.
 */
export const site = {
  name: 'Roopa Arts Cultural Center',
  shortName: 'RACC',
  tagline: 'Where the classical arts of India take the stage',
  description:
    'Roopa Arts Cultural Center is a Texas 501(c)(3) public charity built by artists and art lovers, ' +
    'presenting the Arudra Festival, concerts, workshops, and seasonal celebrations.',
  url: 'https://roopaartsculturalcenter.org',
  location: 'Texas',
  email: 'roopaartsculturalcenter@gmail.com',
  status: '501(c)(3) public charity',
  founded: null as string | null, // not published — see README "Content still needed"

  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/roopaartsculturalcenter/' },
    { label: 'Facebook', href: 'https://www.facebook.com/roopaartsculturalcenter/' },
    { label: 'YouTube', href: 'https://www.youtube.com/@RoopaArtsCulturalCenter' },
  ],

  donate: {
    zelleEmail: 'roopaartsculturalcenter@gmail.com',
    zelleEnrollUrl: 'https://enroll.zellepay.com/',
    qr: '/images/misc/zelle-qr.webp',
  },

  // Persistent nav. Donate is deliberately absent here — it renders as a
  // visually distinct button, not a nav link.
  nav: [
    { label: 'Events', to: '/events' },
    { label: 'Arudra', to: '/arudra' },
    { label: 'About', to: '/about' },
    { label: 'Gallery', to: '/gallery' },
  ],

  donateTo: '/support',
} as const

export const logo = {
  dark: '/images/logo/racc-logo.webp', // for light backgrounds
  light: '/images/logo/racc-logo-white.webp', // for dark backgrounds
  width: 600,
  height: 124,
} as const
