"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVS, isCurrent, type NavName } from "@/lib/nav";

// Takes the nav by name: icon components can't be passed as props from a server component.
export function HeaderLinks({ nav }: { nav: NavName }) {
  const pathname = usePathname();
  return NAVS[nav].header.map((it) => (
    <Link
      key={it.href}
      href={it.href}
      className="ha-nav-link"
      aria-current={isCurrent(it, pathname) ? "page" : undefined}
    >
      {it.label}
    </Link>
  ));
}

export function BottomLinks({ nav }: { nav: NavName }) {
  const pathname = usePathname();
  return NAVS[nav].bottom.map((it) => (
    <Link
      key={it.href}
      href={it.href}
      className="ha-bottom-nav__item"
      aria-current={isCurrent(it, pathname) ? "page" : undefined}
    >
      {it.icon && <it.icon size={24} />}
      <span>{it.label}</span>
    </Link>
  ));
}
