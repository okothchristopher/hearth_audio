import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Placeholder } from "@/components/shell/Placeholder";
import { Button } from "@/components/ui";
import { formatKes, getSpeaker, getSpeakers } from "@/lib/speakers";

export async function generateStaticParams() {
  return (await getSpeakers()).map(({ id }) => ({ id }));
}

export default async function SpeakerPage({ params }: PageProps<"/speakers/[id]">) {
  const speaker = await getSpeaker((await params).id);
  if (!speaker) notFound();

  return (
    <Placeholder
      eyebrow="Speaker page"
      title={speaker.name}
      lead={`${speaker.type}. ${formatKes(speaker.pricePerMonth)} / month.`}
    >
      <Button href="/" variant="ghost" iconStart={ArrowLeft}>
        Back to speakers
      </Button>
    </Placeholder>
  );
}
