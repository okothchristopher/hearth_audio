import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Logo } from "@/components/ui";
import { NAVS, type NavItem, type NavName } from "@/lib/nav";
import { BottomLinks, HeaderLinks } from "./NavLinks";

// Without a known pathname (dynamic routes during prerender) links render with no current state.
function Static({ items, className }: { items: NavItem[]; className: string }) {
  return items.map((it) => (
    <Link key={it.href} href={it.href} className={className}>
      {it.icon && <it.icon size={24} />}
      <span>{it.label}</span>
    </Link>
  ));
}

/** AppHeader + BottomNav from the prototype. CSS swaps header links for the bottom bar below 768px. */
export function AppShell({
  nav,
  homeHref,
  user,
  action,
  children,
}: {
  nav: NavName;
  homeHref: string;
  user?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <a href="#main" className="ha-skip-link">
        Skip to content
      </a>
      <header className="ha-header">
        <div className="ha-header__inner">
          <Link href={homeHref} className="ha-header__home" aria-label="Hearth Audio home">
            <Logo variant="symbol-on-light" size={32} withName />
          </Link>
          <nav aria-label="Main" className="ha-header__nav">
            <Suspense fallback={<Static items={NAVS[nav].header} className="ha-nav-link" />}>
              <HeaderLinks nav={nav} />
            </Suspense>
          </nav>
          {user && <span className="ha-header__user">{user}</span>}
          {action}
        </div>
      </header>
      <main id="main" className="ha-main">
        {children}
      </main>
      <nav aria-label="Main" className="ha-bottom-nav">
        <Suspense fallback={<Static items={NAVS[nav].bottom} className="ha-bottom-nav__item" />}>
          <BottomLinks nav={nav} />
        </Suspense>
      </nav>
    </>
  );
}
