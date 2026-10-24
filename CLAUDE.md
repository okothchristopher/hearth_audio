# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Hearth Audio is a mobile-first web app for renting a high-end speaker in Kenya for a month, swapping it, and writing listening notes. Product context: [hearth-audio-spec.md](hearth-audio-spec.md).

**There is no application code yet** — the repo holds only product/brand documents, logos, and a Claude Design prototype. There are no build, lint, or test commands until the stack below is scaffolded. Remote: `https://github.com/okothchristopher/hearth_audio` (branch `main`).

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Renter and admin UI in one app; mutations (book, submit note, swap/return) as server actions — no separate API layer |
| Database | Supabase Postgres | Tables: people, speakers, rentals, listening_notes. Average stars via a view |
| Auth | Supabase Auth, email + password | Role (`renter`/`admin`) lives on `people` |
| Authorization | Postgres row-level security | Renters write only their own rentals/notes; only admins write speakers |
| Double-booking | Postgres exclusion constraint on rental `daterange` per speaker | Source of the "Someone just booked this speaker" error — don't rely on app-side checks |
| Files | Supabase Storage | Speaker photos |
| Styling | Plain CSS + CSS Modules, using `tokens/*.css` and `components/hearth.css` from the prototype zip's `_ds/` folder | No Tailwind |
| Validation | zod, shared by client and server actions | |
| Dates | date-fns with `Africa/Nairobi` timezone | |
| Hosting | Vercel, functions pinned to the same region as Supabase (Frankfurt / eu-central) | Supabase has no Africa region |

Deliberately excluded for now: payments (M-Pesa Daraja later), SMS (Africa's Talking later), global state libraries, native apps.

## Source documents (read before building anything)

| File | Authority |
|---|---|
| [`hearth-audio-spec.md`](hearth-audio-spec.md) | Product scope: 3 screens, 2 roles, data model, out-of-scope list |
| `claude-design-prompt.md` | Detailed screen contents, exact UI copy for loading/empty/error/success states, real sample content, responsive and accessibility rules |
| `brand-guide.md` | Single source of truth for fonts, type scale, colour tokens, logo geometry, voice. §0 and §9 list what is decided vs. still open |
| `hearth-audio-brand-concept.md` | Mission, audience, positioning, pillars |
| `Hearth Audio prototype build.zip` | Claude Design click-through prototype (`*.dc.html` screens incl. Admin screens not in the spec) plus a generated design system under `_ds/hearth-audio-design-system-*/` (`tokens/*.css`, `components/hearth.css`, `readme.md`). Reuse these tokens/classes rather than re-deriving styles |

Use the UI copy in `claude-design-prompt.md` verbatim; don't invent alternative wording for states and errors.

## Domain rules that span multiple docs

- **Roles:** Renter (browse, rent, swap, write note on return) and Admin (add/edit speakers, set available/rented, track return dates). The spec defines no admin screens; the prototype zip has draft ones (`AdminSpeakers`, `AdminEdit`, `AdminReturns`).
- **Data:** People, Speakers, Rentals, Listening notes (see spec table). Average stars on Browse are derived from notes. A speaker cannot have overlapping rentals — the "Someone just booked this speaker" error depends on enforcing this.
- **Rental length** is 30 days (e.g. start Sat 24 Oct 2026 → returns Mon 23 Nov 2026). Dates are Kenya time (Africa/Nairobi), formatted like `Fri 23 Oct 2026`. Prices are KES per month, formatted `KES 18,000`, with tabular figures.
- **Listening note:** stars required, text ≥ 20 characters.
- **Out of scope:** payments and delivery (handled outside the app — after booking, the business messages the renter), marketplace listings, social features, damage/insurance, room-size/music-type fields.
- Sign-in happens in a sheet from the booking flow, not a separate screen.
- Speaker names in content are invented placeholders; never use real brand names. No photos exist — use labelled tonal placeholders.

## Brand constraints

- Fonts: Young Serif 400 only (headings, never bold/italic) + Hanken Grotesk 400/500/600 (everything else). No third font.
- Colour: the current tokens are the Lamplight palette with yellow accent `#F2B705`; the accent is decoration only (fails contrast for text). Whether pages move to graphite/ivory/champagne is an **open decision** (brand-guide §9) — don't change the palette unilaterally.
- Logos: use only `hearth-audio-icon-graphite.svg`, `-icon-ivory.svg`, `-symbol-on-light.svg`, `-symbol-on-dark.svg`. All other files in `logos/` are the retired warm direction. No wordmark exists: set "Hearth Audio" as text in Young Serif.
- Voice: calm, exact, short sentences, no exclamation marks or emoji. Never use: cheap, hack, deal, bargain, gear-head.
- Accessibility: WCAG AA contrast, status never by colour alone, visible focus on every interactive element, touch targets ≥ 44 px, body text ≥ 16 px, design at 390 px first (1 → 2 → 3 card columns at 768/1280).
