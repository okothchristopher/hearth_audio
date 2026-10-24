import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Placeholder } from "@/components/shell/Placeholder";
import { Button } from "@/components/ui";
import { sampleSpeakers } from "@/lib/sample-speakers";

export function generateStaticParams() {
  return sampleSpeakers.map(({ id }) => ({ id }));
}

export default async function SpeakerPage({ params }: PageProps<"/speakers/[id]">) {
  const { id } = await params;
  const speaker = sampleSpeakers.find((s) => s.id === id);
  if (!speaker) notFound();

  return (
    <Placeholder eyebrow="Speaker page" title={speaker.name} lead={`${speaker.summary}. ${speaker.price} / month.`}>
      <Button href="/" variant="ghost" iconStart={ArrowLeft}>
        Back to speakers
      </Button>
    </Placeholder>
  );
}
