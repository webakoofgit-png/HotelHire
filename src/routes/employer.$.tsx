import { useParams } from "@/lib/navigation";
import { Dashboard } from "@/components/hotelhire/dashboard";
export default function Page() {
  const slug = useParams()["*"] ?? "overview";
  const aliases: Record<string, string> = {
    dashboard: "overview",
    "hiring-pipeline": "pipeline",
    applicants: "applications",
    "jobs/create": "jobs",
  };
  return <Dashboard role="Employer" view={aliases[slug] ?? slug} />;
}
