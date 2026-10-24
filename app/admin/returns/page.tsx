import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminSpeakerListSkeleton } from "@/components/admin/AdminSpeakerList";
import { Placeholder } from "@/components/shell/Placeholder";

export const metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <Suspense fallback={<AdminSpeakerListSkeleton />}>
      <AdminGate>
        <Placeholder eyebrow="Admin" title="Returns" lead="Upcoming and overdue return dates, with a control to mark each speaker returned, go here." />
      </AdminGate>
    </Suspense>
  );
}
