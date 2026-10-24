// Rental dates are calendar days in Kenya, stored as "YYYY-MM-DD".
// Format them in UTC so the day never shifts with the viewer's timezone.

export const RENTAL_DAYS = 30;

/** Today's date in Nairobi as "YYYY-MM-DD" */
export function todayInNairobi() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date());
}

/** A timestamp's calendar date in Nairobi as "YYYY-MM-DD" */
export function toNairobiDate(timestamp: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date(timestamp));
}

export function addDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Fixed names rather than Intl: ICU versions disagree ("Sep" vs "Sept").
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  return { wd: WEEKDAYS[d.getUTCDay()], day: d.getUTCDate(), mon: MONTHS[d.getUTCMonth()], year: d.getUTCFullYear() };
}

/** "Sat 24 Oct 2026" */
export function formatDate(isoDate: string) {
  const p = parts(isoDate);
  return `${p.wd} ${p.day} ${p.mon} ${p.year}`;
}

const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Friday" */
export function formatWeekday(isoDate: string) {
  return WEEKDAYS_LONG[new Date(`${isoDate}T00:00:00Z`).getUTCDay()];
}

/** Whole days from one "YYYY-MM-DD" to another; negative when `to` is earlier. */
export function daysBetween(from: string, to: string) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** "Sat 24 Oct" */
export function formatShortDate(isoDate: string) {
  const p = parts(isoDate);
  return `${p.wd} ${p.day} ${p.mon}`;
}

/** "12 Oct 2026" */
export function formatDay(isoDate: string) {
  const p = parts(isoDate);
  return `${p.day} ${p.mon} ${p.year}`;
}

/** "3 Nov" */
export function formatDayMonth(isoDate: string) {
  const p = parts(isoDate);
  return `${p.day} ${p.mon}`;
}
