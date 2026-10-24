import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { SignInButton } from "@/components/account/SignInButton";
import { Button, ErrorBanner, MessagePanel, RetryButton } from "@/components/ui";
import { getAdminContext, type AdminContext } from "@/lib/admin";

/** Renders children only for admins; otherwise a sign-in prompt or a "team only" message. */
export async function AdminGate({ children }: { children: ReactNode }) {
  let ctx: AdminContext;
  try {
    ctx = await getAdminContext();
  } catch {
    return (
      <ErrorBanner title="We couldn't check your account." action={<RetryButton />}>
        Check your connection and try again.
      </ErrorBanner>
    );
  }

  if (ctx.status === "signed-out") {
    return (
      <MessagePanel icon={Lock} title="Sign in to manage speakers." actions={<SignInButton />}>
        This area is for the Hearth Audio team.
      </MessagePanel>
    );
  }
  if (ctx.status === "forbidden") {
    return (
      <MessagePanel
        icon={Lock}
        title="This area is for the Hearth Audio team."
        actions={
          <Button href="/" size="lg">
            Go to the renter site
          </Button>
        }
      >
        Your account doesn&apos;t have admin access.
      </MessagePanel>
    );
  }
  return children;
}
