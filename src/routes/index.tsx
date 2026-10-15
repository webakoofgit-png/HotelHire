import { HomeExtras } from "@/components/hotelhire/home-extras";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChefHat,
  ConciergeBell,
  Coffee,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  SprayCan,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Layout,
  SectionHeading,
  JobCard,
  CompanyMark,
  useDemo,
} from "@/components/hotelhire/platform";
import { SponsoredBanner } from "@/components/hotelhire/public-pages";
import teamImage from "@/assets/hospitality-team.jpg";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HotelHire Pro — Find Your Next Hospitality Opportunity" },
      {
        name: "description",
        content:
          "Find rewarding hotel, restaurant and resort jobs with verified hospitality employers across India.",
      },
      { property: "og:title", content: "HotelHire Pro — Your Next Hospitality Opportunity" },
      {
        property: "og:description",
        content: "Discover careers with leading hospitality employers across India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
const categories = [
  { name: "Chef & Kitchen", count: 286, icon: ChefHat },
  { name: "Front Office", count: 184, icon: ConciergeBell },
  { name: "Food & Beverage", count: 312, icon: Coffee },
  { name: "Housekeeping", count: 228, icon: SprayCan },
  { name: "Hotel Management", count: 156, icon: Building2 },
  { name: "Restaurant Service", count: 247, icon: UtensilsCrossed },
];
function Index() {
  const { jobs: allJobs, companies: allCompanies, website } = useDemo();
  const jobs = allJobs.filter((j) => j.status === "Published");
  const companies = allCompanies.slice(0, 6);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [tab, setTab] = useState("All jobs");
  const featured = jobs
    .filter(
      (j) =>
        tab === "All jobs" ||
        (tab === "Full-time" && j.type === "Full-time") ||
        (tab === "With accommodation" && j.benefits.includes("Accommodation")) ||
        (tab === "For freshers" && j.experience.startsWith("0")),
    )
    .slice(0, 6);
  return (
    <Layout>
      <section className="hero">
        <img
          className="hero-image"
          src={teamImage}
          width={1920}
          height={1024}
          alt="Hospitality manager, chef and restaurant professional in an elegant hotel"
          fetchPriority="high"
        />
        <div className="container hero-inner">
          <span className="hero-tag">
            <Sparkles size={13} /> INDIA’S HOSPITALITY CAREER NETWORK
          </span>
          <h1>
            {website.heroLead}
            <br />
            <span>{website.heroAccent}</span>
          </h1>
          <p className="hero-copy">{website.tagline}</p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/jobs", search: { q: keyword, city, experience } });
            }}
          >
            <label className="search-field">
              <Search />
              <input
                aria-label="Job title or keyword"
                placeholder="Job title, skill or company"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </label>
            <label className="search-field">
              <MapPin />
              <select
                aria-label="Job location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Select location</option>
                {["Mumbai", "Pune", "Goa", "Bengaluru", "Nashik"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="search-field">
              <Building2 />
              <select
                aria-label="Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">Experience</option>
                <option value="0">Fresher</option>
                <option value="2">2+ years</option>
                <option value="5">5+ years</option>
              </select>
            </label>
            <Button type="submit">
              <Search />
              Find jobs
            </Button>
          </form>
          <div className="popular-searches">
            <span>Popular searches:</span>
            {["Chef", "Front Office", "Restaurant Manager", "Housekeeping"].map((q) => (
              <Link to="/jobs" search={{ q }} key={q}>
                {q}
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-proof">
          <ShieldCheck />
          <div>
            <strong>Great people. Verified employers.</strong>
            <span>A better way to build your hospitality career.</span>
          </div>
        </div>
      </section>
      <div className="trust-bar">
        <div className="container trust-inner">
          <p className="trust-caption">
            Find your next role with
            <br />
            <strong>the best in hospitality</strong>
          </p>
          {companies.map((c) => (
            <div className={`trust-logo tone-${c.tone}`} key={c.name}>
              <strong>
                {c.label === "MARRIOTT"
                  ? "Marriott"
                  : c.label === "ITC HOTELS"
                    ? "ITC HOTELS"
                    : c.label === "OBEROI"
                      ? "The Oberoi"
                      : c.label === "IHCL"
                        ? "Taj"
                        : c.label === "WESTIN"
                          ? "WESTIN"
                          : "HYATT"}
              </strong>
              <span>
                {c.label === "IHCL"
                  ? "HOTELS · RESORTS · PALACES"
                  : c.label === "OBEROI"
                    ? "HOTELS & RESORTS"
                    : c.label === "MARRIOTT"
                      ? "INTERNATIONAL"
                      : "HOTELS & RESORTS"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <section className="section">
        <div className="container">
          <SectionHeading
            title="A role for every passion"
            description="From the kitchen to the front desk, find where you belong."
            link={{ to: "/jobs", label: "Explore all categories" }}
          />
          <div className="categories-grid">
            {categories.map((c) => (
              <Link
                to="/jobs"
                search={{ department: c.name }}
                key={c.name}
                className="category-card"
              >
                <div className="category-icon">
                  <c.icon size={20} />
                </div>
                <h3>{c.name}</h3>
                <p>
                  {jobs.filter((j) => j.department === c.name).length} open positions
                  <ArrowUpRight className="category-arrow" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section featured-section">
        <div className="container">
          <SectionHeading
            eyebrow="YOUR NEXT CHAPTER"
            title="Featured hospitality jobs"
            description="Handpicked opportunities from employers who value your talent."
            link={{ to: "/jobs", label: "View all jobs" }}
          />
          <div className="filter-tabs">
            {["All jobs", "Full-time", "For freshers", "With accommodation"].map((t) => (
              <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>
                {t}
              </Button>
            ))}
          </div>
          <div className="jobs-grid">
            {featured.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
          <div className="center-action">
            <Button asChild variant="outline">
              <Link to="/jobs">
                Discover more opportunities <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            title="Great brands. Great places to work."
            description="Explore opportunities with leading hospitality employers."
            link={{ to: "/companies", label: "Explore companies" }}
          />
          <div className="companies-grid">
            {companies.map((c) => (
              <article className="company-card" key={c.name}>
                <CompanyMark mark={c.mark} tone={c.tone} />
                <h3>{c.name}</h3>
                <p>
                  <ShieldCheck size={11} className="inline mr-1" />
                  {c.status} · Demo
                </p>
                <Link to="/jobs" search={{ q: c.name }}>
                  {jobs.filter((j) => j.companyId === c.id).length} open jobs{" "}
                  <ArrowUpRight size={11} className="inline" />
                </Link>
              </article>
            ))}
          </div>
          <div className="employer-banner">
            <div>
              <span className="eyebrow">FOR HOSPITALITY EMPLOYERS</span>
              <h2>Your next great hire is here.</h2>
              <p>Connect with hospitality professionals. Build a team your guests will love.</p>
            </div>
            <div className="employer-banner-actions">
              <span>Find talent. Hire better.</span>
              <Button asChild>
                <Link to="/for-employers">
                  Start hiring <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <SponsoredBanner placement="Homepage" />
      </div>
      <HomeExtras />
    </Layout>
  );
}
