# HotelHire Pro

A hospitality recruitment frontend built with React, Vite, TypeScript and React Router. It includes public job and company discovery, candidate workspaces, employer/HR recruitment tools and platform administration.

## Local development

Use Node.js 22.12+ or a newer supported LTS release.

```sh
git clone https://github.com/webakoofgit-png/HotelHire.git
cd HotelHire
npm ci
npm run dev
```

## Checks and production build

```sh
npm test
npx tsc --noEmit
npm run build
npm run preview
```

The static production site is generated in `dist/`. Upload that directory to a static host. Configure a history fallback so application URLs such as `/jobs/job-1` and `/admin/dashboard` serve `index.html` when loaded directly or refreshed. Netlify's `_redirects` file and a Vercel SPA configuration are included. Other hosts need an equivalent rewrite; GitHub repository hosting alone does not deploy the website.

`src/router.tsx` declares application routes. `src/main.tsx` mounts the browser application. Shared recruitment demo state lives in `src/lib/demo-store.tsx`. Keep only `package-lock.json` as the dependency lockfile and use `npm ci` for reproducible installs.

## Demo scope

Seeded employers, jobs, candidates, reviews, billing records and analytics are fictional. Changes remain in memory across navigation and reset on refresh. Login and registration are demo role-entry screens. There is no production authentication, database, payment gateway, notification delivery or secure document storage.

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for modules, routes and integration boundaries. This app uses client-side rendering, including route-specific page metadata; it does not require a framework server.
