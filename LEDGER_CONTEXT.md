# The Ledger Website — Continuation Context

> Paste this into a new Claude Code chat to continue where we left off.

---

## Project Location
```
/Users/swasmac/the-ledger
```

## Quick Commands
```bash
cd /Users/swasmac/the-ledger
npm run dev          # Dev server → http://localhost:5173
npm run build        # Production build → dist/
npx netlify-cli deploy --dir=dist --prod   # Deploy (requires netlify login first)
```

---

## What This Is
**The Ledger** is a student-led, international finance club network. The website drives:
1. **App signups** → https://app.theledger.online (primary CTA everywhere)
2. **Club registrations** → /register (Register Your Club form)
3. **Regional Head applications** → /register (Apply as Regional Head form)

---

## Tech Stack
- **React 18 + TypeScript + Vite**
- **Tailwind CSS v3** (tailwind.config.js)
- **React Router v6** (BrowserRouter, 4 routes)
- **lucide-react** (icons)
- **Fonts**: Jost (body, from Google Fonts) + Futura/Century Gothic/Josefin Sans (headings — CSS fallback stack)
- **No backend** — forms show success state client-side only; newsletter is front-end only

---

## Design System

### Palette
| Token | Value | Use |
|-------|-------|-----|
| `#0E0C09` | Warm charcoal | Primary dark background |
| `#141108` | Slightly lighter dark | Alternate dark sections |
| `#FAF8F3` | Warm off-white | Light sections (alternating) |
| `#F2EDE5` | Cream | Second light section variant |
| `#F5F0E8` | Cream | Primary text on dark |
| `#7A6B58` | Dark stone | Body text on light sections |
| `#9B8B75` | Stone | Muted text on dark |
| `#C4A882` | Tan | Accent/warm highlights |
| `#F97316` | Orange | All CTAs, primary accent |
| `#FFFFFF` | White | Cards on light sections |

### Typography
- **Headings**: `font-family: 'Futura', 'Futura PT', 'Century Gothic', 'Josefin Sans', system-ui`
- **Body**: `font-family: 'Jost', system-ui` — weight 300 (light)
- **Display size**: `clamp(3rem, 7vw, 5.5rem)` for H1s
- **Section labels**: `text-[11px] font-semibold uppercase tracking-[0.2em]` in orange/tan

### CSS Utilities (src/index.css)
- `.glass` — cream-tinted glassmorphism (dark sections)
- `.glass-md` — stronger glass blur
- `.glass-warm` — tan-tinted glass
- `.glass-orange` — orange-tinted glass
- `.gradient-text` — animated orange→cream→white gradient text
- `.btn-primary` — orange button with hover glow
- `.btn-cream` — cream button (for use on orange/dark sections)
- `.btn-ghost` — transparent bordered button
- `.card-hover` — dark-section card hover (lifts, cream border glow)
- `.card-hover-light` — light-section card hover (lifts, orange border glow)
- `.divider` — gradient horizontal rule

### Section Alternation Pattern (Home)
1. Hero → **DARK** `#0E0C09`
2. Marquee strip → dark
3. Stats → **ORANGE** gradient
4. "What is The Ledger?" → **LIGHT** `#FAF8F3`
5. Glass Bento features → **DARK** `#141108`
6. For Club Leaders → **LIGHT** `#F2EDE5`
7. Testimonials → **DARK** `#141108`
8. Marquee 2 → dark
9. Pre-footer CTA → **ORANGE** gradient

---

## File Structure
```
/Users/swasmac/the-ledger/
├── src/
│   ├── App.tsx                    # Router — 4 routes + redirects
│   ├── main.tsx
│   ├── index.css                  # Global styles + glass utilities
│   ├── components/
│   │   ├── Navbar.tsx             # Fixed nav, blur-on-scroll, mobile overlay
│   │   ├── Footer.tsx             # 4-col grid, newsletter
│   │   ├── FadeIn.tsx             # Scroll-triggered fade wrapper
│   │   └── Marquee.tsx            # Infinite scrolling text strip
│   ├── hooks/
│   │   ├── useInView.ts           # IntersectionObserver (fires immediately if in-viewport)
│   │   ├── useCountUp.ts          # Animated number counter
│   │   └── useScrollY.ts          # Window scrollY for parallax
│   └── pages/
│       ├── Home.tsx               # 9 sections, app mockup, bento grid, alternating light/dark
│       ├── AppPage.tsx            # Combined app + download page (/app)
│       ├── Chapters.tsx           # 4 chapters (Tokyo, India, Madrid, Gold Coast)
│       └── Register.tsx           # 2 forms: Register Club + Regional Head
├── tailwind.config.js             # Warm palette, orb/marquee/float animations
├── netlify.toml                   # SPA redirect + build config
├── .claude/launch.json            # Preview server config (port 5173)
└── LEDGER_CONTEXT.md              # This file
```

---

## Routes
| Route | Page | Primary CTA |
|-------|------|-------------|
| `/home` | Home | Get the App |
| `/app` | AppPage | Get Started Free (web app) + Desktop downloads |
| `/chapters` | Chapters | Apply as Regional Head |
| `/register` | Register | Register Your Club / Apply as Regional Head |
| `/download` → `/app` | redirect | — |
| `/ledger-app` → `/app` | redirect | — |

---

## Key Animations
- **HeroOrbs** (Home hero): 4 floating blurred orbs with independent CSS keyframe paths + scroll parallax via `useScrollY`
- **AppMockup**: `animate-float` continuous vertical float + staggered badge float
- **MarqueeStrip** (2 strips on home): CSS `marquee` / `marqueeRev` keyframes, 50s/35s
- **FadeIn component**: `useInView` with immediate-visibility check → opacity+translateY on scroll entry
- **StatCounter**: `useCountUp` eased number animation triggered by `useInView`
- **card-hover / card-hover-light**: cubic-bezier spring lift on hover

---

## Content (from Squarespace scrape, May 2026)

### Stats
- 70+ Student Members · 15+ Chapters Worldwide · 6+ Countries · 3 Competitions in Pipeline

### Chapters
- **Tokyo, Japan** — 35+ members, 7 schools, Founding Chapter
- **India** — Delhi / Tamil Nadu / Gujarat, newest expansion
- **Madrid, Spain** — European Hub
- **Gold Coast, Australia** — Fintech Focus

### Summits 2026
Tokyo · Singapore · Gold Coast · Delhi

### Social
- Instagram: @the_ledger.jp → https://instagram.com/the_ledger.jp
- LinkedIn: TheledgerOnline → https://linkedin.com/company/theledgeronline
- App: https://app.theledger.online

---

## Pending / To-Do

### 🔴 High Priority
- **Netlify deployment** — site is built and ready (`dist/`). Needs:
  ```bash
  npx netlify-cli login   # browser OAuth
  npx netlify-cli init    # connect/create site
  npx netlify-cli deploy --dir=dist --prod
  ```
  OR: Drag-and-drop `dist/` folder at app.netlify.com/drop

### 🟡 Medium Priority
- **Form backend** — Register forms are front-end only. Wire to:
  - Netlify Forms (add `netlify` attribute to `<form>`)
  - Or Formspree / custom API endpoint
- **Newsletter** — Footer newsletter is front-end only. Wire to Mailchimp or ConvertKit
- **Download links** — Mac (.dmg) and Windows (.exe) links are `href="#"` placeholders

### 🟢 Nice to Have
- Real app screenshots to replace code mockup in hero
- Add testimonials with names/roles (currently anonymous)
- SEO: per-page meta descriptions (react-helmet or similar)
- Analytics (Plausible/GA4)
- Domain: theledger.online (Squarespace transfer → Netlify DNS)

---

## Design Decisions Made
1. **Navy → Warm charcoal**: Replaced `#0A1628` (cold blue) with `#0E0C09` (warm charcoal)
2. **Download + App → merged**: `/download` and `/ledger-app` combined into `/app`
3. **Futura heading font**: `'Futura', 'Futura PT', 'Century Gothic', 'Josefin Sans'` stack — Mac users get Futura natively, Windows get Century Gothic, everyone else gets Josefin Sans from Google
4. **Alternating light sections**: Home, Chapters, AppPage, Register all have cream/off-white sections for visual variety
5. **Forms front-end only**: No backend wired up — shows success state on submit
6. **Orange as sole CTA color**: All interactive primary actions are orange (#F97316)
7. **Glass on dark, white cards on light**: Glass panels only used on dark sections; light sections use white cards with subtle shadows

---

## Netlify Login (Agent-Assisted Flow)
If continuing deployment, run:
```bash
npx netlify-cli login --request "Deploy The Ledger" --json
# → gives you a URL + ticket_id
# User opens URL in browser and clicks Authorize
# Then:
npx netlify-cli login --check <ticket_id> --json
# Once status is "authorized":
npx netlify-cli init
npx netlify-cli deploy --dir=dist --prod
```
