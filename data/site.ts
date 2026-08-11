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

  /**
   * The live social feed on the homepage.
   *
   * This uses Facebook's own Page Plugin: no API key, no access token, no
   * third-party widget service, and it updates itself. Verified rendering this
   * page's real timeline.
   *
   * Why not Instagram, which is the busier account: there is no way to do it from a
   * static site. Checked, not assumed —
   *   - the profile page ships 609KB of HTML containing zero post shortcodes; the
   *     grid is loaded by authenticated XHR after paint
   *   - the legacy `?__a=1` JSON endpoint answers 201 behind a login gate
   *   - Graph `instagram_oembed` returns OAuthException without an app token
   *   - Basic Display API was shut down in December 2024
   *   - Graph API tokens cannot be shipped to a browser, and this site is fully
   *     static on both hosts, so there is nowhere to keep one
   * Instagram's per-post `/p/{shortcode}/embed/` iframe IS open, but shortcodes
   * cannot be discovered programmatically, so it would be a hand-maintained list.
   *
   * `embedUrl` overrides all of this. Set it to a feed widget provider's embed URL
   * (Behold.so, LightWidget, SnapWidget, Curator.io) to get an auto-updating
   * Instagram feed instead.
   */
  socialFeed: {
    facebookPage: 'https://www.facebook.com/roopaartsculturalcenter',
    /** Plugin caps its own width at 500; this is the frame height. */
    height: 720,
    embedUrl: null as string | null,
    label: 'Latest posts from Roopa Arts Cultural Center on Facebook',
  },

  /**
   * The mailing list sign-up, which appears in the footer and therefore on every
   * page (TheFooter is mounted in layouts/default.vue).
   *
   * Leave `endpoint` null and the form falls back to a mailto: link, so there is a
   * working way to subscribe from day one with no account anywhere. Paste a
   * provider endpoint in and it becomes a real inline form.
   *
   * ONE DISTINCTION WORTH MAKING BEFORE CHOOSING. Two different kinds of service
   * answer this, and only one of them can later send a newsletter:
   *
   *   Form relays (Formspree, Google Forms) email you each submission. Free and
   *   quick, but they do not build a list or send campaigns — addresses arrive in an
   *   inbox and somebody has to move them somewhere else by hand later.
   *
   *   List tools (MailerLite, Buttondown, Kit, Mailchimp) store subscribers, handle
   *   confirmation and unsubscribes, and can actually send the mail. This is what
   *   "a mailing list" normally means.
   *
   * `mode` exists because they do not all accept the same request:
   *   'fetch'  posts JSON in the background and shows an inline thank-you. Works with
   *            Formspree and Buttondown, which send permissive CORS headers.
   *   'native' does a plain form POST into a new tab, which is the only thing that
   *            works with Mailchimp — it refuses cross-origin AJAX outright.
   *
   * `field` is the input name the provider expects: 'email' for Formspree and
   * Buttondown, 'fields[email]' for MailerLite, 'EMAIL' for Mailchimp.
   */
  mailingList: {
    // Formspree free tier: 50 submissions a month, and it relays to email rather
    // than building a list. See the note above before sending a campaign.
    endpoint: 'https://formspree.io/f/mljrbakq' as string | null,
    mode: 'fetch' as 'fetch' | 'native',
    field: 'email',
  },

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
