import { useJobSearch } from "@/lib/navigation";
import { useNavigate } from "@/lib/navigation";
import { useState, useEffect } from "react";
import { MapPin, Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard, Layout, useDemo } from "@/components/hotelhire/platform";
import { cities, departments } from "@/lib/demo-data";
import { SponsoredBanner } from "@/components/hotelhire/public-pages";
export default function Jobs() {
  const s = useJobSearch(),
    navigate = useNavigate(),
    d = useDemo();
  const [q, setQ] = useState(s.q ?? ""),
    [city, setCity] = useState(s.city ?? ""),
    [dept, setDept] = useState(s.department ?? ""),
    [exp, setExp] = useState(s.experience ?? ""),
    [salary, setSalary] = useState(""),
    [shift, setShift] = useState(""),
    [type, setType] = useState(""),
    [days, setDays] = useState(""),
    [benefits, setBenefits] = useState<string[]>([]),
    [onlySaved, setOnlySaved] = useState(false),
    [sort, setSort] = useState("recent"),
    [page, setPage] = useState(1),
    [filters, setFilters] = useState(false),
    [list, setList] = useState(false);
  useEffect(() => {
    setQ(s.q ?? "");
    setCity(s.city ?? "");
    setDept(s.department ?? "");
    setExp(s.experience ?? "");
    setPage(1);
  }, [s.q, s.city, s.department, s.experience]);
  const result = d.jobs
    .filter(
      (j) =>
        j.status === "Published" &&
        (!s.q ||
          `${j.title} ${j.company} ${j.skills.join(" ")}`
            .toLowerCase()
            .includes(s.q.toLowerCase())) &&
        (!s.city || j.city === s.city) &&
        (!dept || j.department === dept) &&
        (!exp || (Number(exp) >= j.minExperience && Number(exp) <= j.maxExperience)) &&
        (!salary || j.salaryMax >= Number(salary)) &&
        (!shift || j.shift === shift) &&
        (!type || j.type === type) &&
        (!days || j.postedDays <= Number(days)) &&
        benefits.every((b) => j.benefits.includes(b)) &&
        (!onlySaved || d.saved.includes(j.id)),
    )
    .sort((a, b) =>
      sort === "salary"
        ? b.salaryMax - a.salaryMax
        : sort === "title"
          ? a.title.localeCompare(b.title)
          : a.postedDays - b.postedDays,
    );
  const pages = Math.max(1, Math.ceil(result.length / 8)),
    current = Math.min(page, pages);
  function clear() {
    setQ("");
    setCity("");
    setDept("");
    setExp("");
    setSalary("");
    setShift("");
    setType("");
    setDays("");
    setBenefits([]);
    setOnlySaved(false);
    setPage(1);
    navigate({ to: "/jobs", search: {} });
  }
  return (
    <Layout>
      <div className="page-intro">
        <div className="container">
          <span className="eyebrow">FIND YOUR NEXT CHAPTER</span>
          <h1>Hospitality opportunities, made for you.</h1>
          <p>Explore roles with exceptional employers across India.</p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              navigate({ to: "/jobs", search: { q, city, department: dept, experience: exp } });
            }}
          >
            <label className="search-field">
              <Search />
              <input
                aria-label="Search jobs"
                placeholder="Job title, skill or company"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <label className="search-field">
              <MapPin />
              <select
                aria-label="Job location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">All locations</option>
                {d.locations.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <Button type="submit">Search jobs</Button>
          </form>
        </div>
      </div>
      <div className="container browse-layout">
        <Button variant="outline" className="filter-toggle" onClick={() => setFilters(!filters)}>
          <SlidersHorizontal size={15} />
          Filters
        </Button>
        {filters && (
          <button
            className="filter-scrim"
            aria-label="Close filters"
            onClick={() => setFilters(false)}
          />
        )}
        <aside className={`filter-sidebar advanced-filters ${filters ? "filters-open" : ""}`}>
          <h3>
            Refine your search
            <Button variant="link" onClick={clear}>
              Clear all
            </Button>
          </h3>
          <Button className="filter-done" onClick={() => setFilters(false)}>
            Show {result.length} jobs
          </Button>
          {[
            { label: "Department", value: dept, set: setDept, options: d.categories },
            {
              label: "Employment type",
              value: type,
              set: setType,
              options: ["Full-time", "Part-time", "Contract", "Seasonal"],
            },
            {
              label: "Shift",
              value: shift,
              set: setShift,
              options: ["Day", "Night", "Rotational"],
            },
          ].map((f) => (
            <label className="filter-select" key={f.label}>
              {f.label}
              <select
                value={f.value}
                onChange={(e) => {
                  f.set(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All</option>
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          ))}
          <label className="filter-select">
            Your experience
            <select
              value={exp}
              onChange={(e) => {
                setExp(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Any experience</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Fresher" : `${n} years`}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-select">
            Minimum salary
            <select
              value={salary}
              onChange={(e) => {
                setSalary(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Any salary</option>
              {[15000, 25000, 35000, 45000].map((n) => (
                <option value={n} key={n}>
                  ₹{n.toLocaleString("en-IN")}+ / month
                </option>
              ))}
            </select>
          </label>
          <label className="filter-select">
            Posted within
            <select
              value={days}
              onChange={(e) => {
                setDays(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Any time</option>
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
            </select>
          </label>
          <div className="filter-block">
            <h4>What matters to you</h4>
            {["Accommodation", "Meals provided", "Training provided"].map((b) => (
              <label key={b}>
                <input
                  type="checkbox"
                  checked={benefits.includes(b)}
                  onChange={() => {
                    setBenefits((old) =>
                      old.includes(b) ? old.filter((x) => x !== b) : [...old, b],
                    );
                    setPage(1);
                  }}
                />
                {b}
              </label>
            ))}
            <label>
              <input
                type="checkbox"
                checked={onlySaved}
                onChange={(e) => setOnlySaved(e.target.checked)}
              />
              Saved jobs ({d.saved.length})
            </label>
          </div>
        </aside>
        <section className="min-w-0">
          <div className="result-toolbar">
            <span>
              <strong>{result.length}</strong> opportunities found
            </span>
            <div className="table-actions">
              <select aria-label="Sort jobs" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="recent">Most recent</option>
                <option value="salary">Highest salary</option>
                <option value="title">Job title</option>
              </select>
              <Button
                variant="outline"
                size="icon"
                aria-label={list ? "Show grid" : "Show list"}
                onClick={() => setList(!list)}
              >
                {list ? <LayoutGrid size={16} /> : <List size={16} />}
              </Button>
            </div>
          </div>
          <SponsoredBanner placement="Search results" />
          <div className={`jobs-grid browse-jobs ${list ? "jobs-list" : ""}`}>
            {result.slice((current - 1) * 8, current * 8).map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
            {!result.length && (
              <div className="empty-state">
                <Search />
                <h3>No matching opportunities</h3>
                <p>Try another role, location or fewer filters.</p>
                <Button variant="outline" onClick={clear}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
          <div className="grid-pagination">
            <span>
              Page {current} of {pages}
            </span>
            <div>
              <Button
                variant="outline"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
