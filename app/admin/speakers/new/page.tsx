import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSpeakerListSkeleton } from "@/components/admin/AdminSpeakerList";
import { Placeholder } from "@/components/shell/Placeholder";
import { Button } from "@/components/ui";

export const metadata = { title: "Add speaker" };

export default function AddSpeakerPage() {
  return (
    <Suspense fallback={<AdminSpeakerListSkeleton />}>
      <AdminGate>
        <Placeholder eyebrow="Admin" title="Add a speaker" lead="Name, brand, photo, price per month, description and status go here.">
          <Button href="/admin" variant="ghost">
            Back to speakers
          </Button>
        </Placeholder>
      </AdminGate>
    </Suspense>
  );
}
