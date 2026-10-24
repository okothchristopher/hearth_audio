import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { StarRating } from "./StarRating";
import { StatusChip, type Status } from "./feedback";

export function Card({
  interactive = false,
  padding = 24,
  className = "",
  style,
  ...rest
}: { interactive?: boolean; padding?: number | string } & ComponentProps<"div">) {
  return (
    <div
      className={`ha-card${interactive ? " ha-card--interactive" : ""} ${className}`}
      style={{ padding, ...style }}
      {...rest}
    />
  );
}

/** Until real photography exists this renders a labelled tonal placeholder. */
export function SpeakerPhoto({
  src,
  alt = "",
  ratio = "4 / 5",
  label = "Speaker photo placeholder",
}: {
  src?: string;
  alt?: string;
  ratio?: string;
  label?: string;
}) {
  return (
    <div className="ha-photo" style={{ aspectRatio: ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- photos come from Supabase Storage later */}
      {src ? <img src={src} alt={alt} /> : <span className="ha-photo__label" aria-hidden="true">{label}</span>}
    </div>
  );
}

export function ListeningNote({
  author,
  area,
  date,
  stars,
  children,
}: {
  author: string;
  area?: string;
  date: string;
  stars: number;
  children: ReactNode;
}) {
  return (
    <figure className="ha-note">
      <div className="ha-note__meta">
        <StarRating value={stars} size={14} />
        <span className="ha-note__date">{date}</span>
      </div>
      <blockquote className="ha-note__text">{children}</blockquote>
      <figcaption className="ha-note__author">
        {author}
        {area && <span className="ha-note__area"> · {area}</span>}
      </figcaption>
    </figure>
  );
}

/** Prototype SpeakerTile: a compact row on mobile, a column card from 768px. */
export function SpeakerCard({
  href,
  name,
  type,
  price,
  rating,
  notes = 0,
  status = "available",
  statusLabel,
  photo,
}: {
  href: string;
  name: string;
  /** Type and tuning, e.g. "Bookshelf speaker, warm tuning" */
  type: string;
  /** Pre-formatted, e.g. "KES 18,000" */
  price: string;
  rating?: number;
  notes?: number;
  status?: Status;
  statusLabel?: string;
  photo?: string;
}) {
  return (
    <Link href={href} className="ha-card ha-card--interactive ha-speaker-card">
      <div className="ha-speaker-card__photo">
        <SpeakerPhoto src={photo} alt={name} />
      </div>
      <div className="ha-speaker-card__body">
        <div className="ha-speaker-card__chip">
          <StatusChip status={status}>{statusLabel}</StatusChip>
        </div>
        <h3 className="ha-speaker-card__name">{name}</h3>
        <p className="ha-speaker-card__type">{type}</p>
        <div className="ha-speaker-card__row">
          <span className="ha-speaker-card__price">
            <strong>{price}</strong>
            <span className="ha-speaker-card__per"> / month</span>
          </span>
          {notes > 0 && rating !== undefined ? (
            <StarRating value={rating} size={14} showValue count={notes} />
          ) : (
            <span className="ha-speaker-card__per">No listening notes yet</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function SpeakerCardSkeleton() {
  return (
    <div className="ha-card ha-speaker-card" aria-hidden="true">
      <div className="ha-speaker-card__photo">
        <div className="ha-photo" style={{ aspectRatio: "4 / 5" }} />
      </div>
      <div className="ha-speaker-card__body">
        <div className="ha-skeleton" style={{ height: 22, width: "40%", borderRadius: 999 }} />
        <div className="ha-skeleton" style={{ height: 22, width: "70%" }} />
        <div className="ha-skeleton" style={{ height: 16, width: "55%" }} />
      </div>
    </div>
  );
}
