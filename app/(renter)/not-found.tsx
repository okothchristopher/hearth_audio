import { NotFoundPanel } from "@/components/shell/NotFoundPanel";

export const metadata = { title: "Page not found" };

/** notFound() inside the renter area, e.g. an unknown speaker id. The renter layout supplies the header. */
export default function RenterNotFound() {
  return <NotFoundPanel />;
}
