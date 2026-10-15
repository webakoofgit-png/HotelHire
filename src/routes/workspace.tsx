import { useSearchParams } from "@/lib/navigation";
import { Dashboard } from "@/components/hotelhire/dashboard";
import type { Role } from "@/lib/demo-store";
const roles = ["Candidate", "Employer", "Recruiter", "Admin"];
export default function Workspace() {
  const [params] = useSearchParams();
  const requested = params.get("role") ?? "";
  const role: Role = roles.includes(requested) ? (requested as Role) : "Employer";
  return <Dashboard role={role} view={params.get("view") || "overview"} />;
}
