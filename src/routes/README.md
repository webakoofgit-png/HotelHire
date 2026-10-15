# Page modules

This folder contains React page components. Routes are declared explicitly in `src/router.tsx` using React Router. File names do not register routes and no generated route tree is required.

- `index.tsx`: homepage
- `jobs.index.tsx`, `jobs.$id.tsx`: job search and job details
- `companies.tsx`, `companies_.$id.tsx`: company discovery and profiles
- `$page.tsx`, `blog.$id.tsx`: public information pages and journal articles
- `workspace.tsx`: query-based role and module selection
- `candidate.$.tsx`, `employer.$.tsx`, `recruiter.$.tsx`, `admin.$.tsx`: direct role URLs

The existing filenames are retained for continuity. Dynamic URLs use React Router parameters (`:id`) and wildcard segments (`*`). App links and query parameters are composed by `src/lib/navigation.tsx`. Shared state is mounted above all routes, so changing pages preserves the demo session.
