"use client";

import { Repeat } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { bookSpeaker, getBookingStart, type BookingResult } from "@/app/(renter)/actions";
import { SignInSheet } from "@/components/account/SignInSheet";
import { Button, Dialog, TextField } from "@/components/ui";
import { RENTAL_DAYS, addDays, formatDate, formatShortDate, todayInNairobi } from "@/lib/dates";
import { useUser } from "@/lib/supabase/client";

type Props = {
  speakerId: string;
  speakerName: string;
  /** Pre-formatted, e.g. "KES 18,000" */
  price: string;
  /** e.g. "Unavailable until 3 Nov"; when set the button is disabled */
  unavailableLabel?: string;
  /** "aside": desktop column. "bar": fixed bar above the mobile bottom nav. */
  layout: "aside" | "bar";
};

type Sheet =
  | { kind: "signin" }
  | { kind: "swap-first"; current: string }
  | { kind: "booking"; earliest: string; swapFrom?: string }
  | null;

export function RentAction({ speakerId, speakerName, price, unavailableLabel, layout }: Props) {
  const user = useUser();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [checking, startCheck] = useTransition();

  // One speaker at a time: decide between sign-in, swap first, or booking (and from which day)
  const openNext = () =>
    startCheck(async () => {
      const start = await getBookingStart().catch(() => ({ status: "ready" as const, earliest: todayInNairobi() }));
      if (start.status === "signin") return setSheet({ kind: "signin" });
      if (start.status === "swap-first") return setSheet({ kind: "swap-first", current: start.current });
      setSheet({ kind: "booking", earliest: start.earliest, swapFrom: "swapFrom" in start ? start.swapFrom : undefined });
    });

  const button = (
    <Button
      size="lg"
      block={layout === "aside"}
      disabled={!!unavailableLabel || checking}
      onClick={() => (user ? openNext() : setSheet({ kind: "signin" }))}
    >
      {unavailableLabel ?? "Rent for a month"}
    </Button>
  );

  return (
    <>
      {layout === "aside" ? (
        <div className="ha-rent-aside">
          {button}
          <p className="ha-small ha-rent-aside__hint">Thirty days from the delivery day. We deliver anywhere in Nairobi.</p>
        </div>
      ) : (
        <div className="ha-rent-bar">
          <p className="ha-num ha-rent-bar__price">
            <span>{price}</span>
            <span className="ha-rent-bar__per">per month</span>
          </p>
          {button}
        </div>
      )}
      {sheet?.kind === "signin" && (
        <SignInSheet context={`Sign in to rent the ${speakerName}.`} onClose={() => setSheet(null)} onSignedIn={openNext} />
      )}
      {sheet?.kind === "swap-first" && (
        <Dialog
          sheet
          title="Swap your speaker first"
          onClose={() => setSheet(null)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setSheet(null)}>
                Cancel
              </Button>
              <Button href="/swap" iconStart={Repeat}>
                Swap your speaker
              </Button>
            </>
          }
        >
          <p>
            You have the {sheet.current} at home. Swap it to rent the {speakerName}. We deliver the next speaker on the day we
            collect yours.
          </p>
        </Dialog>
      )}
      {sheet?.kind === "booking" && (
        <BookingSheet
          speakerId={speakerId}
          speakerName={speakerName}
          price={price}
          earliest={sheet.earliest}
          swapFrom={sheet.swapFrom}
          onClose={() => setSheet(null)}
          onNeedsSignIn={() => setSheet({ kind: "signin" })}
          onSwapFirst={(current) => setSheet({ kind: "swap-first", current })}
        />
      )}
    </>
  );
}

function BookingSheet({
  speakerId,
  speakerName,
  price,
  earliest,
  swapFrom,
  onClose,
  onNeedsSignIn,
  onSwapFirst,
}: {
  speakerId: string;
  speakerName: string;
  price: string;
  /** First bookable day: today, or the swap collection day */
  earliest: string;
  /** Name of the speaker being swapped out, when booking the next one */
  swapFrom?: string;
  onClose: () => void;
  onNeedsSignIn: () => void;
  onSwapFirst: (current: string) => void;
}) {
  const router = useRouter();
  const [start, setStart] = useState(earliest);
  const [result, setResult] = useState<BookingResult>();
  const [pending, startTransition] = useTransition();
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(start) && start >= earliest;
  const earliestMessage = earliest === todayInNairobi() ? "Choose today or a later date." : `Choose ${formatDate(earliest)} or later.`;

  const confirm = () =>
    startTransition(async () => {
      const r = await bookSpeaker(speakerId, start);
      if (!r.ok && r.reason === "signin") return onNeedsSignIn();
      if (!r.ok && r.reason === "swap-first") return onSwapFirst(swapFrom ?? "current speaker");
      setResult(r);
      if (r.ok) router.refresh(); // status chips and My rental
    });

  if (result?.ok) {
    return (
      <Dialog
        sheet
        title="Booked."
        onClose={onClose}
        actions={
          <Button href="/rental" onClick={onClose}>
            View my rental
          </Button>
        }
      >
        <p role="status">
          {speakerName} is reserved from {formatShortDate(result.startDate)} to {formatShortDate(result.returnDate)}.
          {" "}We&apos;ll message you to arrange delivery.
        </p>
      </Dialog>
    );
  }

  return (
    <Dialog
      sheet
      title={`Book the ${speakerName}`}
      onClose={onClose}
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!valid || pending} onClick={confirm}>
            {pending ? "Booking" : "Confirm booking"}
          </Button>
        </>
      }
    >
      <div className="ha-booking">
        {swapFrom && (
          <p className="ha-booking__swap">
            We deliver it on {formatDate(earliest)}, the day we collect your {swapFrom}.
          </p>
        )}
        <TextField
          label="Start date"
          type="date"
          min={earliest}
          value={start}
          onChange={(e) => {
            setStart(e.currentTarget.value);
            setResult(undefined);
          }}
          hint="We deliver on this day."
          error={valid ? undefined : earliestMessage}
        />
        <dl className="ha-summary">
          <div>
            <dt>Speaker</dt>
            <dd>{speakerName}</dd>
          </div>
          <div>
            <dt>Length</dt>
            <dd>{RENTAL_DAYS} days</dd>
          </div>
          <div>
            <dt>Returns</dt>
            <dd>{valid ? formatDate(addDays(start, RENTAL_DAYS)) : "—"}</dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>{price}</dd>
          </div>
        </dl>
        {result && !result.ok && (
          <p role="alert" className="ha-field__error">
            {result.message}
          </p>
        )}
        <p className="ha-small ha-booking__note">After you book, we message you to arrange delivery and send payment details.</p>
      </div>
    </Dialog>
  );
}
