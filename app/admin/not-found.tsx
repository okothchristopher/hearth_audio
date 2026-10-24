import { NotFoundPanel } from "@/components/shell/NotFoundPanel";

export const metadata = { title: "Page not found" };

/** notFound() inside admin, e.g. editing an unknown speaker id. The admin layout supplies the header. */
export default function AdminNotFound() {
  return <NotFoundPanel homeHref="/admin" homeLabel="Back to speakers" body="This speaker may have been removed, or the link may be old." />;
}
