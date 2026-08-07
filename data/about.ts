/**
 * About / How It Began.
 *
 * `story` is supplied verbatim by the organisation — do not paraphrase it.
 * The accordion bodies are drawn from copy already published on the existing
 * site (mission/vision statement, programmes page, donate page).
 */

export const story = [
  'Roopa Arts Cultural Center is a Texas 501(c)(3) public charity built by artists and art lovers. ' +
    'From our signature Arudra Festival to concerts, workshops, and seasonal celebrations, we create ' +
    'stages where the classical arts of India thrive — and where the whole community gathers to ' +
    'experience them.',
  'Our mission is to promote, produce, and provide access to a diverse range of arts experiences — ' +
    'with the performing arts at our heart. Our vision is to create a space where artists and art ' +
    'lovers can come together to celebrate creativity and cultural expression in all its forms.',
]

/**
 * Act 3 recites the story as verses rather than paragraphs. This is the exact
 * `story` copy above, only line-broken — nothing is added or reworded. `gold`
 * marks the phrase that lights up as it crosses centre screen.
 */
export const verses: { text: string; gold?: boolean }[] = [
  { text: 'Roopa Arts Cultural Center is a Texas' },
  { text: '501(c)(3) public charity built by' },
  { text: 'artists and art lovers.' },
  { text: 'From our signature Arudra Festival' },
  { text: 'to concerts, workshops, and seasonal' },
  { text: 'celebrations, we create stages' },
  { text: 'where the classical arts of India thrive', gold: true },
  { text: '— and where the whole community' },
  { text: 'gathers to experience them.' },
]

export interface AccordionItem {
  id: string
  title: string
  body: string[]
  /** Bullet list rendered after the body copy. */
  points?: { title: string; text: string }[]
}

export const accordions: AccordionItem[] = [
  {
    id: 'vision',
    title: 'Our Vision',
    body: [
      'To create a space where artists and art lovers can come together to celebrate creativity and ' +
        'cultural expression in all its forms.',
      'Our mission is to promote, produce, and provide access to a diverse range of arts experiences — ' +
        'with the performing arts at our heart, from classical dance productions to concerts and workshops.',
    ],
  },
  {
    id: 'what-we-do',
    title: 'What We Do',
    body: [
      'The performing arts are at the centre of everything we present. Our programming runs across four ' +
        'strands, on stages across Texas.',
    ],
    points: [
      {
        title: 'Stage Productions',
        text:
          'Full-scale classical productions — the annual Arudra Festival brings Bharatanatyam, Kuchipudi, ' +
          'Mohiniyattam, and live Carnatic music to one stage.',
      },
      {
        title: 'Concerts',
        text:
          'Carnatic and Hindustani concerts and cross-cultural collaborations — violin jugalbandis, the ' +
          'Baroque–Carnatic Connection, Bollywood Night, and more.',
      },
      {
        title: 'Workshops',
        text: 'Hands-on learning with visiting and local artists, like our Sound Workshop series.',
      },
      {
        title: 'Community Series',
        text: 'Seasonal and cultural celebrations — the Margazhi season and our annual Golu series.',
      },
    ],
  },
  {
    id: 'community-impact',
    title: 'Community Impact',
    body: [
      'Roopa Arts Cultural Center is a registered 501(c)(3) public charity. Donations are tax-deductible ' +
        'to the extent allowed by law and eligible for employer matching.',
      'As a non-profit organization, we rely on the generosity of our supporters to keep our programs ' +
        'running and accessible to all. Our productions are powered by dancers and musicians from across ' +
        'the community, and from front-of-house at festivals to backstage hands on production days, ' +
        'volunteers make our work possible.',
    ],
  },
]

/**
 * The counter strip. These are counts of what is actually documented in this
 * repository, not claims about attendance or reach — see the README before
 * changing them.
 */
export const stats = [
  { value: 2, suffix: '', label: 'Arudra Festival editions staged' },
  { value: 4, suffix: '', label: 'Productions in the 2026 programme' },
  { value: 60, suffix: '+', label: 'Performance photographs archived' },
  { value: 501, prefix: '', suffix: '(c)(3)', label: 'Texas public charity', isStatus: true },
]
