# Prompt for Claude Design: Hearth Audio

## Goal
Design a mobile-first web app called **Hearth Audio**, a premium speaker rental service in Kenya. A renter borrows a high-end speaker for 30 days, swaps it for a different one the next month, and writes a short listening note about the one they return. Other renters read those notes before choosing their next speaker.

The design has exactly three screens: **Browse speakers**, **Speaker page and booking**, and **My rental**. The core action is the monthly swap with a listening note. Keep everything else out of the way.

Follow the attached `brand-guide.md` for fonts (Young Serif and Hanken Grotesk), colours, the hearth-arch icon, and voice rules. The feel is sleek and premium, like a luxury audio showroom: minimal, a lot of empty space, one speaker at a time, precise language. Where the guide marks a decision as open, choose what fits that feel and the graphite, ivory and champagne icon.

## Audience
Christopher, 30, a consultant in Nairobi. He loves music, has a home worth listening in, and doesn't want to spend around KES 400k on each speaker just to hear different tunings. Today he visits a shop for a short demo and watches YouTube reviews. He wants to hear a speaker in his own living room, then read honest notes from people who did the same. He is busy, uses his phone most of the time, and expects the app to be calm, clear and quick.

## Screens, in order

### 1. Browse speakers
- **Header:** the Hearth Audio icon and name, and a sign-in button (or the renter's first name if signed in).
- **Active rental banner** (only when the renter has a speaker now): "You have Ember Monitor until Sun 8 Nov." with a link to My rental.
- **Intro line:** "Hear a different speaker at home every month."
- **Filter:** an "Available now" toggle.
- **Speaker cards** (one column on mobile): photo, name, type and tuning in a few words, price per month in KES, average stars with number of notes, and a status chip (Available, or "Returns 3 Nov").
- **Bottom navigation:** Browse, My rental.

### 2. Speaker page and booking
- **Top:** back link, large photo, name, a one-line description, price per month, status chip.
- **Details:** type, tuning, size, best room size, connections.
- **Description:** two or three precise sentences.
- **Listening notes:** newest first. Each shows stars, the note, the renter's first name and area, and the date. A "Show all notes" link at the bottom.
- **Sticky button:** "Rent for a month". If the speaker is rented, the button is disabled and reads "Unavailable until 3 Nov".
- **Booking sheet** (opens from the button): start date picker, summary (speaker, 30 days, return date, price), and "Confirm booking". If the person isn't signed in, show a sign-in sheet first (email and password, with a "Create account" option). Do not add a separate sign-in screen.

### 3. My rental
- **Current speaker card:** photo, name, start date, return date, days left (for example "22 days left"), and a simple progress bar.
- **Write your listening note:** a star selector (required) and a text box (at least 20 characters), with the helper text "What did you play, and how did it sound in your room?" and a "Submit note" button.
- **Swap button:** "Swap for a different speaker", which goes to Browse.
- **Past rentals:** a list with dates and a label, either "Note written" or "Add a note".

## Real content (use this, not lorem ipsum)
All speaker names below are invented placeholders. Do not use real brand names. Prices are in Kenyan shillings per month.

**Speakers**
| Name | Description | Price | Stars | Status |
|---|---|---|---|---|
| Ember Monitor | Bookshelf speaker, warm tuning | KES 18,000 | 4.6 (12 notes) | Available |
| Slate Tower | Floor-standing, neutral tuning | KES 32,000 | 4.8 (9 notes) | Available |
| Aria Studio | Active monitor pair, bright and detailed | KES 24,000 | 4.4 (7 notes) | Returns 3 Nov |
| Quill Compact | Small-room speaker, forward midrange | KES 15,000 | 4.5 (5 notes) | Available |
| Meridian Wide | Wide soundstage, relaxed tuning | KES 28,000 | 4.7 (11 notes) | Returns 9 Nov |
| Lumen Stand | Slim stand-mount, balanced tuning | KES 21,000 | No notes yet | Available |

**Ember Monitor details:** two-way bookshelf speaker; warm tuning; 28 cm tall; best for small to medium rooms; Bluetooth and line-in. Description: "A warm, forward-sounding bookshelf speaker. Voices sit in the room, and the bass stays full without overwhelming a small space."

**Ember Monitor listening notes**
1. 5 stars. "Played Sunday jazz and a lot of afrobeats. Vocals sit forward and nothing is harsh, even at night volume. In my small living room the bass was full without booming." Wanjiru, Kilimani, 12 Oct 2026.
2. 4 stars. "Great for long evenings. Keep it about 30 cm from the wall or the low end gets heavy. I would want more sparkle on strings." Brian, Westlands, 28 Sep 2026.
3. 4 stars. "Warm and forgiving with older recordings. Less exciting with electronic music. Easy to live with for a month." Amina, Lavington, 3 Sep 2026.
4. 5 stars. "Played benga and film scores. Clean and relaxed, and it never tired my ears." Kevin, Karen, 20 Aug 2026.

**My rental (sample renter, Christopher):** Ember Monitor, started Fri 9 Oct 2026, returns Sun 8 Nov 2026, 22 days left. Past rentals: Slate Tower, 9 Aug to 8 Sep 2026, "Note written"; Quill Compact, 9 Jul to 8 Aug 2026, "Add a note".

**Booking example:** start Sat 24 Oct 2026, 30 days, returns Mon 23 Nov 2026, KES 18,000. Payment happens outside the app: after the booking, we message the renter to arrange delivery and send payment details.

**Photos:** no photos are available. Use quiet tonal placeholders with a simple speaker silhouette, clearly labelled as placeholders.

## States
Design each of these, in the same visual style as the rest.

**Loading**
- Browse: skeleton cards in the final layout.
- Speaker page: skeleton photo, title and note rows.
- My rental: skeleton rental card.
- Buttons show a progress state and stay disabled until done.

**Empty**
- Browse, "Available now" on with nothing available: "Every speaker is rented right now. Turn off the filter to see when they return."
- Speaker page, no notes: "No listening notes yet. Be the first to rent this speaker and write one."
- My rental, no current rental: "You don't have a speaker right now." with a "Browse speakers" button, and past rentals hidden if there are none.

**Error**
- Failed to load: "We couldn't load the speakers. Check your connection and try again." with a Retry button.
- Booking conflict: "Someone just booked this speaker. Choose different dates or another speaker."
- Note not saved: "Your note wasn't saved. Your text is still here. Try again."
- Form problems: "Choose a star rating." and "Write at least 20 characters."
- Sign-in failed: "That email or password isn't right. Try again."

**Success**
- Booking confirmed: "Booked. Ember Monitor is reserved from Sat 24 Oct to Mon 23 Nov. We'll message you to arrange delivery." with a "View my rental" button.
- Note submitted: "Thank you. Your note is now on the Ember Monitor page."
- Signed in: a quiet confirmation, then back to where the person was.

## Mobile first
- Design at 390 px wide first, then adapt to tablet (768 px) and desktop (1280 px). Cards go from one column to two to three.
- No horizontal scrolling at any width. Keep side margins of at least 16 px.
- Touch targets are at least 44 px. The main button on the Speaker page stays fixed at the bottom on mobile.
- Body text is at least 16 px. Text and controls meet WCAG AA contrast. Status is always shown with text as well as colour.
- Show the focus state on every interactive element.

## Closing
For anything not covered here, make sensible choices that fit the brand guide and the sleek, premium, minimal feel, and tell me which choices you made.
