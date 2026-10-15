import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/hotelhire/dashboard";
export const Route = createFileRoute("/candidate/$")({ component: Page });
function Page() {
  const slug = Route.useParams()._splat ?? "overview";
  const aliases: Record<string, string> = {
    dashboard: "overview",
    "job-alerts": "alerts",
    "my-applications": "applications",
    resume: "profile",
  };
  return <Dashboard role="Candidate" view={aliases[slug] ?? slug} />;
}
