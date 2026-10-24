import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSpeakerListSkeleton } from "@/components/admin/AdminSpeakerList";
import { SpeakerForm } from "@/components/admin/SpeakerForm";

export const metadata = { title: "Add speaker" };

export default function AddSpeakerPage() {
  return (
    <div className="ha-admin">
      <Suspense fallback={<AdminSpeakerListSkeleton />}>
        <AdminGate>
          <SpeakerForm />
        </AdminGate>
      </Suspense>
    </div>
  );
}
