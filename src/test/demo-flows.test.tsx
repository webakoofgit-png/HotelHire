import { act, renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DemoProvider, useDemo } from "@/lib/demo-store";
import {
  jobs,
  companies,
  candidates,
  applications,
  interviews,
  campaigns,
  matchScore,
} from "@/lib/demo-data";

describe("Connected recruitment demo", () => {
  it("connects a candidate application to the shared employer pipeline and prevents duplicates", () => {
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    act(() => result.current.apply("job-1", "Demo Applicant"));
    const application = result.current.applications.find((a) => a.candidateId === "me");
    expect(application).toMatchObject({ jobId: "job-1", name: "Demo Applicant", stage: "Applied" });
    act(() => result.current.move(application!.id, "Shortlisted"));
    expect(result.current.applications.find((a) => a.id === application!.id)?.stage).toBe(
      "Shortlisted",
    );
    act(() => result.current.apply("job-1", "Demo Applicant"));
    expect(result.current.applications.filter((a) => a.candidateId === "me")).toHaveLength(1);
    expect(result.current.audit.some((a) => a.text.includes("Shortlisted"))).toBe(true);
  });
  it("keeps saved jobs and plan edits across role changes", () => {
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    act(() => {
      result.current.toggleSave("job-1");
      result.current.setRole("Admin");
      result.current.setPlans((old) =>
        old.map((p) => (p.name === "Starter" ? { ...p, price: "1,999", jobCredits: 7 } : p)),
      );
    });
    act(() => result.current.setRole("Candidate"));
    expect(result.current.saved).toContain("job-1");
    expect(result.current.plans.find((p) => p.name === "Starter")).toMatchObject({
      price: "1,999",
      jobCredits: 7,
    });
    act(() => result.current.toggleSave("job-1"));
    expect(result.current.saved).not.toContain("job-1");
  });
  it("retains salary and description on a newly published demo job", () => {
    const { result } = renderHook(() => useDemo(), { wrapper: DemoProvider });
    const job = {
      ...jobs[0]!,
      id: "new-demo-job",
      title: "Tandoor Chef",
      salaryMin: 30000,
      salaryMax: 42000,
      description: "Run a thoughtful tandoor kitchen.",
    };
    act(() => result.current.setJobs((old) => [job, ...old]));
    act(() => result.current.setRole("Candidate"));
    expect(result.current.jobs.find((j) => j.id === job.id)).toMatchObject({
      salaryMin: 30000,
      salaryMax: 42000,
      description: job.description,
      status: "Published",
    });
  });
  it("starts a fresh session without mutating shared seed data", () => {
    const first = renderHook(() => useDemo(), { wrapper: DemoProvider });
    act(() => {
      first.result.current.toggleSave("job-1");
      first.result.current.setApplications([]);
    });
    first.unmount();
    const next = renderHook(() => useDemo(), { wrapper: DemoProvider });
    expect(next.result.current.saved).toEqual([]);
    expect(next.result.current.applications).toHaveLength(150);
  });
});
describe("Coherent fictional recruitment data", () => {
  it("meets the demo volume requirements and uses valid relationships", () => {
    expect([
      companies.length,
      jobs.length,
      candidates.length,
      applications.length,
      interviews.length,
      campaigns.length,
    ]).toEqual([30, 80, 50, 150, 15, 10]);
    expect(
      applications.every(
        (a) => jobs.some((j) => j.id === a.jobId) && candidates.some((c) => c.id === a.candidateId),
      ),
    ).toBe(true);
    expect(interviews.every((i) => applications.some((a) => a.id === i.applicationId))).toBe(true);
    expect(
      jobs.every((j) => companies.some((c) => c.id === j.companyId) && j.salaryMin <= j.salaryMax),
    ).toBe(true);
  });
  it("explains a deterministic match score from actual profile factors", () => {
    const job = jobs[0]!;
    const exact = {
      skills: job.skills,
      city: job.city,
      experience: job.minExperience,
      salary: job.salaryMin,
      shift: job.shift,
    };
    const match = matchScore(exact, job);
    expect(match.score).toBe(100);
    expect(match.factors.reduce((s, f) => s + f.score, 0)).toBe(match.score);
    expect(matchScore({ ...exact, city: "Elsewhere", shift: "Other" }, job).score).toBe(70);
  });
});
