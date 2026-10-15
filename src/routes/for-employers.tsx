import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BriefcaseBusiness, Users, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/hotelhire/platform";
import teamImage from "@/assets/hospitality-team.jpg";
export const Route = createFileRoute("/for-employers")({
  head: () => ({
    meta: [
      { title: "Hire Hospitality Staff — HotelHire Pro" },
      {
        name: "description",
        content:
          "Discover hospitality recruitment tools for hotel owners, restaurants and HR teams.",
      },
      { property: "og:title", content: "Hire Hospitality Staff — HotelHire Pro" },
      { property: "og:description", content: "Build a team your guests will love." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Employers,
});
function Employers() {
  return (
    <Layout>
      <section className="hero">
        <img
          className="hero-image"
          src={teamImage}
          width={1920}
          height={1024}
          alt="Experienced hospitality professionals at a luxury hotel"
        />
        <div className="container hero-inner employer-hero-copy">
          <span className="hero-tag">
            <ShieldCheck size={14} /> BUILT FOR HOSPITALITY EMPLOYERS
          </span>
          <h1>
            Your next great hire.
            <br />
            <span>Your strongest team yet.</span>
          </h1>
          <p className="hero-copy">
            From an independent café to a world-class hotel, find people who share your passion for
            hospitality.
          </p>
          <div className="flex gap-3 mt-7">
            <Button asChild>
              <Link to="/workspace">
                Explore hiring workspace <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/pricing">View plans</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container employer-feature-grid">
          {[
            {
              icon: BriefcaseBusiness,
              title: "Opportunities that reach the right people",
              text: "Create vacancies for your kitchen, service, housekeeping and management teams.",
            },
            {
              icon: Users,
              title: "A thoughtful hiring pipeline",
              text: "Review applicants, shortlist your best matches and manage interview stages in one place.",
            },
            {
              icon: LayoutDashboard,
              title: "Clarity across your recruitment",
              text: "Stay on top of active jobs, your applicant pipeline and every hiring decision.",
            },
          ].map((f) => (
            <div className="employer-feature" key={f.title}>
              <f.icon size={28} />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
