import { ArrowLeft, Repeat } from "lucide-react";
import { Suspense } from "react";
import { SignInButton } from "@/components/account/SignInButton";
import { RentalSkeleton } from "@/components/rental/RentalSkeleton";
import { ReturningSpeakerCard } from "@/components/swap/ReturningSpeakerCard";
import { SwapForm } from "@/components/swap/SwapForm";
import { Button, ErrorBanner, MessagePanel, RetryButton } from "@/components/ui";
import { formatDate } from "@/lib/dates";
import { collectionWindow, getMyRentals } from "@/lib/rentals";

export const metadata = { title: "Swap" };

export default function SwapPage() {
  return (
    <div className="ha-swap">
      <Button href="/rental" variant="ghost" iconStart={ArrowLeft} className="ha-swap__back">
        My rental
      </Button>
      <Suspense fallback={<RentalSkeleton />}>
        <SwapContent />
      </Suspense>
    </div>
  );
}

async function SwapContent() {
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
      <MessagePanel icon={Repeat} title="Sign in to swap your speaker." actions={<SignInButton />}>
        Your current speaker and its collection day are here once you sign in.
      </MessagePanel>
    );
  }

  const rental = rentals.current;
  if (!rental) {
    return (
      <MessagePanel
        icon={Repeat}
        title="You have nothing to swap yet."
        actions={
          <Button href="/" size="lg">
            Browse speakers
          </Button>
        }
      >
        Rent a speaker first. When you want a different sound, swap it here and we bring the next one on the same day.
      </MessagePanel>
    );
  }

  if (rental.collectionDate) {
    return (
      <MessagePanel
        tone="success"
        title={`Collection booked for ${formatDate(rental.collectionDate)}.`}
        actions={
          <>
            <Button href="/" size="lg">
              Choose your next speaker
            </Button>
            <Button href="/rental" variant="ghost" size="lg">
              Go to My rental
            </Button>
          </>
        }
      >
        {rental.hasNote ? `Your note on the ${rental.speakerName} is published. ` : ""}
        Now choose what you want to hear next. We deliver it on the same day.
      </MessagePanel>
    );
  }

  const { from, count } = collectionWindow(rental.returnDate);
  if (count === 0) {
    return (
      <MessagePanel icon={Repeat} title={`Your ${rental.speakerName} is due back today.`} actions={<Button href="/">Browse speakers</Button>}>
        We collect it today. Choose your next speaker and we deliver it on the day you pick.
      </MessagePanel>
    );
  }

  return (
    <>
      <div className="ha-swap__intro">
        <h1>Swap your speaker</h1>
        <p className="ha-swap__lead">
          We collect your {rental.speakerName} and deliver the next speaker on the same day.
          {rental.note ? "" : " Write your listening note first, so the next renter knows what to expect."}
        </p>
      </div>
      <div className="ha-swap__layout">
        <SwapForm rental={rental} from={from} count={count} />
        <ReturningSpeakerCard rental={rental} />
      </div>
    </>
  );
}
