# Roopa Arts Cultural Center — Website Redesign

Redesign skeleton for [roopaartsculturalcenter.org](https://roopaartsculturalcenter.org), built as a
zero-build static site so it deploys straight to GitHub Pages (no framework, no npm, no CI needed).

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Site map

| Page | File | Status |
|---|---|---|
| Home | `index.html` | Skeleton — hero photo + real events needed |
| About | `about.html` | Skeleton — founding story, team bios/headshots needed |
| Programs | `programs.html` | Skeleton — **real program catalog needed** |
| Events | `events.html` | Events source needed (manual / Google Calendar / Eventbrite); links to production sub-pages |
| Archive | `archive.html` | Hub for past series — currently holds Golu Series 2024 and past festivals |
| Pancha Bhuta Sthalam | `pancha-bhuta-sthalam.html` | Archived as Golu Series 2024; Fire/Water/Earth need the original write-ups |
| Arudra 2026 | `productions/arudra-2026.html` | Festival sub-page — program lineup and flyers; recap copy needed |
| Navagrahamum Navakailasamum | `productions/navagrahamum-navakailasamum.html` | Production sub-page — all 12 artist cards; synopsis needed |
| Arudra Festival 2025 | `productions/arudra-2025.html` | Festival sub-page — flyers/banners; recap copy needed |
| Gallery | `gallery.html` | Skeleton — 12–24 curated photos / YouTube embeds needed |
| Shop | `shop.html` | Skeleton — **e-commerce decision needed** (see §4) |
| Donate | `donate.html` | **Done** — Zelle QR + roopaartsculturalcenter@gmail.com + Zelle login link, dark design like the old site |
| Contact | `contact.html` | Skeleton — address/phone/email + form backend needed |

Placeholder content is marked in two ways:
- `[PLACEHOLDER — ...]` text in square brackets
- A dashed gold outline (`class="todo"`) around unfinished blocks — remove the class as content lands

## §1–5 Content questionnaire (what we need answered)

### §1 Organization basics
- [ ] Street address, ZIP, phone, hours
- [x] Public email: roopaartsculturalcenter@gmail.com
- [x] EIN: not published (per owner)
- [ ] Founding story: when, by whom, why (founder Roopali Kambo's bio?)
- [ ] Board / team: names, titles, short bios
- [ ] Preferred tagline (current placeholder: "Where art, culture, and community come together")

### §2 Programs
- [x] Performing arts only — no visual/media arts programs (per owner). Site now shows: stage productions, concerts, workshops, community series
- [ ] How performers apply / audition (Margazhi flyer invites applications)
- [ ] Any classes offered, schedules, fees

### §3 Donations
- [x] Zelle only — to roopaartsculturalcenter@gmail.com, plus link to https://enroll.zellepay.com/
- [ ] **Verify the Zelle QR** (`assets/img/misc/zelle-qr.png`): it was regenerated with the standard Zelle QR payload for that email — scan it once to confirm it resolves to the RACC account, or replace it with the QR image from the old site
- [ ] Sponsorship tiers / corporate giving?
- [ ] Volunteer roles to advertise?

### §4 Shop (decision required)
The current site runs WooCommerce (WordPress). GitHub Pages is static — no cart/checkout.
Options, pick one:
1. Keep WooCommerce alive at `shop.roopaartsculturalcenter.org` and link out (least work)
2. Move to Shopify "Buy Button" / Printful / Fourthwall embeds (works on static hosting)
3. Drop the shop for now

### §5 Domain & hosting
- [ ] Will `roopaartsculturalcenter.org` point at GitHub Pages? (needs a `CNAME` file here + DNS change — **not added yet** so nothing breaks prematurely)
- [ ] Who controls DNS / current WordPress hosting?
- [ ] Any email tied to the domain that DNS changes must not disturb?

## Image assets

All images live under `assets/img/`, organized by purpose (duplicates were removed by checksum):

| Folder | Contents |
|---|---|
| `logo/` | RACC logo (`racc-logo.png` header, `racc-logo-white.png` footer — cropped from the "AN RACC PRODUCTION" lockups), ABV logos |
| `banners/` | Hero slider banners (`banner-1..5.jpg`), Arudra 2025 banners, animated GIFs |
| `home/` | Homepage section photos (`home-1..7.jpg`) |
| `gallery/` | ~60 performance photos (HG series + gallery series) |
| `events/` | Event flyers (Arudra 2025/2026, Bollywood Night, Navtar Jugalbandi, Baroque–Carnatic, Sound Workshop, Margazhi, Guruguha Vaibhavam) + Arudra 2026 artist cards |
| `artists/` | Featured artist headshots |
| `about/` | About-page photo |
| `misc/` | Shiva/mandala art (`final.jpg`, used on Pancha Bhuta Sthalam hero), design PNGs, misc |

Site colors are now sampled from the real logo: rust `#884820`, amber `#f0a838`, charcoal `#303030`.

## Assets still needed

- **Vector logo** (SVG/AI) — currently using cropped PNGs
- **Temple photos or artwork** for the five Pancha Bhuta Sthalam sections
- **Headshots + bios** for board/leadership (About page)
- **Product photos** for the Shop (pending the e-commerce decision)

## What was scraped / recovered from public sources

- Mission & vision statements, 501(c)(3) status, Sugar Land TX location (site metadata + search index)
- Site structure of the old site: home, Pancha Bhuta Sthalam series (five element pages), WooCommerce clothing store
- Social links: [Instagram](https://www.instagram.com/roopaartsculturalcenter/), [Facebook](https://www.facebook.com/roopaartsculturalcenter/), [YouTube](https://www.youtube.com/@RoopaArtsCulturalCenter), [GoFundMe](https://www.gofundme.com/charity/roopa-arts-cultural-center)
- Space (Chidambaram) and Wind (Sri Kalahasti) element themes

Note: the live site blocks automated fetching from this environment (HTTP 403), so full page copy
and images could not be pulled directly. If you can export the WordPress content
(Tools → Export in wp-admin) or share a browser-saved copy of key pages, the remaining
`[PLACEHOLDER]` copy can be filled in from it.
