import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/hotelhire/dashboard";
export const Route = createFileRoute("/employer/$")({ component: Page });
function Page() {
  const slug = Route.useParams()._splat ?? "overview";
  const aliases: Record<string, string> = {
    dashboard: "overview",
    "hiring-pipeline": "pipeline",
    applicants: "applications",
    "jobs/create": "jobs",
  };
  return <Dashboard role="Employer" view={aliases[slug] ?? slug} />;
}
