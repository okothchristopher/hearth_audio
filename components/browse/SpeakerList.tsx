import { Speaker } from "lucide-react";
import Link from "next/link";
import { Button, ErrorBanner, MessagePanel, SpeakerCard, SpeakerCardSkeleton } from "@/components/ui";
import { formatKes, getSpeakers, statusLabel, type Speaker as SpeakerData } from "@/lib/speakers";
import { RetryButton } from "./RetryButton";

function FilterBar({ availableOnly, count }: { availableOnly: boolean; count?: string }) {
  return (
    <div className="ha-browse__filters">
      <nav aria-label="Filter speakers" className="ha-browse__tags">
        <Link href="/" scroll={false} className="ha-tag ha-browse__tag" aria-current={!availableOnly || undefined}>
          All speakers
        </Link>
        <Link href="/?filter=available" scroll={false} className="ha-tag ha-browse__tag" aria-current={availableOnly || undefined}>
          Available now
        </Link>
      </nav>
      {count && <p className="ha-small ha-num ha-browse__count">{count}</p>}
    </div>
  );
}

export async function SpeakerList({ searchParams }: { searchParams: PageProps<"/">["searchParams"] }) {
  const availableOnly = (await searchParams).filter === "available";

  let all: SpeakerData[];
  try {
    all = await getSpeakers();
  } catch {
    return (
      <>
        <FilterBar availableOnly={availableOnly} />
        <ErrorBanner title="We couldn't load the speakers." action={<RetryButton />}>
          Check your connection and try again.
        </ErrorBanner>
      </>
    );
  }

  const available = all.filter((s) => s.status === "available");
  const shown = availableOnly ? available : all;

  return (
    <>
      <FilterBar availableOnly={availableOnly} count={`${available.length} of ${all.length} speakers available now`} />
      {shown.length === 0 ? (
        <MessagePanel
          icon={Speaker}
          title="Every speaker is rented right now."
          actions={
            <Button href="/" size="lg" scroll={false}>
              Show all speakers
            </Button>
          }
        >
          Turn off the filter to see when they return.
        </MessagePanel>
      ) : (
        <ul className="ha-speaker-grid ha-browse__list">
          {shown.map((s) => (
            <li key={s.id}>
              <SpeakerCard
                href={`/speakers/${s.id}`}
                name={s.name}
                type={s.type}
                price={formatKes(s.pricePerMonth)}
                rating={s.rating}
                notes={s.noteCount}
                status={s.status === "available" ? "available" : "due"}
                statusLabel={statusLabel(s)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function SpeakerListSkeleton() {
  return (
    <>
      <p role="status" className="ha-visually-hidden">
        Loading speakers
      </p>
      <div className="ha-browse__filters" aria-hidden="true">
        <div className="ha-skeleton" style={{ height: 44, width: 260, borderRadius: 999 }} />
      </div>
      <div className="ha-speaker-grid">
        {[1, 2, 3, 4, 5, 6].map((k) => (
          <SpeakerCardSkeleton key={k} />
        ))}
      </div>
    </>
  );
}
