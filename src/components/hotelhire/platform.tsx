import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
export { DemoProvider, useDemo } from "@/lib/demo-store";
import { useDemo } from "@/lib/demo-store";
import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  MapPin,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/hospitality-data";
export function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-symbol">
        <Building2 size={22} />
      </span>
      <span>
        HotelHire<span className="brand-pro">Pro</span>
      </span>
    </Link>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const path = useLocation().pathname;
  return (
    <>
      <div className="announcement">
        <span>Better opportunities. Exceptional hospitality.</span>
        <Link to="/jobs">
          Your next chapter starts here <ArrowUpRight size={13} />
        </Link>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
            {[
              { to: "/jobs", label: "Find jobs" },
              { to: "/companies", label: "Explore companies" },
              { to: "/for-employers", label: "For employers" },
              { to: "/pricing", label: "Pricing" },
            ].map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={path === n.to ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <Link to="/workspace" className="header-workspace-link" onClick={() => setOpen(false)}>
              My workspace
            </Link>
          </nav>
          <div className="header-actions">
            <Button variant="outline" asChild>
              <Link to="/$page" params={{ page: "login" }} onClick={() => setOpen(false)}>
                Login
              </Link>
            </Button>
            <Button asChild>
              <Link to="/$page" params={{ page: "register" }} onClick={() => setOpen(false)}>
                Register
              </Link>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-expanded">
        <div>
          <Brand />
          <p>
            Great hospitality starts with great people. Find your next chapter with a team that
            values your talent.
          </p>
          <span className="demo-note">
            Interactive prototype · Fictional records
            <br />
            No real accounts, applications or payments
          </span>
        </div>
        <div>
          <h3>For your career</h3>
          <Link to="/jobs">Find opportunities</Link>
          <Link to="/$page" params={{ page: "categories" }}>
            Browse categories
          </Link>
          <Link to="/$page" params={{ page: "jobs-by-location" }}>
            Jobs by location
          </Link>
          <Link to="/workspace" search={{ role: "Candidate", view: "profile" }}>
            Create your demo profile
          </Link>
          <Link to="/$page" params={{ page: "blog" }}>
            Career journal
          </Link>
        </div>
        <div>
          <h3>For your team</h3>
          <Link to="/for-employers">Hire hospitality staff</Link>
          <Link to="/companies">Explore employers</Link>
          <Link to="/pricing">Plans & pricing</Link>
          <Link to="/$page" params={{ page: "advertise" }}>
            Advertise with us
          </Link>
          <Link to="/workspace">Recruitment workspace</Link>
        </div>
        <div>
          <h3>HotelHire Pro</h3>
          {[
            { page: "about", label: "Our story" },
            { page: "contact", label: "Get in touch" },
            { page: "faq", label: "Help & FAQs" },
            { page: "terms", label: "Demo terms" },
            { page: "privacy", label: "Privacy notice" },
          ].map((l) => (
            <Link to="/$page" params={{ page: l.page }} key={l.page}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 HotelHire Pro. All rights reserved.</span>
        <span>Made for the people behind hospitality.</span>
      </div>
    </footer>
  );
}
export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
export function CompanyMark({ mark, tone = "gold" }: { mark: string; tone?: string }) {
  return <span className={`company-mark tone-${tone}`}>{mark}</span>;
}
export function JobCard({ job }: { job: Job }) {
  const { saved, toggleSave } = useDemo();
  const isSaved = saved.includes(job.id);
  return (
    <article className="job-card">
      <div className="job-card-top">
        <CompanyMark mark={job.mark} tone={job.tone} />
        <div className="job-company">
          {job.company}
          <ShieldCheck size={14} />
          <span>Demo employer</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={isSaved ? `Unsave ${job.title}` : `Save ${job.title}`}
          title={isSaved ? "Unsave job" : "Save job"}
          onClick={() => toggleSave(job.id)}
          className={isSaved ? "saved" : ""}
        >
          <Bookmark fill={isSaved ? "currentColor" : "none"} />
        </Button>
      </div>
      <Link to="/jobs/$id" params={{ id: job.id }} className="job-title">
        {job.title}
      </Link>
      <div className="job-meta">
        <span>
          <MapPin size={14} />
          {job.city}, {job.area}
        </span>
        <span>
          <BriefcaseBusiness size={14} />
          {job.experience}
        </span>
      </div>
      <p className="salary">
        ₹{job.salary}
        <span> / month</span>
      </p>
      <div className="job-benefits">
        {job.benefits.map((b) => (
          <span key={b}>
            <Check size={11} />
            {b}
          </span>
        ))}
      </div>
      <div className="job-card-bottom">
        <span>
          {job.featured && <i className="featured-label">Featured</i>}
          {job.posted}
        </span>
        <Link to="/jobs/$id" params={{ id: job.id }}>
          View job <ChevronRight size={15} />
        </Link>
      </div>
    </article>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { to: "/jobs" | "/companies"; label: string };
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && (
        <Link to={link.to}>
          {link.label}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
