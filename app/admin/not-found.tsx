import { NotFoundPanel } from "@/components/shell/NotFoundPanel";

// Missing pages anywhere under /admin: unmatched URLs (via [...rest]) and notFound()
// calls such as an unknown speaker id. The admin layout supplies the header.
export default function AdminNotFound() {
  return (
    <NotFoundPanel
      homeHref="/admin"
      homeLabel="Back to speakers"
      body="The link may be old, or the speaker or page may have been removed."
    />
  );
}
