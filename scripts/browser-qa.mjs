// Uses an already launched local Chromium DevTools endpoint; no browser package required.
import { mkdir, writeFile } from "node:fs/promises";
const base = "http://127.0.0.1:4175";
const tabs = await fetch("http://127.0.0.1:9333/json").then((r) => r.json());
const tab = tabs.find((t) => t.type === "page");
if (!tab) throw new Error("Launch a local Chromium page with remote debugging on port 9333.");
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});
let seq = 0;
const pending = new Map(),
  errors = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id) {
    const p = pending.get(m.id);
    pending.delete(m.id);
    m.error ? p?.reject(new Error(JSON.stringify(m.error))) : p?.resolve(m.result);
  }
  if (m.method === "Runtime.exceptionThrown")
    errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
await send("Page.enable");
await send("Runtime.enable");
const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails)
    throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
};
async function until(expression, timeout = 25000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await evaluate(expression)) return;
    await new Promise((r) => setTimeout(r, 180));
  }
  throw new Error(`Timed out: ${expression}`);
}
async function visit(path, text) {
  await send("Page.navigate", { url: base + path });
  await until(`document.body && document.body.innerText.includes(${JSON.stringify(text)})`);
  await until(
    `Array.from(document.querySelectorAll('button')).some(b=>Object.keys(b).some(k=>k.startsWith('__reactProps')))`,
    45000,
  );
  await new Promise((r) => setTimeout(r, 350));
}
async function click(text) {
  const ok = await evaluate(
    `(()=>{const b=Array.from(document.querySelectorAll('button,a')).find(b=>(b.textContent.trim()===${JSON.stringify(text)}||b.getAttribute("aria-label")===${JSON.stringify(text)}));if(!b)return false;b.click();return true;})()`,
  );
  if (!ok) throw new Error(`Missing clickable control: ${text}`);
  await new Promise((r) => setTimeout(r, 180));
}
async function fill(selector, value) {
  await until(`!!document.querySelector(${JSON.stringify(selector)})`);
  await evaluate(
    `(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw new Error('Missing input');const setter=Object.getOwnPropertyDescriptor(el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set;setter.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`,
  );
}
async function screenshot(name) {
  await mkdir("artifacts", { recursive: true });
  const image = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  await writeFile(`artifacts/${name}.png`, Buffer.from(image.data, "base64"));
}
const results = [];
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1050,
  deviceScaleFactor: 1,
  mobile: false,
});
await visit("/workspace?role=Employer&view=overview", "Let’s build an exceptional team.");
await screenshot("employer-desktop");
await click("Post a job");
await until(`document.body.innerText.includes('Create vacancy')`);
await click("Create vacancy");
await fill('input[name="title"]', "QA Tandoor Chef");
await fill(
  'textarea[name="description"]',
  "Lead a thoughtful kitchen team and deliver memorable meals.",
);
await click("Continue");
await until(`!!document.querySelector('input[name="salaryMin"]')`);
await fill('input[name="salaryMin"]', "31000");
await fill('input[name="salaryMax"]', "43000");
await click("Continue");
await until(`document.body.innerText.includes('VACANCY PREVIEW')`);
await click("Save vacancy");
await until(`!document.querySelector('[role="dialog"]')`);
await until(`document.body.innerText.includes('QA Tandoor Chef')`);
results.push("Multi-step job creation retains title and salary");
await click("Back to website");
await until(`document.body.innerText.includes('Great hospitality.')`);
await evaluate(`document.querySelector('a[href^="/jobs"]').click()`);
await until(`document.body.innerText.includes('opportunities found')`);
await fill('input[aria-label="Search jobs"]', "QA Tandoor Chef");
await click("Search jobs");
await until(`document.querySelector('.result-toolbar').innerText.includes('1 opportunities')`);
await evaluate(`document.querySelector('.job-title').click()`);
await until(`document.body.innerText.includes('31,000')`);
await fill("#app-email", "candidate@hotelhire.demo");
await fill("#app-phone", "9999999999");
await click("Submit demo application");
await until(`document.body.innerText.includes('Your demo application is in.')`);
await click("Track application");
await until(`document.body.innerText.includes('QA Tandoor Chef')`);
results.push("Published job appears in search; application appears in Candidate tracker");
await click("Employer");
await click("All applicants");
await fill('input[aria-label="Search applications"]', "Aarav Deshmukh");
await until(`document.body.innerText.includes('Aarav Deshmukh')`);
await screenshot("applications-desktop");
results.push("Candidate application visible in shared employer workspace");
const pages = [
  ["/", "Great hospitality."],
  ["/jobs", "opportunities found"],
  ["/companies", "Find a company you’ll"],
  ["/companies/company-1", "The Grand Orchid"],
  ["/categories", "A role for every"],
  ["/jobs-by-location", "Your next chapter starts"],
  ["/about", "Making room"],
  ["/contact", "Good things begin"],
  ["/advertise", "Put your brand"],
  ["/blog", "A little insight"],
  ["/blog/article-1", "hospitality CV"],
  ["/faq", "Your questions"],
  ["/terms", "Demo terms"],
  ["/privacy", "Privacy, with people"],
  ["/login", "Welcome back"],
  ["/register", "Great opportunities"],
  ["/pricing", "Better hiring."],
  ["/candidate/dashboard", "Good morning"],
  ["/employer/hiring-pipeline", "From first hello"],
  ["/admin/advertisements", "Campaigns that make"],
  ["/admin/plans", "Subscription overview"],
  ["/admin/payments", "Payments & invoices"],
];
for (const [path, text] of pages) {
  await visit(path, text);
  const overflow = await evaluate("document.documentElement.scrollWidth > innerWidth+1");
  if (overflow) throw new Error(`Desktop overflow on ${path}`);
  results.push(`Desktop smoke: ${path}`);
}
await visit("/admin/dashboard", "Your platform, at a glance.");
await screenshot("admin-desktop");
const modules = {
  Candidate: [
    "profile",
    "applications",
    "saved-jobs",
    "recommendations",
    "alerts",
    "interviews",
    "messages",
    "notifications",
    "settings",
    "support",
  ],
  Employer: [
    "company-profile",
    "branches",
    "jobs",
    "applications",
    "candidates",
    "saved-candidates",
    "pipeline",
    "interviews",
    "team",
    "subscription",
    "billing",
    "promotions",
    "analytics",
    "messages",
    "notifications",
    "settings",
    "support",
  ],
  Admin: [
    "employers",
    "candidates",
    "team",
    "jobs",
    "applications",
    "interviews",
    "categories",
    "plans",
    "billing",
    "advertisements",
    "placements",
    "promotions",
    "content",
    "enquiries",
    "analytics",
    "audit",
    "messages",
    "notifications",
    "settings",
  ],
  Recruiter: ["overview", "jobs", "candidates", "pipeline", "interviews"],
};
for (const [role, views] of Object.entries(modules))
  for (const view of views) {
    await visit(`/workspace?role=${role}&view=${view}`, "Interactive demo");
    if (!(await evaluate(`!!document.querySelector('.desk-panel,.desk-plans')`)))
      throw new Error(`Empty module ${role}/${view}`);
    if (await evaluate("document.documentElement.scrollWidth>innerWidth+1"))
      throw new Error(`Module overflow ${role}/${view}`);
    results.push(`Module smoke: ${role}/${view}`);
  }
await visit("/admin/plans", "Subscription overview");
await click("Edit plan");
await fill('input[name="price"]', "199");
await click("Save changes");
await until(`!document.querySelector('[role="dialog"]')`);
await click("Back to website");
await until(`document.body.innerText.includes('Great hospitality.')`);
await click("Pricing");
await until(`document.querySelector('.plan-price')?.textContent.includes('199')`);
results.push("Admin plan edit updates public pricing without losing state");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
for (const [path, text] of [
  ["/", "Great hospitality."],
  ["/jobs", "opportunities found"],
  ["/jobs/job-1", "Your next chapter starts"],
  ["/candidate/dashboard", "Good morning"],
  ["/admin/advertisements", "Campaigns that make"],
  ["/pricing", "Better hiring."],
]) {
  await visit(path, text);
  if (await evaluate("document.documentElement.scrollWidth>innerWidth+1"))
    throw new Error(`Mobile overflow on ${path}`);
  results.push(`Mobile smoke: ${path}`);
}
await visit("/candidate/dashboard", "Good morning");
await screenshot("candidate-mobile");
await click("Open workspace navigation");
await until(`document.querySelector('.desk-sidebar-open')!==null`);
await click("My profile & resume");
await until(`document.body.innerText.includes('Tell your hospitality story')`);
results.push("Mobile sidebar opens and navigates");
await visit("/jobs", "opportunities found");
await click("Filters");
await until(`!!document.querySelector('.filters-open')`);
await screenshot("mobile-filters");
await click("Show 80 jobs");
results.push("Mobile filter drawer opens and closes");
for (const width of [360, 375, 768, 1024, 1280]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await visit("/workspace?role=Admin&view=advertisements", "Campaigns that make");
  if (await evaluate("document.documentElement.scrollWidth>innerWidth+1"))
    throw new Error(`Overflow at ${width}px`);
  results.push(`Responsive admin at ${width}px`);
}
await writeFile("artifacts/qa-results.json", JSON.stringify({ results, errors }, null, 2));
console.log(JSON.stringify({ passed: results.length, errors, results }, null, 2));
ws.close();
if (errors.length) process.exitCode = 1;
