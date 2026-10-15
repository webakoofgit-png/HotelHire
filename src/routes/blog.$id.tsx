import { createFileRoute } from "@tanstack/react-router";
import { ArticleDetails } from "@/components/hotelhire/public-pages";
export const Route = createFileRoute("/blog/$id")({
  head: () => ({ meta: [{ title: "The HotelHire Journal — Career Advice" }] }),
  component: Page,
});
function Page() {
  return <ArticleDetails id={Route.useParams().id} />;
}
