import { Pencil } from "lucide-react";
import { Button, SpeakerPhoto, StatusChip } from "@/components/ui";
import { formatKes, type Speaker } from "@/lib/speakers";
import { StatusToggle } from "./StatusToggle";

function notesLine(s: Speaker) {
  if (!s.noteCount || s.rating === undefined) return "No notes yet";
  return `${s.rating.toFixed(1)} from ${s.noteCount} ${s.noteCount === 1 ? "note" : "notes"}`;
}

const statusLabel = (s: Speaker) => (s.status === "available" ? "Available" : "Rented");

/** Admin speaker list: a table from 768px, stacked rows below (prototype AdminSpeakers). */
export function AdminSpeakerList({ speakers }: { speakers: Speaker[] }) {
  return (
    <>
      <table className="ha-admin-table">
        <thead>
          <tr>
            <th scope="col">Speaker</th>
            <th scope="col">Price per month</th>
            <th scope="col">Listening notes</th>
            <th scope="col">Status</th>
            <th scope="col" className="ha-admin-table__actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {speakers.map((s) => (
            <tr key={s.id}>
              <td>
                <div className="ha-admin-speaker">
                  <div className="ha-admin-speaker__photo">
                    <SpeakerPhoto src={s.photoUrl} ratio="1 / 1" label="" alt={s.name} />
                  </div>
                  <div className="ha-admin-speaker__text">
                    <span className="ha-admin-speaker__name">{s.name}</span>
                    <span className="ha-small ha-admin-speaker__muted">{s.type}</span>
                  </div>
                </div>
              </td>
              <td>{formatKes(s.pricePerMonth)}</td>
              <td>{notesLine(s)}</td>
              <td>
                <StatusChip status={s.status === "available" ? "available" : "rented"}>{statusLabel(s)}</StatusChip>
              </td>
              <td>
                <div className="ha-admin-table__buttons">
                  <StatusToggle speakerId={s.id} speakerName={s.name} status={s.status} />
                  <Button href={`/admin/speakers/${s.id}`} variant="ghost" iconStart={Pencil} aria-label={`Edit ${s.name}`}>
                    Edit
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="ha-admin-list">
        {speakers.map((s) => (
          <li key={s.id} className="ha-admin-list__item">
            <div className="ha-admin-speaker">
              <div className="ha-admin-speaker__photo ha-admin-speaker__photo--lg">
                <SpeakerPhoto src={s.photoUrl} ratio="1 / 1" label="" alt={s.name} />
              </div>
              <div className="ha-admin-speaker__text">
                <span className="ha-admin-speaker__name">{s.name}</span>
                <span className="ha-small ha-num ha-admin-speaker__muted">
                  {formatKes(s.pricePerMonth)} / month · {notesLine(s)}
                </span>
                <StatusChip status={s.status === "available" ? "available" : "rented"}>{statusLabel(s)}</StatusChip>
              </div>
            </div>
            <div className="ha-admin-list__buttons">
              <StatusToggle speakerId={s.id} speakerName={s.name} status={s.status} block />
              <Button href={`/admin/speakers/${s.id}`} variant="ghost" block iconStart={Pencil} aria-label={`Edit ${s.name}`}>
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function AdminSpeakerListSkeleton() {
  return (
    <div aria-hidden="true" className="ha-admin-skeleton">
      {[1, 2, 3, 4, 5].map((k) => (
        <div key={k} className="ha-admin-skeleton__row">
          <div className="ha-skeleton" style={{ width: 56, height: 56 }} />
          <div className="ha-admin-skeleton__text">
            <div className="ha-skeleton" style={{ width: "40%", height: 18 }} />
            <div className="ha-skeleton" style={{ width: "25%", height: 14 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
