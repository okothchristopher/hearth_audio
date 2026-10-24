"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { bookSpeaker, type BookingResult } from "@/app/(renter)/actions";
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

export function RentAction({ speakerId, speakerName, price, unavailableLabel, layout }: Props) {
  const user = useUser();
  const [sheet, setSheet] = useState<"signin" | "booking" | null>(null);
  const button = (
    <Button
      size="lg"
      block={layout === "aside"}
      disabled={!!unavailableLabel}
      onClick={() => setSheet(user ? "booking" : "signin")}
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
      {sheet === "signin" && (
        <SignInSheet
          context={`Sign in to rent the ${speakerName}.`}
          onClose={() => setSheet(null)}
          onSignedIn={() => setSheet("booking")}
        />
      )}
      {sheet === "booking" && (
        <BookingSheet
          speakerId={speakerId}
          speakerName={speakerName}
          price={price}
          onClose={() => setSheet(null)}
          onNeedsSignIn={() => setSheet("signin")}
        />
      )}
    </>
  );
}

function BookingSheet({
  speakerId,
  speakerName,
  price,
  onClose,
  onNeedsSignIn,
}: {
  speakerId: string;
  speakerName: string;
  price: string;
  onClose: () => void;
  onNeedsSignIn: () => void;
}) {
  const router = useRouter();
  const today = todayInNairobi();
  const [start, setStart] = useState(today);
  const [result, setResult] = useState<BookingResult>();
  const [pending, startTransition] = useTransition();
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(start) && start >= today;

  const confirm = () =>
    startTransition(async () => {
      const r = await bookSpeaker(speakerId, start);
      if (!r.ok && r.reason === "signin") return onNeedsSignIn();
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
        <TextField
          label="Start date"
          type="date"
          min={today}
          value={start}
          onChange={(e) => {
            setStart(e.currentTarget.value);
            setResult(undefined);
          }}
          hint="We deliver on this day."
          error={valid ? undefined : "Choose today or a later date."}
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
