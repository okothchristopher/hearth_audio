import { Card, SpeakerPhoto } from "@/components/ui";
import { formatDayMonth, formatDate } from "@/lib/dates";
import type { Rental } from "@/lib/rentals";

/** "You are returning" summary beside the swap form (prototype Swap aside). */
export function ReturningSpeakerCard({ rental }: { rental: Rental }) {
  return (
    <Card className="ha-returning" padding={20} aria-label="Speaker you are returning" role="complementary">
      <div className="ha-returning__photo">
        <SpeakerPhoto alt={rental.speakerName} label="" />
      </div>
      <div className="ha-returning__body">
        <p className="ha-small ha-returning__muted">You are returning</p>
        <p className="ha-returning__name">{rental.speakerName}</p>
        <p className="ha-small ha-num ha-returning__muted">
          {formatDayMonth(rental.startDate)} to {formatDate(rental.returnDate)}
        </p>
      </div>
    </Card>
  );
}
