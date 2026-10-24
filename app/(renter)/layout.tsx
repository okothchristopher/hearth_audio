import { AccountAction } from "@/components/account/AccountAction";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { AppShell } from "@/components/shell/AppShell";
import { SiteFooter } from "@/components/shell/SiteFooter";

// ChatWidget renders after <main> with the footer, not beside {children}: a sibling
// of the page segment inside <main> breaks Next's instant-navigation validation.
export default function RenterLayout({ children }: LayoutProps<"/">) {
  return (
    <AppShell
      nav="renter"
      homeHref="/"
      action={<AccountAction />}
      footer={
        <>
          <SiteFooter />
          <ChatWidget />
        </>
      }
    >
      {children}
    </AppShell>
  );
}
