import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/hotelhire/dashboard";
import type { Role } from "@/lib/demo-store";
const roles = ["Candidate", "Employer", "Recruiter", "Admin"];
export const Route = createFileRoute("/workspace")({
  validateSearch: (s: Record<string, unknown>): { role?: Role; view?: string } => ({
    role: roles.includes(String(s["role"])) ? (s["role"] as Role) : ("Employer" as Role),
    view: typeof s["view"] === "string" ? s["view"] : "overview",
  }),
  head: () => ({ meta: [{ title: "Recruitment Workspace — HotelHire Pro" }] }),
  component: Page,
});
function Page() {
  const s = Route.useSearch();
  return <Dashboard role={s.role ?? "Employer"} view={s.view ?? "overview"} />;
}
