import { Placeholder } from "@/components/shell/Placeholder";
import { Button } from "@/components/ui";

export const metadata = { title: "Swap" };

export default function SwapPage() {
  return (
    <Placeholder eyebrow="Swap" title="Swap for a different speaker" lead="Return your current speaker, write a listening note, then choose the next one.">
      <Button href="/" variant="secondary">
        Browse speakers
      </Button>
    </Placeholder>
  );
}
