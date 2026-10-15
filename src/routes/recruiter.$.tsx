import { useParams } from "@/lib/navigation";
import { Dashboard } from "@/components/hotelhire/dashboard";
export default function Page() {
  const slug = useParams()["*"] ?? "overview";
  return (
    <Dashboard
      role="Recruiter"
      view={slug === "dashboard" ? "overview" : slug === "hiring-pipeline" ? "pipeline" : slug}
    />
  );
}
