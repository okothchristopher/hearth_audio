import { Suspense } from "react";
import { SignInButton } from "@/components/account/SignInButton";
import { CurrentRentalCard } from "@/components/rental/CurrentRentalCard";
import { ListeningNoteSection } from "@/components/rental/ListeningNoteSection";
import { PastRentalsList } from "@/components/rental/PastRentalsList";
import { RentalSkeleton } from "@/components/rental/RentalSkeleton";
import { Button, ErrorBanner, MessagePanel, RetryButton } from "@/components/ui";
import { getMyRentals } from "@/lib/rentals";

export const metadata = { title: "My rental" };

export default function MyRentalPage() {
  return (
    <div className="ha-rental">
      <h1>My rental</h1>
      <Suspense fallback={<RentalSkeleton />}>
        <RentalContent />
      </Suspense>
    </div>
  );
}

async function RentalContent() {
  let rentals: Awaited<ReturnType<typeof getMyRentals>>;
  try {
    rentals = await getMyRentals(); // reads the session cookie, so this renders per request
  } catch {
    return (
      <ErrorBanner title="We couldn't load your rental." action={<RetryButton />}>
        Check your connection and try again.
      </ErrorBanner>
    );
  }

  if (!rentals) {
    return (
      <MessagePanel title="Sign in to see your rental." actions={<SignInButton />}>
        Your current speaker, return date and listening notes are here once you sign in.
      </MessagePanel>
    );
  }

  const { current, past } = rentals;
  return (
    <>
      {current ? (
        <>
          <CurrentRentalCard rental={current} />
          <ListeningNoteSection rental={current} />
          <Button href="/" variant="secondary" className="ha-rental__swap">
            Swap for a different speaker
          </Button>
        </>
      ) : (
        <MessagePanel title="You don't have a speaker right now." actions={<Button href="/">Browse speakers</Button>} />
      )}
      <PastRentalsList rentals={past} />
    </>
  );
}
