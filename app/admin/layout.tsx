import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui";

// Admin screens come from the prototype; the spec defines the role but not its screens.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <AppShell nav="admin" homeHref="/admin" action={<Button href="/" variant="ghost" iconStart={ArrowUpRight}>Renter site</Button>}>
      {children}
    </AppShell>
  );
}
