# Hearth Audio

A mobile-first web app for renting a high-end speaker in Kenya for a month, swapping it for a different one, and writing listening notes about it. Product scope is in [`hearth-audio-spec.md`](hearth-audio-spec.md).

## Stack

- Next.js (App Router) and TypeScript
- Supabase: Postgres, Auth and Storage
- Plain CSS with design tokens, no Tailwind
- Deployed on Vercel

## Getting started

Requires Node.js 20 or later.

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

Open <http://localhost:3000>.

The Supabase URL and publishable key are under Project Settings → API Keys in your Supabase project. Database migrations and seed data are in `supabase/`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

## Project layout

- `app/(renter)/` — Browse, Speaker page, My rental, Swap
- `app/admin/` — Admin screens
- `app/styles/` — design tokens and component styles
- `components/` — `ui/` holds the design-system components; the other folders hold feature components
- `lib/` — data access, dates and Supabase clients
- `supabase/` — migrations and seed data

## Docs

- [`hearth-audio-spec.md`](hearth-audio-spec.md): product scope
- [`brand-guide.md`](brand-guide.md): fonts, colours, logo and voice
- [`claude-design-prompt.md`](claude-design-prompt.md): screen contents and UI copy
- [`CLAUDE.md`](CLAUDE.md): conventions for working in this repo
