import { useParams } from "@/lib/navigation";

import { CompanyDetails } from "@/components/hotelhire/public-pages";
export default function Page() {
  return <CompanyDetails id={useParams()["id"] ?? ""} />;
}
