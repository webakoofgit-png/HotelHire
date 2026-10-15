import { useParams } from "@/lib/navigation";

import { ArticleDetails } from "@/components/hotelhire/public-pages";
export default function Page() {
  return <ArticleDetails id={useParams()["id"] ?? ""} />;
}
