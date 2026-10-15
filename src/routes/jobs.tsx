import { createFileRoute, Outlet } from "@tanstack/react-router";
type JobsSearch = { q?: string; city?: string; department?: string; experience?: string };
export const Route = createFileRoute("/jobs")({
  validateSearch: (s: Record<string, unknown>): JobsSearch => ({
    q: typeof s["q"] === "string" ? s["q"] : "",
    city: typeof s["city"] === "string" ? s["city"] : "",
    department: typeof s["department"] === "string" ? s["department"] : "",
    experience: typeof s["experience"] === "string" ? s["experience"] : "",
  }),
  component: () => <Outlet />,
});
