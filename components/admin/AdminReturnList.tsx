import { StatusChip, type Status } from "@/components/ui";
import type { ActiveRental } from "@/lib/admin";
import { daysBetween, formatDate, formatDayMonth, formatWeekday } from "@/lib/dates";
import { MarkReturnedButton } from "./MarkReturnedButton";

/** Chip for a rental as of `today` (prototype AdminReturns rules). */
export function returnStatus(r: ActiveRental, today: string): { status: Status; label: string } {
  if (r.startDate > today) return { status: "available", label: `Delivery ${formatDayMonth(r.startDate)}` };
  const left = daysBetween(today, r.dueDate);
  if (left < 0) return { status: "overdue", label: "Overdue" };
  const verb = r.isCollection ? "Collection" : "Returns";
  if (left <= 6) return { status: "due", label: `${verb} ${left === 0 ? "today" : formatWeekday(r.dueDate)}` };
  return { status: "rented", label: `${verb} ${formatDayMonth(r.dueDate)}` };
}

/** Rentals out with renters: a table from 768px, stacked rows below. */
export function AdminReturnList({ rentals, today }: { rentals: ActiveRental[]; today: string }) {
  const rows = rentals.map((r) => ({ ...r, ...returnStatus(r, today), markLabel: `Mark returned: ${r.speakerName} from ${r.renter}` }));
  return (
    <>
      <table className="ha-admin-table">
        <thead>
          <tr>
            <th scope="col">Renter</th>
            <th scope="col">Speaker</th>
            <th scope="col">Delivered</th>
            <th scope="col">Due back</th>
            <th scope="col">Status</th>
            <th scope="col" className="ha-admin-table__actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="ha-admin-speaker__text">
                  <span className="ha-admin-speaker__name">{r.renter}</span>
                  {r.area && <span className="ha-small ha-admin-speaker__muted">{r.area}</span>}
                </div>
              </td>
              <td>{r.speakerName}</td>
              <td>{formatDate(r.startDate)}</td>
              <td>{formatDate(r.dueDate)}</td>
              <td>
                <StatusChip status={r.status}>{r.label}</StatusChip>
              </td>
              <td>
                <div className="ha-admin-table__buttons">
                  <MarkReturnedButton rentalId={r.id} label={r.markLabel} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="ha-admin-list">
        {rows.map((r) => (
          <li key={r.id} className="ha-admin-list__item">
            <StatusChip status={r.status}>{r.label}</StatusChip>
            <div className="ha-admin-speaker__text">
              <span className="ha-admin-speaker__name">{r.speakerName}</span>
              <span className="ha-small ha-admin-speaker__muted">
                {r.renter}
                {r.area ? `, ${r.area}` : ""}
              </span>
              <span className="ha-small ha-num">Due back {formatDate(r.dueDate)}</span>
            </div>
            <MarkReturnedButton rentalId={r.id} label={r.markLabel} block />
          </li>
        ))}
      </ul>
    </>
  );
}
