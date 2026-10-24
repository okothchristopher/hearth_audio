import { AccountAction } from "@/components/account/AccountAction";
import { AppShell } from "@/components/shell/AppShell";
import { NotFoundPanel } from "@/components/shell/NotFoundPanel";

// URLs that match no route render here, inside the root layout only, so this adds
// the renter header itself. notFound() inside (renter) or admin uses their own
// not-found.tsx, which keeps that area's header instead of adding a second one.
export default function NotFound() {
  return (
    <AppShell nav="renter" homeHref="/" action={<AccountAction />}>
      <NotFoundPanel />
    </AppShell>
  );
}
