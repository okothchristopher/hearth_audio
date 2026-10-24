import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui";

// Admin screens come from the prototype; the spec defines the role but not its screens.
// Each page wraps its content in <AdminGate> inside its own <Suspense> (not here, so
// the page segment still renders for instant-navigation checks). Row-level security
// protects the data itself.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AppShell nav="admin" homeHref="/admin" action={<Button href="/" variant="ghost" iconStart={ArrowUpRight}>Renter site</Button>}>
      {children}
    </AppShell>
  );
}
