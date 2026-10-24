import { notFound } from "next/navigation";

// Unmatched /admin/* URLs would otherwise reach the root not-found, which shows the
// renter shell. Routing them here keeps the admin header and admin/not-found.tsx.
export default function AdminCatchAll() {
  notFound();
}
