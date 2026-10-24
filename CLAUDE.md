# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Hearth Audio is a mobile-first web app for renting a high-end speaker in Kenya for a month, swapping it, and writing listening notes. Product context: [hearth-audio-spec.md](hearth-audio-spec.md).

Current state: Browse, Speaker page + booking, and My rental are built on Supabase (auth, booking, listening notes). Swap and the admin screens are still `Placeholder`s, and admin routes are not yet restricted to admins. Remote: `https://github.com/okothchristopher/hearth_audio` (branch `main`).

## Commands

Node is installed at `C:\Program Files\nodejs` but is not on the shell PATH; in Git Bash prefix commands with `export PATH="/c/Program Files/nodejs:$PATH";`.

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build; also generates the route types (`PageProps`, `LayoutProps`) that `npx tsc --noEmit` needs
- `npm run lint` — ESLint
- No test runner is set up yet.

Next.js is v16 with `cacheComponents` and `partialPrefetching` on: read `node_modules/next/dist/docs/` before using an API from memory. Practical consequences: a route that reads `params`, `searchParams` or cookies (the Supabase session) needs a `loading.tsx` or `<Suspense>`, and client components calling `usePathname` must sit inside `<Suspense>` (see `components/shell/AppShell.tsx`). Session refresh lives in `proxy.ts` (Next 16's rename of `middleware.ts`).

## Supabase

- Env: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env` / `.env.local` (template: `.env.example`). No secret key is used.
- Schema lives in `supabase/migrations/` and sample content in `supabase/seed.sql`; both are run by hand in the Supabase SQL Editor (no CLI). Add schema changes as a new numbered migration file, never by editing an applied one.
- Clients (`lib/supabase/`): `publicClient` for public reads (no cookies, keeps Browse and Speaker pages fast); `createUserClient()` + `getSignedInUser()` for anything acting as the user (server actions, My rental); `browserClient()` / `useUser()` in client components for sign-in state.
- Writes go through server actions in `app/(renter)/actions.ts` and rely on row-level security, not app checks: renters insert only their own rentals and notes, a note needs a rental of that speaker, and overlapping bookings fail with SQLSTATE `23P01` (mapped to the prompt's "Someone just booked this speaker" copy).
- Triggers do bookkeeping the client can't be trusted with: a `people` row on sign-up, speaker `status` from active rentals, and note `author_name`/`author_area` copied from `people` (people rows are private, notes are public).
- Make an admin with `update public.people set role = 'admin' where email = '…';` in the SQL Editor.

## Code layout

- `app/styles/` — design tokens and `hearth.css` copied verbatim from the prototype's `_ds/` folder; `components.css` holds styles the prototype set inline; `shell.css` is the header/bottom-nav/layout. `app/globals.css` imports them in order. Fonts load via `next/font` in `app/layout.tsx` and feed `--font-heading` / `--font-body`.
- `components/ui/` — React ports of the prototype's design-system components (`_ds_bundle.js`), exported from `components/ui/index.ts`. Icons use `lucide-react` components (the prototype loaded Lucide from a CDN); pass the icon component, e.g. `iconStart={ArrowLeft}`.
- `components/shell/` — `AppShell` (prototype `AppHeader` + `BottomNav`). Below 768px header links hide and the fixed bottom nav shows, in CSS only.
- `lib/nav.ts` — renter and admin nav items and their active-path rules (desktop highlights My rental on `/swap`; mobile has a Swap tab). Client nav components take the nav by name because icon components can't cross the server→client boundary as props.
- Routes: `app/(renter)/` (`/`, `/speakers/[id]`, `/rental`, `/swap`, internal `/design-system` showcase) and `app/admin/` (`/admin`, `/admin/speakers/new`, `/admin/returns`).
- `lib/dates.ts` — rental dates are `YYYY-MM-DD` calendar days in Nairobi; `RENTAL_DAYS` (30), `addDays`, and fixed-name formatters (`formatDate` → "Sat 24 Oct 2026"). Don't format with `Intl` month names: ICU versions differ ("Sep" vs "Sept").
- Speaker page (`app/(renter)/speakers/[id]/` + `components/speaker/RentAction.tsx`): "Rent for a month" opens the sign-in sheet first when signed out, then the booking sheet, which calls the `bookSpeaker` server action.
- `components/account/` — `SignInSheet` (sign in / create account; there is no sign-in page), `AccountAction` (header), `SignInButton`.
- `lib/speakers.ts` / `lib/rentals.ts` — data access plus KES and status-chip formatting. Pages call these, never Supabase directly.
- Browse (`app/(renter)/page.tsx` + `components/browse/`) keeps the Available-now filter in the URL (`?filter=available`) and reads it inside `<Suspense>`, whose fallback is the loading skeleton.

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
| Validation | Plain checks in the form and again in the server action; the database constraints are the final word | |
| Dates | `lib/dates.ts` (no date library), `Africa/Nairobi` calendar days | |
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

## Component-driven development

Before building any feature or page:

1. Read the design and spec docs for the feature's requirements and design tokens (`design.md` and `spec.md` in the generic rule; in this repo: `hearth-audio-spec.md`, `claude-design-prompt.md`, `brand-guide.md`, and the tokens in `app/styles/`).
2. Search `components/` (and `components/ui/`) for existing components that cover each UI part the feature needs (buttons, forms, cards, tables, modals, nav, empty/loading/error states, etc.).
3. Report a short checklist: which components EXIST and will be reused, and which are MISSING.
4. Build every missing component first, as its own reusable component:
   - one component per file, named in PascalCase, with typed props
   - use only tokens from the design docs (colors, type, spacing, radius), never hard-coded values
   - support mobile and desktop, plus loading, empty and error states where relevant
   - prefer extending existing primitives in `components/ui/` over writing from scratch (shadcn/ui is not installed here; styling stays plain CSS, no Tailwind)
5. Only after the components exist, compose the feature or page from them. Do not put one-off UI inline in a page if it could be a component.
6. Never duplicate a component. If an existing one is close, extend it with props instead of creating a copy.
7. After each component and each page: run `npm run build` and `npm run lint`, fix any errors, then commit with a clear message and push.

Pause and show the missing-components list before building if more than 3 components are missing.
