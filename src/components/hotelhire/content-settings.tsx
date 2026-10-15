import { useState } from "react";
import { useDemo, uid } from "@/lib/demo-store";
import { Panel, Form, Modal, AddButton, DataGrid } from "./workspace-ui";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export function ContentSettings() {
  const d = useDemo(),
    [tab, setTab] = useState("Website"),
    [edit, setEdit] = useState<string | true | null>(null);
  return (
    <Panel
      title="Your brand, thoughtfully expressed"
      subtitle="Changes appear on the public website for this demo session"
    >
      <div className="filter-tabs">
        {["Website", "FAQs", "Testimonials"].map((t) => (
          <Button
            variant={tab === t ? "default" : "outline"}
            key={t}
            onClick={() => {
              setTab(t);
              setEdit(null);
            }}
          >
            {t}
          </Button>
        ))}
      </div>
      {tab === "Website" ? (
        <Form
          fields={[
            { name: "heroLead", label: "Homepage opening line", value: d.website.heroLead },
            { name: "heroAccent", label: "Homepage accent headline", value: d.website.heroAccent },
            {
              name: "tagline",
              label: "Homepage supporting text",
              type: "textarea",
              value: d.website.tagline,
            },
          ]}
          onSave={(v) => {
            d.setWebsite({
              heroLead: v["heroLead"]!,
              heroAccent: v["heroAccent"]!,
              tagline: v["tagline"]!,
            });
            d.log("Updated homepage content");
            toast.success("Homepage content updated");
          }}
        />
      ) : tab === "FAQs" ? (
        <>
          <AddButton onClick={() => setEdit(true)}>Add FAQ</AddButton>
          <DataGrid
            rows={d.faqContent}
            title="FAQs"
            searchText={(f) => f.question}
            columns={[
              { label: "Question", render: (f) => f.question },
              {
                label: "Actions",
                render: (f) => (
                  <div className="table-actions">
                    <Button variant="outline" size="sm" onClick={() => setEdit(f.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        d.setFaqContent((old) => old.filter((x) => x.id !== f.id));
                        d.log("FAQ removed");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </>
      ) : (
        <>
          <AddButton onClick={() => setEdit(true)}>Add testimonial</AddButton>
          <DataGrid
            rows={d.testimonials}
            title="testimonials"
            searchText={(t) => `${t.name} ${t.quote}`}
            columns={[
              { label: "Person", render: (t) => t.name },
              { label: "Story", render: (t) => t.quote },
              {
                label: "Actions",
                render: (t) => (
                  <div className="table-actions">
                    <Button size="sm" variant="outline" onClick={() => setEdit(t.id)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        d.setTestimonials((old) => old.filter((x) => x.id !== t.id));
                        d.log("Testimonial removed");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </>
      )}
      <Modal
        open={edit !== null}
        title={tab === "FAQs" ? "Edit FAQ" : "Edit testimonial"}
        onClose={() => setEdit(null)}
      >
        {tab === "FAQs" ? (
          <Form
            key={String(edit)}
            fields={[
              {
                name: "question",
                label: "Question",
                value: d.faqContent.find((x) => x.id === edit)?.question ?? "",
              },
              {
                name: "answer",
                label: "Answer",
                type: "textarea",
                value: d.faqContent.find((x) => x.id === edit)?.answer ?? "",
              },
            ]}
            onSave={(v) => {
              const f = {
                id: edit === true ? uid() : String(edit),
                question: v["question"]!,
                answer: v["answer"]!,
              };
              d.setFaqContent((old) =>
                old.some((x) => x.id === f.id)
                  ? old.map((x) => (x.id === f.id ? f : x))
                  : [...old, f],
              );
              d.log("FAQ content saved");
              setEdit(null);
            }}
          />
        ) : (
          <Form
            key={String(edit)}
            fields={[
              {
                name: "name",
                label: "Display name",
                value: d.testimonials.find((x) => x.id === edit)?.name ?? "",
              },
              {
                name: "role",
                label: "Role / fictional attribution",
                value: d.testimonials.find((x) => x.id === edit)?.role ?? "",
              },
              {
                name: "quote",
                label: "Testimonial",
                type: "textarea",
                value: d.testimonials.find((x) => x.id === edit)?.quote ?? "",
              },
            ]}
            onSave={(v) => {
              const t = {
                id: edit === true ? uid() : String(edit),
                name: v["name"]!,
                role: v["role"]!,
                quote: v["quote"]!,
              };
              d.setTestimonials((old) =>
                old.some((x) => x.id === t.id)
                  ? old.map((x) => (x.id === t.id ? t : x))
                  : [...old, t],
              );
              d.log("Testimonial saved");
              setEdit(null);
            }}
          />
        )}
      </Modal>
    </Panel>
  );
}
export function TaxonomyManager() {
  const d = useDemo(),
    [kind, setKind] = useState<"Category" | "Location" | null>(null);
  return (
    <>
      <div className="dashboard-columns">
        <Panel
          title="Hospitality departments"
          subtitle="The roles that make hospitality happen"
          action={<AddButton onClick={() => setKind("Category")}>Add category</AddButton>}
        >
          {d.categories.map((c) => (
            <div className="taxonomy-row" key={c}>
              <strong>{c}</strong>
              <span className="status-pill">
                {d.jobs.filter((j) => j.department === c).length} jobs
              </span>
            </div>
          ))}
        </Panel>
        <Panel
          title="Our hiring locations"
          subtitle="Maharashtra first. Opportunities across India."
          action={<AddButton onClick={() => setKind("Location")}>Add city</AddButton>}
        >
          {d.locations.map((c) => (
            <div className="taxonomy-row" key={c}>
              <strong>{c}</strong>
              <span className="status-pill">{d.jobs.filter((j) => j.city === c).length} jobs</span>
            </div>
          ))}
        </Panel>
      </div>
      <Modal open={!!kind} title={`Add ${kind?.toLowerCase() ?? ""}`} onClose={() => setKind(null)}>
        <Form
          fields={[{ name: "name", label: kind === "Category" ? "Department name" : "City name" }]}
          onSave={(v) => {
            const name = v["name"]!.trim();
            if (!name) return;
            const values = kind === "Category" ? d.categories : d.locations;
            if (values.some((x) => x.toLowerCase() === name.toLowerCase())) {
              toast.error("This entry already exists");
              return;
            }
            if (kind === "Category") d.setCategories((old) => [...old, name]);
            else d.setLocations((old) => [...old, name]);
            d.log(`Added ${kind?.toLowerCase()}: ${name}`);
            setKind(null);
          }}
        />
      </Modal>
    </>
  );
}
