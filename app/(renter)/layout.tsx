import { AccountAction } from "@/components/account/AccountAction";
import { AppShell } from "@/components/shell/AppShell";

export default function RenterLayout({ children }: LayoutProps<"/">) {
  return (
    <AppShell nav="renter" homeHref="/" action={<AccountAction />}>
      {children}
    </AppShell>
  );
}
