# Roopa Arts Cultural Center

The website for [Roopa Arts Cultural Center](https://roopaartsculturalcenter.org) — a Texas
501(c)(3) public charity in Texas, presenting the Arudra Festival, concerts, workshops,
and seasonal celebrations.

The site is choreographed like a classical recital: the home page is one continuous scroll,
structured as acts, on a near-black stage lit with spotlight gold.

**Nuxt 3** · **Tailwind** · **GSAP** (ScrollTrigger, SplitText, Flip) · **Lenis** · **Three.js**
Fully static output, deployed to Vercel.

**Live: https://roopaarts.vercel.app**

---

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build → `.vercel/output/static` |
| `npm run preview` | Preview the production build |
| `npm run images` | Regenerate web images from the originals |

Dev mode does not reflect real performance. To see what actually ships:

```bash
npm run build && npx serve .vercel/output/static -l 4173
```

---

## The acts

The home page is assembled from these, in order. Each is a self-contained component.

| Act | Component | What it does |
|---|---|---|
| 0 | `TheCurtain` | Mandala mark draws in stroke, panels slide apart. Once per session |
| 1 | `ActInvocation` | Masked line reveals, rotating ring, WebGL temple-arch hero, mouse parallax |
| 2 | `ActInvocation` | Pinned 180vh scrub — type recedes, five photo columns counter-drift in |
| 3 | `ActMission` | Pinned recitation, verse by verse, one phrase lighting gold at centre |
| 4 | `ActPlaybill` | Cards reveal from a slanted shard, 3D tilt on hover, magnetic RSVP |
| 5 | `ActFilmstrip` | Pinned horizontal filmstrip with velocity skew and a gold progress line |
| 6 | `ActGallery` | Masonry with clip-path wipes; lightbox expands from the thumbnail (GSAP Flip) |
| 7 | `ActOvation` | Cursor-tracked spotlight, Zelle details centre stage |
| — | `TheFooter` | Outlined "Join the audience", velocity-skewed marquee, underline draws |

Acts 3–7 are reused on the inner pages, so every route is the same production.

---

## Adding a new event

**Everything about events lives in one file: [`data/events.ts`](data/events.ts).**

**1. Add the flyer.** Drop the original into `legacy/assets/img/events/` and run `npm run images`.
(Or put an already-web-sized `.webp` straight into `public/images/events/`.)

**2. Add an entry:**

```ts
{
  slug: 'spring-concert-2027',        // unique, url-safe
  title: 'Spring Concert 2027',
  status: 'upcoming',                 // 'upcoming' or 'past'
  image: '/images/events/spring-concert-2027.webp',
  width: 1400,                        // real pixel size — prevents layout shift
  height: 1400,
  alt: 'Flyer for the 2027 Spring Concert',
  date: 'April 18, 2027',             // shown verbatim
  isoDate: '2027-04-18',              // for <time datetime> and sorting
  venue: 'Stafford Centre',
  description: 'An evening of Carnatic vocal and violin.',
  rsvpUrl: 'https://evite.me/XXXXXXX',
},
```

Only `slug`, `title`, `status`, `image`, `width`, `height`, `alt` are required. Anything omitted
is not rendered. Look sizes up in `data/image-manifest.json`.

**3. Done.** It appears on `/events` and, if `upcoming`, in the home page Playbill.

### The rest of the content

| File | Contents |
|---|---|
| `data/site.ts` | Name, tagline, location, email, socials, Zelle details, nav |
| `data/events.ts` | All events |
| `data/arudra.ts` | Arudra 2026 programme, flyers, artist cards, featured artists |
| `data/about.ts` | Story copy, Act 3 verses, accordions |
| `data/gallery.ts` | Hero picks; the gallery builds itself from the manifest |

Adding photos to `legacy/assets/img/gallery/` and running `npm run images` publishes them.

---

## Deploying

Live at **https://roopaarts.vercel.app**, on the Vercel project `roopa-arts`
(scope `naveenkumarp3939-3162s-projects`). The build emits Vercel's Build Output API format, so
everything is static files on the CDN — no functions, nothing to warm up.

### Redeploying

> **Pushing to GitHub does not deploy.** The repo is not connected to the Vercel project:
> `vercel link` failed with *"You need to add a Login Connection to your GitHub account first."*
> Until that is added (Vercel → Account Settings → Login Connections → GitHub), every deploy is
> manual.

```bash
vercel --prod        # from the repo root, after `vercel login`
```

Once the GitHub connection exists, imports at [vercel.com/new](https://vercel.com/new) work
normally: keep the detected **Nuxt.js** preset, leave **Output Directory** empty, no env vars.
Pushes then deploy on their own and each branch gets its own preview URL.

### About the URLs

`*.vercel.app` subdomains are globally unique across all Vercel users — `roopa-arts.vercel.app`
was already taken by someone else, hence `roopaarts`.

The auto-generated `roopa-arts-<hash>-<scope>.vercel.app` URLs sit behind Vercel Authentication
and redirect to a login page. The custom domain does not, which is why `roopaarts.vercel.app` is
the link to share.

A domain cannot be attached while the project's most recent **production** deployment is failed —
fix the build and `vercel --prod` first, then add the domain.

### Connecting roopaartsculturalcenter.org

1. Project → **Settings → Domains** → add `roopaartsculturalcenter.org` and the `www` variant.
2. Create the DNS records Vercel displays (typically `A @ → 76.76.21.21`,
   `CNAME www → cname.vercel-dns.com`). Use the values Vercel shows, not these.
3. **Only touch the `A`/`CNAME` records** — leave MX records alone or you will break email.

The old site is still on GitHub Pages at `roopaartsculturalcenter.github.io`, served from the
`claude/roopaartsculturalcenter-redesign-i2nw1b` branch in legacy (no-build) mode. Nothing here
has disturbed it. Pointing Pages at this branch would publish raw `.vue` source — it would need a
GitHub Actions workflow and the `github-pages` Nitro preset instead.

---

## Motion, and how to not break it

**Everything routes through `composables/useStage.ts`.** `scene()` owns a GSAP context, so a route
change reverts its tweens and kills its ScrollTriggers. Without that, pins from the previous page
keep measuring and the next page's pins land at the wrong offsets.

**Reduced motion is a hard gate, not a dimmer.** Every scene takes a `fallback` that renders the
same content with no pin, no scrub, no parallax. Lenis does not initialise. The curtain does not
play. The custom cursor does not mount. Test it — it is a supported way to use the site.

**Scrub tweens must be `fromTo` with `immediateRender: false`.** A plain `.to()` captures its start
value when the timeline is built, which races the entrance animation. This cost us a permanently
invisible mandala ring: the timeline was built mid-intro, captured `opacity: 0`, and pinned it there.

**Only `transform` and `opacity` inside pins and scrubs.** `clip-path` is used for the Playbill and
Gallery reveals because it is compositor-accelerated and causes no layout — but only on `once`
triggers, never inside a scrub.

**Do not put opacity on a reveal that also needs a contrast check.** A half-transparent card blends
its text against the stage, and automated contrast auditing reads the blended colour as real. The
Playbill reveals with `clip-path` alone for exactly this reason.

### Other traps, all hit during the build

- **Do not unpin `image.provider`.** Left to auto-detect, `@nuxt/image` picks the `vercel`
  provider when it sees the Vercel preset and emits `/_vercel/image?url=…` URLs. The prerenderer
  crawls those, 404s, and **fails the build** — and it cannot reproduce locally, where the same
  config resolves to `ipx`. This broke the first deploy. `ipxStatic` keeps both environments
  identical and writes all ~1,500 variants as real files.
- **Tailwind opacity modifiers must be multiples of 5.** `bg-stage/90` works; `bg-stage/92`
  silently generates *no CSS* and the element is transparent.
- **`@nuxt/image` needs breakpoint-prefixed `sizes`.** A bare `sizes="100vw"` produces a
  **1-pixel** srcset. Use `utils/imageSizes.ts`.
- **A canvas hidden with `v-show` measures 0×0** and the WebGL renderer never recovers. It is
  hidden with opacity instead, and sized after `nextTick` with a `ResizeObserver`.
- **Do not `v-if` images out of the DOM to defer them.** The prerender then never generates their
  `_ipx` variants and the deployed static site 404s on every one. Defer them positionally instead.
- **Chalk text below `text-chalk/50` fails contrast** on the stage black. 50 is the floor.

---

## Performance

Three.js is dynamically imported after a capability check and demoted from `preload` to `prefetch`
in `nuxt.config.ts`, so it never touches the hero's critical path — and phones that decline the
shader never download it. Fonts are self-hosted and deliberately **not** preloaded: preloading them
competed with the hero image and cost ~1s of LCP.

The WebGL arch declines to run under reduced motion, without WebGL, or on devices reporting ≤4
cores or <4GB, falling back to a CSS-masked still.

Measured on the production build:

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 97–100 | **100** | **100** | **100** |
| Mobile (inner pages) | 89–96 | **100** | **100** | **100** |
| Mobile (home) | 79–91, high variance | **100** | **100** | **100** |

> **Read the mobile home number with care.** Repeated Lighthouse runs on the same build ranged
> 79–91 with no code change, and a control page that had scored 96 earlier dropped to 86 under
> sustained machine load. These were measured on a developer laptop running the dev server, a
> static server and Chrome simultaneously. **Re-measure against the deployed URL with PageSpeed
> Insights** before drawing conclusions.

CLS is 0–0.011 everywhere. Total blocking time is 0ms.

---

## Accessibility

- 100 on every route, verified per page.
- All content is real text — nothing meaningful lives in an image.
- Keyboard: skip link, focus trapping in the menu and lightbox, arrow keys and Escape in the
  lightbox, focus returned to the element that opened it.
- The custom cursor hides the system cursor, but **restores it the instant a key is pressed** —
  and never mounts on touch or under reduced motion.
- Focus rings are gold on stage black and always visible.

---

## Structure

```
components/     TheCurtain, ActInvocation, ActMission, ActPlaybill, ActFilmstrip,
                ActGallery, ActOvation, TheNav, TheFooter, TheCursor, PageOverture
composables/    useStage (GSAP + scenes), useArchCanvas (WebGL), useMotionPreference,
                useMagnetic, useSeo
data/           All content + generated image-manifest.json
pages/          /, /about, /events, /arudra-2026, /arudra-2026/gallery, /gallery, /donate
plugins/        lenis.client.ts
public/fonts/   Self-hosted Fraunces + Inter (variable, latin + latin-ext)
public/images/  Web-ready WebP (generated — do not hand-edit)
legacy/         The original static site and uncompressed originals. Not built, not served,
                and excluded from deploys by .vercelignore (85 MB the build never reads)
```

Old `.html` URLs 301-redirect to their new paths (`nuxt.config.ts`).

## Content still needed

- Founding story beyond the published paragraph; founder and board bios and headshots.
  Scaffolding for these was built and then removed for launch — nothing invented was
  shipped. The published About page names no founder, lists no trustee and gives no
  reach figures, so the site claims none of it.
- Real "Community Impact" copy — the `community-impact` accordion is assembled from
  published material, which is honest but is not impact copy
- Per-photo captions (all gallery images share one descriptive alt)
- A vector logo (SVG). The raster lockup is now in the nav and footer
  (`racc-logo-white.webp`, 600×124); the curtain still draws a mandala mark
  because no vector wordmark exists
- Hero video, if wanted — the only motion assets in the archive are two 673×501 slideshow GIFs
- **Verify the Zelle QR** resolves to the right account before launch
