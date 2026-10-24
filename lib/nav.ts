import { CalendarClock, LayoutGrid, Plus, Repeat, Speaker, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon?: LucideIcon;
  /** Paths that mark this item current. A trailing "/*" matches the subtree. */
  match: string[];
};

export type NavSet = { header: NavItem[]; bottom: NavItem[] };

// Mirrors headerLinks / bottomItems in the prototype. Swap is a bottom-nav tab
// on mobile; on desktop it highlights My rental.
export const renterNav: NavSet = {
  header: [
    { href: "/", label: "Browse speakers", match: ["/", "/speakers/*"] },
    { href: "/rental", label: "My rental", match: ["/rental", "/swap"] },
  ],
  bottom: [
    { href: "/", label: "Browse", icon: LayoutGrid, match: ["/", "/speakers/*"] },
    { href: "/rental", label: "My rental", icon: Speaker, match: ["/rental"] },
    { href: "/swap", label: "Swap", icon: Repeat, match: ["/swap"] },
  ],
};

export const adminNav: NavSet = {
  header: [
    { href: "/admin", label: "Speakers", match: ["/admin", "/admin/speakers/*"] },
    { href: "/admin/returns", label: "Returns", match: ["/admin/returns"] },
  ],
  bottom: [
    { href: "/admin", label: "Speakers", icon: Speaker, match: ["/admin"] },
    { href: "/admin/speakers/new", label: "Add speaker", icon: Plus, match: ["/admin/speakers/*"] },
    { href: "/admin/returns", label: "Returns", icon: CalendarClock, match: ["/admin/returns"] },
  ],
};

export const NAVS = { renter: renterNav, admin: adminNav };
export type NavName = keyof typeof NAVS;

export function isCurrent(item: NavItem, pathname: string) {
  return item.match.some((m) =>
    m.endsWith("/*") ? pathname.startsWith(m.slice(0, -1)) : pathname === m,
  );
}
