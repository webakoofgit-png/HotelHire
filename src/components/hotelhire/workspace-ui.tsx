import { useState, type ReactNode } from "react";
import { ArrowDownToLine, Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
export function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="desk-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Status({ children }: { children: ReactNode }) {
  const text = String(children);
  return (
    <span
      className={`status-pill ${/Rejected|Failed|Suspended|Cancelled/.test(text) ? "status-danger" : /Pending|Applied|Draft|Paused|Screening/.test(text) ? "status-amber" : ""}`}
    >
      {children}
    </span>
  );
}
export function Empty({
  title = "Nothing here yet",
  text = "Your next action will appear here.",
  action,
}: {
  title?: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-art">✦</span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
export function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <article className="stat">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{hint ?? "Live demo activity"}</span>
    </article>
  );
}
export function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="desk-modal">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Demo workspace · Changes remain in memory until refresh.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
export type Field = {
  name: string;
  label: string;
  type?: string;
  options?: string[];
  value?: string | number;
  required?: boolean;
  min?: number;
  max?: number;
  help?: string;
};
export function Form({
  fields,
  onSave,
  submit = "Save changes",
  children,
}: {
  fields: Field[];
  onSave: (data: Record<string, string>) => void;
  submit?: string;
  children?: ReactNode;
}) {
  return (
    <form
      className="desk-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(
          Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>,
        );
      }}
    >
      <div className="form-grid">
        {fields.map((f) => (
          <label key={f.name} className={f.type === "textarea" ? "field-wide" : ""}>
            <span>
              {f.label}
              {f.required !== false && " *"}
            </span>
            {f.options ? (
              <select name={f.name} defaultValue={f.value} required={f.required !== false}>
                {f.options.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                name={f.name}
                rows={4}
                defaultValue={f.value}
                required={f.required !== false}
              />
            ) : (
              <input
                name={f.name}
                type={f.type ?? "text"}
                defaultValue={f.value}
                required={f.required !== false}
                min={f.min}
                max={f.max}
                maxLength={f.type === "number" ? undefined : 2000}
              />
            )}{" "}
            {f.help && <small>{f.help}</small>}
          </label>
        ))}
      </div>
      {children}
      <div className="form-actions">
        <Button type="submit">{submit}</Button>
        <span>Demo only · No external request is sent</span>
      </div>
    </form>
  );
}
export function exportCsv(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]!);
  const cell = (value: unknown) => {
    const s = String(value ?? "");
    return '"' + (/^[=+\-@\t\r]/.test(s) ? "'" : "") + s.replaceAll('"', '""') + '"';
  };
  const blob = new Blob(
    [
      "\uFEFF" +
        [keys.map(cell).join(","), ...rows.map((r) => keys.map((k) => cell(r[k])).join(","))].join(
          "\r\n",
        ),
    ],
    { type: "text/csv;charset=utf-8;" },
  );
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = `${name}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function DataGrid<T>({
  rows,
  columns,
  searchText,
  title = "records",
  exportRows,
}: {
  rows: T[];
  columns: { label: string; render: (row: T) => ReactNode }[];
  searchText: (row: T) => string;
  title?: string;
  exportRows?: Record<string, unknown>[];
}) {
  const [q, setQ] = useState(""),
    [page, setPage] = useState(1);
  const filtered = rows.filter((r) => searchText(r).toLowerCase().includes(q.toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 10)),
    current = Math.min(page, pages);
  return (
    <>
      <div className="grid-toolbar">
        <label className="desk-search">
          <Search size={16} />
          <input
            aria-label={`Search ${title}`}
            placeholder={`Search ${title}…`}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </label>
        {exportRows && (
          <Button size="sm" variant="outline" onClick={() => exportCsv(title, exportRows)}>
            <ArrowDownToLine size={14} />
            Export CSV
          </Button>
        )}
      </div>
      {filtered.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.label}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice((current - 1) * 10, current * 10).map((r, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c.label}>{c.render(r)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title="No matching records" text="Try another name, location or keyword." />
      )}
      <div className="grid-pagination">
        <span>
          {filtered.length} {title} · Page {current} of {pages}
        </span>
        <div>
          <Button
            size="icon"
            variant="outline"
            aria-label="Previous page"
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft size={15} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Next page"
            disabled={current === pages}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight size={15} />
          </Button>
        </div>
      </div>
    </>
  );
}
export const AddButton = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
  <Button size="sm" onClick={onClick}>
    <Plus size={15} />
    {children}
  </Button>
);
