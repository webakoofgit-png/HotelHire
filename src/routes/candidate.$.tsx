import { useParams } from "@/lib/navigation";
import { Dashboard } from "@/components/hotelhire/dashboard";
export default function Page() {
  const slug = useParams()["*"] ?? "overview";
  const aliases: Record<string, string> = {
    dashboard: "overview",
    "job-alerts": "alerts",
    "my-applications": "applications",
    resume: "profile",
  };
  return <Dashboard role="Candidate" view={aliases[slug] ?? slug} />;
}
