import { NotFoundPanel } from "@/components/shell/NotFoundPanel";

/** Editing a speaker id that doesn't exist. */
export default function SpeakerNotFound() {
  return <NotFoundPanel homeHref="/admin" homeLabel="Back to speakers" body="This speaker may have been removed, or the link may be old." />;
}
