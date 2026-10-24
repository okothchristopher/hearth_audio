"use client";

import { useState } from "react";
import { Button, Dialog, TextField } from "@/components/ui";
import { RENTAL_DAYS, addDays, formatDate, todayInNairobi } from "@/lib/dates";

type Props = {
  speakerName: string;
  /** Pre-formatted, e.g. "KES 18,000" */
  price: string;
  /** e.g. "Unavailable until 3 Nov"; when set the button is disabled */
  unavailableLabel?: string;
  /** "aside": desktop column. "bar": fixed bar above the mobile bottom nav. */
  layout: "aside" | "bar";
};

export function RentAction({ speakerName, price, unavailableLabel, layout }: Props) {
  const [open, setOpen] = useState(false);
  const button = (
    <Button size="lg" block={layout === "aside"} disabled={!!unavailableLabel} onClick={() => setOpen(true)}>
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
      {open && <BookingSheet speakerName={speakerName} price={price} onClose={() => setOpen(false)} />}
    </>
  );
}

function BookingSheet({ speakerName, price, onClose }: { speakerName: string; price: string; onClose: () => void }) {
  const today = todayInNairobi();
  const [start, setStart] = useState(today);
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(start) && start >= today;

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
          {/* Enabled once accounts and rentals are stored in Supabase */}
          <Button disabled aria-describedby="booking-unavailable">
            Confirm booking
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
          onChange={(e) => setStart(e.currentTarget.value)}
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
        <p className="ha-small ha-booking__note">After you book, we message you to arrange delivery and send payment details.</p>
        <p id="booking-unavailable" className="ha-small ha-booking__note">
          Booking is not available yet.
        </p>
      </div>
    </Dialog>
  );
}
