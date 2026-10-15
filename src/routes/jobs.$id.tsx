import { useParams } from "@/lib/navigation";
import { Link } from "@/lib/navigation";
import { useState } from "react";
import { Bookmark, CheckCircle2, ArrowLeft, Share2, Flag, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout, CompanyMark, JobCard, useDemo } from "@/components/hotelhire/platform";
import { SponsoredBanner } from "@/components/hotelhire/public-pages";
import { uid } from "@/lib/demo-store";
import { toast } from "sonner";
export default function Detail() {
  const { id } = useParams(),
    d = useDemo(),
    job = d.jobs.find((j) => j.id === id && j.status === "Published");
  const applied = d.applications.some((a) => a.jobId === id && a.candidateId === "me");
  const [error, setError] = useState("");
  if (!job)
    return (
      <Layout>
        <section className="section container">
          <h1>This opportunity is unavailable.</h1>
          <p className="muted-copy">It may be paused, closed or removed from the demo.</p>
          <Button asChild>
            <Link to="/jobs">Browse opportunities</Link>
          </Button>
        </section>
      </Layout>
    );
  return (
    <Layout>
      <div className="container detail-layout">
        <div>
          <Link className="back-link" to="/jobs">
            <ArrowLeft size={14} />
            Back to opportunities
          </Link>
          <article className="detail-main">
            <div className="detail-title">
              <CompanyMark mark={job.mark} tone={job.tone} />
              <div>
                <h1>{job.title}</h1>
                <Link to="/companies/$id" params={{ id: job.companyId }}>
                  {job.company} ↗
                </Link>
              </div>
            </div>
            <div className="detail-facts">
              {[
                ["Monthly salary", `₹${job.salary}`],
                ["Location", `${job.area}, ${job.city}`],
                ["Experience", job.experience],
                ["Employment", job.type],
                ["Shift", job.shift],
                ["Open positions", String(job.openings)],
              ].map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
            <div className="prose">
              <h2>A little about the opportunity</h2>
              <p>{job.description}</p>
              <h2>What you’ll do</h2>
              <ul>
                <li>Deliver thoughtful service in the {job.department.toLowerCase()} team.</li>
                <li>Collaborate with colleagues to create memorable guest experiences.</li>
                <li>Maintain safety, hygiene and operational standards.</li>
                <li>Take ownership of your work and support the team during busy shifts.</li>
              </ul>
              <h2>What you bring</h2>
              <p>
                {job.experience} of relevant experience, a guest-first approach and the willingness
                to learn.
              </p>
              <div className="tag-row">
                {job.skills.map((s) => (
                  <span className="status-pill" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <h2>Your benefits</h2>
              <div className="job-benefits">
                {job.benefits.map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </div>
              <h2>Application details</h2>
              <p>
                Apply by {job.deadline}. Joining, language requirements, qualifications and weekly
                offs should be discussed during the demo interview workflow.
              </p>
              <h2>About {job.company}</h2>
              <p>{d.companies.find((c) => c.id === job.companyId)?.about}</p>
            </div>
            <div className="table-actions mt-5">
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success("Job link copied");
                  } catch {
                    setError("Copy the link from your browser address bar to share this job.");
                  }
                }}
              >
                <Share2 size={14} />
                Share job
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  d.setTickets((old) => [
                    {
                      id: `REPORT-${uid().slice(0, 8)}`,
                      subject: `Reported job: ${job.title}`,
                      message: `Review requested for ${job.id} at ${job.company}`,
                      status: "Open",
                      priority: "High",
                    },
                    ...old,
                  ]);
                  d.log("Job report added to admin enquiries");
                  toast.success("Demo report sent to Admin enquiries");
                }}
              >
                <Flag size={14} />
                Report job
              </Button>
            </div>
          </article>
          <div className="section-heading mt-8">
            <h2>More opportunities for you</h2>
          </div>
          <div className="jobs-grid browse-jobs">
            {d.jobs
              .filter(
                (j) => j.status === "Published" && j.department === job.department && j.id !== id,
              )
              .slice(0, 2)
              .map((j) => (
                <JobCard job={j} key={j.id} />
              ))}
          </div>
        </div>
        <aside className="application-panel" id="apply">
          {applied ? (
            <div className="success-state">
              <CheckCircle2 size={35} />
              <h3>Your demo application is in.</h3>
              <p>
                Track progress in your Candidate workspace. The Employer pipeline now includes your
                application. No real application was sent.
              </p>
              <Button asChild variant="outline">
                <Link to="/workspace" search={{ role: "Candidate", view: "applications" }}>
                  Track application
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <h3>Your next chapter starts here</h3>
              <p>
                Apply for {job.title} at {job.company}.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  d.apply(job.id, String(f.get("name")));
                  d.setProfile((p) => ({ ...p, name: String(f.get("name")) }));
                  toast.success("Demo application added to hiring pipeline");
                }}
              >
                <label htmlFor="app-name">Full name</label>
                <input
                  id="app-name"
                  name="name"
                  className="form-input"
                  required
                  defaultValue={d.profile.name}
                />
                <label htmlFor="app-email">Email address</label>
                <input
                  id="app-email"
                  className="form-input"
                  type="email"
                  required
                  placeholder="candidate@hotelhire.demo"
                />
                <label htmlFor="app-phone">Mobile number (demo)</label>
                <input
                  id="app-phone"
                  className="form-input"
                  type="tel"
                  pattern="[0-9+ ()-]{10,15}"
                  required
                  placeholder="Use a fictional phone number"
                />
                <Button type="submit">Submit demo application</Button>
              </form>
            </>
          )}
          <Button variant="outline" onClick={() => d.toggleSave(job.id)}>
            <Bookmark />
            {d.saved.includes(job.id) ? "Saved to your jobs" : "Save this opportunity"}
          </Button>
          {error && <p role="status">{error}</p>}
          <span className="demo-note">
            Fictional vacancy · No real application, account or payment
          </span>
          <SponsoredBanner placement="Job details" />
        </aside>
      </div>
      <div className="mobile-apply">
        <span>
          {job.title}
          <strong>₹{job.salaryMin.toLocaleString("en-IN")}+ / month</strong>
        </span>
        <a href="#apply">{applied ? "View application" : "Apply now"} ↗</a>
      </div>
    </Layout>
  );
}
