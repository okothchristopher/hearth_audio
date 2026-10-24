import { AccountAction } from "@/components/account/AccountAction";
import { AppShell } from "@/components/shell/AppShell";
import { SiteFooter } from "@/components/shell/SiteFooter";

export default function RenterLayout({ children }: LayoutProps<"/">) {
  return (
    <AppShell nav="renter" homeHref="/" action={<AccountAction />} footer={<SiteFooter />}>
      {children}
    </AppShell>
  );
}
