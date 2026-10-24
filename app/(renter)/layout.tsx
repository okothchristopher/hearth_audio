import { UserRound } from "lucide-react";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui";

export default function RenterLayout({ children }: LayoutProps<"/">) {
  return (
    // Sign in opens a sheet (claude-design-prompt.md); wired up with Supabase Auth later.
    <AppShell nav="renter" homeHref="/" action={<Button variant="ghost" iconStart={UserRound}>Sign in</Button>}>
      {children}
    </AppShell>
  );
}
