import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";
export function HomeExtras() {
  const d = useDemo();
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A BETTER WAY FORWARD</span>
              <h2>Your next chapter, in three steps.</h2>
              <p>A little clarity at every stage of your hospitality journey.</p>
            </div>
            <Link to="/$page" params={{ page: "register" }}>
              Create a demo profile <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="home-how">
            {[
              [
                "01",
                "Tell your story",
                "Build a profile around your experience, skills and the role you want next.",
              ],
              [
                "02",
                "Find your people",
                "Explore opportunities by location, department, salary and the things that matter to you.",
              ],
              [
                "03",
                "Take the next step",
                "Apply, follow your progress and prepare for a thoughtful conversation.",
              ],
            ].map(([n, t, p]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
          <div className="section-heading mt-10">
            <div>
              <span className="eyebrow">HOSPITALITY, EVERYWHERE</span>
              <h2>A career in a city you love.</h2>
            </div>
            <Link to="/$page" params={{ page: "jobs-by-location" }}>
              Explore all locations <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="filter-tabs">
            {["Pune", "Mumbai", "Goa", "Lonavala", "Nashik", "Bengaluru"].map((city) => (
              <Button variant="outline" asChild key={city}>
                <Link to="/jobs" search={{ city }}>
                  {city} ·{" "}
                  {d.jobs.filter((j) => j.city === city && j.status === "Published").length}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
      <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ROOM FOR YOUR TEAM TO GROW</span>
              <h2>Better hiring starts with the right plan.</h2>
              <p>From independent cafés to hospitality groups.</p>
            </div>
            <Link to="/pricing">
              Compare all plans <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="plans-grid">
            {d.plans.map((p) => (
              <article key={p.name} className="plan-card">
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <div className="plan-price">
                  {p.price === "Custom" ? "Let’s talk" : `₹${p.price}`}
                  <span> / month</span>
                </div>
                <ul>
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f}>
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" asChild>
                  <Link to="/pricing">Explore plan</Link>
                </Button>
              </article>
            ))}
          </div>
          <span className="demo-note">Illustrative pricing · No payment taken</span>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A LITTLE CLARITY</span>
              <h2>Good questions. Helpful answers.</h2>
            </div>
            <Link to="/$page" params={{ page: "faq" }}>
              All FAQs <ArrowUpRight size={15} />
            </Link>
          </div>
          {[
            [
              "Is this a live job portal?",
              "This is an interactive demo using fictional records. Applications are added to the shared demo workspace; they are not sent to real employers.",
            ],
            [
              "Can I try the employer tools?",
              "Yes. Open My workspace and choose Employer or Recruiter to try job posting, applicant management and interview scheduling.",
            ],
            [
              "Will selecting a plan charge me?",
              "No. Subscription plans, credits and billing records are illustrative. No payment gateway is connected.",
            ],
          ].map(([q, a]) => (
            <details key={q} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="section featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE PEOPLE BEHIND HOSPITALITY</span>
              <h2>Good connections make a difference.</h2>
              <p>Illustrative candidate and employer stories.</p>
            </div>
          </div>
          <div className="testimonial-grid">
            {d.testimonials.map((t) => (
              <blockquote key={t.id}>
                <span className="quote-mark">“</span>
                <p>{t.quote}</p>
                <footer>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
      <section className="newsletter">
        <div className="container">
          <div>
            <h2>A little inspiration for your next chapter.</h2>
            <p>Explore career guidance and hospitality opportunities. Demo signup only.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
            }}
          >
            <input
              type="email"
              aria-label="Newsletter email"
              required
              placeholder="Your email address"
              disabled={subscribed}
            />
            <Button type="submit" disabled={subscribed}>
              {subscribed ? "Demo signup noted ✓" : "Join the demo list"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
