// Rental dates are calendar days in Kenya, stored as "YYYY-MM-DD".
// Format them in UTC so the day never shifts with the viewer's timezone.

export const RENTAL_DAYS = 30;

/** Today's date in Nairobi as "YYYY-MM-DD" */
export function todayInNairobi() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(new Date());
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
