import { useParams } from "@/lib/navigation";
import { Dashboard } from "@/components/hotelhire/dashboard";
export default function Page() {
  const slug = useParams()["*"] ?? "overview";
  const aliases: Record<string, string> = {
    dashboard: "overview",
    recruiters: "team",
    subscriptions: "plans",
    payments: "billing",
    invoices: "billing",
    blogs: "content",
    pages: "content",
    banners: "advertisements",
    reports: "analytics",
    "audit-logs": "audit",
    "admin-users": "team",
    "jobs/pending": "jobs",
    "advertisements/create": "advertisements",
    "advertisements/placements": "placements",
    "advertisements/analytics": "analytics",
    "featured-jobs": "promotions",
    "featured-employers": "employers",
    support: "enquiries",
    testimonials: "content",
    locations: "categories",
  };
  return <Dashboard role="Admin" view={aliases[slug] ?? slug} />;
}
