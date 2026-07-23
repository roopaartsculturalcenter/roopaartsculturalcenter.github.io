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
| Events | `events.html` | Skeleton — events source needed (manual / Google Calendar / Eventbrite) |
| Pancha Bhuta Sthalam | `pancha-bhuta-sthalam.html` | Skeleton — Space & Wind copy drafted from public sources; Fire/Water/Earth need the original write-ups |
| Gallery | `gallery.html` | Skeleton — 12–24 curated photos / YouTube embeds needed |
| Shop | `shop.html` | Skeleton — **e-commerce decision needed** (see §4) |
| Donate | `donate.html` | Skeleton — GoFundMe linked; confirm other channels |
| Contact | `contact.html` | Skeleton — address/phone/email + form backend needed |

Placeholder content is marked in two ways:
- `[PLACEHOLDER — ...]` text in square brackets
- A dashed gold outline (`class="todo"`) around unfinished blocks — remove the class as content lands

## §1–5 Content questionnaire (what we need answered)

### §1 Organization basics
- [ ] Street address, ZIP, phone, public email, hours
- [ ] EIN (for the footer / donation tax language)
- [ ] Founding story: when, by whom, why (founder Roopali Kambo's bio?)
- [ ] Board / team: names, titles, short bios
- [ ] Preferred tagline (current placeholder: "Where art, culture, and community come together")

### §2 Programs
- [ ] Actual list of classes/programs (the three categories on the site now — visual, media, performing — come from the mission statement, not a catalog)
- [ ] Age groups, schedules, instructors, fees
- [ ] How people register today (form? email? in person?)
- [ ] Scholarships / financial aid policy, if any

### §3 Donations
- [ ] Besides GoFundMe, what channels? (Zeffy, PayPal Giving Fund, Stripe, checks?)
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

## Assets needed from you (cannot be scraped)

- **Logo** — vector (SVG/AI) ideally; the round gradient mark in the header is a stand-in
- **Brand colors/fonts** if any exist (current palette is a proposal: lac red `#8c2f39`, turmeric `#d98e04`, plum `#2b1b2c`, ivory `#faf6ef`)
- **Hero photo** — one great wide shot (≥1920px): the space, a class, or a performance
- **12–24 gallery photos** at full resolution (social-media copies are compressed)
- **Headshots** for team/board
- **Temple photos or original artwork** for the five Pancha Bhuta Sthalam sections
- **Program flyers/schedules** for the current session

## What was scraped / recovered from public sources

- Mission & vision statements, 501(c)(3) status, Sugar Land TX location (site metadata + search index)
- Site structure of the old site: home, Pancha Bhuta Sthalam series (five element pages), WooCommerce clothing store
- Social links: [Instagram](https://www.instagram.com/roopaartsculturalcenter/), [Facebook](https://www.facebook.com/roopaartsculturalcenter/), [YouTube](https://www.youtube.com/@RoopaArtsCulturalCenter), [GoFundMe](https://www.gofundme.com/charity/roopa-arts-cultural-center)
- Space (Chidambaram) and Wind (Sri Kalahasti) element themes

Note: the live site blocks automated fetching from this environment (HTTP 403), so full page copy
and images could not be pulled directly. If you can export the WordPress content
(Tools → Export in wp-admin) or share a browser-saved copy of key pages, the remaining
`[PLACEHOLDER]` copy can be filled in from it.
