import { MemoryRouter, matchRoutes } from "react-router";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App, appRoutes } from "@/router";
import { destinationUrl, Link, useLocation, useNavigate } from "@/lib/navigation";
import { afterEach } from "vitest";
afterEach(cleanup);
describe("App routing", () => {
  it.each([
    "/jobs",
    "/jobs/job-1",
    "/companies/company-1",
    "/blog/article-1",
    "/categories",
    "/advertise",
    "/workspace",
    "/candidate/dashboard",
    "/employer/hiring-pipeline",
    "/admin/advertisements",
    "/recruiter/dashboard",
  ])("matches %s to a concrete module", (path) => {
    const matches = matchRoutes(appRoutes, path);
    expect(matches?.at(-1)?.route.path).not.toBe("*");
    expect(matches?.at(-1)?.route.element).toBeDefined();
  });
  it("matches a page for / instead of falling back to not found", () => {
    expect(matchRoutes(appRoutes, "/")?.at(-1)?.route.path).toBe("/");
  });
  it("routes unknown public pages to the not-found screen", () => {
    expect(matchRoutes(appRoutes, "/not-a-real-page")?.at(-1)?.route.path).toBe("*");
  });
  it("encodes dynamic IDs and query values", () => {
    expect(
      destinationUrl({
        to: "/companies/$id",
        params: { id: "hotel & café" },
        search: { q: "Chef & kitchen", city: "Pune", experience: 0, empty: "" },
      }),
    ).toBe("/companies/hotel%20%26%20caf%C3%A9?q=Chef+%26+kitchen&city=Pune&experience=0");
  });
  it("preserves parameterised links and imperative workspace navigation", () => {
    function Probe() {
      const location = useLocation(),
        navigate = useNavigate();
      return (
        <>
          <output>{location.pathname + location.search}</output>
          <Link to="/jobs/$id" params={{ id: "job-1" }}>
            View vacancy
          </Link>
          <button
            onClick={() =>
              navigate({ to: "/workspace", search: { role: "Candidate", view: "applications" } })
            }
          >
            Open tracker
          </button>
        </>
      );
    }
    render(
      <MemoryRouter>
        <Probe />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("View vacancy"));
    expect(screen.getByRole("status")).toHaveTextContent("/jobs/job-1");
    fireEvent.click(screen.getByText("Open tracker"));
    expect(screen.getByRole("status")).toHaveTextContent(
      "/workspace?role=Candidate&view=applications",
    );
  });
  it("renders a directly loaded demo sign-in URL", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "Welcome back to HotelHire." }),
    ).toBeInTheDocument();
  });
  it("renders the not-found page without server routing", () => {
    render(
      <MemoryRouter initialEntries={["/does-not-exist"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});
