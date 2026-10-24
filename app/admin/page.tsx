import { Plus } from "lucide-react";
import { Placeholder } from "@/components/shell/Placeholder";
import { Button } from "@/components/ui";

export const metadata = { title: "Speakers" };

export default function AdminSpeakersPage() {
  return (
    <Placeholder eyebrow="Admin" title="Speakers" lead="Every speaker, its status, and controls to mark it available or rented go here.">
      <Button href="/admin/speakers/new" iconStart={Plus}>
        Add speaker
      </Button>
    </Placeholder>
  );
}
