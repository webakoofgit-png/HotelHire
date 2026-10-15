import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/hotelhire/platform";
import { useDemo } from "@/lib/demo-store";
export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Employer Plans & Pricing — HotelHire Pro" },
      {
        name: "description",
        content:
          "Compare illustrative recruitment plans for independent hotels and multi-property hospitality teams.",
      },
      { property: "og:title", content: "Employer Plans — HotelHire Pro" },
      {
        property: "og:description",
        content: "The right hiring tools for your hospitality business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});
function Pricing() {
  const { plans, setPlan, log } = useDemo();
  const [selected, setSelected] = useState("");
  return (
    <Layout>
      <div className="page-intro">
        <div className="container text-center">
          <span className="eyebrow">INVEST IN GREAT PEOPLE</span>
          <h1>Better hiring. The right plan.</h1>
          <p>Whether you run one café or a collection of hotels, find a plan that fits.</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="notice">
            Illustrative monthly plans. No payment will be taken. Final pricing and applicable taxes
            are to be confirmed.
          </div>
          <div className="plans-grid">
            {plans.map((p) => (
              <article key={p.name} className={`plan-card ${p.popular ? "popular" : ""}`}>
                {p.popular && <span className="plan-badge">MOST POPULAR</span>}
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <div className="plan-price">
                  {p.price === "Custom" ? "Let’s talk" : `₹${p.price}`}
                  <span>{p.price === "Custom" ? "" : " / month"}</span>
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
                  variant={p.popular ? "default" : "outline"}
                  onClick={() => {
                    setSelected(p.name);
                    setPlan(p.name);
                    log(`Selected demo plan ${p.name}`);
                  }}
                >
                  {p.price === "Custom" ? "Contact sales" : "Choose plan"}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
      {selected && (
        <div className="modal-overlay">
          <div className="modal" role="dialog" aria-modal="true" aria-label="Plan selected">
            <div className="modal-header">
              <CheckCircle2 className="text-primary" />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close plan selection"
                onClick={() => setSelected("")}
              >
                <X />
              </Button>
            </div>
            <h2 className="mt-4">{selected} selected</h2>
            <p className="demo-note">
              This is a demo plan selection. Payments are not connected and you haven’t been
              charged.
            </p>
            <Button asChild className="mt-5">
              <Link to="/workspace">Explore the hiring workspace</Link>
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
