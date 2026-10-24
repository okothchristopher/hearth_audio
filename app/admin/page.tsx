import { Plus, Speaker } from "lucide-react";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSpeakerList, AdminSpeakerListSkeleton } from "@/components/admin/AdminSpeakerList";
import { Button, ErrorBanner, MessagePanel, RetryButton } from "@/components/ui";
import { getSpeakers, type Speaker as SpeakerData } from "@/lib/speakers";

export const metadata = { title: "Speakers" };

export default function AdminSpeakersPage() {
  return (
    <div className="ha-admin">
      <Suspense fallback={<AdminSpeakerListSkeleton />}>
        <AdminGate>
          <SpeakersContent />
        </AdminGate>
      </Suspense>
    </div>
  );
}

function Head({ summary }: { summary: string }) {
  return (
    <div className="ha-admin__head">
      <div className="ha-admin__title">
        <h1>Speakers</h1>
        <p className="ha-admin__summary">{summary}</p>
      </div>
      <Button href="/admin/speakers/new" size="lg" iconStart={Plus}>
        Add speaker
      </Button>
    </div>
  );
}

async function SpeakersContent() {
  let speakers: SpeakerData[];
  try {
    speakers = await getSpeakers();
  } catch {
    return (
      <>
        <Head summary="" />
        <ErrorBanner title="We couldn't load the speakers." action={<RetryButton />}>
          Check your connection and try again.
        </ErrorBanner>
      </>
    );
  }

  if (speakers.length === 0) {
    return (
      <>
        <Head summary="Nothing listed yet." />
        <MessagePanel
          icon={Speaker}
          title="No speakers yet."
          actions={
            <Button href="/admin/speakers/new" size="lg" iconStart={Plus}>
              Add speaker
            </Button>
          }
        >
          Add your first speaker. It shows on Browse as soon as you save it.
        </MessagePanel>
      </>
    );
  }

  const available = speakers.filter((s) => s.status === "available").length;
  return (
    <>
      <Head summary={`${speakers.length} speakers. ${available} available, ${speakers.length - available} out with renters.`} />
      <AdminSpeakerList speakers={speakers} />
    </>
  );
}
