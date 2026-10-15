import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Building2,
  ChefHat,
  MapPin,
  ShieldCheck,
  BookOpen,
  Megaphone,
  Users,
  Check,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout, CompanyMark, JobCard } from "./platform";
import { useDemo, type Role, uid } from "@/lib/demo-store";
import { cities, departments } from "@/lib/demo-data";
import { Form, Panel, Empty } from "./workspace-ui";
import teamImage from "@/assets/hospitality-team.jpg";
import { toast } from "sonner";
export const publicPages = [
  "categories",
  "jobs-by-location",
  "advertise",
  "about",
  "contact",
  "blog",
  "faq",
  "terms",
  "privacy",
  "login",
  "register",
  "forgot-password",
];
const pageCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  categories: {
    eyebrow: "FIND WHERE YOU BELONG",
    title: "A role for every hospitality passion.",
    description: "From the kitchen to the front desk, discover a career that feels like you.",
  },
  "jobs-by-location": {
    eyebrow: "OPPORTUNITIES, CLOSER TO HOME",
    title: "Your next chapter starts here.",
    description: "Explore hospitality careers across Maharashtra and the cities you love.",
  },
  advertise: {
    eyebrow: "GET NOTICED BY THE RIGHT PEOPLE",
    title: "Put your brand in good company.",
    description:
      "Reach a focused hospitality audience with thoughtful, beautifully placed campaigns.",
  },
  about: {
    eyebrow: "GREAT HOSPITALITY STARTS WITH PEOPLE",
    title: "Making room for better careers.",
    description:
      "We connect passionate professionals with hospitality teams who see their potential.",
  },
  contact: {
    eyebrow: "LET’S START A CONVERSATION",
    title: "Good things begin with hello.",
    description: "Have a hiring question, partnership idea or need a little help? We’re listening.",
  },
  blog: {
    eyebrow: "THE HOTELHIRE JOURNAL",
    title: "A little insight. A brighter future.",
    description:
      "Practical guidance for hospitality careers and the people building exceptional teams.",
  },
  faq: {
    eyebrow: "A LITTLE CLARITY GOES A LONG WAY",
    title: "Your questions, thoughtfully answered.",
    description: "Everything you need to know about the HotelHire demo experience.",
  },
  terms: {
    eyebrow: "CLEAR EXPECTATIONS",
    title: "Demo terms of use.",
    description: "Understand the scope of this prototype and its illustrative services.",
  },
  privacy: {
    eyebrow: "YOUR INFORMATION MATTERS",
    title: "Privacy, with people in mind.",
    description: "A clear explanation of how this demo handles the information you enter.",
  },
  login: {
    eyebrow: "YOUR NEXT CHAPTER",
    title: "Welcome back to HotelHire.",
    description: "Explore a workspace built around your hospitality journey.",
  },
  register: {
    eyebrow: "MAKE YOURSELF AT HOME",
    title: "Great opportunities begin here.",
    description: "Choose your demo role and discover what’s possible.",
  },
  "forgot-password": {
    eyebrow: "A FRESH START",
    title: "Let’s help you get back in.",
    description: "Password recovery will be available when secure authentication is connected.",
  },
};
export function PublicPage({ page }: { page: string }) {
  const copy = pageCopy[page]!;
  return (
    <Layout>
      <div className="page-intro">
        <div className="container">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <PublicBody page={page} />
        </div>
      </section>
    </Layout>
  );
}
const faqs = [
  [
    "Is HotelHire a live recruitment service?",
    "This is an interactive frontend prototype with fictional jobs, employers, profiles and billing records. It does not send real applications, collect payments or verify businesses.",
  ],
  [
    "How do I apply for a job?",
    "Browse opportunities, open a job and submit the demo application form. Your application appears in the Candidate workspace and in the Employer application pipeline.",
  ],
  [
    "Are candidate contact details public?",
    "Contact details are masked in recruiter screens. Production resume access and privacy controls require secure server-side authorisation.",
  ],
  [
    "Can I hire for multiple properties?",
    "The Employer workspace includes branches, team members, job postings and a shared hiring pipeline for demonstrating multi-property recruitment.",
  ],
  [
    "Do I need to pay to try a plan?",
    "No. Plan selection and billing records are illustrative. Selecting a plan never takes a payment.",
  ],
  [
    "Will my changes be saved?",
    "Demo changes remain in memory while you navigate. Refreshing the page starts a fresh session and restores sample data.",
  ],
  [
    "How do sponsored placements work?",
    "The Admin workspace lets you create, preview, edit, pause and resume sample campaigns. Public placements display active campaigns with sponsored labels. Sample analytics do not represent live tracking.",
  ],
  [
    "Can I upload a resume?",
    "The profile screen validates PDF, DOC and DOCX filenames and a maximum size of 5 MB. The demo stores the filename in memory; file contents are not uploaded.",
  ],
];
function PublicBody({ page }: { page: string }) {
  const d = useDemo();
  if (page === "categories")
    return (
      <>
        <div className="discovery-grid">
          {d.categories.map((c, i) => (
            <Link to="/jobs" search={{ department: c }} key={c} className="discovery-card">
              <span className={`discovery-icon discovery-tone-${i % 3}`}>
                <ChefHat size={24} />
              </span>
              <h2>{c}</h2>
              <p>
                {d.jobs.filter((j) => j.department === c && j.status === "Published").length} open
                opportunities <ArrowUpRight size={16} />
              </p>
            </Link>
          ))}
        </div>
        <SponsoredBanner placement="Category page" />
      </>
    );
  if (page === "jobs-by-location")
    return (
      <div className="discovery-grid">
        {d.locations.map((c, i) => (
          <Link to="/jobs" search={{ city: c }} key={c} className="location-card">
            <span className="location-number">{String(i + 1).padStart(2, "0")}</span>
            <MapPin size={27} />
            <h2>{c}</h2>
            <p>
              {d.jobs.filter((j) => j.city === c && j.status === "Published").length} opportunities{" "}
              <ArrowUpRight size={15} />
            </p>
          </Link>
        ))}
      </div>
    );
  if (page === "faq")
    return (
      <div className="faq-layout">
        <div>
          <span className="round-icon">
            <LifeIcon />
          </span>
          <h2>Here to make things easier.</h2>
          <p className="muted-copy">
            Need a hand with something else? Leave a demo enquiry and explore the support workflow.
          </p>
          <Button asChild variant="outline">
            <Link to="/$page" params={{ page: "contact" }}>
              Get in touch <ArrowUpRight size={15} />
            </Link>
          </Button>
        </div>
        <div>
          {[
            ...d.faqContent.map((f) => [f.question, f.answer]),
            ...faqs.filter(([q]) => !d.faqContent.some((f) => f.question === q)).slice(2),
          ].map(([q, a]) => (
            <details className="faq-item" key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    );
  if (page === "contact" || page === "advertise")
    return (
      <>
        <div className="public-two-col">
          <div>
            <div className="editorial-block">
              <span className="round-icon">{page === "advertise" ? <Megaphone /> : <Heart />}</span>
              <h2>
                {page === "advertise"
                  ? "A focused audience. A lasting impression."
                  : "People first. Always."}
              </h2>
              <p>
                {page === "advertise"
                  ? "Showcase your employer brand, spotlight an opportunity, or introduce a service to people who live and breathe hospitality."
                  : "Whether you’re taking your first step into hospitality or building a team across properties, we’re here to make the journey clearer."}
              </p>
            </div>
            <div className="contact-notes">
              {(page === "advertise"
                ? [
                    ["Homepage banners", "Prominent, responsive brand stories."],
                    ["Sponsored opportunities", "A little extra visibility for your next hire."],
                    [
                      "Featured employer profiles",
                      "Show people why your team is a great place to grow.",
                    ],
                  ]
                : [
                    ["For candidates", "Questions about profiles, applications or opportunities."],
                    ["For employers", "Hiring, subscriptions and recruitment workspaces."],
                    ["Partnerships", "Build something meaningful in hospitality."],
                  ]
              ).map(([t, p]) => (
                <div key={t}>
                  <Check size={17} />
                  <div>
                    <h3>{t}</h3>
                    <p>{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Panel
            title={page === "advertise" ? "Tell us about your campaign" : "Send a demo enquiry"}
            subtitle="This creates a local demo support record; no email is sent."
          >
            <Form
              fields={[
                { name: "name", label: "Your name" },
                { name: "email", label: "Email address", type: "email" },
                {
                  name: "subject",
                  label: page === "advertise" ? "Brand / campaign name" : "Subject",
                },
                {
                  name: "message",
                  label:
                    page === "advertise"
                      ? "Campaign goals, preferred placement & budget"
                      : "How can we help?",
                  type: "textarea",
                },
              ]}
              submit="Submit demo enquiry"
              onSave={(v) => {
                d.setTickets((old) => [
                  {
                    id: `ENQ-${uid().slice(0, 8)}`,
                    subject: `${page === "advertise" ? "Advertising: " : ""}${v["subject"]}`,
                    message: `${v["name"]} (${v["email"]}): ${v["message"]}`,
                    status: "Open",
                    priority: "Normal",
                  },
                  ...old,
                ]);
                d.log("New public demo enquiry received");
                toast.success("Demo enquiry created · View it in Admin enquiries");
              }}
            />
          </Panel>
        </div>
        {page === "advertise" && (
          <div className="advert-example">
            <span className="eyebrow">YOUR BRAND COULD BE HERE</span>
            <div className="employer-banner">
              <div>
                <span className="sponsored-label">SAMPLE SPONSORED PLACEMENT</span>
                <h2>Good people deserve great opportunities.</h2>
                <p>A purposeful message. A focused audience. An impression that lasts.</p>
              </div>
              <Megaphone size={55} />
            </div>
          </div>
        )}
      </>
    );
  if (page === "about")
    return (
      <>
        <div className="about-hero">
          <img src={teamImage} alt="Hospitality professionals working together" />
          <div>
            <span className="eyebrow">OUR PURPOSE</span>
            <h2>
              Behind every memorable stay,
              <br />
              there’s an extraordinary team.
            </h2>
            <p>
              Hospitality is built on people. The chef who remembers a guest’s favourite dish. The
              receptionist who makes a long journey feel worth it. The housekeeper whose care turns
              a room into a welcome.
            </p>
            <p>
              HotelHire Pro is designed to help those people find teams where they belong, and help
              businesses recognise the talent that makes them special.
            </p>
            <Button asChild>
              <Link to="/jobs">
                Find your next chapter <ArrowUpRight size={15} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="values-grid">
          {[
            [
              Heart,
              "People before everything",
              "Care, respect and thoughtful communication at every step.",
            ],
            [
              ShieldCheck,
              "Clarity builds trust",
              "Transparent opportunities, clearly marked demo data and privacy in mind.",
            ],
            [
              Users,
              "Room for everyone",
              "From first roles to leadership, across every hospitality department.",
            ],
          ].map(([Icon, t, p]) => {
            const I = Icon as typeof Heart;
            return (
              <article key={String(t)}>
                <I size={28} />
                <h3>{String(t)}</h3>
                <p>{String(p)}</p>
              </article>
            );
          })}
        </div>
      </>
    );
  if (page === "blog")
    return (
      <div className="journal-grid">
        {d.articles
          .filter((a) => a.status === "Published")
          .map((a, i) => (
            <Link to="/blog/$id" params={{ id: a.id }} key={a.id} className="journal-card">
              <div className={`journal-art journal-art-${i % 3}`}>
                <BookOpen size={52} />
                <span>THE HOTELHIRE JOURNAL</span>
              </div>
              <div>
                <span className="eyebrow">{a.category}</span>
                <h2>{a.title}</h2>
                <p>{a.summary.slice(0, 140)}</p>
                <small>
                  {a.readTime} min read <ArrowUpRight size={15} />
                </small>
              </div>
            </Link>
          ))}
      </div>
    );
  if (page === "login" || page === "register") return <DemoAuth register={page === "register"} />;
  if (page === "forgot-password")
    return (
      <div className="auth-card">
        <ShieldCheck size={30} />
        <h2>Demo accounts don’t use passwords.</h2>
        <p className="muted-copy">
          Choose a role on the demo sign-in screen to explore. No recovery email will be sent.
        </p>
        <Button asChild>
          <Link to="/$page" params={{ page: "login" }}>
            Back to demo sign-in
          </Link>
        </Button>
      </div>
    );
  return (
    <article className="legal-copy">
      {(page === "privacy"
        ? [
            [
              "About this demo",
              "HotelHire Pro is a frontend prototype. All seeded employers, candidates, jobs and transaction records are fictional.",
            ],
            [
              "Information you enter",
              "Forms use in-memory browser state. Changes are reset on refresh. The application does not intentionally persist recruitment form data to a database or browser storage. Use fictional information when exploring.",
            ],
            [
              "Resume handling",
              "Resume selection validates the extension and size locally. Only the filename is retained in memory; file contents are not uploaded.",
            ],
            [
              "External resources",
              "The interface loads its font from Google Fonts. External advertising links, when configured, may open third-party websites with their own policies.",
            ],
            [
              "Production privacy controls",
              "Secure authentication, consent records, data retention, deletion and authorised resume access must be implemented before using this prototype with real candidate data.",
            ],
          ]
        : [
            [
              "Demo service scope",
              "This prototype demonstrates hospitality recruitment workflows. It does not provide live vacancies, employment offers, verified employers or a recruitment service.",
            ],
            [
              "Accounts and permissions",
              "Role switching is a demo interaction. It does not authenticate users or enforce production access controls.",
            ],
            [
              "Subscriptions and payments",
              "Prices, credits, invoices and payment states are illustrative. Selecting a plan does not create a real contract or collect payment.",
            ],
            [
              "Content and advertising",
              "Sample campaigns and sponsored labels demonstrate placement behaviour. Analytics are fictional, and no real impressions or clicks are billed.",
            ],
            [
              "Before commercial use",
              "Final legal terms, privacy notices, secure backend services and operational policies need review and implementation before a production launch.",
            ],
          ]
      ).map(([h, p]) => (
        <section key={h}>
          <h2>{h}</h2>
          <p>{p}</p>
        </section>
      ))}
    </article>
  );
}
function LifeIcon() {
  return <Search />;
}
function DemoAuth({ register }: { register: boolean }) {
  const d = useDemo(),
    [role, setRole] = useState<Role>("Candidate");
  return (
    <div className="auth-layout">
      <div className="auth-story">
        <span className="eyebrow">BETTER TOGETHER</span>
        <h2>
          Your skills.
          <br />
          Your people.
          <br />
          <span>Your next chapter.</span>
        </h2>
        <p>A workspace for everyone who makes hospitality happen.</p>
        <div className="auth-benefits">
          {[
            "Explore meaningful hospitality opportunities",
            "Build a professional profile that tells your story",
            "Connect with teams who value your potential",
          ].map((t) => (
            <p key={t}>
              <Check size={16} />
              {t}
            </p>
          ))}
        </div>
      </div>
      <div className="auth-card">
        <span className="round-icon">
          <Building2 />
        </span>
        <h2>{register ? "Create a demo profile" : "Explore your demo workspace"}</h2>
        <p className="muted-copy">No password, OTP or real account is required.</p>
        <div className="auth-roles">
          {(["Candidate", "Employer", "Recruiter", "Admin"] as Role[]).map((r) => (
            <button key={r} className={r === role ? "selected" : ""} onClick={() => setRole(r)}>
              {r}
            </button>
          ))}
        </div>
        {register && (
          <p className="muted-copy">
            Your demo profile is available in the Candidate workspace. You can edit your name,
            experience and preferences there.
          </p>
        )}
        <Button className="w-full" asChild onClick={() => d.setRole(role)}>
          <Link to="/workspace" search={{ role, view: "overview" }}>
            Continue as {role}
            <ArrowUpRight size={16} />
          </Link>
        </Button>
        <span className="demo-note">Demo role switch · No real authentication</span>
        <Link
          className="auth-alternate"
          to="/$page"
          params={{ page: register ? "login" : "register" }}
        >
          {register
            ? "Already exploring? Sign in to the demo"
            : "New here? Explore demo registration"}
        </Link>
      </div>
    </div>
  );
}
export function CompanyDetails({ id }: { id: string }) {
  const d = useDemo(),
    c = d.companies.find((c) => c.id === id);
  if (!c)
    return (
      <Layout>
        <section className="section container">
          <Empty title="Employer unavailable" text="This employer is no longer part of the demo." />
        </section>
      </Layout>
    );
  const list = d.jobs.filter((j) => j.companyId === c.id && j.status === "Published");
  return (
    <Layout>
      <div className="company-detail-cover">
        <div className="container">
          <span className="eyebrow">A PLACE TO GROW</span>
          <h1>Great service. Greater possibilities.</h1>
          <Building2 size={90} />
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="company-profile-heading">
            <CompanyMark mark={c.mark} tone={c.tone} />
            <div>
              <h1>{c.name}</h1>
              <p>
                {c.type} · {c.city} <StatusLabel text={c.status} />
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                d.setFollowing((old) =>
                  old.includes(c.id) ? old.filter((x) => x !== c.id) : [...old, c.id],
                )
              }
            >
              {d.following.includes(c.id) ? "Following ✓" : "Follow employer"}
            </Button>
          </div>
          <div className="public-two-col">
            <article className="prose detail-main">
              <h2>People are at the heart of what we do.</h2>
              <p>{c.about}</p>
              <h2>Life at {c.name}</h2>
              <p>
                We believe in thoughtful service, supportive teams and the chance to grow. Our
                people bring a range of skills, perspectives and passions to every guest experience.
              </p>
              <h2>Benefits that make a difference</h2>
              <div className="tag-row">
                {[
                  "Meals provided",
                  "Learning & development",
                  "Supportive teams",
                  "Career progression",
                ].map((b) => (
                  <StatusLabel key={b} text={b} />
                ))}
              </div>
              <h2>Our locations</h2>
              <p>{c.city} · Explore individual vacancies for role-specific workplace details.</p>
              <p className="demo-note">
                Fictional employer profile. Verification and benefits are illustrative.
              </p>
            </article>
            <div>
              <Panel title="At a glance">
                <div className="company-at-glance">
                  <p>
                    Business type<strong>{c.type}</strong>
                  </p>
                  <p>
                    Location<strong>{c.city}</strong>
                  </p>
                  <p>
                    Open roles<strong>{list.length}</strong>
                  </p>
                  <p>
                    Contact policy<strong>Apply through HotelHire</strong>
                  </p>
                </div>
              </Panel>
            </div>
          </div>
          <div className="section-heading mt-8">
            <div>
              <h2>Find your place on the team.</h2>
              <p>{list.length} open opportunities</p>
            </div>
          </div>
          <div className="jobs-grid">
            {list.map((j) => (
              <JobCard job={j} key={j.id} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
function StatusLabel({ text }: { text: string }) {
  return <span className="status-pill">{text}</span>;
}
export function ArticleDetails({ id }: { id: string }) {
  const d = useDemo(),
    a = d.articles.find((a) => a.id === id && a.status === "Published");
  return (
    <Layout>
      <section className="section">
        <div className="container article-detail">
          {a ? (
            <>
              <Link to="/$page" params={{ page: "blog" }} className="back-link">
                ← Back to the journal
              </Link>
              <span className="eyebrow">{a.category}</span>
              <h1>{a.title}</h1>
              <p className="article-byline">
                HotelHire editorial team · {a.date} · {a.readTime} min read
              </p>
              <div className="article-visual">
                <BookOpen size={75} />
              </div>
              <div className="prose">
                <p>{a.summary}</p>
                <h2>Start with what makes you valuable.</h2>
                <p>
                  Hospitality teams look for people who care about the guest experience and the
                  colleagues around them. Describe your responsibilities with specific examples: the
                  team you supported, the service you improved, and what you learned along the way.
                </p>
                <h2>Prepare for a thoughtful conversation.</h2>
                <p>
                  Learn about the employer and the role. Think about your preferred shift, location,
                  expected salary and joining availability. Ask clear questions about
                  responsibilities, training, meals, accommodation and weekly time off.
                </p>
                <h2>Take the next step with confidence.</h2>
                <p>
                  Keep your professional profile current, choose opportunities that fit your goals,
                  and follow up respectfully. A career in hospitality grows one good experience at a
                  time.
                </p>
                <p className="demo-note">
                  Illustrative editorial content for the HotelHire prototype.
                </p>
              </div>
              <Button asChild>
                <Link to="/jobs">
                  Explore opportunities <ArrowUpRight size={15} />
                </Link>
              </Button>
            </>
          ) : (
            <Empty
              title="Article unavailable"
              text="This article may be a draft or no longer published."
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
export function SponsoredBanner({ placement }: { placement: string }) {
  const d = useDemo();
  const today = new Date().toISOString().slice(0, 10);
  const c = d.campaigns
    .filter(
      (c) =>
        c.placement === placement && c.status === "Active" && c.start <= today && c.end >= today,
    )
    .sort((a, b) => a.priority - b.priority)[0];
  if (!c) return null;
  return (
    <aside className="public-sponsored">
      {c.image && <img className="banner-creative" src={c.image} alt={`${c.sponsor} campaign`} />}
      <div>
        <span className="sponsored-label">SPONSORED · {c.sponsor}</span>
        <h2>{c.title}</h2>
        <p>{c.subtitle}</p>
      </div>
      {c.url.startsWith("https://") ? (
        <a href={c.url} className="sponsored-cta" target="_blank" rel="noopener noreferrer">
          {c.cta}
          <ArrowUpRight size={16} />
        </a>
      ) : (
        <Link to={c.url as "/jobs"} className="sponsored-cta">
          {c.cta}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </aside>
  );
}
