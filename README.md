# Roopa Arts Cultural Center

The website for [Roopa Arts Cultural Center](https://roopaartsculturalcenter.org) — a Texas
501(c)(3) public charity presenting the Arudra Festival, concerts, workshops, and seasonal
celebrations.

The site is choreographed like a classical recital: the home page is one continuous scroll,
structured as acts, on a warm off-white stage lit with gold.

**Nuxt 3** · **Tailwind** · **GSAP** (ScrollTrigger, SplitText, Flip) · **Lenis** · **Three.js**
Fully static output.

| | |
|---|---|
| Vercel | **https://roopaarts.vercel.app** |
| GitHub Pages | **https://roopaartsculturalcenter.github.io** (built by Actions from `architecture-v3`) |
| **roopaartsculturalcenter.org** | **Live, and serving this build.** Set as the Pages custom domain, so `*.github.io` now 301s here |

The domain was on LiteSpeed/PHP with the old site until the cutover; it is now GitHub Pages.

"Enforce HTTPS" is on, so a visitor arriving on `http://` is redirected to the secure site.

Every host serves the same static build. Being static is the constraint behind every third-party
decision below: there is no server, so anything dynamic has to work from the browser alone.

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
| `npm run images` | Regenerate web images from the originals, and rewrite `data/image-manifest.json` |

Dev mode does not reflect real performance. To see what actually ships:

```bash
npm run build && python3 -m http.server --directory .vercel/output/static 4173
```

> Use a plain static server, not `serve -s`. The `-s` flag rewrites every unknown path to
> `index.html`, so a broken route still returns the homepage and looks fine.

---

## The acts

The home page is assembled from these, in order. Each is a self-contained component.

| # | Component | What it does |
|---|---|---|
| 0 | `TheCurtain` | Mandala mark draws in stroke, panels slide apart. Once per session |
| 1 | `ActInvocation` | Masked line reveals, rotating ring, WebGL temple-arch hero, mouse parallax; then a pinned scrub where the type recedes and photo columns counter-drift in |
| 2 | `SceneFeatured` | The next event, full bleed |
| 3 | `SceneStory` | Who we are, in short |
| 4 | `SceneArudraTeaser` | The festival, with a fan of posters |
| 5 | `SceneSocial` | Embedded Facebook feed (see *Social* below) |
| 6 | `ActOvation` | Cursor-tracked spotlight, Zelle details centre stage |
| — | `TheFooter` | Outlined "Join the audience", velocity-skewed marquee, mailing-list sign-up |

Shared across the inner pages: `PageOverture` (every inner page's hero, mirroring the home
composition), `EventGrid`, `ActGallery`, `ActMission` (`/about`), `ProductionProgramme`
(edition pages), `ActOvation`, `TheFooter`. Every route is the same production.

Routes: `/` · `/about` · `/events` · `/events/[slug]` · `/arudra` · `/gallery` · `/support`

---

## Adding a new event

**Everything about events lives in [`content/events.ts`](content/events.ts).** One entry gives you
the card on `/events`, the card on `/arudra` if the slug contains `arudra`, and the detail page at
`/events/<slug>` — the route is served by `pages/events/[slug].vue` and prerendered because
`crawlLinks` follows the link. Nothing is written twice.

**1. Add the flyer.** Drop the original into `legacy/assets/img/events/` and run `npm run images`.

**2. Add an entry:**

```ts
{
  title: 'Spring Concert 2027',
  slug: 'spring-concert-2027',                // unique, url-safe
  date: '2027-04-18',                         // ISO; null only for undated series
  dateLabel: 'April 18–19, 2027',             // optional: overrides the displayed text
  artists: ['Name, role'],                    // [] if none are announced
  description: 'An evening of Carnatic vocal and violin.',
  venue: 'Stafford Centre',                   // or null
  meta: 'Two cities, two nights',             // optional one-liner on the card
  flyerImage: '/images/events/spring-concert-2027.webp',
  rsvpUrl: 'https://…',                       // optional
}
```

`title`, `slug`, `date`, `artists`, `description`, `venue` and `flyerImage` are required.

- **There is no `status` field.** Upcoming vs past is derived from `date`, so it can never go stale.
- **There is no `width`/`height`.** `flyerSize()` reads the real dimensions from the manifest and
  **throws** if the image is missing from it — run `npm run images`.
- `flyerAlt` overrides the card's generated alt text. Only set it when
  *"Flyer for {title}, {date}"* is genuinely inadequate.
- `seasonOverview: true` pushes an entry to the end of the list regardless of date.
- `pinned: true` forces an entry to count as upcoming whatever its date says. An escape
  hatch for a headline act, not a way to fake a date.
- `production` carries long-form detail (scenes, credits, a full programme book) and renders on
  the edition page only.

### Adding a gallery to an event page

Galleries are per-event, keyed by slug in [`content/gallery.ts`](content/gallery.ts):

```ts
export const eventGalleries: Record<string, EventGallery> = {
  'arudra-2026': { heading: '…', rubric: '…', images: [...] },
}
```

An event with no entry renders **no gallery section** — deliberately, because a heading over an
empty grid reads as a broken page rather than one awaiting content. Heading and rubric live in the
data, not the template, so one edition's copy cannot leak onto another's page.

Images go in their own folder under `legacy/assets/img/`, with a rule in
`scripts/optimize-images.mjs`, then `npm run images`. Alt text should name what is *in* the image:
these are mostly artist announcement cards with legible names, so *"Arudra 2026 performance"*
would be both wrong and useless to a screen reader.

### The rest of the content

| File | Contents |
|---|---|
| `data/site.ts` | Name, tagline, location, email, socials, Zelle details, nav, social feed, mailing list |
| `content/events.ts` | All events, and the per-edition production detail |
| `content/gallery.ts` | Gallery groups, the curation hold-back list, Arudra collateral, `eventGalleries` |
| `data/arudra.ts` | The festival's standing playbill, 2026 credits, previous-year artists |
| `data/arudra-2026-programme.json` | The 2026 programme book: 195 blocks of narrative, verse and raga |
| `data/about.ts` | Story copy, Act 3 verses, accordions |
| `data/image-manifest.json` | Generated. Do not hand-edit |

---

## Mailing list

`data/site.ts` → `mailingList`. Currently a **Formspree** endpoint (free tier: 50 submissions a
month). The form is in `TheFooter`, which is mounted in the default layout, so it is on all 20
pages from one insertion.

> **Formspree relays to email. It does not build a list and cannot send a campaign.** To actually
> mail the season announcement you want a list tool — MailerLite (free to 1,000 subscribers),
> Buttondown, Kit or Mailchimp — which stores subscribers and handles confirmation and
> unsubscribes.

Three states, because a static site has no backend:

| `endpoint` / `mode` | Behaviour |
|---|---|
| `endpoint: null` | A `mailto:` link. Not a placeholder — it genuinely works with nothing configured |
| `mode: 'fetch'` | Posts in the background, thanks the reader in place. Formspree, Buttondown |
| `mode: 'native'` | Plain form POST into a new tab. The **only** thing that works with Mailchimp, which refuses cross-origin AJAX — and also the no-JavaScript path |

`field` sets the input name: `email` for Formspree/Buttondown, `fields[email]` for MailerLite,
`EMAIL` for Mailchimp.

## Social

`SceneSocial` embeds Facebook's **Page Plugin**, which needs no key and no token.

Instagram is the busier account but **cannot** be embedded as a feed from a static site: Basic
Display was shut down in December 2024, Graph requires an access token that cannot be shipped to a
browser, and the legacy `?__a=1` endpoint sits behind a login. Per-post embeds are open, but they
need hardcoded shortcodes, so they are not a feed.

The plugin iframe is **deliberately not sandboxed**. A sandbox gives it an opaque origin, storage
access is denied, and it spins forever.

## Favicon

`public/favicon.ico` (16/32/48), `favicon-32x32.png`, `favicon-16x16.png`,
`apple-touch-icon.png` (180). Generated from `legacy/assets/img/logo/racc-logo.png`: wordmark
trimmed off, transparent edges trimmed, squared with a 6% margin.

The icon is the **R mark alone**. It previously pointed at the full 767×159 horizontal lockup,
which a browser crushed into 16px as an illegible smear. The Apple icon is flattened onto the page
colour because iOS discards alpha and composites on black.

---

## Deploying

The build emits Vercel's Build Output API format — static files on a CDN, no functions.

### Vercel

Project `roopa-arts` (scope `naveenkumarp3939-3162s-projects`), linked locally via
`.vercel/project.json`.

> **Check whether pushing deploys before relying on it.** The repo was historically *not*
> connected to the Vercel project — `vercel link` failed with *"You need to add a Login Connection
> to your GitHub account first"* — which made every deploy manual:
> ```bash
> vercel --prod
> ```
> Once that connection exists, pushes deploy on their own and each branch gets a preview URL.

`*.vercel.app` subdomains are globally unique across all Vercel users, so `roopa-arts.vercel.app`
was taken and this is `roopaarts`. The auto-generated `roopa-arts-<hash>-<scope>` URLs sit behind
Vercel Authentication and redirect to a login page; the custom domain does not, which is why
`roopaarts.vercel.app` is the link to share.

A domain cannot be attached while the most recent **production** deployment is failed — fix the
build and `vercel --prod` first.

### GitHub Pages

`.github/workflows/pages.yml` builds with `NITRO_PRESET=github_pages` and publishes
`.output/public`.

> ⚠️ **Pages `build_type` is still `legacy`.** Both the legacy builder and the Actions workflow run
> on every push and race each other. It has resolved correctly so far, but that is luck: if the
> legacy builder lands last it serves the unbuilt branch and the site 404s.
> **Fix: Settings → Pages → Source → "GitHub Actions"** — and note `public/CNAME` has to stay in
> place for that switch, or the custom domain goes with it. See below.

### roopaartsculturalcenter.org

**Already connected, to GitHub Pages** — not to Vercel. `cname` is set in the Pages config,
`www` 301s to the apex, and `*.github.io` 301s to the domain. Verified serving this build.

Two things to know about it:

- **The domain is pinned in two places, and it needs both.** Setting it in Settings wrote a
  root-level `CNAME`, which is what the *legacy* branch builder serves. The Actions workflow
  publishes `.output/public`, and a root `CNAME` is not inside `public/`, so it would **not** be in
  that artifact — switching Source to "GitHub Actions" would drop the custom domain and take the
  site off the domain. `public/CNAME` exists for exactly that reason: Nuxt copies it into the
  output, verified present in the build. **Do not delete either copy.**

If it is ever moved to Vercel instead: add the apex and `www` under project **Settings → Domains**,
create the records Vercel displays (typically `A @ → 76.76.21.21`,
`CNAME www → cname.vercel-dns.com`) using its values rather than these, and **only touch
`A`/`CNAME`** — leave MX records alone or you will break email.

---

## Motion, and how to not break it

**Everything routes through `composables/useStage.ts`.** `scene()` owns a GSAP context, so a route
change reverts its tweens and kills its ScrollTriggers. Without that, pins from the previous page
keep measuring and the next page's pins land at the wrong offsets.

**Reduced motion is a hard gate, not a dimmer.** Every scene takes a `fallback` that renders the
same content with no pin, no scrub, no parallax. Lenis does not initialise. The curtain does not
play. The custom cursor does not mount. Test it — it is a supported way to use the site.

**Scrub tweens must be `fromTo` with `immediateRender: false`.** A plain `.to()` captures its start
value when the timeline is built, which races the entrance animation. This cost a permanently
invisible mandala ring: the timeline was built mid-intro, captured `opacity: 0`, and pinned it there.

**Only `transform` and `opacity` inside pins and scrubs.** `clip-path` is used for the event-card
and gallery reveals because it is compositor-accelerated and causes no layout — but only on `once`
triggers, never inside a scrub.

**Do not put opacity on a reveal that also needs a contrast check.** A half-transparent card blends
its text against the stage, and automated contrast auditing reads the blended colour as real.

**Animations freeze in a backgrounded tab.** `requestAnimationFrame` is throttled, so GSAP's ticker
stops mid-tween — entrance wipes stall part-open and `Flip.fit` leaves the lightbox image sized to
its thumbnail. When automating screenshots, this looks exactly like a rendering bug and is not one.

### Other traps, all hit during the build

- **Do not unpin `image.provider`.** Left to auto-detect, `@nuxt/image` picks the `vercel`
  provider when it sees the Vercel preset and emits `/_vercel/image?url=…` URLs. The prerenderer
  crawls those, 404s, and **fails the build** — and it cannot reproduce locally, where the same
  config resolves to `ipx`. `ipxStatic` keeps both environments identical and writes every variant
  as a real file. `$development` overrides it back to `ipx`, or dev 404s on every image.
- **Colour opacity modifiers must exist in `theme.opacity`.** The default scale is multiples of 5;
  anything else — `text-chalk/82`, `border-chalk/12`, `bg-[#17120F]/97` — silently matches no
  utility and is dropped, with no build warning. The text then renders **fully opaque** and a
  border falls back to Tailwind's gray-200, a cool grey in a warm palette. The values in use are
  registered in `tailwind.config.ts`; add yours there or use a multiple of 5. This bit twice: it
  hid 48 of 92 opacity usages, and it meant the lightbox scrim had never rendered at all.
- **Gold must never carry text.** `spot.DEFAULT` is 2.2:1 on the light stage and is a fill colour
  only; `spot.ink` is the same hue taken dark enough to read. All `text-*` uses `spot-ink`.
- **`@nuxt/image` needs breakpoint-prefixed `sizes`.** A bare `sizes="100vw"` produces a
  **1-pixel** srcset. Use `utils/imageSizes.ts`.
- **A canvas hidden with `v-show` measures 0×0** and the WebGL renderer never recovers. It is
  hidden with opacity instead, and sized after `nextTick` with a `ResizeObserver`.
- **Do not `v-if` images out of the DOM to defer them.** The prerender then never generates their
  `_ipx` variants and the deployed site 404s on every one. Defer them positionally instead.
- **A negative `z-index` cannot escape a positioned ancestor.** The hero wash nested inside a
  `z-10` context painted over the photo wall below it; it has to be a sibling.
- **Flexbox `align-items` defaults to `stretch`, and in a column that acts on width.** The footer
  logo was being pulled to the container width against its fixed height and distorting — only on
  phones, because `sm:items-center` masked it above 640px.

---

## Performance

Three.js is dynamically imported after a capability check and demoted from `preload` to `prefetch`
in `nuxt.config.ts`, so it never touches the hero's critical path — and phones that decline the
shader never download it. Fonts are self-hosted and deliberately **not** preloaded: preloading them
competed with the hero image and cost ~1s of LCP.

The WebGL arch declines to run under reduced motion, without WebGL, or on devices reporting ≤4
cores or <4GB, falling back to a CSS-masked still.

> **The Lighthouse table below was measured on the earlier dark-theme build and has not been
> re-run since.** Treat it as indicative only, and **re-measure against a deployed URL with
> PageSpeed Insights** before quoting numbers. Repeated local runs on one unchanged build ranged
> 79–91 on mobile home with no code change.

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 97–100 | **100** | **100** | **100** |
| Mobile (inner pages) | 89–96 | **100** | **100** | **100** |
| Mobile (home) | 79–91, high variance | **100** | **100** | **100** |

---

## Accessibility

Contrast is audited per route with a script that walks every text node and composites ancestor
backgrounds, checked at desktop and tablet widths. Current status: **0 failures across all 20 routes.**

- All content is real text — nothing meaningful lives in an image.
- Keyboard: skip link, focus trapping in the menu and lightbox, arrow keys and Escape in the
  lightbox, focus returned to the element that opened it.
- The custom cursor hides the system cursor but **restores it the instant a key is pressed**, and
  never mounts on touch or under reduced motion.
- WCAG AA thresholds: 4.5:1 normal text, 3:1 for large (≥24px, or ≥18.66px bold). Several
  regressions here were a few hundredths under the line, so measure rather than eyeball.

---

## Structure

```
components/     TheCurtain, ActInvocation, ActMission, ActGallery, ActOvation, EventGrid,
                ProductionProgramme, PageOverture, MailingListForm, SceneFeatured, SceneStory,
                SceneArudraTeaser, SceneSocial, TheNav, TheFooter, TheCursor, TheMandalaRing
composables/    useStage (GSAP + scenes), useArchCanvas (WebGL), useMotionPreference,
                useMagnetic, useSeo
content/        events.ts, gallery.ts
data/           site.ts, arudra.ts, about.ts, the 2026 programme, image-manifest.json
pages/          /, /about, /events, /events/[slug], /arudra, /gallery, /support
plugins/        lenis.client.ts
scripts/        optimize-images.mjs
public/fonts/   Self-hosted Fraunces + Inter (variable, latin + latin-ext)
public/images/  Web-ready WebP (generated — do not hand-edit)
legacy/         The original static site and the uncompressed originals. Not built, not served,
                excluded from deploys by .vercelignore (~92 MB the build never reads)
```

Old `.html` URLs 301-redirect to their new paths (`nuxt.config.ts`).

## Content still needed

- **Artist lists for Arudra Festival 2024 and 2025.** Both have `artists: []`, so neither page has
  an "On stage" list or schema.org `performer` data — yet their announcement cards name 20 and 10
  people respectively. The names are already transcribed in the alt text in `content/gallery.ts`.
- Founding story beyond the published paragraph; founder and board bios and headshots.
  Scaffolding was built and then removed for launch — nothing invented was shipped. The published
  About page names no founder, lists no trustee and gives no reach figures, so the site claims none.
- Real "Community Impact" copy — the `community-impact` accordion is assembled from published
  material, which is honest but is not impact copy.
- Per-photo captions: the ~63 archive photographs share one descriptive alt and carry no
  attribution, which is why they sit in one "Company archive" group rather than being assigned to
  events on a guess.
- A vector logo (SVG). Everything is raster, which is also why the favicon is generated by
  trimming the lockup rather than exported cleanly.
- **Verify the Zelle QR** on `/support` resolves to the right account. This is a live donation path
  and has never been checked.
