import { createFileRoute } from "@tanstack/react-router";
import { CompanyDetails } from "@/components/hotelhire/public-pages";
export const Route = createFileRoute("/companies_/$id")({
  head: () => ({ meta: [{ title: "Employer Profile — HotelHire Pro" }] }),
  component: Page,
});
function Page() {
  return <CompanyDetails id={Route.useParams().id} />;
}
