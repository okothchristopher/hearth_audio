import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSpeakerListSkeleton } from "@/components/admin/AdminSpeakerList";
import { SpeakerForm } from "@/components/admin/SpeakerForm";
import { ErrorBanner, RetryButton } from "@/components/ui";
import { getSpeaker, type Speaker } from "@/lib/speakers";

export const metadata = { title: "Edit speaker" };

// Blocking route: the speaker lookup (public data) finishes before anything streams,
// so an unknown id gets a real 404 status. Only the admin check and form stream in.
export const instant = false;

export default async function EditSpeakerPage({ params }: PageProps<"/admin/speakers/[id]">) {
  const { id } = await params;

  let speaker: Speaker | undefined;
  try {
    speaker = await getSpeaker(id);
  } catch {
    return (
      <div className="ha-admin">
        <ErrorBanner title="We couldn't load this speaker." action={<RetryButton />}>
          Check your connection and try again.
        </ErrorBanner>
      </div>
    );
  }
  if (!speaker) notFound();

  return (
    <div className="ha-admin">
      <Suspense fallback={<AdminSpeakerListSkeleton />}>
        <AdminGate>
          {/* key: a fresh form when moving between speakers */}
          <SpeakerForm key={speaker.id} speaker={speaker} />
        </AdminGate>
      </Suspense>
    </div>
  );
}
