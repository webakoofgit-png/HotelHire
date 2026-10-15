import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Hotel,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { CompanyMark, Layout, useDemo } from "@/components/hotelhire/platform";
import { businessTypes, type Company } from "@/lib/demo-data";
import { companyInsights, companySizes } from "@/lib/company-discovery";
import directoryCss from "@/company-directory.css?url";
import { SponsoredBanner } from "@/components/hotelhire/public-pages";
export const Route = createFileRoute("/companies")({
  head: () => ({
    links: [{ rel: "stylesheet", href: directoryCss }],
    meta: [
      { title: "Discover Companies Hiring in Hospitality — HotelHire Pro" },
      {
        name: "description",
        content:
          "Explore hospitality employers by business type, location, team size and open opportunities. Find a company where you belong.",
      },
    ],
  }),
  component: Companies,
});
type Filters = {
  cities: string[];
  types: string[];
  departments: string[];
  sizes: string[];
  verified: boolean;
  hiring: boolean;
};
const emptyFilters: Filters = {
  cities: [],
  types: [],
  departments: [],
  sizes: [],
  verified: false,
  hiring: false,
};
const categoryTiles = [
  { name: "Hotels", value: "Hotel", icon: Hotel, tone: "indigo" },
  { name: "Resorts", value: "Resort", icon: Sun, tone: "green" },
  { name: "Restaurants", value: "Restaurant", icon: UtensilsCrossed, tone: "amber" },
  { name: "Cafés", value: "Café", icon: Coffee, tone: "rose" },
  { name: "Hospitality groups", value: "groups", icon: Building2, tone: "blue" },
];
function Companies() {
  const d = useDemo();
  const [query, setQuery] = useState(""),
    [filters, setFilters] = useState<Filters>(emptyFilters),
    [tab, setTab] = useState("all"),
    [sort, setSort] = useState("recommended"),
    [page, setPage] = useState(1),
    [drawer, setDrawer] = useState(false),
    [groupOnly, setGroupOnly] = useState(false);
  const published = d.jobs.filter((j) => j.status === "Published");
  const companyJobs = (id: string) => published.filter((j) => j.companyId === id);
  const featured = (id: string) => companyJobs(id).some((j) => j.featured);
  function toggle(key: "cities" | "types" | "departments" | "sizes", value: string) {
    setFilters((old) => ({
      ...old,
      [key]: old[key].includes(value) ? old[key].filter((x) => x !== value) : [...old[key], value],
    }));
    setPage(1);
  }
  function reset() {
    setFilters(emptyFilters);
    setGroupOnly(false);
    setQuery("");
    setTab("all");
    setPage(1);
  }
  const list = d.companies
    .filter((c) => {
      const facts = companyInsights(c),
        jobs = companyJobs(c.id);
      return (
        (!query ||
          `${c.name} ${c.city} ${c.type}`.toLowerCase().includes(query.trim().toLowerCase())) &&
        (!filters.cities.length || filters.cities.includes(c.city)) &&
        (!filters.types.length || filters.types.includes(c.type)) &&
        (!filters.sizes.length || filters.sizes.includes(facts.size)) &&
        (!filters.departments.length ||
          jobs.some((j) => filters.departments.includes(j.department))) &&
        (!filters.verified || c.status === "Verified") &&
        (!filters.hiring || jobs.length > 0) &&
        (!groupOnly || facts.ownership !== "Independent business") &&
        (tab !== "featured" || featured(c.id)) &&
        (tab !== "following" || d.following.includes(c.id))
      );
    })
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "openings"
          ? companyJobs(b.id).length - companyJobs(a.id).length
          : sort === "rating"
            ? companyInsights(b).rating - companyInsights(a).rating
            : Number(b.status === "Verified") - Number(a.status === "Verified") ||
              companyJobs(b.id).length - companyJobs(a.id).length,
    );
  const pages = Math.max(1, Math.ceil(list.length / 9)),
    current = Math.min(page, pages),
    start = (current - 1) * 9;
  const selectedCount =
    filters.cities.length +
    filters.types.length +
    filters.departments.length +
    filters.sizes.length +
    Number(filters.verified) +
    Number(filters.hiring) +
    Number(groupOnly);
  const filterBody = (
    <CompanyFilters
      filters={filters}
      toggle={toggle}
      setFlag={(key, value) => {
        setFilters((old) => ({ ...old, [key]: value }));
        setPage(1);
      }}
      reset={reset}
      count={selectedCount}
    />
  );
  return (
    <Layout>
      <div className="company-discovery">
        <section className="company-discovery-hero">
          <div className="container">
            <div className="company-breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={12} />
              <span>Explore companies</span>
            </div>
            <span className="directory-eyebrow">
              <Sparkles size={13} /> GREAT TEAMS. GREATER POSSIBILITIES.
            </span>
            <h1>
              Find a company you’ll <span>love.</span>
            </h1>
            <p>Discover the hospitality teams where your next chapter begins.</p>
            <form
              className="company-search"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                document
                  .getElementById("company-results")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <Search size={20} />
              <input
                aria-label="Search companies"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by company name, city or business type"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear company search"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                >
                  <X size={15} />
                </button>
              )}
              <Button type="submit">
                Search
                <ArrowRight size={15} />
              </Button>
            </form>
            <div className="directory-proof">
              <span>
                <Building2 size={13} />
                {d.companies.length} hospitality employers
              </span>
              <i />
              <span>{published.length} open opportunities</span>
              <i />
              <span>All records are illustrative</span>
            </div>
          </div>
        </section>
        <div className="container">
          <section className="company-category-section" aria-label="Discover company categories">
            <div className="company-section-title">
              <h2>Explore companies by category</h2>
              <span>A place for every hospitality passion</span>
            </div>
            <div className="company-category-row">
              {categoryTiles.map((cat) => {
                const Icon = cat.icon,
                  active = cat.value === "groups" ? groupOnly : filters.types.includes(cat.value);
                const count = d.companies.filter((c) =>
                  cat.value === "groups"
                    ? companyInsights(c).ownership !== "Independent business"
                    : c.type === cat.value,
                ).length;
                return (
                  <button
                    key={cat.value}
                    className={`company-category-tile ${active ? "selected" : ""}`}
                    aria-pressed={active}
                    onClick={() => {
                      if (cat.value === "groups") {
                        setGroupOnly(!groupOnly);
                        setPage(1);
                      } else toggle("types", cat.value);
                    }}
                  >
                    <div className={`directory-category-icon category-${cat.tone}`}>
                      <Icon size={21} />
                    </div>
                    <div>
                      <h3>{cat.name}</h3>
                      <p>
                        {count} companies hiring
                        <ChevronRight size={13} />
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
          <div className="company-directory-layout" id="company-results">
            <aside className="company-filter-sidebar">
              {filterBody}
              <div className="company-filter-help">
                <ShieldCheck size={22} />
                <h3>Your next employer matters.</h3>
                <p>Explore the team, benefits and opportunities before taking your next step.</p>
                <Link to="/$page" params={{ page: "blog" }}>
                  A little career guidance <ArrowUpRight size={13} />
                </Link>
              </div>
            </aside>
            <section className="company-results-section">
              <div className="company-results-heading">
                <div>
                  <span className="eyebrow">MEET YOUR NEXT TEAM</span>
                  <h2>Companies hiring in hospitality</h2>
                </div>
                <span className="directory-total">{list.length} companies</span>
              </div>
              <div className="company-directory-toolbar">
                <div className="company-view-tabs" aria-label="Company collections">
                  {[
                    { id: "all", name: "All companies" },
                    { id: "featured", name: "Featured" },
                    { id: "following", name: "Following", count: d.following.length },
                  ].map((t) => (
                    <button
                      key={t.id}
                      className={tab === t.id ? "active" : ""}
                      aria-pressed={tab === t.id}
                      onClick={() => {
                        setTab(t.id);
                        setPage(1);
                      }}
                    >
                      {t.name}
                      {t.count !== undefined && <span>{t.count}</span>}
                    </button>
                  ))}
                </div>
                <label className="company-sort">
                  <span>Sort by:</span>
                  <select
                    aria-label="Sort companies"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="openings">Most openings</option>
                    <option value="rating">Sample rating</option>
                    <option value="name">Company name</option>
                  </select>
                  <ChevronDown size={12} />
                </label>
              </div>
              <div className="company-mobile-toolbar">
                <Button variant="outline" onClick={() => setDrawer(true)}>
                  <SlidersHorizontal size={15} />
                  All filters{selectedCount > 0 && <span>{selectedCount}</span>}
                </Button>
                <span>
                  {list.length ? `${start + 1}–${Math.min(start + 9, list.length)}` : "0"} of{" "}
                  {list.length} companies
                </span>
              </div>
              {selectedCount > 0 && (
                <div className="company-applied-filters" aria-label="Applied company filters">
                  {(["types", "cities", "departments", "sizes"] as const).flatMap((key) =>
                    filters[key].map((value) => (
                      <button
                        key={`${key}-${value}`}
                        onClick={() => toggle(key, value)}
                        aria-label={`Remove ${value} filter`}
                      >
                        {value}
                        <X size={11} />
                      </button>
                    )),
                  )}
                  {filters.verified && (
                    <button onClick={() => setFilters((old) => ({ ...old, verified: false }))}>
                      Verified employers
                      <X size={11} />
                    </button>
                  )}
                  {filters.hiring && (
                    <button onClick={() => setFilters((old) => ({ ...old, hiring: false }))}>
                      With open jobs
                      <X size={11} />
                    </button>
                  )}
                  {groupOnly && (
                    <button onClick={() => setGroupOnly(false)}>
                      Hospitality groups
                      <X size={11} />
                    </button>
                  )}
                  <button className="clear-directory-filters" onClick={reset}>
                    Clear all
                  </button>
                </div>
              )}
              <div className="company-results-note">
                <Star size={12} />
                <span>Fictional companies · Ratings and reviews shown are sample data.</span>
              </div>
              {list.length ? (
                <div className="directory-company-grid">
                  {list.slice(start, start + 9).map((c) => (
                    <DirectoryCard
                      key={c.id}
                      company={c}
                      openings={companyJobs(c.id).length}
                      featured={featured(c.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="company-directory-empty">
                  <Search size={34} />
                  <h3>
                    {tab === "following"
                      ? "Your favourite teams, together."
                      : "No companies match just yet."}
                  </h3>
                  <p>
                    {tab === "following"
                      ? "Follow a company to find it here. Your list stays with you as you explore."
                      : "Try a different company name or adjust your filters to discover more employers."}
                  </p>
                  <Button variant="outline" onClick={reset}>
                    Explore all companies
                    <ArrowRight size={15} />
                  </Button>
                </div>
              )}
              <div className="company-pagination">
                <span>
                  {list.length
                    ? `Showing ${start + 1}–${Math.min(start + 9, list.length)} of ${list.length} companies`
                    : "No companies to show"}
                </span>
                <nav aria-label="Company result pages">
                  <button
                    aria-label="Previous companies page"
                    disabled={current === 1}
                    onClick={() => setPage(current - 1)}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: pages }, (_, i) => (
                    <button
                      key={i}
                      aria-label={`Company page ${i + 1}`}
                      aria-current={current === i + 1 ? "page" : undefined}
                      className={current === i + 1 ? "active" : ""}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    aria-label="Next companies page"
                    disabled={current === pages}
                    onClick={() => setPage(current + 1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
              <div className="company-profile-cta">
                <div className="company-cta-art">
                  <Users size={36} />
                  <span>
                    <Check size={12} />
                  </span>
                </div>
                <div>
                  <span className="eyebrow">GET DISCOVERED BY GREAT TEAMS</span>
                  <h3>The right company could be looking for you.</h3>
                  <p>Tell your story. Build your profile. Let your next chapter find you.</p>
                </div>
                <Button asChild>
                  <Link to="/workspace" search={{ role: "Candidate", view: "profile" }}>
                    Build my profile
                    <ArrowUpRight size={15} />
                  </Link>
                </Button>
              </div>
              <SponsoredBanner placement="Employer directory" />
            </section>
          </div>
          <section className="company-bottom-note">
            <ShieldCheck size={18} />
            <p>
              Take a closer look before you take the next step.
              <span>
                Company profiles, ratings, verification badges and vacancies are illustrative demo
                records.
              </span>
            </p>
          </section>
        </div>
      </div>
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="company-filter-sheet">
          <SheetHeader>
            <SheetTitle>Find your kind of company</SheetTitle>
            <SheetDescription>
              Refine your search by location, business type and more.
            </SheetDescription>
          </SheetHeader>
          {filterBody}
          <Button className="company-filter-apply" onClick={() => setDrawer(false)}>
            Show {list.length} companies
            <ArrowRight size={15} />
          </Button>
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
function CompanyFilters({
  filters,
  toggle,
  setFlag,
  reset,
  count,
}: {
  filters: Filters;
  toggle: (key: "cities" | "types" | "departments" | "sizes", value: string) => void;
  setFlag: (key: "verified" | "hiring", value: boolean) => void;
  reset: () => void;
  count: number;
}) {
  const d = useDemo(),
    [locationQuery, setLocationQuery] = useState(""),
    [allLocations, setAllLocations] = useState(false),
    [allDepartments, setAllDepartments] = useState(false);
  const locationOptions = d.locations.filter((c) =>
    c.toLowerCase().includes(locationQuery.toLowerCase()),
  );
  return (
    <div className="company-filter-card">
      <div className="company-filter-title">
        <h2>
          <SlidersHorizontal size={16} />
          All filters{count > 0 && <span>{count}</span>}
        </h2>
        {count > 0 && <button onClick={reset}>Clear all</button>}
      </div>
      <details className="directory-filter-group" open>
        <summary>
          Business type
          <ChevronDown size={14} />
        </summary>
        <div className="directory-filter-options">
          {businessTypes.map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={() => toggle("types", type)}
              />
              <span>
                {type === "Hotel"
                  ? "Hotels"
                  : type === "Resort"
                    ? "Resorts"
                    : type === "Restaurant"
                      ? "Restaurants"
                      : type === "Café"
                        ? "Cafés"
                        : type}
              </span>
              <small>{d.companies.filter((c) => c.type === type).length}</small>
            </label>
          ))}
        </div>
      </details>
      <details className="directory-filter-group" open>
        <summary>
          Location
          <ChevronDown size={14} />
        </summary>
        <label className="directory-location-search">
          <Search size={13} />
          <input
            aria-label="Search company locations"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search a city"
          />
        </label>
        <div className="directory-filter-options">
          {locationOptions.slice(0, allLocations || locationQuery ? undefined : 5).map((city) => (
            <label key={city}>
              <input
                type="checkbox"
                checked={filters.cities.includes(city)}
                onChange={() => toggle("cities", city)}
              />
              <span>{city}</span>
              <small>{d.companies.filter((c) => c.city === city).length}</small>
            </label>
          ))}
        </div>
        {!locationQuery && locationOptions.length > 5 && (
          <button className="directory-more-filters" onClick={() => setAllLocations(!allLocations)}>
            {allLocations ? "Show less" : `+${locationOptions.length - 5} more locations`}
          </button>
        )}
        {!locationOptions.length && <p className="location-no-match">No matching cities</p>}
      </details>
      <details className="directory-filter-group" open>
        <summary>
          Team size
          <ChevronDown size={14} />
        </summary>
        <div className="directory-filter-options">
          {companySizes.map((size) => (
            <label key={size}>
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={() => toggle("sizes", size)}
              />
              <span>{size}</span>
              <small>{d.companies.filter((c) => companyInsights(c).size === size).length}</small>
            </label>
          ))}
        </div>
      </details>
      <details className="directory-filter-group" open>
        <summary>
          Hiring department
          <ChevronDown size={14} />
        </summary>
        <div className="directory-filter-options">
          {d.categories.slice(0, allDepartments ? undefined : 5).map((dept) => (
            <label key={dept}>
              <input
                type="checkbox"
                checked={filters.departments.includes(dept)}
                onChange={() => toggle("departments", dept)}
              />
              <span>{dept}</span>
            </label>
          ))}
        </div>
        <button
          className="directory-more-filters"
          onClick={() => setAllDepartments(!allDepartments)}
        >
          {allDepartments ? "Show less" : "View all departments"}
        </button>
      </details>
      <details className="directory-filter-group" open>
        <summary>
          Employer preferences
          <ChevronDown size={14} />
        </summary>
        <div className="directory-filter-options">
          <label>
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => setFlag("verified", e.target.checked)}
            />
            <span>Verified employers</span>
            <ShieldCheck size={12} />
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.hiring}
              onChange={(e) => setFlag("hiring", e.target.checked)}
            />
            <span>With open opportunities</span>
          </label>
        </div>
      </details>
    </div>
  );
}
function DirectoryCard({
  company: c,
  openings,
  featured,
}: {
  company: Company;
  openings: number;
  featured: boolean;
}) {
  const d = useDemo(),
    facts = companyInsights(c),
    followed = d.following.includes(c.id);
  return (
    <article className="directory-company-card">
      <div className="directory-card-top">
        <CompanyMark mark={c.mark} tone={c.tone} />
        <button
          className={`company-follow ${followed ? "followed" : ""}`}
          aria-label={`${followed ? "Unfollow" : "Follow"} ${c.name}`}
          aria-pressed={followed}
          onClick={() =>
            d.setFollowing((old) =>
              old.includes(c.id) ? old.filter((id) => id !== c.id) : [...old, c.id],
            )
          }
        >
          <Bookmark size={17} fill={followed ? "currentColor" : "none"} />
        </button>
      </div>
      <Link className="directory-company-name" to="/companies/$id" params={{ id: c.id }}>
        <h3>{c.name}</h3>
        <ChevronRight size={16} />
      </Link>
      <div className="directory-company-rating">
        <span>
          <Star size={12} fill="currentColor" />
          {facts.rating.toFixed(1)}
        </span>
        <i />
        <small>{facts.reviews} sample reviews</small>
      </div>
      <div className="directory-company-tags">
        <span>{c.type}</span>
        <span>{facts.ownership}</span>
      </div>
      <p className="directory-company-tagline">{facts.tagline}</p>
      <div className="directory-company-location">
        <MapPin size={13} />
        <span>{c.city}</span>
        <i /> <span>{facts.size.replace(" employees", "")} employees</span>
      </div>
      <div className="directory-card-divider" />
      <div className="directory-company-footer">
        <Link to="/jobs" search={{ q: c.name }}>
          <strong>
            {openings} open {openings === 1 ? "job" : "jobs"}
          </strong>
          <ArrowUpRight size={13} />
        </Link>
        {featured ? (
          <span className="directory-featured">
            <Sparkles size={11} />
            Featured
          </span>
        ) : c.status === "Verified" ? (
          <span className="directory-verified">
            <ShieldCheck size={12} />
            Verified · Demo
          </span>
        ) : (
          <span className="directory-reviewing">Under review</span>
        )}
      </div>
    </article>
  );
}
