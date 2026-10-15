import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/hotelhire/dashboard";
export const Route = createFileRoute("/recruiter/$")({ component: Page });
function Page() {
  const slug = Route.useParams()._splat ?? "overview";
  return (
    <Dashboard
      role="Recruiter"
      view={slug === "dashboard" ? "overview" : slug === "hiring-pipeline" ? "pipeline" : slug}
    />
  );
}
