import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import * as seed from "./demo-data";
export type Role = "Candidate" | "Employer" | "Recruiter" | "Admin";
export type Profile = {
  name: string;
  headline: string;
  city: string;
  phone: string;
  summary: string;
  skills: string;
  experience: number;
  salary: number;
  shift: string;
  languages: string;
  availability: string;
  visibility: string;
  resume: string;
};
type Message = { id: string; name: string; text: string; outgoing: boolean };
type TeamMember = { id: string; name: string; email: string; role: string; status: string };
type Branch = { id: string; name: string; city: string; address: string };
type Alert = { id: string; role: string; city: string; frequency: string; active: boolean };
type Notice = { id: string; text: string; read: boolean };
type Audit = { id: string; text: string; time: string };
type State<T> = { value: T; set: Dispatch<SetStateAction<T>> };
function useData<T>(initial: T): State<T> {
  const [value, set] = useState(initial);
  return { value, set };
}
function useStore() {
  const saved = useData<string[]>([]),
    role = useData<Role>("Employer"),
    jobs = useData(seed.jobs),
    companies = useData(seed.companies),
    candidates = useData(seed.candidates),
    applications = useData(seed.applications),
    interviews = useData(seed.interviews),
    campaigns = useData(seed.campaigns),
    plans = useData(seed.plans),
    tickets = useData(seed.tickets),
    articles = useData(seed.articles);
  const profile = useData<Profile>({
    name: "Aarav Deshmukh",
    headline: "Hospitality professional · Thoughtful service, every day",
    city: "Pune",
    phone: "",
    summary: "Passionate about thoughtful guest experiences and collaborative hospitality teams.",
    skills: "Guest service, Teamwork, Food safety",
    experience: 4,
    salary: 28000,
    shift: "Day",
    languages: "English, Hindi, Marathi",
    availability: "30 days",
    visibility: "Recruiters only",
    resume: "",
  });
  const plan = useData("Professional"),
    following = useData<string[]>([]),
    messages = useData<Message[]>([
      {
        id: "msg-1",
        name: "Meera · Grand Orchid",
        text: "Hello! We would love to learn more about your hospitality experience. Are you available for a conversation this week?",
        outgoing: false,
      },
    ]);
  const locations = useData(seed.cities),
    categories = useData(seed.departments.slice(1));
  const preferences = useData({
    display: "Grand Orchid Group",
    language: "English",
    email: "Enabled",
  });
  const website = useData({
    heroLead: "Great hospitality.",
    heroAccent: "Even greater opportunities.",
    tagline:
      "Find your place at exceptional hotels, restaurants and resorts. Your skills deserve the right opportunity.",
  });
  const testimonials = useData([
    {
      id: "quote-1",
      name: "Priya S.",
      role: "Front office professional · Fictional story",
      quote:
        "A clear view of the opportunities, the team and what comes next. That makes all the difference.",
    },
    {
      id: "quote-2",
      name: "Meera K.",
      role: "Hospitality recruiter · Fictional story",
      quote: "Having applicants, interviews and hiring stages together helps us focus on people.",
    },
    {
      id: "quote-3",
      name: "Rohan P.",
      role: "Kitchen professional · Fictional story",
      quote: "Finding roles by city, shift and accommodation makes the search feel more personal.",
    },
  ]);
  const faqContent = useData([
    {
      id: "faq-1",
      question: "Is HotelHire a live recruitment service?",
      answer:
        "This is an interactive frontend prototype with fictional records. It does not send real applications, collect payments or verify businesses.",
    },
    {
      id: "faq-2",
      question: "How do I apply for a job?",
      answer:
        "Browse opportunities, open a job and submit the demo application form. Your application appears in the Candidate workspace and Employer pipeline.",
    },
    {
      id: "faq-3",
      question: "Will my changes be saved?",
      answer:
        "Demo changes remain in memory while you navigate. Refreshing the page starts a fresh session and restores sample data.",
    },
  ]);
  const team = useData<TeamMember[]>([
    {
      id: "team-1",
      name: "Meera Kulkarni",
      email: "meera@hotelhire.demo",
      role: "Recruiter",
      status: "Active",
    },
  ]);
  const branches = useData<Branch[]>([
    {
      id: "branch-1",
      name: "Grand Orchid · Pune",
      city: "Pune",
      address: "12 Riverside Road, Pune",
    },
    {
      id: "branch-2",
      name: "Grand Orchid · Mumbai",
      city: "Mumbai",
      address: "45 Heritage Avenue, Mumbai",
    },
  ]);
  const alerts = useData<Alert[]>([
    { id: "alert-1", role: "Chef", city: "Pune", frequency: "Weekly", active: true },
  ]);
  const notices = useData<Notice[]>(
    Array.from({ length: 15 }, (_, i) => ({
      id: `notice-${i}`,
      text: [
        "A new application is ready to review",
        "Your interview schedule has been updated",
        "New hospitality roles match your preferences",
        "Your subscription summary is available",
        "An employer verification needs review",
      ][i % 5]!,
      read: i > 4,
    })),
  );
  const audit = useData<Audit[]>([
    { id: "audit-1", text: "Demo workspace initialized", time: "Demo session" },
  ]);
  function log(text: string) {
    audit.set((a) => [
      { id: uid(), text, time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) },
      ...a,
    ]);
    notices.set((n) => [{ id: uid(), text, read: false }, ...n]);
  }
  function apply(jobId: string, name: string) {
    applications.set((a) =>
      a.some((x) => x.jobId === jobId && x.candidateId === "me")
        ? a
        : [
            {
              id: uid(),
              jobId,
              candidateId: "me",
              name,
              stage: "Applied",
              date: new Date().toISOString().slice(0, 10),
              note: "",
            },
            ...a,
          ],
    );
    log(
      `Demo application submitted for ${jobs.value.find((j) => j.id === jobId)?.title ?? "a vacancy"}`,
    );
  }
  function move(id: string, stage: string) {
    applications.set((a) => a.map((x) => (x.id === id ? { ...x, stage } : x)));
    log(`Application moved to ${stage}`);
  }
  return {
    locations: locations.value,
    setLocations: locations.set,
    categories: categories.value,
    setCategories: categories.set,
    preferences: preferences.value,
    setPreferences: preferences.set,
    website: website.value,
    setWebsite: website.set,
    testimonials: testimonials.value,
    setTestimonials: testimonials.set,
    faqContent: faqContent.value,
    setFaqContent: faqContent.set,
    saved: saved.value,
    toggleSave: (id: string) =>
      saved.set((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    role: role.value,
    setRole: role.set,
    jobs: jobs.value,
    setJobs: jobs.set,
    companies: companies.value,
    setCompanies: companies.set,
    candidates: candidates.value,
    setCandidates: candidates.set,
    applications: applications.value,
    setApplications: applications.set,
    interviews: interviews.value,
    setInterviews: interviews.set,
    campaigns: campaigns.value,
    setCampaigns: campaigns.set,
    plans: plans.value,
    setPlans: plans.set,
    tickets: tickets.value,
    setTickets: tickets.set,
    articles: articles.value,
    setArticles: articles.set,
    profile: profile.value,
    setProfile: profile.set,
    plan: plan.value,
    setPlan: plan.set,
    following: following.value,
    setFollowing: following.set,
    messages: messages.value,
    setMessages: messages.set,
    team: team.value,
    setTeam: team.set,
    branches: branches.value,
    setBranches: branches.set,
    alerts: alerts.value,
    setAlerts: alerts.set,
    notices: notices.value,
    setNotices: notices.set,
    audit: audit.value,
    log,
    apply,
    move,
  };
}
const Context = createContext<ReturnType<typeof useStore> | null>(null);
export const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
export function DemoProvider({ children }: { children: ReactNode }) {
  const value = useStore();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDemo() {
  const store = useContext(Context);
  if (!store) throw new Error("DemoProvider is required");
  return store;
}
