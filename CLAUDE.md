# Working notes for Claude

Roopa Arts Cultural Center website. Nuxt 3, Tailwind, GSAP, Lenis, Three.js. Fully static.

**Read [README.md](README.md) first** — it documents the architecture, how to add an event, the
image pipeline and the deploy topology. This file holds only what the README does not: the rules
that were learned by breaking something, the state of things a fresh session cannot infer, and the
work that is still open.

Last session: 2026-08-13. Branch `architecture-v3` (the default). Working tree clean, everything
pushed, live and verified.

---

## Hard rules, each one learned the hard way

**No em dashes anywhere in site copy.** The rendered site is at **0** and should stay there. Check
with `grep -rl '—' --include='*.html' .vercel/output/static`. En dashes are fine and already used
(season ranges). Em dashes in code comments and in the README are fine — the rule is about copy.
When given copy containing one, substitute a colon and say so.

**"Texas", never "Sugar Land"** or any other city, in organisation-level copy. Venue names may name
their own city (`Jewish Community Center of Houston`).

**Visitor-facing copy must not explain the implementation.** The `/events` lede once read "Every
event below is drawn from one list, so a date passing moves it into Past on its own." That is
rationale for the build, shown to the audience. If a string describes the data model, rewrite it.

**Colour opacity modifiers must exist in `theme.opacity`.** Tailwind's default scale is multiples of
5. Anything else silently matches nothing and is **dropped with no build warning**: text renders
fully opaque and borders fall back to gray-200, a cool grey inside a warm palette. This bit twice —
it hid 48 of 92 opacity usages, and `bg-[#17120F]/97` meant the lightbox had **no backdrop at all**
for months. Values in use are registered in `tailwind.config.ts`. Add new ones there.

**Gold never carries text.** `spot.DEFAULT` is 2.2:1 on the light stage and is fill-only.
`spot.ink` is the readable version. Every `text-*` uses `spot-ink`.

**Never guess an image's dimensions.** `flyerSize()` and `pick()` read the manifest and **throw** if
an image is missing from it. That is deliberate: hardcoded `1400x1400` once made ipx physically crop
6 of 13 flyers to squares. Run `npm run images` after adding any image.

---

## How image work goes

1. Originals into `legacy/assets/img/<folder>/` (tracked in git; ~92 MB already there).
2. A rule for the folder in `scripts/optimize-images.mjs`.
3. `npm run images` — writes `public/images/<folder>/*.webp` and **rewrites the whole manifest**.
4. Diff the manifest before and after. Expect only additions. A removal means something referenced
   is about to throw.

Output is always WebP, whatever the input. Thumbnails are derived by `@nuxt/image` at build time, so
the file in `public/images` is the full-size version the lightbox opens.

### Deciding whether an image is already in the repo

**Perceptual hashing is not sufficient here.** These artist cards share a template; an 8×8 average
hash matched one file to two different repo images at distance 0. Use a pixel comparison instead:
greyscale, resize both to 256², RMSE. Then a tile-level check to tell a uniform re-encode (same
artwork, different compression) from a localised difference (different subject).

Judgement calls that have already been made, and the reasoning, so they stay consistent:

- **Arudra 2026:** 16 of 27 supplied files already existed in-repo *better compressed* (one was
  1305 KB vs 120 KB). Referenced in place; only the 11 new ones imported.
- **Arudra 2025:** six of 11 also exist in `public/images/artists` but capped at maxEdge **800** for
  small cards on `/arudra`. The lightbox opens to 72vw, so the 1080px originals were imported.
  Two rules, two uses.
- **Every event's own `flyerImage` is excluded from its own gallery.** It is already the top of that
  page; repeating it a screen down reads as a bug.

### Alt text

These are artist **announcement cards** with legible names, not performance photographs. Alt names
the artist, the instrument or discipline, and the programme. "Arudra 2026 performance" would be both
wrong and useless to a screen reader. Read the names **off the artwork** — nine of the 2024 files
arrived with filenames like "RACC provides a platform for art enthusiasts…" that identify nobody.

Two spellings deliberately follow the card over the source, and are **not** typos to fix:

| Card says | Other source says |
|---|---|
| SOUNDARYA DALIPARTHY | credits in `content/events.ts` say "Dalipatti" |
| AJAY GOPI | filename said "Ajai Gopi" |

---

## Galleries

Per-event, keyed by slug in `eventGalleries` (`content/gallery.ts`), carrying `heading`, `rubric`
and `images`. `pages/events/[slug].vue` reads it. An event with no entry renders **no gallery
section** — deliberately, because a heading over an empty grid reads as broken rather than pending.
Heading and rubric live in the data because the template is shared by every event.

Current: **2026** 26 cards · **2025** 11 · **2024** 20. `ActGallery` provides the lightbox (GSAP
Flip, arrow keys, Escape, focus trap) and takes `tone` and `id`.

`arudraCollateral` still exists in `content/gallery.ts` but is **referenced by nothing** since the
"festival, on paper" section was removed from `/arudra`. Inert, kept on purpose.

---

## Deploy topology, and the traps in it

Three hosts, one build: **roopaartsculturalcenter.org** (live, GitHub Pages), Pages at
`*.github.io` (301s to the domain), and Vercel at `roopaarts.vercel.app`.

**The domain is pinned in two files and needs both.** Root `CNAME` serves the legacy branch builder.
`public/CNAME` is what lands in `.output/public`, so it is the one that survives switching Source to
"GitHub Actions". Deleting either can take the site off the domain.

Two settings still not done, both the owner's to click:

- **Enforce HTTPS is off.** `https://` works with a valid cert, but `http://` visitors are not
  redirected. A donation page should not be reachable over plain HTTP.
- **Pages `build_type` is `legacy`,** so the legacy builder and the Actions workflow race on every
  push. It has resolved correctly every time so far, which is luck. Safe to switch now that
  `public/CNAME` exists.

---

## How to verify work here

The bar for this project is: **measure it, do not eyeball it.** Several regressions were fractions
under a threshold.

- **Contrast:** a script walks every text node and composites ancestor backgrounds, per route, at
  desktop and tablet. Current status 0 failures on all 20 routes. Re-run after any colour or opacity
  change, because honouring a dropped opacity makes text *lighter*.
- **A backgrounded Chrome tab throttles `requestAnimationFrame`,** so GSAP's ticker stops mid-tween.
  Entrance wipes stall part-open and `Flip.fit` leaves the lightbox image sized to its thumbnail.
  This looks exactly like a rendering bug and is not one. `visibilityState` tells you. To capture a
  faithful screenshot, remove the `js-motion` class from `<html>` — that is what a reduced-motion or
  no-JS visitor gets.
- **Never verify with `serve -s`.** The SPA fallback returns the homepage for every unknown path, so
  a broken route looks fine. Use `python3 -m http.server --directory .vercel/output/static`.
- **A grep against a live URL can be reading a redirect stub.** `github.io/events/` returns a
  162-byte nginx 301; greps for both the old and the new copy came back 0 and looked like a
  successful removal. Use `curl -sL` and check `%{url_effective}`.
- **Runtime-injected class names never reach Tailwind's JIT,** so probing for a utility by adding a
  class in the browser always reports it missing. Check the compiled CSS instead.

---

## Open work

Blocked on the owner:

- **`artists: []` on Arudra Festival 2024 and 2025.** Neither page has an "On stage" list or
  schema.org `performer` data, yet the cards name 20 and 10 people. **The names are already
  transcribed** in the alt text in `content/gallery.ts` — this is a transcription-to-data job, ready
  to do on a word from them.
- **Verify the Zelle QR** on `/support` resolves to the right account. Live donation path, never
  checked.
- **Mailing list is Formspree**, which relays to email and cannot send a campaign. A list tool
  (MailerLite, Buttondown) is needed before any season announcement goes out. No test submission has
  been sent — that would post real data to their account.
- Founder and board bios, real Community Impact copy, per-photo captions, a vector logo.

Tidying, offered and not yet taken:

- 2024 assets sit in **two folders** — `arudra-2024/` (poster) and `arudra-festival-2024/`
  (gallery) — because two requests named different subfolders.
- `arudraCollateral` is dead code.
- The favicon was generated from `racc-logo.png`, not from the 40×40 `Favicon RACC.png` supplied
  (its opaque content was only 16×16 inside padding, so it would have rendered ~6px wide). That file
  is not in the repo.

---

## Working style that has fit this project

Say what was actually verified and what was not. Several times the useful move was distrusting a
green result: the "0 occurrences" that was reading a 301, the perceptual hash that matched two
different images, the blank gallery that was a throttled animation frame. When a check passes too
easily, confirm it is measuring what you think.

Corrections made to my own earlier claims, so they are not repeated as fact: the `.org` domain was
described as LiteSpeed/old for most of the session and is now GitHub Pages serving this build; a
"stuck SplitText reveal" was HMR churn, not a defect; a `canvas opacity: 0` reading was taken
mid-fade.
