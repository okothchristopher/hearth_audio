import { SearchX } from "lucide-react";
import { Button, MessagePanel } from "@/components/ui";

/**
 * 404 content. Renders inside whatever shell the not-found.tsx boundary sits under.
 * Sets the tab title itself: nested not-found files can't export metadata, and the
 * page's own title (e.g. "Edit speaker") would otherwise remain.
 */
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
    <>
      <title>Page not found · Hearth Audio</title>
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
    </>
  );
}
