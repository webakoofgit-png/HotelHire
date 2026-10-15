import { useState, type ReactNode } from "react";
import { ContentSettings, TaxonomyManager } from "./content-settings";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  CalendarDays,
  MessageSquare,
  Building2,
  CreditCard,
  Megaphone,
  BarChart3,
  Bell,
  Settings,
  LifeBuoy,
  Bookmark,
  FileText,
  ShieldCheck,
  ArrowUpRight,
  Check,
  Plus,
  Search,
  LogOut,
  ChevronRight,
  MapPin,
  Menu,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, JobCard, CompanyMark } from "./platform";
import { useDemo, uid, type Role } from "@/lib/demo-store";
import {
  cities,
  departments,
  stages,
  payments,
  matchScore,
  type Job,
  type Campaign,
} from "@/lib/demo-data";
import {
  Panel,
  Metric,
  Status,
  Empty,
  Modal,
  Form,
  DataGrid,
  AddButton,
  exportCsv,
  type Field,
} from "./workspace-ui";
import { toast } from "sonner";
type NavItem = { id: string; label: string; icon: typeof Users };
const shared: NavItem[] = [
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "support", label: "Help & support", icon: LifeBuoy },
];
const menus: Record<Role, NavItem[]> = {
  Candidate: [
    { id: "overview", label: "My dashboard", icon: LayoutDashboard },
    { id: "profile", label: "My profile & resume", icon: FileText },
    { id: "applications", label: "My applications", icon: BriefcaseBusiness },
    { id: "saved-jobs", label: "Saved jobs", icon: Bookmark },
    { id: "recommendations", label: "Recommended jobs", icon: Search },
    { id: "alerts", label: "Job alerts", icon: Bell },
    { id: "interviews", label: "My interviews", icon: CalendarDays },
    ...shared,
  ],
  Employer: [
    { id: "overview", label: "Hiring overview", icon: LayoutDashboard },
    { id: "company-profile", label: "Company profile", icon: Building2 },
    { id: "branches", label: "Properties & branches", icon: MapPin },
    { id: "jobs", label: "Job postings", icon: BriefcaseBusiness },
    { id: "applications", label: "All applicants", icon: Users },
    { id: "candidates", label: "Candidate database", icon: Search },
    { id: "saved-candidates", label: "Saved candidates", icon: Bookmark },
    { id: "pipeline", label: "Hiring pipeline", icon: LayoutDashboard },
    { id: "interviews", label: "Interview calendar", icon: CalendarDays },
    { id: "team", label: "Recruitment team", icon: Users },
    { id: "subscription", label: "Subscription & credits", icon: CreditCard },
    { id: "billing", label: "Billing & invoices", icon: FileText },
    { id: "promotions", label: "Job promotions", icon: Megaphone },
    { id: "analytics", label: "Hiring analytics", icon: BarChart3 },
    ...shared,
  ],
  Recruiter: [],
  Admin: [
    { id: "overview", label: "Platform overview", icon: LayoutDashboard },
    { id: "employers", label: "Employers & verification", icon: Building2 },
    { id: "candidates", label: "Candidate management", icon: Users },
    { id: "team", label: "Recruiters & admins", icon: ShieldCheck },
    { id: "jobs", label: "Jobs & moderation", icon: BriefcaseBusiness },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "interviews", label: "Interviews", icon: CalendarDays },
    { id: "categories", label: "Categories & locations", icon: MapPin },
    { id: "plans", label: "Plans & subscriptions", icon: CreditCard },
    { id: "billing", label: "Payments & invoices", icon: FileText },
    { id: "advertisements", label: "Advertisement manager", icon: Megaphone },
    { id: "placements", label: "Ad placements", icon: LayoutDashboard },
    { id: "promotions", label: "Featured placements", icon: Bookmark },
    { id: "content", label: "Content & blogs", icon: FileText },
    { id: "enquiries", label: "Enquiries & support", icon: LifeBuoy },
    { id: "analytics", label: "Reports & analytics", icon: BarChart3 },
    { id: "audit", label: "Activity & audit log", icon: ShieldCheck },
    ...shared.filter((x) => x.id !== "support"),
  ],
};
menus.Recruiter = menus.Employer.filter(
  (n) => !["billing", "subscription", "team", "company-profile", "branches"].includes(n.id),
);
export function Dashboard({ role: forcedRole, view = "overview" }: { role?: Role; view?: string }) {
  const d = useDemo(),
    navigate = useNavigate();
  const role = forcedRole ?? d.role;
  useEffect(() => {
    if (forcedRole && d.role !== forcedRole) d.setRole(forcedRole);
  }, [forcedRole, d.role, d.setRole]);
  const [mobile, setMobile] = useState(false);
  const nav = menus[role],
    active = nav.find((n) => n.id === view) ?? nav[0]!;
  const go = (next: string) => {
    setMobile(false);
    navigate({ to: "/workspace", search: { role, view: next } });
  };
  return (
    <div className="desk-layout">
      <aside className={`desk-sidebar ${mobile ? "desk-sidebar-open" : ""}`}>
        <div className="desk-brand">
          <Brand />
          <Button
            className="desk-close"
            size="icon"
            variant="ghost"
            aria-label="Close sidebar"
            onClick={() => setMobile(false)}
          >
            ×
          </Button>
        </div>
        <div className="workspace-identity">
          <span className="avatar">
            {role === "Admin" ? "HP" : role === "Candidate" ? "AD" : "GO"}
          </span>
          <div>
            <strong>
              {role === "Admin"
                ? "HotelHire platform"
                : role === "Candidate"
                  ? d.profile.name
                  : "Grand Orchid Group"}
            </strong>
            <small>
              {role === "Admin"
                ? "Platform administration"
                : role === "Candidate"
                  ? "Your career workspace"
                  : "Hospitality recruitment"}
            </small>
          </div>
        </div>
        <span className="nav-caption">{role} workspace</span>
        <nav aria-label={`${role} workspace`}>
          {nav.map((n) => (
            <button
              key={n.id}
              className={active.id === n.id ? "selected" : ""}
              onClick={() => go(n.id)}
            >
              <n.icon size={17} />
              <span>{n.label}</span>
              {n.id === "notifications" && <i>{d.notices.filter((x) => !x.read).length}</i>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span>Good people. Great hospitality.</span>
            <p>Everything your team needs to grow.</p>
            <button
              onClick={() =>
                go(
                  role === "Candidate"
                    ? "recommendations"
                    : role === "Admin"
                      ? "analytics"
                      : "subscription",
                )
              }
            >
              Explore your workspace <ArrowUpRight size={13} />
            </button>
          </div>
          <Link to="/">
            <LogOut size={15} />
            Back to website
          </Link>
        </div>
      </aside>
      {mobile && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="desk-main">
        <header className="desk-topbar">
          <div>
            <Button
              size="icon"
              variant="ghost"
              className="desk-menu"
              aria-label="Open workspace navigation"
              onClick={() => setMobile(true)}
            >
              <Menu />
            </Button>
            <span className="breadcrumb">
              Workspace <ChevronRight size={13} /> {active.label}
            </span>
          </div>
          <div className="topbar-actions">
            <span className="demo-chip">DEMO MODE</span>
            <button
              aria-label="View notifications"
              className="notification-bell"
              onClick={() => go("notifications")}
            >
              <Bell size={18} />
              <i />
            </button>
            <span className="avatar avatar-small">{role.slice(0, 1)}</span>
          </div>
        </header>
        <main className={`desk-content ${role === "Candidate" ? "candidate-content" : ""}`}>
          <div className="desk-rolebar">
            <span>Explore as</span>
            {(["Candidate", "Employer", "Recruiter", "Admin"] as Role[]).map((r) => (
              <button
                className={role === r ? "active" : ""}
                key={r}
                onClick={() => {
                  d.setRole(r);
                  navigate({ to: "/workspace", search: { role: r, view: "overview" } });
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="desk-heading">
            <div>
              <span className="eyebrow">
                {role === "Candidate"
                  ? "YOUR NEXT CHAPTER"
                  : role === "Admin"
                    ? "THE BIG PICTURE"
                    : "PEOPLE MAKE THE DIFFERENCE"}
              </span>
              <h1>
                {active.id === "overview"
                  ? role === "Candidate"
                    ? `Good morning, ${d.profile.name.split(" ")[0]}.`
                    : role === "Admin"
                      ? "Your platform, at a glance."
                      : "Let’s build an exceptional team."
                  : active.label}
              </h1>
              <p>
                {role === "Candidate"
                  ? "Your opportunities, applications and next steps — together."
                  : role === "Admin"
                    ? "A clear view of the people, opportunities and growth across HotelHire."
                    : "Thoughtful hiring. Stronger teams. Memorable guest experiences."}
              </p>
            </div>
            {["Employer", "Recruiter"].includes(role) && (
              <Button onClick={() => go("jobs")}>
                <Plus size={16} />
                Post a job
              </Button>
            )}
          </div>
          <div className="desk-demo-note">
            <ShieldCheck size={15} />
            <span>
              Interactive demo · Fictional records · Changes survive navigation, reset on refresh ·
              No real login, messages or payments
            </span>
          </div>
          <WorkspaceSection key={`${role}-${active.id}`} role={role} view={active.id} go={go} />
          <div className="desk-copyright">
            HotelHire Pro <span>Made for the people behind hospitality.</span>
          </div>
        </main>
      </div>
      {role === "Candidate" && (
        <nav className="candidate-mobile-nav" aria-label="Candidate shortcuts">
          {[
            { id: "overview", label: "Home", icon: LayoutDashboard },
            { id: "applications", label: "Applications", icon: BriefcaseBusiness },
            { id: "saved-jobs", label: "Saved", icon: Bookmark },
            { id: "profile", label: "Profile", icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              className={active.id === item.id ? "active" : ""}
              onClick={() => go(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
function WorkspaceSection({
  role,
  view,
  go,
}: {
  role: Role;
  view: string;
  go: (v: string) => void;
}) {
  const d = useDemo();
  const candidate = role === "Candidate",
    admin = role === "Admin";
  if (view === "overview") return <Overview role={role} go={go} />;
  if (view === "profile") return <ProfileEditor />;
  if (view === "jobs") return <JobsManager admin={admin} />;
  if (view === "applications" || view === "pipeline")
    return <Applications candidate={candidate} pipeline={view === "pipeline"} />;
  if (view === "candidates" || view === "saved-candidates")
    return <Candidates savedOnly={view === "saved-candidates"} admin={admin} />;
  if (view === "interviews") return <Interviews candidate={candidate} />;
  if (view === "company-profile") return <CompanyEditor />;
  if (view === "branches" || view === "team")
    return <TeamBranches branch={view === "branches"} admin={admin} />;
  if (view === "subscription" || view === "plans") return <Subscriptions admin={admin} />;
  if (view === "billing") return <Billing admin={admin} />;
  if (view === "advertisements" || view === "placements" || view === "promotions")
    return (
      <Advertisements
        placement={view === "placements"}
        promotion={view === "promotions"}
        admin={admin}
      />
    );
  if (view === "analytics") return <Analytics admin={admin} />;
  if (view === "employers") return <Employers />;
  if (view === "content") return <ContentManager />;
  if (view === "categories") return <TaxonomyManager />;
  if (view === "messages") return <Messages />;
  if (view === "notifications")
    return (
      <Panel
        title="You’re in the loop"
        subtitle="Hiring updates and important activity"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => d.setNotices((n) => n.map((x) => ({ ...x, read: true })))}
          >
            Mark all read
          </Button>
        }
      >
        {d.notices.map((n) => (
          <button
            className={`notification-row ${n.read ? "" : "unread"}`}
            key={n.id}
            onClick={() =>
              d.setNotices((old) => old.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
            }
          >
            <span className="round-icon">
              <Bell size={17} />
            </span>
            <span>
              <strong>{n.text}</strong>
              <small>{n.read ? "Read" : "Unread"} · Demo session</small>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </Panel>
    );
  if (view === "audit")
    return (
      <Panel title="Activity history" subtitle="Actions performed during this demo session">
        <DataGrid
          rows={d.audit}
          title="events"
          searchText={(x) => x.text}
          exportRows={d.audit}
          columns={[
            { label: "Activity", render: (x) => x.text },
            { label: "Time · IST", render: (x) => x.time },
          ]}
        />
      </Panel>
    );
  if (view === "settings") return <SettingsPanel candidate={candidate} />;
  if (view === "support" || view === "enquiries") return <Support admin={admin} />;
  if (view === "alerts") return <JobAlerts />;
  if (view === "saved-jobs" || view === "recommendations") {
    const p = { ...d.profile, skills: d.profile.skills.split(",").map((s) => s.trim()) };
    const list = d.jobs
      .filter((j) => j.status === "Published" && (view !== "saved-jobs" || d.saved.includes(j.id)))
      .sort((a, b) => matchScore(p, b).score - matchScore(p, a).score);
    return (
      <Panel
        title={view === "saved-jobs" ? "The opportunities you love" : "Made for your next move"}
        subtitle={
          view === "saved-jobs"
            ? `${list.length} saved opportunities`
            : "Transparent demo matching based on your profile, location, experience, salary and shift."
        }
      >
        {list.length ? (
          <div className="jobs-grid browse-jobs">
            {list.slice(0, 12).map((j) => (
              <div key={j.id}>
                {view === "recommendations" && (
                  <details className="match-explanation">
                    <summary>{matchScore(p, j).score}% match · Why this job?</summary>
                    {matchScore(p, j).factors.map((f) => (
                      <p key={f.label}>
                        {f.label}: {f.score}/{f.max}
                      </p>
                    ))}
                  </details>
                )}
                <JobCard job={j} />
              </div>
            ))}
          </div>
        ) : (
          <Empty
            title="Your next opportunity is waiting"
            text="Browse jobs and tap the bookmark to save them here."
            action={
              <Button asChild>
                <Link to="/jobs">Explore jobs</Link>
              </Button>
            }
          />
        )}
      </Panel>
    );
  }
  return null;
}
function Overview({ role, go }: { role: Role; go: (v: string) => void }) {
  const d = useDemo(),
    candidate = role === "Candidate",
    admin = role === "Admin";
  const mine = d.applications.filter((a) => a.candidateId === "me");
  const rows = candidate ? mine : d.applications;
  return (
    <>
      <div className="stats-grid">
        {candidate ? (
          <>
            <Metric label="Your applications" value={mine.length} />
            <Metric label="Saved opportunities" value={d.saved.length} />
            <Metric
              label="Interview invitations"
              value={d.interviews.filter((i) => mine.some((a) => a.id === i.applicationId)).length}
            />
            <Metric label="Profile completeness" value={`${profileCompletion(d.profile)}%`} />
          </>
        ) : admin ? (
          <>
            <Metric label="Registered employers" value={d.companies.length} />
            <Metric label="Candidate profiles" value={d.candidates.length} />
            <Metric
              label="Published jobs"
              value={d.jobs.filter((j) => j.status === "Published").length}
            />
            <Metric
              label="Demo revenue"
              value={`₹${payments
                .filter((p) => p.status === "Successful")
                .reduce((s, p) => s + p.amount, 0)
                .toLocaleString("en-IN")}`}
              hint="Illustrative successful payments"
            />
          </>
        ) : (
          <>
            <Metric
              label="Published opportunities"
              value={d.jobs.filter((j) => j.status === "Published").length}
            />
            <Metric label="Applications received" value={d.applications.length} />
            <Metric
              label="Shortlisted talent"
              value={d.applications.filter((a) => a.stage === "Shortlisted").length}
            />
            <Metric
              label="Upcoming interviews"
              value={d.interviews.filter((i) => i.status === "Scheduled").length}
            />
          </>
        )}
      </div>
      <div className="dashboard-columns">
        <div>
          <Panel
            title={
              candidate
                ? "Your career, moving forward"
                : admin
                  ? "Hiring activity across the platform"
                  : "Your hiring momentum"
            }
            subtitle="A clear view of every step"
            action={
              <button
                className="text-link"
                onClick={() => go(candidate ? "applications" : "analytics")}
              >
                View details <ArrowUpRight size={14} />
              </button>
            }
          >
            {candidate ? (
              <div className="career-card">
                <span className="round-icon">
                  <FileText />
                </span>
                <h3>A complete profile opens more doors.</h3>
                <p>
                  Add your experience, skills and resume so the right hospitality teams can find
                  you.
                </p>
                <div className="progress">
                  <span style={{ width: `${profileCompletion(d.profile)}%` }} />
                </div>
                <Button variant="outline" onClick={() => go("profile")}>
                  Complete my profile <ArrowUpRight size={14} />
                </Button>
              </div>
            ) : (
              <div className="chart-bars" aria-label="Applications by hiring stage">
                {stages.slice(0, 7).map((s, i) => {
                  const count = d.applications.filter((a) => a.stage === s).length;
                  return (
                    <div key={s}>
                      <strong>{count}</strong>
                      <div
                        style={{
                          height: `${Math.max(12, (count / Math.max(d.applications.length, 1)) * 600)}px`,
                          background: i === 2 ? "var(--primary)" : undefined,
                        }}
                      />
                      <span>{s}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
          <Panel
            title={candidate ? "Recent applications" : "Recent applicants"}
            subtitle="The latest people and possibilities"
            action={
              <button className="text-link" onClick={() => go("applications")}>
                View all <ArrowUpRight size={14} />
              </button>
            }
          >
            {rows.length ? (
              rows.slice(0, 5).map((a) => (
                <div className="activity-row" key={a.id}>
                  <span className="avatar">
                    {a.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>
                      {candidate ? d.jobs.find((j) => j.id === a.jobId)?.title : a.name}
                    </strong>
                    <small>
                      {d.jobs.find((j) => j.id === a.jobId)?.company} · {a.date}
                    </small>
                  </div>
                  <Status>{a.stage}</Status>
                </div>
              ))
            ) : (
              <Empty
                title="Your story starts with one application"
                text="Find a role you love, apply, and track its progress here."
                action={
                  <Button asChild>
                    <Link to="/jobs">Find my next role</Link>
                  </Button>
                }
              />
            )}
          </Panel>
        </div>
        <div>
          <div className="workspace-promo">
            <span className="eyebrow">
              {candidate ? "READY FOR WHAT’S NEXT?" : "MAKE ROOM FOR GREAT PEOPLE"}
            </span>
            <h2>{candidate ? "A role that feels like you." : "Your next great hire is here."}</h2>
            <p>
              {candidate
                ? "Discover opportunities with hospitality teams who value your skills."
                : "Connect with passionate hospitality professionals and build your strongest team."}
            </p>
            <Button
              variant="secondary"
              onClick={() => go(candidate ? "recommendations" : admin ? "employers" : "candidates")}
            >
              {candidate ? "Explore matches" : "Discover talent"}
              <ArrowUpRight size={15} />
            </Button>
            <Building2 size={80} className="promo-building" />
          </div>
          <Panel title={candidate ? "Your next steps" : "On your radar"}>
            {(candidate
              ? [
                  ["Finish your professional profile", "profile"],
                  ["Set up a personalised job alert", "alerts"],
                  ["Save your favourite opportunities", "saved-jobs"],
                ]
              : admin
                ? [
                    [
                      `${d.companies.filter((c) => c.status === "Pending review").length} employer verifications`,
                      "employers",
                    ],
                    ["Review advertisement campaigns", "advertisements"],
                    ["Manage plans & subscriptions", "plans"],
                  ]
                : [
                    ["Review your newest applicants", "applications"],
                    ["Prepare for upcoming interviews", "interviews"],
                    ["Check your subscription credits", "subscription"],
                  ]
            ).map(([label, to]) => (
              <button key={label} className="next-step" onClick={() => go(to!)}>
                <Check size={15} />
                {label}
                <ChevronRight size={14} />
              </button>
            ))}
          </Panel>
          <Panel title="A note from HotelHire">
            <p className="muted-copy">
              Great hospitality begins with people who care. Thank you for building a better place
              to work.
            </p>
            <span className="editorial-signature">The HotelHire team</span>
          </Panel>
        </div>
      </div>
    </>
  );
}
function Applications({ candidate, pipeline }: { candidate: boolean; pipeline: boolean }) {
  const d = useDemo();
  const [note, setNote] = useState<string | null>(null),
    [confirm, setConfirm] = useState<{ id: string; stage: string } | null>(null);
  const [filter, setFilter] = useState("All stages");
  const list = d.applications.filter(
    (a) =>
      (!candidate || a.candidateId === "me") && (filter === "All stages" || a.stage === filter),
  );
  const change = (id: string, stage: string) => setConfirm({ id, stage });
  return (
    <>
      <Panel
        title={
          pipeline
            ? "From first hello to a great hire"
            : candidate
              ? "Every application, one clear view"
              : "Your applicant response centre"
        }
        subtitle={
          candidate
            ? "Track progress and withdraw a demo application at any time."
            : "Review applicants, add notes and move people through the hiring journey."
        }
        action={
          <select
            className="form-input"
            aria-label="Filter application status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {["All stages", ...stages].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        }
      >
        {pipeline ? (
          <div className="kanban">
            {stages.slice(0, 7).map((stage) => (
              <section
                key={stage}
                className="kanban-column"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain");
                  if (d.applications.some((a) => a.id === id)) change(id, stage);
                }}
              >
                <h3>
                  <span className="stage-dot" />
                  {stage}
                  <i>{list.filter((a) => a.stage === stage).length}</i>
                </h3>
                {list
                  .filter((a) => a.stage === stage)
                  .map((a) => (
                    <article
                      className="kanban-card"
                      key={a.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", a.id)}
                    >
                      <span className="avatar">{a.name.slice(0, 2)}</span>
                      <h4>{a.name}</h4>
                      <p>{d.jobs.find((j) => j.id === a.jobId)?.title}</p>
                      <small>{a.date}</small>
                      <select
                        value={a.stage}
                        aria-label={`Move ${a.name}`}
                        onChange={(e) => change(a.id, e.target.value)}
                      >
                        {stages.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </article>
                  ))}
              </section>
            ))}
          </div>
        ) : (
          <DataGrid
            rows={list}
            title="applications"
            searchText={(a) =>
              `${a.name} ${a.stage} ${d.jobs.find((j) => j.id === a.jobId)?.title}`
            }
            exportRows={list}
            columns={[
              {
                label: candidate ? "Opportunity" : "Candidate",
                render: (a) => (
                  <div>
                    <strong>
                      {candidate ? d.jobs.find((j) => j.id === a.jobId)?.title : a.name}
                    </strong>
                    <small className="cell-small">
                      {d.jobs.find((j) => j.id === a.jobId)?.company}
                    </small>
                  </div>
                ),
              },
              { label: "Applied", render: (a) => a.date },
              {
                label: "Progress",
                render: (a) => (
                  <div>
                    <Status>{a.stage}</Status>
                    <small className="cell-small">
                      {a.stage === "Interview"
                        ? "Check your interview calendar"
                        : a.stage === "Applied"
                          ? "Awaiting recruiter review"
                          : a.stage === "Hired"
                            ? "Welcome to your next chapter"
                            : `Current step: ${a.stage}`}
                    </small>
                  </div>
                ),
              },
              {
                label: "Actions",
                render: (a) =>
                  candidate ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={["Withdrawn", "Hired", "Rejected"].includes(a.stage)}
                      onClick={() => change(a.id, "Withdrawn")}
                    >
                      Withdraw
                    </Button>
                  ) : (
                    <div className="table-actions">
                      <select
                        className="compact-select"
                        aria-label={`Status for ${a.name}`}
                        value={a.stage}
                        onChange={(e) => change(a.id, e.target.value)}
                      >
                        {stages.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <Button size="sm" variant="ghost" onClick={() => setNote(a.id)}>
                        Notes
                      </Button>
                    </div>
                  ),
              },
            ]}
          />
        )}
      </Panel>
      <Modal open={!!confirm} title="Confirm status change" onClose={() => setConfirm(null)}>
        <p className="muted-copy">
          Move this application to <strong>{confirm?.stage}</strong>? This updates both candidate
          tracking and recruiter views.
        </p>
        <Button
          onClick={() => {
            d.move(confirm!.id, confirm!.stage);
            setConfirm(null);
            toast.success("Application status updated");
          }}
        >
          Confirm change
        </Button>
      </Modal>
      <Modal open={!!note} title="Recruitment notes" onClose={() => setNote(null)}>
        <Form
          fields={[
            {
              name: "note",
              label: "Private hiring notes",
              type: "textarea",
              value: d.applications.find((a) => a.id === note)?.note ?? "",
              required: false,
            },
          ]}
          onSave={(v) => {
            d.setApplications((old) =>
              old.map((a) => (a.id === note ? { ...a, note: v["note"] ?? "" } : a)),
            );
            d.log("Applicant note updated");
            setNote(null);
          }}
        />
      </Modal>
    </>
  );
}
function Candidates({ savedOnly, admin }: { savedOnly: boolean; admin: boolean }) {
  const d = useDemo();
  const [city, setCity] = useState(""),
    [exp, setExp] = useState(""),
    [active, setActive] = useState<string | null>(null);
  const list = d.candidates.filter(
    (c) =>
      (!savedOnly || c.saved) &&
      (!city || c.city === city) &&
      (!exp || c.experience >= Number(exp)),
  );
  const person = d.candidates.find((c) => c.id === active);
  return (
    <>
      <Panel
        title={
          savedOnly
            ? "Your talent shortlist"
            : admin
              ? "Hospitality professionals"
              : "Discover your next great teammate"
        }
        subtitle="Fictional candidate profiles · Contact information is masked in demo mode"
      >
        <div className="grid-toolbar">
          <select
            className="form-input"
            aria-label="Candidate city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            className="form-input"
            aria-label="Candidate experience"
            value={exp}
            onChange={(e) => setExp(e.target.value)}
          >
            <option value="">Any experience</option>
            <option value="2">2+ years</option>
            <option value="5">5+ years</option>
          </select>
        </div>
        <DataGrid
          rows={list}
          title="candidates"
          searchText={(c) => `${c.name} ${c.role} ${c.skills.join(" ")} ${c.availability}`}
          columns={[
            {
              label: "Professional",
              render: (c) => (
                <div className="table-person">
                  <span className="avatar">
                    {c.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <span>
                    <strong>{c.name}</strong>
                    <small>{c.role}</small>
                  </span>
                </div>
              ),
            },
            { label: "Location / experience", render: (c) => `${c.city} · ${c.experience} years` },
            { label: "Expected salary", render: (c) => `₹${c.salary.toLocaleString("en-IN")}` },
            { label: "Availability", render: (c) => <Status>{c.availability}</Status> },
            {
              label: "Actions",
              render: (c) => (
                <div className="table-actions">
                  <Button variant="outline" size="sm" onClick={() => setActive(c.id)}>
                    View profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      d.setCandidates((old) =>
                        old.map((x) => (x.id === c.id ? { ...x, saved: !x.saved } : x)),
                      )
                    }
                  >
                    {c.saved ? "Saved ✓" : "Save"}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Panel>
      <Modal open={!!person} title={person?.name ?? "Candidate"} onClose={() => setActive(null)}>
        {person && (
          <>
            <p className="muted-copy">
              {person.role} · {person.city} · {person.experience} years experience
            </p>
            <div className="tag-row">
              {person.skills.map((s) => (
                <Status key={s}>{s}</Status>
              ))}
            </div>
            <p className="muted-copy">
              Expected salary: ₹{person.salary.toLocaleString("en-IN")} / month
              <br />
              Available: {person.availability} · {person.shift} shift
            </p>
            <div className="privacy-card">
              <ShieldCheck size={20} />
              <div>
                <strong>Candidate privacy comes first</strong>
                <p>
                  Contact details and resume downloads require authorised access in the production
                  platform.
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                d.setCandidates((old) =>
                  old.map((x) => (x.id === person.id ? { ...x, saved: true } : x)),
                );
                toast.success("Candidate saved to your shortlist");
              }}
            >
              Save candidate
            </Button>
          </>
        )}
      </Modal>
    </>
  );
}
function Interviews({ candidate }: { candidate: boolean }) {
  const d = useDemo();
  const [open, setOpen] = useState(false),
    [edit, setEdit] = useState<string | null>(null);
  const mine = d.applications.filter((a) => a.candidateId === "me").map((a) => a.id);
  const list = d.interviews.filter((i) => !candidate || mine.includes(i.applicationId));
  return (
    <>
      <div className="stats-grid">
        <Metric
          label="Scheduled interviews"
          value={list.filter((i) => i.status === "Scheduled").length}
        />
        <Metric
          label="Completed conversations"
          value={list.filter((i) => i.status === "Completed").length}
        />
        <Metric
          label="Reschedule requests"
          value={list.filter((i) => i.status === "Reschedule requested").length}
        />
        <Metric label="Interview formats" value="3" hint="In person · Phone · Video" />
      </div>
      <Panel
        title="Meaningful conversations start here"
        subtitle="Dates and times shown in India Standard Time"
        action={
          !candidate && <AddButton onClick={() => setOpen(true)}>Schedule interview</AddButton>
        }
      >
        {list.length ? (
          <div className="interview-grid">
            {list.map((i) => (
              <article className="interview-card" key={i.id}>
                <div className="interview-top">
                  <span className="calendar-date">
                    <strong>{i.date.split("-")[2]}</strong>
                    <small>OCT 2026</small>
                  </span>
                  <Status>{i.status}</Status>
                </div>
                <h3>{i.name}</h3>
                <p>{i.role}</p>
                <div className="interview-detail">
                  <CalendarDays size={15} />
                  {i.date} · {i.time} IST
                </div>
                <div className="interview-detail">
                  <MapPin size={15} />
                  {i.mode} · {i.venue}
                </div>
                {i.feedback && <p className="feedback-note">Feedback: {i.feedback}</p>}
                <div className="table-actions">
                  {candidate ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        d.setInterviews((old) =>
                          old.map((x) =>
                            x.id === i.id ? { ...x, status: "Reschedule requested" } : x,
                          ),
                        );
                        d.log("Candidate requested an interview reschedule");
                      }}
                    >
                      Request reschedule
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setEdit(i.id)}>
                        Update / feedback
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          d.setInterviews((old) =>
                            old.map((x) => (x.id === i.id ? { ...x, status: "Cancelled" } : x)),
                          );
                          d.log(`Interview cancelled for ${i.name}`);
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty
            title="Your next conversation is ahead"
            text="Interview invitations will appear when a recruiter schedules one for your application."
          />
        )}
      </Panel>
      <Modal open={open} title="Schedule an interview" onClose={() => setOpen(false)}>
        <Form
          fields={[
            {
              name: "application",
              label: "Applicant",
              options: d.applications.map((a) => `${a.id} · ${a.name}`),
            },
            { name: "date", label: "Interview date", type: "date" },
            { name: "time", label: "Time · IST", type: "time", value: "10:00" },
            { name: "mode", label: "Interview format", options: ["In person", "Phone", "Video"] },
            { name: "venue", label: "Venue / meeting instructions" },
          ]}
          submit="Schedule interview"
          onSave={(v) => {
            const a = d.applications.find((x) => x.id === v["application"]?.split(" · ")[0]);
            if (!a) return;
            d.setInterviews((old) => [
              {
                id: uid(),
                applicationId: a.id,
                name: a.name,
                role: d.jobs.find((j) => j.id === a.jobId)?.title ?? "Hospitality role",
                date: v["date"]!,
                time: v["time"]!,
                mode: v["mode"]!,
                venue: v["venue"]!,
                status: "Scheduled",
                feedback: "",
              },
              ...old,
            ]);
            d.move(a.id, "Interview");
            setOpen(false);
            toast.success("Demo interview scheduled");
          }}
        />
      </Modal>
      <Modal open={!!edit} title="Interview details & feedback" onClose={() => setEdit(null)}>
        <Form
          fields={[
            {
              name: "date",
              label: "Date",
              type: "date",
              value: d.interviews.find((i) => i.id === edit)?.date ?? "",
            },
            {
              name: "time",
              label: "Time · IST",
              type: "time",
              value: d.interviews.find((i) => i.id === edit)?.time ?? "",
            },
            {
              name: "status",
              label: "Status",
              options: ["Scheduled", "Completed", "Cancelled", "Reschedule requested"],
            },
            {
              name: "feedback",
              label: "Recruiter feedback",
              type: "textarea",
              required: false,
              value: d.interviews.find((i) => i.id === edit)?.feedback ?? "",
            },
          ]}
          onSave={(v) => {
            d.setInterviews((old) =>
              old.map((i) =>
                i.id === edit
                  ? {
                      ...i,
                      date: v["date"]!,
                      time: v["time"]!,
                      status: v["status"]!,
                      feedback: v["feedback"] ?? "",
                    }
                  : i,
              ),
            );
            d.log("Interview updated");
            setEdit(null);
          }}
        />
      </Modal>
    </>
  );
}
function CompanyEditor() {
  const d = useDemo(),
    c = d.companies[0]!;
  return (
    <Panel
      title="A place people want to work"
      subtitle="Tell candidates what makes your hospitality team special"
    >
      <div className="company-cover">
        <Building2 size={60} />
        <div>
          <h2>{c.name}</h2>
          <p>
            {c.city} · {c.type}
          </p>
        </div>
        <Status>{c.status}</Status>
      </div>
      <Form
        fields={[
          { name: "name", label: "Business name", value: c.name },
          {
            name: "type",
            label: "Business category",
            options: ["Hotel", "Resort", "Restaurant", "Café", "Villa", "Catering"],
            value: c.type,
          },
          { name: "city", label: "Head office location", options: cities, value: c.city },
          { name: "about", label: "About your company", type: "textarea", value: c.about },
        ]}
        onSave={(v) => {
          d.setCompanies((old) =>
            old.map((x) =>
              x.id === c.id
                ? { ...x, name: v["name"]!, type: v["type"]!, city: v["city"]!, about: v["about"]! }
                : x,
            ),
          );
          d.setJobs((old) =>
            old.map((j) => (j.companyId === c.id ? { ...j, company: v["name"]! } : j)),
          );
          d.log("Company profile updated");
          toast.success("Company profile saved");
        }}
      />
    </Panel>
  );
}
function TeamBranches({ branch, admin }: { branch: boolean; admin: boolean }) {
  const d = useDemo(),
    [open, setOpen] = useState(false);
  return (
    <>
      <Panel
        title={
          branch
            ? "One group. Exceptional properties."
            : admin
              ? "Your platform team"
              : "The people behind every great hire"
        }
        subtitle={
          branch
            ? "Manage locations and branch-level hiring."
            : "Demo team roles · Production permissions require backend enforcement."
        }
        action={
          <AddButton onClick={() => setOpen(true)}>
            {branch ? "Add property" : "Add team member"}
          </AddButton>
        }
      >
        {branch ? (
          <div className="interview-grid">
            {d.branches.map((b) => (
              <article className="property-card" key={b.id}>
                <span className="round-icon">
                  <Building2 />
                </span>
                <h3>{b.name}</h3>
                <p>{b.address}</p>
                <Status>{b.city}</Status>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    d.setBranches((old) => old.filter((x) => x.id !== b.id));
                    d.log(`Removed branch ${b.name}`);
                  }}
                >
                  Remove property
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <DataGrid
            rows={d.team}
            title="team members"
            searchText={(t) => `${t.name} ${t.role}`}
            columns={[
              {
                label: "Team member",
                render: (t) => (
                  <div>
                    <strong>{t.name}</strong>
                    <small className="cell-small">{t.email}</small>
                  </div>
                ),
              },
              { label: "Role", render: (t) => t.role },
              { label: "Status", render: (t) => <Status>{t.status}</Status> },
              {
                label: "Access",
                render: (t) => (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      d.setTeam((old) =>
                        old.map((x) =>
                          x.id === t.id
                            ? { ...x, status: x.status === "Active" ? "Suspended" : "Active" }
                            : x,
                        ),
                      );
                      d.log(`Updated team access for ${t.name}`);
                    }}
                  >
                    {t.status === "Active" ? "Suspend" : "Activate"}
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Panel>
      {!branch && (
        <Panel title="Role permissions">
          <div className="permission-grid">
            {[
              ["Owner", "Company, branches, jobs, applicants, team and billing"],
              ["Recruiter", "Jobs, candidates, pipeline, interviews and messages"],
              ["Branch Manager", "Property recruitment and branch reporting"],
            ].map(([r, text]) => (
              <div key={r}>
                <ShieldCheck size={20} />
                <h3>{r}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
      <Modal
        open={open}
        title={branch ? "Add a property" : "Add a team member"}
        onClose={() => setOpen(false)}
      >
        <Form
          fields={
            branch
              ? [
                  { name: "name", label: "Property name" },
                  { name: "city", label: "Location", options: d.locations },
                  { name: "address", label: "Address" },
                ]
              : [
                  { name: "name", label: "Full name" },
                  { name: "email", label: "Work email", type: "email" },
                  {
                    name: "role",
                    label: "Role",
                    options: admin
                      ? ["Admin", "Recruiter", "Support"]
                      : ["Recruiter", "Branch Manager", "Owner"],
                  },
                ]
          }
          onSave={(v) => {
            if (branch)
              d.setBranches((old) => [
                ...old,
                { id: uid(), name: v["name"]!, city: v["city"]!, address: v["address"]! },
              ]);
            else
              d.setTeam((old) => [
                ...old,
                {
                  id: uid(),
                  name: v["name"]!,
                  email: v["email"]!,
                  role: v["role"]!,
                  status: "Active",
                },
              ]);
            d.log(
              branch ? "Demo property added" : "Demo team member added; no invitation was sent",
            );
            setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
function Subscriptions({ admin }: { admin: boolean }) {
  const d = useDemo(),
    [edit, setEdit] = useState<string | null>(null),
    [cancel, setCancel] = useState(false);
  const plan = d.plans.find((p) => p.name === d.plan) ?? d.plans[0]!;
  const used = d.jobs.filter(
    (j) => j.companyId === d.companies[0]?.id && j.status === "Published",
  ).length;
  return (
    <>
      {!admin && (
        <Panel
          title="The right tools for your next chapter"
          subtitle="Your subscription at a glance"
        >
          <div className="subscription-summary">
            <div>
              <span className="eyebrow">CURRENT PLAN</span>
              <h2>{plan.name}</h2>
              <p>₹{plan.price} / month · Demo billing cycle</p>
              <Status>{cancel ? "Cancellation requested" : "Active"}</Status>
              <small>Illustrative start: 1 Oct 2026 · Renewal: 1 Nov 2026</small>
            </div>
            <div>
              <strong>
                {used} / {plan.jobCredits} job credits
              </strong>
              <div className="progress">
                <span style={{ width: `${Math.min(100, (used / plan.jobCredits) * 100)}%` }} />
              </div>
              <p>{plan.resumeCredits} resume credits included · Demo usage: 0</p>
              <Button
                variant="outline"
                size="sm"
                disabled={cancel}
                onClick={() => {
                  setCancel(true);
                  d.log("Subscription cancellation requested");
                }}
              >
                Request cancellation
              </Button>
            </div>
          </div>
        </Panel>
      )}
      <div className="plans-grid desk-plans">
        {d.plans.map((p) => (
          <article key={p.name} className={`plan-card ${p.popular ? "popular" : ""}`}>
            {p.popular && <span className="plan-badge">MOST POPULAR</span>}
            <h2>{p.name}</h2>
            <p>{p.description}</p>
            <div className="plan-price">
              {p.price === "Custom" ? "Let’s talk" : `₹${p.price}`}
              <span> / month</span>
            </div>
            <ul>
              {p.features.map((f) => (
                <li key={f}>
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={d.plan === p.name ? "default" : "outline"}
              onClick={() => {
                if (admin) setEdit(p.name);
                else {
                  d.setPlan(p.name);
                  d.log(`Selected demo plan ${p.name}`);
                  toast.success(`${p.name} selected · No payment taken`);
                }
              }}
            >
              {admin ? "Edit plan" : d.plan === p.name ? "Current plan" : "Choose plan"}
            </Button>
          </article>
        ))}
      </div>
      {admin && (
        <Panel title="Subscription overview" subtitle="Illustrative platform accounts">
          <DataGrid
            rows={d.companies}
            title="subscriptions"
            searchText={(c) => c.name}
            columns={[
              { label: "Employer", render: (c) => c.name },
              { label: "Plan", render: (_) => d.plan },
              { label: "Status", render: () => <Status>Active · Demo</Status> },
              { label: "Billing cycle", render: () => "Monthly · 1 Nov renewal" },
            ]}
          />
        </Panel>
      )}
      <Modal open={!!edit} title={`Edit ${edit ?? ""} plan`} onClose={() => setEdit(null)}>
        <Form
          fields={[
            {
              name: "price",
              label: "Monthly price (₹ or Custom)",
              value: d.plans.find((p) => p.name === edit)?.price ?? "",
            },
            {
              name: "jobCredits",
              label: "Active job limit",
              type: "number",
              min: 1,
              value: d.plans.find((p) => p.name === edit)?.jobCredits ?? 1,
            },
            {
              name: "resumeCredits",
              label: "Resume credits",
              type: "number",
              min: 0,
              value: d.plans.find((p) => p.name === edit)?.resumeCredits ?? 0,
            },
            {
              name: "description",
              label: "Plan description",
              value: d.plans.find((p) => p.name === edit)?.description ?? "",
            },
          ]}
          onSave={(v) => {
            d.setPlans((old) =>
              old.map((p) =>
                p.name === edit
                  ? {
                      ...p,
                      price: v["price"]!,
                      description: v["description"]!,
                      jobCredits: Number(v["jobCredits"]),
                      resumeCredits: Number(v["resumeCredits"]),
                      features: [
                        `${v["jobCredits"]} active jobs`,
                        `${v["resumeCredits"]} resume credits`,
                        ...p.features.slice(2),
                      ],
                    }
                  : p,
              ),
            );
            d.log(`Updated ${edit} plan pricing and limits`);
            setEdit(null);
            toast.success("Plan updated across demo pricing");
          }}
        />
      </Modal>
    </>
  );
}
function Billing({ admin }: { admin: boolean }) {
  const [status, setStatus] = useState("All payments"),
    [invoice, setInvoice] = useState<string | null>(null);
  const list = payments.filter(
    (p) =>
      (admin || p.company === payments[0]!.company) &&
      (status === "All payments" || p.status === status),
  );
  const item = payments.find((p) => p.id === invoice);
  return (
    <>
      <div className="notice">
        Illustrative billing records. No money has been collected and no payment gateway is
        connected.
      </div>
      <Panel
        title={admin ? "Payments & invoices" : "Your billing history"}
        subtitle="A clear record of your recruitment investment"
        action={
          <select
            aria-label="Payment status"
            className="form-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["All payments", "Pending", "Successful", "Failed", "Refunded", "Cancelled"].map(
              (s) => (
                <option key={s}>{s}</option>
              ),
            )}
          </select>
        }
      >
        <DataGrid
          rows={list}
          title="payments"
          searchText={(p) => `${p.id} ${p.company} ${p.status}`}
          exportRows={list}
          columns={[
            { label: "Invoice", render: (p) => <strong>{p.id}</strong> },
            { label: "Employer", render: (p) => p.company },
            { label: "Date", render: (p) => p.date },
            { label: "Amount", render: (p) => `₹${p.amount.toLocaleString("en-IN")}` },
            { label: "Status", render: (p) => <Status>{p.status}</Status> },
            {
              label: "Details",
              render: (p) => (
                <Button variant="outline" size="sm" onClick={() => setInvoice(p.id)}>
                  View invoice
                </Button>
              ),
            },
          ]}
        />
      </Panel>
      <Modal open={!!item} title="Demo invoice" onClose={() => setInvoice(null)}>
        {item && (
          <div className="invoice-sheet">
            <Brand />
            <hr />
            <h3>{item.id}</h3>
            <p>{item.company}</p>
            <p>Date: {item.date}</p>
            <div className="invoice-total">
              Illustrative recruitment services
              <strong>₹{item.amount.toLocaleString("en-IN")}</strong>
            </div>
            <Status>{item.status}</Status>
            <p className="muted-copy">
              Demonstration record only. This is not a tax invoice or proof of payment.
            </p>
            <Button variant="outline" onClick={() => exportCsv(item.id, [item])}>
              <Download size={15} />
              Download record (CSV)
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
function Advertisements({
  placement,
  promotion,
  admin,
}: {
  placement: boolean;
  promotion: boolean;
  admin: boolean;
}) {
  const d = useDemo(),
    [edit, setEdit] = useState<Campaign | true | null>(null),
    [preview, setPreview] = useState<Campaign | null>(null),
    [error, setError] = useState("");
  const [creative, setCreative] = useState("");
  useEffect(() => {
    setCreative(edit && edit !== true ? edit.image : "");
  }, [edit]);
  const total = d.campaigns.reduce(
    (a, c) => ({ impressions: a.impressions + c.impressions, clicks: a.clicks + c.clicks }),
    { impressions: 0, clicks: 0 },
  );
  return (
    <>
      <div className="stats-grid">
        <Metric label="Campaigns" value={d.campaigns.length} />
        <Metric
          label="Active campaigns"
          value={d.campaigns.filter((c) => c.status === "Active").length}
        />
        <Metric label="Sample impressions" value={total.impressions.toLocaleString("en-IN")} />
        <Metric
          label="Sample click-through rate"
          value={`${((total.clicks / Math.max(total.impressions, 1)) * 100).toFixed(2)}%`}
        />
      </div>
      {placement ? (
        <Panel
          title="The right message, in the right place"
          subtitle="Responsive advertising inventory"
        >
          <div className="placement-grid">
            {[
              "Homepage",
              "Search results",
              "Job details",
              "Employer directory",
              "Category page",
              "Candidate dashboard",
              "Employer dashboard",
              "Footer",
            ].map((p, i) => (
              <article key={p} className="placement-card">
                <div className={`placement-sketch sketch-${i % 3}`}>
                  <span />
                  <span />
                  <i>AD</i>
                  <span />
                </div>
                <h3>{p}</h3>
                <p>
                  {i % 3 === 0
                    ? "Wide · 1200 × 300"
                    : i % 3 === 1
                      ? "Inline · 970 × 250"
                      : "Compact · 300 × 250"}
                </p>
                <small>
                  {d.campaigns.filter((c) => c.placement === p && c.status === "Active").length}{" "}
                  active campaigns
                </small>
              </article>
            ))}
          </div>
        </Panel>
      ) : promotion ? (
        <>
          <Panel
            title="Give your opportunities a little spotlight"
            subtitle="Featured placements are illustrative and require no payment"
          >
            <DataGrid
              rows={d.jobs}
              title="placements"
              searchText={(j) => `${j.title} ${j.company}`}
              columns={[
                { label: "Opportunity", render: (j) => <strong>{j.title}</strong> },
                { label: "Employer", render: (j) => j.company },
                {
                  label: "Placement",
                  render: (j) => <Status>{j.featured ? "Featured" : "Standard"}</Status>,
                },
                {
                  label: "Action",
                  render: (j) => (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        d.setJobs((old) =>
                          old.map((x) => (x.id === j.id ? { ...x, featured: !x.featured } : x)),
                        );
                        d.log(`Updated featured placement: ${j.title}`);
                      }}
                    >
                      {j.featured
                        ? "Remove feature"
                        : admin
                          ? "Feature job"
                          : "Request demo promotion"}
                    </Button>
                  ),
                },
              ]}
            />
          </Panel>
        </>
      ) : (
        <Panel
          title="Campaigns that make an impression"
          subtitle="Manage promotional messages, creative and placements"
          action={
            <AddButton
              onClick={() => {
                setEdit(true);
                setError("");
              }}
            >
              Create campaign
            </AddButton>
          }
        >
          <DataGrid
            rows={d.campaigns}
            title="campaigns"
            searchText={(c) => `${c.title} ${c.sponsor} ${c.placement}`}
            exportRows={d.campaigns.map((c) => ({
              title: c.title,
              placement: c.placement,
              status: c.status,
              impressions: c.impressions,
              clicks: c.clicks,
            }))}
            columns={[
              {
                label: "Campaign",
                render: (c) => (
                  <div>
                    <strong>{c.title}</strong>
                    <small className="cell-small">{c.sponsor}</small>
                  </div>
                ),
              },
              { label: "Placement", render: (c) => c.placement },
              {
                label: "Schedule",
                render: (c) => (
                  <small>
                    {c.start}
                    <br />
                    {c.end}
                  </small>
                ),
              },
              { label: "Status", render: (c) => <Status>{c.status}</Status> },
              {
                label: "Actions",
                render: (c) => (
                  <div className="table-actions">
                    <Button size="sm" variant="outline" onClick={() => setPreview(c)}>
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEdit(c);
                        setError("");
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        d.setCampaigns((old) =>
                          old.map((x) =>
                            x.id === c.id
                              ? { ...x, status: x.status === "Active" ? "Paused" : "Active" }
                              : x,
                          ),
                        );
                        d.log(`Campaign ${c.title} toggled`);
                      }}
                    >
                      {c.status === "Active" ? "Pause" : "Resume"}
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </Panel>
      )}
      <Modal
        open={!!edit}
        title={edit === true ? "Create an advertisement" : "Edit campaign"}
        onClose={() => setEdit(null)}
      >
        <Form
          key={edit === true ? "new" : edit?.id}
          fields={(
            [
              { name: "title", label: "Campaign headline" },
              { name: "subtitle", label: "Supporting text" },
              { name: "sponsor", label: "Sponsor name" },
              { name: "cta", label: "Button text", value: "Explore opportunities" },
              {
                name: "url",
                label: "Destination URL",
                value: "/jobs",
                help: "Relative path or HTTPS address",
              },
              {
                name: "placement",
                label: "Placement",
                options: [
                  "Homepage",
                  "Search results",
                  "Job details",
                  "Employer directory",
                  "Category page",
                  "Candidate dashboard",
                  "Employer dashboard",
                  "Footer",
                ],
              },
              {
                name: "audience",
                label: "Target audience",
                options: ["Candidates", "Employers", "Everyone"],
              },
              { name: "city", label: "Target city", options: ["All cities", ...cities] },
              { name: "start", label: "Start date", type: "date", value: "2026-10-15" },
              { name: "end", label: "End date", type: "date", value: "2026-12-31" },
              {
                name: "priority",
                label: "Priority (1 is highest)",
                type: "number",
                min: 1,
                max: 100,
                value: 1,
              },
              {
                name: "status",
                label: "Status",
                options: ["Draft", "Active", "Paused", "Pending review"],
              },
            ] as Field[]
          ).map((f) => ({
            ...f,
            value:
              edit && edit !== true
                ? String(edit[f.name as keyof Campaign] ?? f.value ?? "")
                : (f.value ?? ""),
          }))}
          onSave={(v) => {
            if (
              !(v["url"]?.startsWith("/") && !v["url"].startsWith("//")) &&
              !/^https:\/\/[^\s]+$/i.test(v["url"] ?? "")
            ) {
              setError("Use a relative path or a valid HTTPS URL.");
              return;
            }
            if (v["end"]! < v["start"]!) {
              setError("End date must be on or after the start date.");
              return;
            }
            const c: Campaign = {
              image: creative,
              id: edit !== true && edit ? edit.id : uid(),
              title: v["title"]!,
              subtitle: v["subtitle"]!,
              sponsor: v["sponsor"]!,
              cta: v["cta"]!,
              url: v["url"]!,
              placement: v["placement"]!,
              audience: v["audience"]!,
              city: v["city"]!,
              start: v["start"]!,
              end: v["end"]!,
              status: v["status"]!,
              priority: Number(v["priority"]),
              impressions: edit !== true && edit ? edit.impressions : 0,
              clicks: edit !== true && edit ? edit.clicks : 0,
            };
            d.setCampaigns((old) =>
              old.some((x) => x.id === c.id)
                ? old.map((x) => (x.id === c.id ? c : x))
                : [c, ...old],
            );
            d.log(`Saved campaign ${c.title}`);
            setEdit(null);
            toast.success("Demo campaign saved");
          }}
        >
          <label className="upload-zone campaign-upload">
            <strong>Campaign creative</strong>
            <span>PNG, JPEG or WebP · Up to 3 MB · Local preview only</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              aria-label="Choose campaign creative"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (
                  !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
                  file.size > 3 * 1024 * 1024
                ) {
                  setError("Choose a PNG, JPEG or WebP image smaller than 3 MB.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  setCreative(String(reader.result));
                  setError("");
                };
                reader.readAsDataURL(file);
              }}
            />
            {creative && (
              <img className="campaign-creative" src={creative} alt="Selected campaign preview" />
            )}
          </label>
          {creative && (
            <Button type="button" variant="ghost" onClick={() => setCreative("")}>
              Remove creative
            </Button>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </Form>
      </Modal>
      <Modal open={!!preview} title="Campaign preview" onClose={() => setPreview(null)}>
        {preview && (
          <div className="campaign-preview">
            <span className="sponsored-label">SPONSORED · {preview.sponsor}</span>
            {preview.image ? (
              <img
                className="campaign-creative"
                src={preview.image}
                alt={`${preview.sponsor} campaign creative`}
              />
            ) : (
              <Megaphone size={35} />
            )}
            <h2>{preview.title}</h2>
            <p>{preview.subtitle}</p>
            <Button>
              {preview.cta}
              <ArrowUpRight size={14} />
            </Button>
            <small>Preview only · {preview.placement}</small>
          </div>
        )}
      </Modal>
    </>
  );
}
function Analytics({ admin }: { admin: boolean }) {
  const d = useDemo(),
    [range, setRange] = useState("This month");
  const hired = d.applications.filter((a) => a.stage === "Hired").length;
  return (
    <>
      <div className="grid-toolbar">
        <span className="muted-copy">Illustrative analytics from demo records</span>
        <select
          className="form-input"
          value={range}
          aria-label="Report range"
          onChange={(e) => setRange(e.target.value)}
        >
          {["This month", "This quarter", "All demo records"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <Button variant="outline" onClick={() => exportCsv("hiring-report", d.applications)}>
          <Download size={14} />
          Export report
        </Button>
      </div>
      <div className="notice">
        {range} · Sample records are dated October 2026; available data falls within all displayed
        ranges.
      </div>
      <div className="stats-grid">
        <Metric label="Total applications" value={d.applications.length} />
        <Metric label="Successful hires" value={hired} />
        <Metric
          label="Hiring conversion"
          value={`${Math.round((hired / Math.max(d.applications.length, 1)) * 100)}%`}
        />
        <Metric
          label={admin ? "Employer verifications" : "Interviews scheduled"}
          value={
            admin ? d.companies.filter((c) => c.status === "Verified").length : d.interviews.length
          }
        />
      </div>
      <div className="dashboard-columns">
        <Panel title="Your hiring funnel" subtitle="How opportunities become great teams">
          {stages.slice(0, 7).map((s) => {
            const count = d.applications.filter((a) => a.stage === s).length;
            return (
              <div className="report-bar" key={s}>
                <div>
                  <span>{s}</span>
                  <strong>{count}</strong>
                </div>
                <div className="progress">
                  <span
                    style={{ width: `${(count / Math.max(d.applications.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Panel>
        <Panel title="Opportunities by city" subtitle="Where hospitality is growing">
          {cities.map((c) => (
            <div className="report-bar" key={c}>
              <div>
                <span>{c}</span>
                <strong>{d.jobs.filter((j) => j.city === c).length}</strong>
              </div>
              <div className="progress">
                <span
                  style={{
                    width: `${(d.jobs.filter((j) => j.city === c).length / Math.max(d.jobs.length, 1)) * 350}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </Panel>
      </div>
      <Panel title="Campaign performance" subtitle="Sample counts · No live tracking is connected">
        <DataGrid
          rows={d.campaigns}
          title="campaign performance"
          searchText={(c) => c.title}
          exportRows={d.campaigns}
          columns={[
            { label: "Campaign", render: (c) => c.title },
            { label: "Impressions", render: (c) => c.impressions.toLocaleString("en-IN") },
            { label: "Clicks", render: (c) => c.clicks },
            {
              label: "CTR",
              render: (c) => `${((c.clicks / Math.max(c.impressions, 1)) * 100).toFixed(2)}%`,
            },
          ]}
        />
      </Panel>
    </>
  );
}
function Employers() {
  const d = useDemo(),
    [active, setActive] = useState<string | null>(null);
  const c = d.companies.find((c) => c.id === active);
  return (
    <>
      <Panel
        title="Trust starts with verification"
        subtitle="Review fictional businesses and manage their platform status"
      >
        <DataGrid
          rows={d.companies}
          title="employers"
          searchText={(c) => `${c.name} ${c.city} ${c.status}`}
          exportRows={d.companies}
          columns={[
            {
              label: "Business",
              render: (c) => (
                <div className="table-person">
                  <CompanyMark mark={c.mark} tone={c.tone} />
                  <span>
                    <strong>{c.name}</strong>
                    <small>{c.type}</small>
                  </span>
                </div>
              ),
            },
            { label: "Location", render: (c) => c.city },
            {
              label: "Vacancies",
              render: (c) => d.jobs.filter((j) => j.companyId === c.id).length,
            },
            { label: "Verification", render: (c) => <Status>{c.status}</Status> },
            {
              label: "Actions",
              render: (c) => (
                <Button variant="outline" size="sm" onClick={() => setActive(c.id)}>
                  Review employer
                </Button>
              ),
            },
          ]}
        />
      </Panel>
      <Modal open={!!c} title="Employer verification" onClose={() => setActive(null)}>
        {c && (
          <>
            <CompanyMark mark={c.mark} tone={c.tone} />
            <h3>{c.name}</h3>
            <p className="muted-copy">{c.about}</p>
            <p>
              {c.type} · {c.city}
            </p>
            <div className="privacy-card">
              <ShieldCheck size={20} />
              <p>Demo review only. No business documents have been collected or verified.</p>
            </div>
            <Form
              fields={[
                {
                  name: "status",
                  label: "Verification decision",
                  options: [
                    "Verified",
                    "Pending review",
                    "Correction requested",
                    "Rejected",
                    "Suspended",
                  ],
                  value: c.status,
                },
              ]}
              onSave={(v) => {
                d.setCompanies((old) =>
                  old.map((x) => (x.id === c.id ? { ...x, status: v["status"]! } : x)),
                );
                d.log(`Employer ${c.name}: ${v["status"]}`);
                setActive(null);
              }}
            />
          </>
        )}
      </Modal>
    </>
  );
}
function ContentManager() {
  const d = useDemo(),
    [open, setOpen] = useState(false),
    [editing, setEditing] = useState<string | null>(null);
  return (
    <>
      <Panel
        title="Stories that help people grow"
        subtitle="Manage career advice and hiring insights"
        action={
          <AddButton
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Write an article
          </AddButton>
        }
      >
        <DataGrid
          rows={d.articles}
          title="articles"
          searchText={(a) => `${a.title} ${a.category}`}
          columns={[
            {
              label: "Article",
              render: (a) => (
                <div>
                  <strong>{a.title}</strong>
                  <small className="cell-small">
                    {a.category} · {a.readTime} min read
                  </small>
                </div>
              ),
            },
            { label: "Published", render: (a) => a.date },
            { label: "Status", render: (a) => <Status>{a.status}</Status> },
            {
              label: "Publishing",
              render: (a) => (
                <div className="table-actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(a.id);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      d.setArticles((old) =>
                        old.map((x) =>
                          x.id === a.id
                            ? { ...x, status: x.status === "Published" ? "Draft" : "Published" }
                            : x,
                        ),
                      );
                      d.log(`Article publication changed: ${a.title}`);
                    }}
                  >
                    {a.status === "Published" ? "Move to draft" : "Publish"}
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Panel>
      <ContentSettings />
      <Modal open={open} title="Create a career article" onClose={() => setOpen(false)}>
        <Form
          key={editing ?? "new"}
          fields={[
            { name: "title", label: "Article title" },
            { name: "category", label: "Category", options: ["Career advice", "Hiring insights"] },
            { name: "summary", label: "Article content", type: "textarea" },
            { name: "status", label: "Publication", options: ["Draft", "Published"] },
          ].map((f) => ({
            ...f,
            value: String(
              d.articles.find((a) => a.id === editing)?.[
                f.name as "title" | "summary" | "status" | "category"
              ] ?? "",
            ),
          }))}
          onSave={(v) => {
            const article = {
              id: editing ?? uid(),
              title: v["title"]!,
              category: v["category"]!,
              summary: v["summary"]!,
              readTime: 4,
              date: "Demo session",
              status: v["status"]!,
            };
            d.setArticles((old) =>
              editing ? old.map((a) => (a.id === editing ? article : a)) : [article, ...old],
            );
            d.log(`Saved article: ${v["title"]}`);
            setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
function Messages() {
  const d = useDemo(),
    [text, setText] = useState("");
  return (
    <Panel
      title="Every great connection starts with hello"
      subtitle="Demo conversation · No messages are sent outside this workspace"
    >
      <div className="messaging-layout">
        <aside>
          <span className="eyebrow">CONVERSATIONS</span>
          <div className="conversation-preview">
            <span className="avatar">MK</span>
            <div>
              <strong>Meera Kulkarni</strong>
              <small>Grand Orchid · Recruitment</small>
            </div>
          </div>
          <div className="privacy-card">
            <ShieldCheck size={18} />
            <p>Messages are shared across demo roles to show a conversation flow.</p>
          </div>
        </aside>
        <div>
          <div className="chat-thread">
            {d.messages.map((m) => (
              <article key={m.id} className={`chat-bubble ${m.outgoing ? "outgoing" : ""}`}>
                <small>{m.name}</small>
                <p>{m.text}</p>
                <span>Demo session</span>
              </article>
            ))}
          </div>
          <form
            className="chat-compose"
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              d.setMessages((old) => [
                ...old,
                {
                  id: uid(),
                  name: d.role === "Candidate" ? d.profile.name : "Recruitment team",
                  text: text.trim(),
                  outgoing: d.role === "Candidate",
                },
              ]);
              setText("");
              d.log("Demo message added to conversation");
            }}
          >
            <input
              aria-label="Message"
              placeholder="Write a thoughtful message…"
              value={text}
              maxLength={2000}
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit">
              Send demo message
              <ArrowUpRight size={14} />
            </Button>
          </form>
        </div>
      </div>
    </Panel>
  );
}
function SettingsPanel({ candidate }: { candidate: boolean }) {
  const d = useDemo();
  return (
    <div className="dashboard-columns">
      <Panel title="Make this workspace yours" subtitle="Demo preferences and visibility">
        <Form
          fields={[
            {
              name: "display",
              label: "Display name",
              value: candidate ? d.profile.name : d.preferences.display,
            },
            {
              name: "language",
              label: "Preferred language",
              options: ["English", "Marathi (preference only)", "Hindi (preference only)"],
              value: d.preferences.language,
            },
            {
              name: "email",
              label: "Email notifications",
              options: ["Enabled", "Disabled"],
              value: d.preferences.email,
            },
            {
              name: "visibility",
              label: "Profile visibility",
              options: ["Recruiters only", "Private", "Public"],
              value: d.profile.visibility,
            },
          ]}
          onSave={(v) => {
            if (candidate)
              d.setProfile((p) => ({ ...p, name: v["display"]!, visibility: v["visibility"]! }));
            d.log("Demo preferences saved");
            d.setPreferences({
              display: v["display"]!,
              language: v["language"]!,
              email: v["email"]!,
            });
            toast.success("Demo preferences saved; delivery and translation are not connected");
          }}
        />
      </Panel>
      <Panel title="Privacy & account">
        <div className="privacy-card">
          <ShieldCheck size={24} />
          <div>
            <strong>You control your information</strong>
            <p>
              No real account exists in this demo. Contact details remain masked for recruiters.
            </p>
          </div>
        </div>
        <p className="muted-copy">
          To clear all demo changes, refresh the page. Real data export, deletion requests and
          password changes will be available after secure authentication is connected.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            d.log("Demo data deletion enquiry recorded");
            toast.success("Demo enquiry recorded in activity log");
          }}
        >
          Record a deletion enquiry
        </Button>
      </Panel>
    </div>
  );
}
function Support({ admin }: { admin: boolean }) {
  const d = useDemo(),
    [open, setOpen] = useState(false),
    [active, setActive] = useState<string | null>(null);
  const ticket = d.tickets.find((t) => t.id === active);
  return (
    <>
      <Panel
        title={admin ? "Every enquiry deserves a thoughtful response" : "We’re here to help"}
        subtitle="Manage illustrative enquiries and support requests"
        action={<AddButton onClick={() => setOpen(true)}>New support request</AddButton>}
      >
        <DataGrid
          rows={d.tickets}
          title="support tickets"
          searchText={(t) => `${t.id} ${t.subject} ${t.status}`}
          columns={[
            {
              label: "Request",
              render: (t) => (
                <div>
                  <strong>{t.subject}</strong>
                  <small className="cell-small">{t.id}</small>
                </div>
              ),
            },
            { label: "Priority", render: (t) => <Status>{t.priority}</Status> },
            { label: "Status", render: (t) => <Status>{t.status}</Status> },
            {
              label: "Details",
              render: (t) => (
                <Button size="sm" variant="outline" onClick={() => setActive(t.id)}>
                  Open request
                </Button>
              ),
            },
          ]}
        />
      </Panel>
      <Modal open={open} title="How can we help?" onClose={() => setOpen(false)}>
        <Form
          fields={[
            { name: "subject", label: "Subject" },
            { name: "priority", label: "Priority", options: ["Normal", "High"] },
            { name: "message", label: "Tell us what happened", type: "textarea" },
          ]}
          submit="Create demo request"
          onSave={(v) => {
            d.setTickets((old) => [
              {
                id: `SUP-${uid().slice(0, 8)}`,
                subject: v["subject"]!,
                message: v["message"]!,
                priority: v["priority"]!,
                status: "Open",
              },
              ...old,
            ]);
            d.log(`Support request: ${v["subject"]}`);
            setOpen(false);
            toast.success("Demo support ticket created");
          }}
        />
      </Modal>
      <Modal
        open={!!ticket}
        title={ticket?.subject ?? "Support request"}
        onClose={() => setActive(null)}
      >
        {ticket && (
          <>
            <Status>{ticket.status}</Status>
            <p className="muted-copy">{ticket.message}</p>
            {admin && (
              <Form
                fields={[
                  {
                    name: "status",
                    label: "Request status",
                    options: ["Open", "In progress", "Resolved"],
                    value: ticket.status,
                  },
                ]}
                onSave={(v) => {
                  d.setTickets((old) =>
                    old.map((t) => (t.id === ticket.id ? { ...t, status: v["status"]! } : t)),
                  );
                  d.log(`Support request ${ticket.id} updated`);
                  setActive(null);
                }}
              />
            )}
          </>
        )}
      </Modal>
    </>
  );
}
function JobAlerts() {
  const d = useDemo(),
    [open, setOpen] = useState(false);
  return (
    <>
      <Panel
        title="Let the right role find you"
        subtitle="Configure demo preferences · Email and WhatsApp delivery are not connected"
        action={<AddButton onClick={() => setOpen(true)}>Create job alert</AddButton>}
      >
        {d.alerts.map((a) => (
          <div className="alert-card" key={a.id}>
            <span className="round-icon">
              <Bell />
            </span>
            <div>
              <h3>{a.role} opportunities</h3>
              <p>
                {a.city} · {a.frequency} updates
              </p>
            </div>
            <Status>{a.active ? "Active" : "Paused"}</Status>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                d.setAlerts((old) =>
                  old.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)),
                )
              }
            >
              {a.active ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => d.setAlerts((old) => old.filter((x) => x.id !== a.id))}
            >
              Delete
            </Button>
          </div>
        ))}
        {!d.alerts.length && (
          <Empty
            title="Stay one step ahead"
            text="Create an alert for your preferred role and city."
          />
        )}
      </Panel>
      <Modal
        open={open}
        title="Your next opportunity, on your terms"
        onClose={() => setOpen(false)}
      >
        <Form
          fields={[
            { name: "role", label: "Job role / keyword" },
            { name: "city", label: "Preferred city", options: cities },
            {
              name: "frequency",
              label: "Alert frequency",
              options: ["Daily", "Weekly", "Monthly"],
            },
          ]}
          submit="Create demo alert"
          onSave={(v) => {
            d.setAlerts((old) => [
              ...old,
              {
                id: uid(),
                role: v["role"]!,
                city: v["city"]!,
                frequency: v["frequency"]!,
                active: true,
              },
            ]);
            d.log("Job alert preferences created");
            setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
function profileCompletion(p: ReturnType<typeof useDemo>["profile"]) {
  return Math.round(
    ([p.name, p.headline, p.city, p.phone, p.summary, p.skills, p.languages, p.resume].filter(
      Boolean,
    ).length /
      8) *
      100,
  );
}
function ProfileEditor() {
  const d = useDemo(),
    p = d.profile;
  const [error, setError] = useState("");
  return (
    <div className="dashboard-columns">
      <Panel title="Tell your hospitality story" subtitle="Your experience deserves to be seen">
        <Form
          fields={[
            { name: "name", label: "Full name", value: p.name },
            { name: "headline", label: "Professional headline", value: p.headline },
            { name: "city", label: "Current / preferred city", options: cities, value: p.city },
            {
              name: "phone",
              label: "Phone (demo only)",
              type: "tel",
              value: p.phone,
              required: false,
            },
            {
              name: "experience",
              label: "Experience in years",
              type: "number",
              min: 0,
              max: 50,
              value: p.experience,
            },
            {
              name: "salary",
              label: "Expected monthly salary (₹)",
              type: "number",
              min: 0,
              value: p.salary,
            },
            { name: "skills", label: "Skills · comma separated", value: p.skills },
            { name: "languages", label: "Languages", value: p.languages },
            {
              name: "shift",
              label: "Preferred shift",
              options: ["Day", "Night", "Rotational"],
              value: p.shift,
            },
            {
              name: "availability",
              label: "Joining availability",
              options: ["Immediate", "15 days", "30 days", "60 days"],
              value: p.availability,
            },
            {
              name: "visibility",
              label: "Profile visibility",
              options: ["Recruiters only", "Private", "Public"],
              value: p.visibility,
            },
            { name: "summary", label: "Professional summary", type: "textarea", value: p.summary },
          ]}
          onSave={(v) => {
            d.setProfile({
              ...p,
              ...v,
              experience: Number(v["experience"]),
              salary: Number(v["salary"]),
            });
            d.log("Candidate profile updated");
            toast.success("Demo profile updated");
          }}
        />
      </Panel>
      <div>
        <Panel title="Profile strength">
          <strong className="completion-value">{profileCompletion(p)}%</strong>
          <div className="progress">
            <span style={{ width: `${profileCompletion(p)}%` }} />
          </div>
          <p className="muted-copy">Add a contact number and resume to complete your profile.</p>
        </Panel>
        <Panel title="Your resume" subtitle="PDF, DOC or DOCX · Maximum 5 MB">
          <label className="upload-zone">
            <FileText size={28} />
            <strong>{p.resume || "Choose your resume"}</strong>
            <span>Validated locally · File contents are not uploaded</span>
            <input
              aria-label="Choose resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!/\.(pdf|docx?)$/i.test(file.name) || file.size > 5 * 1024 * 1024) {
                  setError("Choose a PDF, DOC or DOCX smaller than 5 MB.");
                  return;
                }
                setError("");
                d.setProfile({ ...p, resume: file.name });
                toast.success("Resume filename added to demo profile");
              }}
            />
          </label>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {p.resume && (
            <Button variant="outline" onClick={() => d.setProfile({ ...p, resume: "" })}>
              Remove resume
            </Button>
          )}
        </Panel>
      </div>
    </div>
  );
}
function JobsManager({ admin }: { admin: boolean }) {
  const d = useDemo();
  const [edit, setEdit] = useState<Job | true | null>(null),
    [remove, setRemove] = useState<Job | null>(null),
    [step, setStep] = useState(0),
    [draft, setDraft] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const fields: Field[][] = [
    [
      { name: "title", label: "Job title" },
      { name: "department", label: "Department", options: d.categories },
      { name: "companyId", label: "Employer", options: d.companies.map((c) => c.id) },
      { name: "openings", label: "Open positions", type: "number", min: 1, max: 100, value: 1 },
      { name: "city", label: "Location", options: d.locations },
      { name: "description", label: "Job description", type: "textarea" },
    ],
    [
      {
        name: "salaryMin",
        label: "Minimum salary (₹ / month)",
        type: "number",
        min: 1000,
        value: 18000,
      },
      {
        name: "salaryMax",
        label: "Maximum salary (₹ / month)",
        type: "number",
        min: 1000,
        value: 28000,
      },
      {
        name: "minExperience",
        label: "Minimum experience",
        type: "number",
        min: 0,
        max: 50,
        value: 0,
      },
      {
        name: "maxExperience",
        label: "Maximum experience",
        type: "number",
        min: 0,
        max: 50,
        value: 3,
      },
      {
        name: "type",
        label: "Employment type",
        options: ["Full-time", "Part-time", "Contract", "Seasonal"],
      },
      { name: "shift", label: "Shift", options: ["Day", "Night", "Rotational"] },
      { name: "skills", label: "Skills · comma separated", value: "Guest service, Teamwork" },
      { name: "benefits", label: "Benefits · comma separated", value: "Meals provided" },
    ],
    [
      { name: "deadline", label: "Application deadline", type: "date", value: "2026-12-31" },
      { name: "recruiter", label: "Assigned recruiter", options: d.team.map((t) => t.name) },
      {
        name: "status",
        label: "Publication status",
        options: admin
          ? ["Published", "Draft", "Pending Review", "Paused", "Closed", "Rejected"]
          : ["Published", "Draft", "Pending Review", "Paused", "Closed"],
      },
      { name: "featured", label: "Placement", options: ["Standard", "Featured"] },
    ],
  ];
  const open = (j: Job | true) => {
    setEdit(j);
    setStep(0);
    setError("");
    setDraft(
      j === true
        ? {}
        : Object.fromEntries(
            Object.entries(j).map(([k, v]) => [
              k,
              k === "featured"
                ? v
                  ? "Featured"
                  : "Standard"
                : Array.isArray(v)
                  ? v.join(", ")
                  : String(v),
            ]),
          ),
    );
  };
  const save = (values: Record<string, string>) => {
    const next = { ...draft, ...values };
    if (
      step === 1 &&
      (Number(next["salaryMin"]) > Number(next["salaryMax"]) ||
        Number(next["minExperience"]) > Number(next["maxExperience"]))
    ) {
      setError("Maximum salary and experience must be at least the minimum.");
      return;
    }
    setError("");
    setDraft(next);
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    const company = d.companies.find((c) => c.id === next["companyId"]) ?? d.companies[0]!;
    const j: Job = {
      id: edit !== true && edit ? edit.id : uid(),
      title: next["title"]!,
      company: company.name,
      companyId: company.id,
      mark: company.mark,
      city: next["city"]!,
      area: company.city,
      salary: `${Number(next["salaryMin"]).toLocaleString("en-IN")} – ${Number(next["salaryMax"]).toLocaleString("en-IN")}`,
      salaryMin: Number(next["salaryMin"]),
      salaryMax: Number(next["salaryMax"]),
      experience: `${next["minExperience"]}–${next["maxExperience"]} years`,
      minExperience: Number(next["minExperience"]),
      maxExperience: Number(next["maxExperience"]),
      department: next["department"]!,
      type: next["type"]!,
      shift: next["shift"]!,
      benefits: next["benefits"]!.split(",").map((s) => s.trim()),
      posted: "Today",
      postedDays: 0,
      featured: next["featured"] === "Featured",
      tone: company.tone,
      status: next["status"]!,
      description: next["description"]!,
      openings: Number(next["openings"]),
      skills: next["skills"]!.split(",").map((s) => s.trim()),
      deadline: next["deadline"]!,
      recruiter: next["recruiter"]!,
    };
    d.setJobs((old) =>
      old.some((x) => x.id === j.id) ? old.map((x) => (x.id === j.id ? j : x)) : [j, ...old],
    );
    d.log(`Job ${j.title} saved as ${j.status}`);
    setEdit(null);
    toast.success("Demo vacancy saved");
  };
  return (
    <>
      <Panel
        title={admin ? "Opportunities & moderation" : "Your job postings"}
        subtitle={`${d.jobs.filter((j) => j.status === "Published").length} published vacancies · Manage the full lifecycle`}
        action={<AddButton onClick={() => open(true)}>Create vacancy</AddButton>}
      >
        <DataGrid
          rows={d.jobs}
          title="jobs"
          searchText={(j) => `${j.title} ${j.city} ${j.status}`}
          exportRows={d.jobs.map((j) => ({
            title: j.title,
            company: j.company,
            city: j.city,
            status: j.status,
          }))}
          columns={[
            {
              label: "Opportunity",
              render: (j) => (
                <div className="table-person">
                  <CompanyMark mark={j.mark} tone={j.tone} />
                  <span>
                    <strong>{j.title}</strong>
                    <small>
                      {j.company} · {j.department}
                    </small>
                  </span>
                </div>
              ),
            },
            { label: "Location", render: (j) => j.city },
            {
              label: "Applicants",
              render: (j) => d.applications.filter((a) => a.jobId === j.id).length,
            },
            { label: "Status", render: (j) => <Status>{j.status}</Status> },
            {
              label: "Actions",
              render: (j) => (
                <div className="table-actions">
                  <Button variant="outline" size="sm" onClick={() => open(j)}>
                    Edit
                  </Button>
                  {admin && j.status !== "Published" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        d.setJobs((old) =>
                          old.map((x) => (x.id === j.id ? { ...x, status: "Published" } : x)),
                        );
                        d.log(`Approved job ${j.title}`);
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setRemove(j)}>
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Panel>
      <Modal
        open={!!edit}
        title={edit === true ? "Create a new opportunity" : "Edit opportunity"}
        onClose={() => setEdit(null)}
      >
        <div className="wizard-steps">
          {["The opportunity", "Requirements", "Review & publish"].map((s, i) => (
            <span className={step === i ? "active" : ""} key={s}>
              {i + 1}. {s}
            </span>
          ))}
        </div>
        <Form
          key={step}
          fields={fields[step]!.map((f) => ({ ...f, value: draft[f.name] ?? f.value ?? "" }))}
          onSave={save}
          submit={step === 2 ? "Save vacancy" : "Continue"}
        >
          {step === 2 && (
            <div className="job-preview">
              <span className="eyebrow">VACANCY PREVIEW</span>
              <h3>{draft["title"]}</h3>
              <p>
                {draft["city"]} · ₹{draft["salaryMin"]}–{draft["salaryMax"]} / month
              </p>
              <p>{draft["description"]}</p>
            </div>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {step > 0 && (
            <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
        </Form>
      </Modal>
      <Modal open={!!remove} title="Delete this vacancy?" onClose={() => setRemove(null)}>
        <p className="muted-copy">
          This removes {remove?.title} and its linked demo applications and interviews.
        </p>
        <Button
          variant="destructive"
          onClick={() => {
            const ids = d.applications.filter((a) => a.jobId === remove!.id).map((a) => a.id);
            d.setJobs((old) => old.filter((j) => j.id !== remove!.id));
            d.setApplications((old) => old.filter((a) => a.jobId !== remove!.id));
            d.setInterviews((old) => old.filter((i) => !ids.includes(i.applicationId)));
            d.log(`Deleted vacancy ${remove!.title}`);
            setRemove(null);
          }}
        >
          Delete vacancy
        </Button>
      </Modal>
    </>
  );
}
