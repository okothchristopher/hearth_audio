import { Placeholder } from "@/components/shell/Placeholder";
import { Button } from "@/components/ui";

export const metadata = { title: "My rental" };

export default function MyRentalPage() {
  return (
    <Placeholder eyebrow="My rental" title="Your speaker this month" lead="The current speaker, days left, your listening note and past rentals go here.">
      <Button href="/swap" variant="secondary">
        Swap for a different speaker
      </Button>
    </Placeholder>
  );
}
