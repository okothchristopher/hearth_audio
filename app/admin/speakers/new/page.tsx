import { Placeholder } from "@/components/shell/Placeholder";
import { Button } from "@/components/ui";

export const metadata = { title: "Add speaker" };

export default function AddSpeakerPage() {
  return (
    <Placeholder eyebrow="Admin" title="Add a speaker" lead="Name, brand, photo, price per month, description and status go here.">
      <Button href="/admin" variant="ghost">
        Back to speakers
      </Button>
    </Placeholder>
  );
}
