import { createFileRoute, notFound } from "@tanstack/react-router";
import { PublicPage, publicPages } from "@/components/hotelhire/public-pages";
export const Route = createFileRoute("/$page")({
  beforeLoad: ({ params }) => {
    if (!publicPages.includes(params.page)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.page.replaceAll("-", " ")} — HotelHire Pro` }],
  }),
  component: Page,
});
function Page() {
  return <PublicPage page={Route.useParams().page} />;
}
