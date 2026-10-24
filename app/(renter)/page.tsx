import { Suspense } from "react";
import { SpeakerList, SpeakerListSkeleton } from "@/components/browse/SpeakerList";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function BrowsePage({ searchParams }: PageProps<"/">) {
  return (
    <div className="ha-browse">
      <section className="ha-browse__hero">
        <h1 className="ha-display">Hear a different speaker at home every month.</h1>
        <p className="ha-browse__lead">
          Rent a premium speaker for thirty days. Listen at home, then swap it for another.
        </p>
      </section>
      <HowItWorks />
      <Suspense fallback={<SpeakerListSkeleton />}>
        <SpeakerList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
