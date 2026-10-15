import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  Component,
  type ReactNode,
  type ErrorInfo,
} from "react";
import {
  matchRoutes,
  useLocation,
  useRoutes,
  useNavigationType,
  type RouteObject,
} from "react-router";
import { DemoProvider } from "./lib/demo-store";
import { publicPages } from "./components/hotelhire/public-pages";
import { Link } from "./lib/navigation";
import { Toaster } from "./components/ui/sonner";
import { reportLovableError } from "./lib/lovable-error-reporting";
import { NotFound } from "./components/not-found";

const Home = lazy(() => import("./routes/index"));
const Jobs = lazy(() => import("./routes/jobs.index"));
const JobDetails = lazy(() => import("./routes/jobs.$id"));
const Companies = lazy(() => import("./routes/companies"));
const CompanyDetails = lazy(() => import("./routes/companies_.$id"));
const Employers = lazy(() => import("./routes/for-employers"));
const Pricing = lazy(() => import("./routes/pricing"));
const PublicInfo = lazy(() => import("./routes/$page"));
const Article = lazy(() => import("./routes/blog.$id"));
const Workspace = lazy(() => import("./routes/workspace"));
const Candidate = lazy(() => import("./routes/candidate.$"));
const Employer = lazy(() => import("./routes/employer.$"));
const Recruiter = lazy(() => import("./routes/recruiter.$"));
const Admin = lazy(() => import("./routes/admin.$"));
type PageMetadata = { title: string; description?: string };
const route = (
  path: string,
  element: ReactNode,
  title: string,
  description?: string,
): RouteObject => ({ path, element, handle: { title, description } });
export const appRoutes: RouteObject[] = [
  route(
    "/",
    <Home />,
    "HotelHire Pro — Find Your Next Hospitality Opportunity",
    "Find rewarding hotel, restaurant and resort jobs across India.",
  ),
  route("/jobs", <Jobs />, "Find Hospitality Jobs — HotelHire Pro"),
  route("/jobs/:id", <JobDetails />, "Hospitality Opportunity — HotelHire Pro"),
  route(
    "/companies",
    <Companies />,
    "Discover Companies Hiring in Hospitality — HotelHire Pro",
    "Explore hospitality employers by business type, location, team size and open opportunities.",
  ),
  route("/companies/:id", <CompanyDetails />, "Employer Profile — HotelHire Pro"),
  route("/for-employers", <Employers />, "Hire Hospitality Staff — HotelHire Pro"),
  route("/pricing", <Pricing />, "Employer Plans & Pricing — HotelHire Pro"),
  route("/blog/:id", <Article />, "The HotelHire Journal — Career Advice"),
  ...publicPages.map((page) =>
    route(`/${page}`, <PublicInfo page={page} />, `${page.replaceAll("-", " ")} — HotelHire Pro`),
  ),
  route("/workspace", <Workspace />, "Recruitment Workspace — HotelHire Pro"),
  route("/candidate/*", <Candidate />, "Candidate Workspace — HotelHire Pro"),
  route("/employer/*", <Employer />, "Employer Workspace — HotelHire Pro"),
  route("/recruiter/*", <Recruiter />, "Recruiter Workspace — HotelHire Pro"),
  route("/admin/*", <Admin />, "Admin Workspace — HotelHire Pro"),
  route("*", <NotFound />, "Page Not Found — HotelHire Pro"),
];
const positions = new Map<string, { x: number; y: number }>();
function ScrollPosition() {
  const location = useLocation(),
    kind = useNavigationType();
  useLayoutEffect(() => {
    const position = kind === "POP" ? positions.get(location.key) : undefined;
    const frame = requestAnimationFrame(() => window.scrollTo(position?.x ?? 0, position?.y ?? 0));
    return () => {
      cancelAnimationFrame(frame);
      positions.set(location.key, { x: window.scrollX, y: window.scrollY });
    };
  }, [location.key, kind]);
  return null;
}
class PageBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  override componentDidCatch(error: Error, info: ErrorInfo) {
    reportLovableError(error, { boundary: "app_root", componentStack: info.componentStack });
  }
  override render() {
    if (this.state.error)
      return (
        <main className="empty-state">
          <h1>This page didn’t load.</h1>
          <p>Please try again or return to the homepage.</p>
          <button onClick={() => this.setState({ error: null })}>Try again</button>
          <Link to="/">Go home</Link>
        </main>
      );
    return this.props.children;
  }
}
function AppRoutes() {
  const location = useLocation(),
    element = useRoutes(appRoutes);
  const metadata = matchRoutes(appRoutes, location.pathname)?.at(-1)?.route.handle as
    PageMetadata | undefined;
  useEffect(() => {
    const title = metadata?.title ?? "HotelHire Pro — Hospitality Careers",
      description =
        metadata?.description ??
        "Connect great hospitality people with exceptional employers across India.";
    document.title = title;
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
    ])
      document.querySelector(selector!)?.setAttribute("content", content!);
  }, [metadata]);
  return (
    <PageBoundary key={location.pathname}>
      <Suspense
        fallback={
          <main className="empty-state" role="status" aria-live="polite">
            <span className="eyebrow">HOTELHIRE PRO</span>
            <p>Finding your next chapter…</p>
          </main>
        }
      >
        {element}
        <ScrollPosition />
      </Suspense>
    </PageBoundary>
  );
}
export function App() {
  return (
    <DemoProvider>
      <AppRoutes />
      <Toaster />
    </DemoProvider>
  );
}
