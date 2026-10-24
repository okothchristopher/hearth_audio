import { CalendarCheck } from "lucide-react";
import { Suspense } from "react";
import { AdminGate } from "@/components/admin/AdminGate";
import { AdminReturnList, returnStatus } from "@/components/admin/AdminReturnList";
import { AdminSpeakerListSkeleton } from "@/components/admin/AdminSpeakerList";
import { Button, ErrorBanner, MessagePanel, RetryButton } from "@/components/ui";
import { getActiveRentals, getAdminContext, type ActiveRental } from "@/lib/admin";
import { todayInNairobi } from "@/lib/dates";

export const metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <div className="ha-admin">
      <Suspense fallback={<AdminSpeakerListSkeleton />}>
        <AdminGate>
          <ReturnsContent />
        </AdminGate>
      </Suspense>
    </div>
  );
}

function Head({ summary }: { summary: string }) {
  return (
    <div className="ha-admin__title">
      <h1>Returns</h1>
      <p className="ha-admin__summary">{summary}</p>
    </div>
  );
}

async function ReturnsContent() {
  let rentals: ActiveRental[];
  try {
    const ctx = await getAdminContext(); // AdminGate already checked; this gives the client
    if (ctx.status !== "admin") return null;
    rentals = await getActiveRentals(ctx.supabase);
  } catch {
    return (
      <>
        <Head summary="" />
        <ErrorBanner title="We couldn't load the returns." action={<RetryButton />}>
          Check your connection and try again.
        </ErrorBanner>
      </>
    );
  }

  if (rentals.length === 0) {
    return (
      <>
        <Head summary="Nothing is out with renters." />
        <MessagePanel icon={CalendarCheck} title="No speakers are out right now." actions={<Button href="/admin">View speakers</Button>}>
          When a renter books a speaker, its return date shows here.
        </MessagePanel>
      </>
    );
  }

  const today = todayInNairobi();
  const overdue = rentals.filter((r) => returnStatus(r, today).status === "overdue").length;
  const n = rentals.length;
  return (
    <>
      <Head summary={`${n} ${n === 1 ? "speaker" : "speakers"} out with renters${overdue ? `, ${overdue} overdue` : ""}.`} />
      <AdminReturnList rentals={rentals} today={today} />
    </>
  );
}
