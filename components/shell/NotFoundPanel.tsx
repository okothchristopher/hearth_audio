import { SearchX } from "lucide-react";
import { Button, MessagePanel } from "@/components/ui";

/** 404 content. Renders inside whatever shell the not-found.tsx boundary sits under. */
export function NotFoundPanel({
  homeHref = "/",
  homeLabel = "Browse speakers",
  body = "The link may be old, or the speaker may no longer be listed.",
}: {
  homeHref?: string;
  homeLabel?: string;
  body?: string;
}) {
  return (
    <MessagePanel
      icon={SearchX}
      title="This page isn't here."
      actions={
        <Button href={homeHref} size="lg">
          {homeLabel}
        </Button>
      }
    >
      {body}
    </MessagePanel>
  );
}
