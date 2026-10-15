# HotelHire Pro implementation

The application uses React, Vite, React Router and TypeScript. The semantic tokens and HotelHire public layout are retained. This is a frontend demonstration with fictional recruitment records and shared in-memory state.

## Entry points

- `/`: public homepage, search, categories, employers, locations, plans, FAQs, testimonials and newsletter demonstration.
- `/jobs`: searchable, filterable, sortable and paginated job discovery; grid/list modes and a mobile filter drawer.
- `/jobs/job-1`: role details, save, apply, share and report actions; mobile apply bar.
- `/companies` and `/companies/company-1`: employer discovery and profiles with follow actions and linked vacancies.
- `/categories`, `/jobs-by-location`, `/advertise`, `/about`, `/contact`, `/blog`, `/blog/article-1`, `/faq`, `/terms`, `/privacy`: public discovery, editorial and information pages.
- `/login`, `/register`, `/forgot-password`: clearly labelled demo account entry screens, without credentials or real authentication.
- `/workspace`: role switching and view navigation through validated query parameters.
- `/candidate/dashboard`, `/employer/dashboard`, `/recruiter/dashboard`, `/admin/dashboard`: direct role entry points.

## Workspaces

Candidate: dashboard, profile and resume filename validation, applications, saved jobs, explained deterministic job matching, alert preferences, linked interviews, demo messages, notifications, settings and support. Mobile shortcuts provide direct access to the dashboard, applications, saved jobs and profile.

Employer/Recruiter: hiring overview, company profile, properties, a three-step job editor, applicant management with notes, searchable candidate database, saved candidates, drag-and-drop pipeline with confirmation and a select alternative, interview scheduling/rescheduling/feedback, team membership, subscription selection, plan usage, invoice records, featured jobs, reports, CSV export, messages, notifications, settings and support. Recruiter navigation excludes owner billing and team management.

Admin: platform overview, employer verification decisions, candidate inspection, recruiter/admin team management, job moderation, applications, interviews, categories and locations, editable pricing and limits, sample subscriptions/payments/invoices, campaign creation/editing/creative preview, placement inventory, featured listings, articles, homepage text, FAQs, testimonials, enquiries, reports, audit events, notifications and preferences.

## Connected behaviour

- A published demo job appears immediately in public search, detail pages and related company vacancies. Salary, requirements and description are retained.
- An application appears in both candidate tracking and employer applicant management. Duplicate applications for the same candidate/job are prevented.
- Status movement updates the shared application record. Interview scheduling links to the application and moves it to Interview.
- Admin plan edits update public pricing. Campaign edits drive scheduled active placements on public surfaces with sponsored labels.
- Public enquiries and job reports create records in Admin enquiries. Profile, alert, team, content and notification changes remain available while navigating.
- Resume files are validated by extension and size, and only their filenames are retained. Campaign images are validated by MIME type and size and previewed in memory.
- Seed data includes 30 employers, 80 jobs, 50 candidates, 150 applications, 15 interviews, 10 campaigns, 4 plans, 20 payment records, 10 articles, 15 notifications and 10 tickets.

## Demo boundary

Refresh resets all changes. There is no database, production authentication, secure tenant isolation, real document storage, payment processing, notification delivery, real employer verification or live analytics. Role navigation is presentation logic, not access control. Payment/analytics records and testimonials are illustrative. CSV downloads are local exports; billing downloads are demo records, not tax invoices. Alert and language settings store preferences only; they do not deliver messages or translate the interface. Resume contents are never uploaded.

Before real users or candidate data are introduced, connect authenticated backend APIs, server-side tenant/role permissions, durable storage, authorised file handling, notification services, payment webhooks and operational privacy policies. More advanced workflows such as resume-credit enforcement, branch-level access, production subscriptions, signed downloads, live tracking and full content/version management belong to that integration phase.

## Validation

- `npm test`: routing, data integrity, shared applications/statuses, saved jobs, plan changes, published-job fields, fresh-session reset and match-score explanations.
- `node node_modules/typescript/bin/tsc --noEmit`: strict TypeScript validation.
- `npm run build`: a static browser application in `dist/`. Hosting must serve `index.html` as the fallback for application routes. Route metadata is rendered in the browser.
- `scripts/browser-qa.mjs`: local Chromium DevTools checks for job creation, application tracking, role modules, public navigation, responsive layouts, mobile controls and shared admin pricing. It expects an existing local DevTools endpoint on port 9333 and the development server on port 4175.
- `artifacts/qa-results.json` and the screenshots in `artifacts/` capture the browser results.

Run locally with `npm install` and `npm run dev`.

## Company directory refresh

The `/companies` directory uses a Naukri-inspired discovery pattern with a rounded search bar, category tiles, a desktop filter sidebar, three-column cards, sample ratings/review counts, business and ownership tags, live demo vacancy counts, following/featured collections, sorting and pagination. The mobile layout uses two-column cards and a filter sheet. Location, business type, team size, hiring department and verification filters are interactive. Ratings, review counts, team sizes and ownership descriptors are illustrative and are labelled as sample data.

The reference URL could not be loaded in this environment, so exact visual comparison was unavailable. HotelHire branding, existing company profile links and the shared in-memory demo provider are retained. `artifacts/companies-desktop.png`, `artifacts/companies-mobile.png` and `artifacts/company-qa-results.json` record this page's validation. The directory passed 17 browser checks including 360, 375, 390, 768, 1024, 1280 and 1440 px viewport checks.
