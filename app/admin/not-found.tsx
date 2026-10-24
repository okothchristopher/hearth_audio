import { NotFoundPanel } from "@/components/shell/NotFoundPanel";

// Missing pages anywhere under /admin: unmatched URLs (via [...rest]) and notFound()
// calls without a closer not-found.tsx. The admin layout supplies the header.
export default function AdminNotFound() {
  return <NotFoundPanel homeHref="/admin" homeLabel="Back to speakers" body="The link may be old, or the page has moved." />;
}
