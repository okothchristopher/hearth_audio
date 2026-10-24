# Hearth Audio: One-Page Spec

## Product name
Hearth Audio

## One line description
Rent a high-end speaker for a month, swap it for a different one, and read honest listening notes from people who heard it at home.

## Primary user
Christopher, 30, a consultant. He wants to hear different speaker tunings but won't spend about KES 400k per speaker. Shop demos are short and happen in the shop's room, and YouTube reviews can't tell him how a speaker sounds in his own living room.

## User types and what each can do
- **Renter:** browses speakers, reads listening notes, rents a speaker for a month, swaps it for another, and writes a listening note when returning one.
- **Admin (owner of the business):** adds and edits speakers, marks them available or rented, and tracks return dates.

## Core action
Christopher swaps his speaker every month and writes a short listening note about the one he's returning.

## Screens
1. **Browse speakers**
   - Shows: speaker cards with photo, brand, price per month, average stars, and availability.
   - Can do: filter by available, tap a speaker to open it.
2. **Speaker page and booking**
   - Shows: details, description, all listening notes for that speaker.
   - Can do: tap "Rent for a month" (if available).
3. **My rental**
   - Shows: current speaker, start and return dates, past rentals.
   - Can do: write a listening note (stars + short text), tap "Swap" to go back to Browse.

## Data
| Table | Fields | Read by | Written by |
|---|---|---|---|
| **People** | name, email, role (renter/admin) | All screens | Sign-up |
| **Speakers** | name, brand, photo, price per month, description, status (available/rented) | Browse, Speaker page | Admin; Speaker page when rented |
| **Rentals** | person, speaker, start date, return date | My rental | Speaker page (new), My rental (return/swap) |
| **Listening notes** | speaker, person, stars, text, date | Browse (average stars), Speaker page | My rental |

## Out of scope
- Owners listing their own speakers (marketplace)
- A social feed, comments, or followers
- In-app payments and delivery tracking (handled outside the app at first)
- Damage claims and insurance
- Room size and music type fields on notes

## Brand notes
Sleek and premium, like a luxury audio showroom. Minimal and spacious, with plenty of empty space around each speaker. Precise, calm language that says exactly what a speaker is and does. The app icon is the hearth arch with a speaker opening.
