import { AccountAction } from "@/components/account/AccountAction";
import { AppShell } from "@/components/shell/AppShell";
import { NotFoundPanel } from "@/components/shell/NotFoundPanel";
import { SiteFooter } from "@/components/shell/SiteFooter";

// URLs that match no route render here, inside the root layout only, so this adds
// the renter shell (header and footer) itself, matching app/(renter)/layout.tsx.
// notFound() inside (renter) or admin uses their own not-found.tsx, which keeps that
// area's shell instead of adding a second one.
export default function NotFound() {
  return (
    <AppShell nav="renter" homeHref="/" action={<AccountAction />} footer={<SiteFooter />}>
      <NotFoundPanel />
    </AppShell>
  );
}
