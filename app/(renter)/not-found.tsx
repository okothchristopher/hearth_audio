import { NotFoundPanel } from "@/components/shell/NotFoundPanel";

// notFound() inside the renter area, e.g. an unknown speaker id. The renter layout
// supplies the header. (Nested not-found files can't set metadata; only the root can.)
export default function RenterNotFound() {
  return <NotFoundPanel />;
}
