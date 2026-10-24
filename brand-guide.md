# Hearth Audio: Brand Guide

Version 1.0, 17 October 2026. This file is the single source of truth for building the Hearth Audio design system. Where a value is written in `code`, use it exactly.

## 0. Decision status

| Area | Status |
|---|---|
| Brand feel: sleek and premium | Decided (changed from warm and cozy on 17 Oct 2026) |
| Fonts: Young Serif and Hanken Grotesk | Decided |
| Logo: the symbol and app icon (hearth arch) | Decided, restyled to graphite, ivory and champagne gold |
| Colour palette | Lamplight was the working palette. The user did not formally confirm it. Its accent was changed to yellow `#F2B705` on request. Treat section 4 as the current palette, and see section 9 |
| Type scale | Defined in this file (section 3). Not previously reviewed |
| Wordmark, imagery, spacing, components | Not decided (section 9) |

## 1. Brand concept

**Product name:** Hearth Audio (always two words, capital H and capital A).

**One line description:** Rent a high-end speaker for a month, swap it for a different one, and read honest listening notes from people who heard it at home.

**Direction:** The Craft Studio, with a touch of The Listening Room.

**Feeling:** sleek and premium, like a luxury audio showroom. Minimal, with a lot of empty space, and precise language.

**Mission:** To let anyone in Kenya hear premium speakers in their own home, one month at a time, so they can find the sound they love before they ever spend a shilling on owning it.

**Primary audience:** People like Christopher: a 30 year old consultant, 25 to 40 year old professionals who love music, have a home worth listening in, and want to explore different speaker tunings without paying around KES 400k for each one. Today they visit a shop for a short demo and watch YouTube reviews.

**Positioning:**
- Shops and demo rooms give 10 minutes in a room that isn't yours. Hearth Audio gives a month in your own living room.
- YouTube and online reviews give someone else's ears through a phone speaker. Hearth Audio gives your own ears, plus honest notes from real renters.
- Buying outright locks you into one sound and a big bill. Hearth Audio lets you change your mind every month.

**Positioning statement:** We are the precise, home-based way to find your sound, with the care of a specialist.

**Brand pillars:**
1. **Listen at home.** Real judgement happens in your own space, not a showroom.
2. **Precise, not showy.** We care about tuning, build, and detail, and we state them exactly.
3. **Shared ears.** Every listening note makes the next person's choice better.

**Visual feel:** A luxury audio showroom at night. A lot of empty space, and each page shows one speaker at a time. Near-black graphite and ivory, with a single restrained gold or yellow accent. Thin lines, exact alignment, minimal ornament. Photography shows one product against a plain background in soft, controlled light.

**Sample headline:** "Your living room, tuned to a different sound every month."

### Product context (for building screens)
The product is a web app with three screens and two user types.
- **Screens:** Browse speakers; Speaker page and booking; My rental.
- **User types:** Renter (browses, rents for a month, swaps, writes a listening note) and Admin (adds speakers, marks them available or rented, tracks returns).
- **Status labels:** Available uses the success colour, "Returns Friday" (due soon) uses the warning colour, and Overdue uses the error colour.

## 2. Fonts and roles

Both fonts are free on Google Fonts.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Hanken+Grotesk:wght@400;500;600&display=swap">
```

| Role | Font | Weights | Fallback stack | Used for |
|---|---|---|---|---|
| Heading | **Young Serif** | 400 only | `"Young Serif", Georgia, serif` | Display, H1 to H4, the name "Hearth Audio" when set as text, prices in feature cards |
| Body and UI | **Hanken Grotesk** | 400, 500, 600 | `"Hanken Grotesk", system-ui, sans-serif` | Body text, navigation, buttons, forms, labels, tables, captions, notes |

Rules:
- Young Serif has one weight. Never apply bold or italic to it.
- Hanken Grotesk is the only font for running text.
- Do not add a third font.
- Use `font-variant-numeric: tabular-nums` wherever numbers line up, such as prices and dates.

## 3. Type scale

Base size is 16px. Steps are 12, 14, 16, 20, 24, 32, 40 and 48 px, roughly a 1.25 ratio. Headings use `text-wrap: balance`. Keep body text to a measure of about 65 characters (`max-width: 65ch`).

| Style | Font | Weight | Size / line height | Tracking | Notes |
|---|---|---|---|---|---|
| Display | Young Serif | 400 | `clamp(34px, 6vw, 48px)` / 1.08 | -0.01em | One per page, hero only |
| H1 | Young Serif | 400 | `clamp(28px, 4vw, 40px)` / 1.1 | -0.01em | Page title |
| H2 | Young Serif | 400 | `clamp(24px, 3vw, 32px)` / 1.15 | 0 | Section title |
| H3 | Young Serif | 400 | 24px / 1.2 | 0 | Card or subsection title |
| H4 | Young Serif | 400 | 20px / 1.25 | 0 | Small heading |
| Lead | Hanken Grotesk | 400 | 20px / 1.5 | 0 | Intro paragraph |
| Body | Hanken Grotesk | 400 | 16px / 1.6 | 0 | Default text |
| Body strong | Hanken Grotesk | 600 | 16px / 1.6 | 0 | Emphasis inside body text |
| Button | Hanken Grotesk | 600 | 15px / 1.3 | 0 | Buttons and links styled as buttons |
| Small | Hanken Grotesk | 400 | 14px / 1.55 | 0 | Secondary text, table cells, helper text |
| Label | Hanken Grotesk | 600 | 12px / 1.3 | 0.14em | Uppercase. Eyebrows, tags, status chips use 13px with no uppercase |

## 4. Colour palette

All colours below are used on the light page background unless stated. Contrast ratios use the WCAG formula. Body text needs at least 4.5:1 (AA).

### Core palette

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `primary` | `#8A4B14` | Buttons, links, heading accent, key shapes | 6.2:1 on background |
| `accent` | `#F2B705` | Badges, card edges, dividers, small decorative marks. Do not use it for small text on the light background | 1.7:1 on background, 3.7:1 on primary |
| `background` | `#FBF4E9` | Page background | n/a |
| `surface` | `#FFFFFF` | Cards, inputs, panels on the page background | 16.6:1 with text |
| `text` | `#2A1B12` | Body text and headings | 15.2:1 on background (AAA) |
| `on-primary` | `#FFF8EC` | Text and icons on `primary` | 6.4:1 on primary |
| `on-accent` | `#2A1B12` | Text and icons on `accent` | 9.1:1 on accent |
| `success` | `#2F6F40` | Available, confirmed, saved | 5.5:1 on background |
| `warning` | `#8F5A00` | Return due soon | 5.3:1 on background |
| `error` | `#B3261E` | Overdue, form problems | 6.0:1 on background |

Body text on background is 15.2:1, which passes AA and AAA. Status colours pass AA as text on the background.

### Dark surface values (used by the logo files)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `dark-background` | `#1E1511` | Dark page background | n/a |
| `dark-text` | `#F3E6D3` | Text and wordmark on dark | 14.6:1 on dark background |
| `dark-ember` | `#E3A857` | Accent dot on dark | 8.5:1 on dark background |

### Icon colours (the current logo)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `graphite` | `#15120F` | Icon tile, and the arch on light surfaces | 16.1:1 against ivory |
| `ivory` | `#F2EEE8` | Arch on the graphite tile, ivory tile, arch on dark surfaces | 16.1:1 against graphite |
| `champagne` | `#C8A86B` | Speaker dot on graphite and dark surfaces | 8.2:1 on graphite |
| `champagne-deep` | `#9A7B3C` | Speaker dot on ivory and light surfaces | 3.4:1 on ivory |

### Design tokens (CSS)

```css
:root {
  --color-primary: #8A4B14;
  --color-accent: #F2B705;
  --color-background: #FBF4E9;
  --color-surface: #FFFFFF;
  --color-text: #2A1B12;
  --color-on-primary: #FFF8EC;
  --color-on-accent: #2A1B12;
  --color-success: #2F6F40;
  --color-warning: #8F5A00;
  --color-error: #B3261E;

  --color-graphite: #15120F;
  --color-ivory: #F2EEE8;
  --color-champagne: #C8A86B;
  --color-champagne-deep: #9A7B3C;

  --color-dark-background: #1E1511;
  --color-dark-text: #F3E6D3;
  --color-dark-ember: #E3A857;

  --font-heading: "Young Serif", Georgia, serif;
  --font-body: "Hanken Grotesk", system-ui, sans-serif;
}
```

## 5. Logo

The chosen logo is the **symbol and app icon**: a hearth arch (a tall arch, like a fireplace opening) with a round speaker opening and a small dot inside. There is no chosen wordmark yet.

### Files (in the `logos` folder)

| File | Use |
|---|---|
| `hearth-audio-icon-graphite.svg` | **Primary app icon.** Graphite tile, ivory arch, champagne dot. Light and dark surfaces |
| `hearth-audio-icon-ivory.svg` | Alternate icon. Ivory tile, graphite arch, deep champagne dot. For light headers and print |
| `hearth-audio-symbol-on-light.svg` | The arch alone, graphite with a deep champagne dot. On light backgrounds and photos |
| `hearth-audio-symbol-on-dark.svg` | The arch alone, ivory with a champagne dot. On dark backgrounds and photos |

The older warm files in the same folder (`hearth-audio-icon.svg`, `-wordmark-`, `-compact-`, `-lockup-`, and `-symbol-light` / `-symbol-dark`) belong to the earlier warm and cozy direction. Do not use them.

### Geometry (64 by 64 units)
- Tile: rounded square, `rx` 15, hairline edge inside the tile (white at 16% on graphite, black at 12% on ivory).
- Arch: from x 16 to 48, straight sides from y 30 to y 58, semicircle top of radius 16. The whole arch is moved up by 1.5 units.
- Speaker opening: a hole of radius 8 centred at (32, 42), cut out of the arch.
- Dot: a filled circle of radius 3.4 centred at (32, 42).

### Usage rules
1. **Minimum size:** 32 px wide. This size was tested. Do not go smaller without testing it first.
2. **Clear space:** keep at least a quarter of the symbol's width (16 units of the 64-unit box) free on every side.
3. **Pick the version by surface:** graphite icon on any surface; ivory icon on light surfaces; `symbol-on-light` on light backgrounds; `symbol-on-dark` on dark backgrounds.
4. **Dark screens:** the graphite icon always keeps its hairline edge, so it stays visible on dark backgrounds.
5. **Colours:** use only the colours in the icon table above. Do not recolour the icon or place it on busy or low-contrast backgrounds.
6. **Do not** stretch, rotate, outline, add shadows, glows or gradients, change the corner radius, move or resize the speaker opening, or redraw the arch.
7. **App stores and home screens:** supply the graphite icon as a full square and let the platform apply its own corner mask.
8. **Name as text:** until a wordmark is chosen, write the name as "Hearth Audio" in Young Serif 400, title case, in the `text` colour. Never in capitals and never in another font.

### Source (copy exactly)

Graphite icon:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Hearth Audio app icon"><title>Hearth Audio app icon</title><rect width="64" height="64" rx="15" fill="#15120F"/><rect x=".5" y=".5" width="63" height="63" rx="14.5" fill="none" stroke="#fff" stroke-opacity=".16"/><g transform="translate(0 -1.5)"><path fill="#F2EEE8" fill-rule="evenodd" d="M16 58V30A16 16 0 0 1 48 30V58ZM24 42a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z"/><circle cx="32" cy="42" r="3.4" fill="#C8A86B"/></g></svg>
```

Ivory icon:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Hearth Audio app icon, ivory"><title>Hearth Audio app icon, ivory</title><rect width="64" height="64" rx="15" fill="#F2EEE8"/><rect x=".5" y=".5" width="63" height="63" rx="14.5" fill="none" stroke="#000" stroke-opacity=".12"/><g transform="translate(0 -1.5)"><path fill="#15120F" fill-rule="evenodd" d="M16 58V30A16 16 0 0 1 48 30V58ZM24 42a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z"/><circle cx="32" cy="42" r="3.4" fill="#9A7B3C"/></g></svg>
```

Symbol on light:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Hearth Audio symbol"><title>Hearth Audio symbol</title><g transform="translate(0 -1.5)"><path fill="#15120F" fill-rule="evenodd" d="M16 58V30A16 16 0 0 1 48 30V58ZM24 42a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z"/><circle cx="32" cy="42" r="3.4" fill="#9A7B3C"/></g></svg>
```

Symbol on dark:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Hearth Audio symbol"><title>Hearth Audio symbol</title><g transform="translate(0 -1.5)"><path fill="#F2EEE8" fill-rule="evenodd" d="M16 58V30A16 16 0 0 1 48 30V58ZM24 42a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z"/><circle cx="32" cy="42" r="3.4" fill="#C8A86B"/></g></svg>
```

## 6. Voice and tone

**Voice:** calm, exact, and quietly confident. We sound like a knowledgeable specialist who respects your time.

**Style:**
- Short sentences. Plain words. Specific facts instead of hype.
- Say what a speaker is and does: its brand, its tuning, its price per month.
- Write from the renter's side: "Rent for a month", "Write your listening note", "Swap".
- Buttons state exactly what happens. Errors say what went wrong and how to fix it, without apologising.
- No exclamation marks. No slang.

**Five words we always use:** listen, tuning, precise, considered, quiet

**Five words we never use:** cheap, hack, deal, bargain, gear-head

**Examples**
- Yes: "Rent a premium speaker for thirty days. Listen at home, then write down what you heard."
- Yes: "Returns Friday."
- No: "Grab a crazy deal on awesome speakers!"
- No: "Unleash next-level audio magic."

## 7. Screen labels and status chips

| Element | Text | Colour |
|---|---|---|
| Available chip | Available | `success` text and border on `background` |
| Due soon chip | Returns Friday (use the real weekday) | `warning` text and border on `background` |
| Overdue chip | Overdue | `error` text and border on `background` |
| Primary button | Rent for a month | `on-primary` text on `primary` |
| Secondary button | Read listening notes | `primary` text and border, no fill |

## 8. Accessibility rules
- Body text must stay at or above 4.5:1 against its background.
- `accent` has low contrast on the light background (1.7:1). Use it only for decoration, never for small text.
- Never use colour alone for status. Always include the text label.
- Show a visible focus outline on every interactive element.

## 9. Open decisions
1. **Palette for the sleek feel.** Lamplight is warm brown and cream, which leans toward the earlier cozy direction. The icon already uses graphite, ivory and champagne. Decide whether the page palette should move to graphite, ivory and champagne as well.
2. **Fonts for the sleek feel.** Young Serif is a soft, rounded serif. It was chosen for the warm direction and is kept for now.
3. **Wordmark.** Not chosen. The earlier options are in the `logos` folder but belong to the warm direction.
4. **Not yet defined:** spacing scale, corner radius for cards and buttons, shadows, grid and breakpoints, imagery and photography rules, motion, and components.
