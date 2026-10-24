import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSpeakerListSkeleton } from "@/components/admin/AdminSpeakerList";
import { SpeakerForm } from "@/components/admin/SpeakerForm";
import { ErrorBanner, RetryButton } from "@/components/ui";
import { getSpeaker, type Speaker } from "@/lib/speakers";

export const metadata = { title: "Edit speaker" };

export default function EditSpeakerPage({ params }: PageProps<"/admin/speakers/[id]">) {
  return (
    <div className="ha-admin">
      <Suspense fallback={<AdminSpeakerListSkeleton />}>
        <AdminGate>
          <EditContent params={params} />
        </AdminGate>
      </Suspense>
    </div>
  );
}

async function EditContent({ params }: { params: PageProps<"/admin/speakers/[id]">["params"] }) {
  const { id } = await params;
  let speaker: Speaker | undefined;
  try {
    speaker = await getSpeaker(id);
  } catch {
    return (
      <ErrorBanner title="We couldn't load this speaker." action={<RetryButton />}>
        Check your connection and try again.
      </ErrorBanner>
    );
  }
  if (!speaker) notFound();
  // key: a fresh form when moving between speakers
  return <SpeakerForm key={speaker.id} speaker={speaker} />;
}
