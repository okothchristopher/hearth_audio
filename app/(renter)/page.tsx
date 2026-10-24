import { Placeholder } from "@/components/shell/Placeholder";
import { Button } from "@/components/ui";
import { sampleSpeakers } from "@/lib/sample-speakers";

export default function BrowsePage() {
  return (
    <Placeholder eyebrow="Browse speakers" title="Hear a different speaker at home every month." lead="Speaker cards, the Available now filter and the active rental banner go here.">
      <Button href={`/speakers/${sampleSpeakers[0].id}`} variant="secondary">
        Open a speaker page
      </Button>
      <Button href="/design-system" variant="ghost">
        View the design system
      </Button>
    </Placeholder>
  );
}
