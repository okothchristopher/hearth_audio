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
      {src ? <img src={src} alt={alt} /> : <span className="ha-photo__label">{label}</span>}
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

export function SpeakerCard({
  href,
  brand,
  name,
  price,
  rating,
  notes,
  status = "available",
  statusLabel,
  photo,
}: {
  href: string;
  brand: string;
  name: string;
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
        <SpeakerPhoto src={photo} alt={`${brand} ${name}`} />
        <div className="ha-speaker-card__chip">
          <StatusChip status={status}>{statusLabel}</StatusChip>
        </div>
      </div>
      <div className="ha-speaker-card__body">
        <span className="ha-label ha-speaker-card__brand">{brand}</span>
        <h3 className="ha-speaker-card__name">{name}</h3>
        <div className="ha-speaker-card__row">
          <span className="ha-speaker-card__price">
            <strong>{price}</strong>
            <span className="ha-speaker-card__per"> / month</span>
          </span>
          {rating !== undefined && <StarRating value={rating} size={14} showValue count={notes} />}
        </div>
      </div>
    </Link>
  );
}
