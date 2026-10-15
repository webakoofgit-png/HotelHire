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
await visit("/companies", "Find a company you’ll");
await until(`document.querySelectorAll('.directory-company-card').length===9`);
await screenshot("companies-desktop");
results.push("Desktop: category tiles, filters and nine company cards render");
await evaluate(`document.querySelector('[aria-label="Next companies page"]').click()`);
await until(
  `document.querySelector('.company-pagination [aria-current="page"]').textContent==='2'`,
);
results.push("Pagination changes result cards");
await evaluate(
  `Array.from(document.querySelectorAll('.company-filter-sidebar .directory-filter-options label')).find(l=>l.querySelector('span')?.textContent==='Hotels').querySelector('input').click()`,
);
await until(`document.querySelectorAll('.directory-company-card').length===4`);
results.push("Business type filter works and resets pagination");
await evaluate(`document.querySelector('.clear-directory-filters').click()`);
await until(`document.querySelectorAll('.directory-company-card').length===9`);
await evaluate(
  `Array.from(document.querySelectorAll('.company-category-tile')).find(b=>b.innerText.includes('Resorts')).click()`,
);
await until(`document.querySelectorAll('.directory-company-card').length===4`);
results.push("Top category tiles filter the directory");
await evaluate(`document.querySelector('.clear-directory-filters').click()`);
await evaluate(`document.querySelector('.company-follow').click()`);
await click("Following1");
await until(`document.querySelectorAll('.directory-company-card').length===1`);
results.push("Following collection reflects saved employers");
await click("All companies");
await fill('[aria-label="Search companies"]', "Blue Horizon");
await until(`document.querySelectorAll('.directory-company-card').length===3`);
results.push("Search matches companies across locations");
await evaluate(
  `(()=>{const s=document.querySelector('[aria-label="Sort companies"]');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'rating');s.dispatchEvent(new Event('change',{bubbles:true}));})()`,
);
results.push("Company sorting control works");
await fill('[aria-label="Search companies"]', "No matching employer xyz");
await until(`!!document.querySelector('.company-directory-empty')`);
await click("Explore all companies");
await until(`document.querySelectorAll('.directory-company-card').length===9`);
results.push("Empty state and clear filters restore results");
await evaluate(`document.querySelector('.directory-company-name').click()`);
await until(`!!document.querySelector('.company-profile-heading')`);
results.push("Company card opens existing company profile");
for (const width of [360, 375, 390, 768, 1024, 1280, 1440]) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1050,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await visit("/companies", "Find a company you’ll");
  if (await evaluate("document.documentElement.scrollWidth>innerWidth+1"))
    throw new Error(`Company page overflow at ${width}px`);
  if (width === 390) {
    await screenshot("companies-mobile");
    await click("All filters");
    await until(`!!document.querySelector('[role="dialog"]')`);
    await screenshot("companies-mobile-filters");
    await evaluate(
      `Array.from(document.querySelectorAll('[role="dialog"] label')).find(l=>l.querySelector('span')?.textContent==='Hotels').querySelector('input').click()`,
    );
    await until(`document.querySelector('.company-filter-apply')?.textContent.includes('4')`);
    await click("Show 4 companies");
    await until(`!document.querySelector('[role="dialog"]')`);
    if ((await evaluate(`document.querySelectorAll('.directory-company-card').length`)) !== 4)
      throw new Error("Mobile filtering did not update results");
    results.push("Mobile drawer filters and closes correctly");
  }
  results.push(`Responsive company directory: ${width}px`);
}
await writeFile(
  "artifacts/company-qa-results.json",
  JSON.stringify({ passed: results.length, results, errors }, null, 2),
);
console.log(JSON.stringify({ passed: results.length, results, errors }, null, 2));
ws.close();
if (errors.length) process.exitCode = 1;
