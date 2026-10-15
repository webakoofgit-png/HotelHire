export const cities = [
  "Pune",
  "Mumbai",
  "Lonavala",
  "Nashik",
  "Kolhapur",
  "Nagpur",
  "Bengaluru",
  "Hyderabad",
  "Delhi",
  "Goa",
  "Jaipur",
  "Chennai",
];
export const departments = [
  "All roles",
  "Chef & Kitchen",
  "Front Office",
  "Food & Beverage",
  "Housekeeping",
  "Hotel Management",
  "Restaurant Service",
  "Bakery & Pastry",
  "Bar & Beverage",
  "Maintenance",
  "Security",
  "Events & Banquets",
  "Catering",
  "Resort Operations",
  "Hospitality Administration",
];
export const businessTypes = [
  "Hotel",
  "Restaurant",
  "Resort",
  "Café",
  "Villa",
  "Cloud Kitchen",
  "Catering",
  "Mess / Canteen",
];
export type Company = {
  id: string;
  name: string;
  mark: string;
  label: string;
  jobs: number;
  tone: string;
  city: string;
  type: string;
  status: string;
  about: string;
};
const names = [
  "The Grand Orchid",
  "Blue Horizon Resort",
  "Urban Spoon",
  "Royal Palm Hospitality",
  "Sunrise Café",
  "Coastal Bay Resort",
  "The Heritage Kitchen",
  "Maple Leaf Hotels",
  "Amber Courtyard",
  "Silver Fern Retreat",
];
export const companies: Company[] = Array.from({ length: 30 }, (_, i) => ({
  id: `company-${i + 1}`,
  name: `${names[i % 10]}${i >= 10 ? ` ${cities[Math.floor(i / 10) + (i % 4)]}` : ""}`,
  mark: ["GO", "BH", "US", "RP", "SC", "CB", "HK", "ML", "AC", "SF"][i % 10]!,
  label: names[i % 10]!,
  jobs: 0,
  tone: ["gold", "blue", "wine", "green", "ink"][i % 5]!,
  city: cities[i % 12]!,
  type: businessTypes[i % 8]!,
  status: i % 9 === 0 ? "Pending review" : "Verified",
  about:
    "An independent hospitality team creating warm guest experiences, investing in people, and building rewarding careers across India.",
}));
export type Job = {
  id: string;
  title: string;
  company: string;
  companyId: string;
  mark: string;
  city: string;
  area: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  experience: string;
  minExperience: number;
  maxExperience: number;
  department: string;
  type: string;
  shift: string;
  benefits: string[];
  posted: string;
  postedDays: number;
  featured: boolean;
  tone: string;
  status: string;
  description: string;
  openings: number;
  skills: string[];
  deadline: string;
  recruiter: string;
};
const titles = [
  "Executive Chef",
  "Front Office Executive",
  "F&B Supervisor",
  "Housekeeping Supervisor",
  "Hotel Manager",
  "Restaurant Captain",
  "Pastry Chef",
  "Bartender",
  "Maintenance Technician",
  "Security Supervisor",
  "Banquet Manager",
  "Catering Associate",
  "Resort Operations Executive",
  "HR Executive",
];
export const jobs: Job[] = Array.from({ length: 80 }, (_, i) => {
  const c = companies[i % 30]!;
  const exp = i % 6,
    min = 14000 + (i % 10) * 4000;
  return {
    id: `job-${i + 1}`,
    title: titles[i % 14]!,
    company: c.name,
    companyId: c.id,
    mark: c.mark,
    city: c.city,
    area: ["City centre", "Business district", "Riverside", "Heritage quarter"][i % 4]!,
    salary: `${min.toLocaleString("en-IN")} – ${(min + 10000).toLocaleString("en-IN")}`,
    salaryMin: min,
    salaryMax: min + 10000,
    experience: `${exp}–${exp + 3} years`,
    minExperience: exp,
    maxExperience: exp + 3,
    department: departments[1 + (i % 14)]!,
    type: ["Full-time", "Contract", "Seasonal", "Part-time"][i % 4]!,
    shift: ["Day", "Rotational", "Night"][i % 3]!,
    benefits:
      i % 2 === 0 ? ["Meals provided", "Accommodation"] : ["Meals provided", "Training provided"],
    posted: i === 0 ? "Today" : `${(i % 14) + 1} days ago`,
    postedDays: i === 0 ? 0 : (i % 14) + 1,
    featured: i % 5 === 0,
    tone: c.tone,
    status: "Published",
    description: `Bring your passion for hospitality to ${c.name}. Work with a supportive team to deliver thoughtful guest service, maintain excellent standards and develop your skills.`,
    openings: 1 + (i % 5),
    skills: ["Guest service", "Teamwork", i % 2 === 0 ? "Food safety" : "Communication"],
    deadline: "2026-12-31",
    recruiter: "Meera Kulkarni",
  };
});
companies.forEach((c) => {
  c.jobs = jobs.filter((j) => j.companyId === c.id).length;
});
export type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
  jobCredits: number;
  resumeCredits: number;
};
export const plans: Plan[] = [
  {
    name: "Free",
    price: "0",
    description: "Start your hiring journey",
    features: ["1 active job", "Basic applicant tracking", "Employer profile"],
    popular: false,
    jobCredits: 1,
    resumeCredits: 5,
  },
  {
    name: "Starter",
    price: "1,499",
    description: "For growing hospitality teams",
    features: ["5 active jobs", "50 resume credits", "Applicant tracking", "Email support"],
    popular: false,
    jobCredits: 5,
    resumeCredits: 50,
  },
  {
    name: "Professional",
    price: "3,999",
    description: "A complete recruitment toolkit",
    features: [
      "20 active jobs",
      "250 resume credits",
      "3 featured jobs",
      "Team collaboration",
      "Priority support",
    ],
    popular: true,
    jobCredits: 20,
    resumeCredits: 250,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For multi-property businesses",
    features: ["100 active jobs", "1000 resume credits", "Multi-branch hiring", "Custom reports"],
    popular: false,
    jobCredits: 100,
    resumeCredits: 1000,
  },
];
export const stages = [
  "Applied",
  "Screening",
  "Shortlisted",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
  "Withdrawn",
];
export type Candidate = {
  id: string;
  name: string;
  role: string;
  city: string;
  experience: number;
  salary: number;
  skills: string[];
  availability: string;
  shift: string;
  saved: boolean;
};
const firstNames = [
  "Aarav",
  "Priya",
  "Rohan",
  "Sneha",
  "Kabir",
  "Ananya",
  "Ishaan",
  "Meera",
  "Dev",
  "Kavya",
];
export const candidates: Candidate[] = Array.from({ length: 50 }, (_, i) => ({
  id: `candidate-${i + 1}`,
  name: `${firstNames[i % 10]} ${["Deshmukh", "Patil", "Shah", "Joshi", "Kulkarni"][Math.floor(i / 10)]}`,
  role: titles[i % 14]!,
  city: cities[i % 12]!,
  experience: i % 9,
  salary: 18000 + (i % 10) * 3000,
  skills: ["Guest service", "Teamwork", i % 2 === 0 ? "Food safety" : "Communication"],
  availability: i % 3 === 0 ? "Immediate" : "30 days",
  shift: ["Day", "Rotational", "Night"][i % 3]!,
  saved: false,
}));
export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  name: string;
  stage: string;
  date: string;
  note: string;
};
export const applications: Application[] = Array.from({ length: 150 }, (_, i) => ({
  id: `application-${i + 1}`,
  jobId: jobs[i % 80]!.id,
  candidateId: candidates[i % 50]!.id,
  name: candidates[i % 50]!.name,
  stage: stages[i % 7]!,
  date: `2026-10-${String(1 + (i % 14)).padStart(2, "0")}`,
  note: "",
}));
export type Interview = {
  id: string;
  applicationId: string;
  name: string;
  role: string;
  date: string;
  time: string;
  mode: string;
  venue: string;
  status: string;
  feedback: string;
};
export const interviews: Interview[] = Array.from({ length: 15 }, (_, i) => ({
  id: `interview-${i + 1}`,
  applicationId: applications.filter((a) => a.stage === "Interview")[i]!.id,
  name: applications.filter((a) => a.stage === "Interview")[i]!.name,
  role: jobs.find((j) => j.id === applications.filter((a) => a.stage === "Interview")[i]!.jobId)!
    .title,
  date: `2026-10-${16 + (i % 12)}`,
  time: "10:00",
  mode: i % 2 === 0 ? "In person" : "Video",
  venue: i % 2 === 0 ? "Grand Orchid, Pune · Reception" : "Meeting link to be shared by recruiter",
  status: "Scheduled",
  feedback: "",
}));
export type Campaign = {
  image: string;
  id: string;
  title: string;
  subtitle: string;
  sponsor: string;
  cta: string;
  url: string;
  placement: string;
  audience: string;
  city: string;
  start: string;
  end: string;
  status: string;
  impressions: number;
  clicks: number;
  priority: number;
};
export const campaigns: Campaign[] = Array.from({ length: 10 }, (_, i) => ({
  image: "",
  id: `campaign-${i + 1}`,
  title: [
    "Build a team guests remember",
    "Your next chapter in hospitality",
    "Fresh talent. Remarkable service.",
  ][i % 3]!,
  subtitle: "Discover people and opportunities made for hospitality.",
  sponsor: companies[i]!.name,
  cta: "Explore opportunities",
  url: "/jobs",
  placement: ["Homepage", "Search results", "Job details", "Employer directory"][i % 4]!,
  audience: i % 2 === 0 ? "Candidates" : "Employers",
  city: cities[i % 12]!,
  start: "2026-10-01",
  end: "2026-12-31",
  status: i % 3 === 0 ? "Paused" : "Active",
  impressions: 1200 + i * 350,
  clicks: 42 + i * 12,
  priority: i + 1,
}));
export const articles = Array.from({ length: 10 }, (_, i) => ({
  id: `article-${i + 1}`,
  title: [
    "How to build a hospitality CV that opens doors",
    "Preparing for your first hotel interview",
    "A practical guide to hiring a kitchen team",
    "Growing from commis chef to kitchen leader",
    "What to ask before accepting a hospitality role",
    "Making your first 30 days count",
    "Building a welcoming front office team",
    "A guide to seasonal resort careers",
    "Better shift handovers for happier teams",
    "Finding the right hospitality employer",
  ][i]!,
  category: i % 2 === 0 ? "Career advice" : "Hiring insights",
  readTime: 4 + (i % 4),
  date: "15 October 2026",
  status: "Published",
  summary:
    "Practical advice from the HotelHire editorial team for a more rewarding hospitality career.",
}));
export type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
};
export const tickets: Ticket[] = Array.from({ length: 10 }, (_, i) => ({
  id: `SUP-${100 + i}`,
  subject: [
    "Help updating my profile",
    "Question about plan credits",
    "Review my employer verification",
    "Interview scheduling help",
  ][i % 4]!,
  message: "This is an illustrative support request. Please help me with the next steps.",
  status: i % 3 === 0 ? "Resolved" : "Open",
  priority: i % 2 === 0 ? "Normal" : "High",
}));
export const payments = Array.from({ length: 20 }, (_, i) => ({
  id: `INV-${2026001 + i}`,
  company: companies[i]!.name,
  amount: [1499, 3999, 7499][i % 3]!,
  date: `2026-10-${String(1 + (i % 14)).padStart(2, "0")}`,
  status: ["Successful", "Pending", "Failed", "Refunded", "Cancelled"][i % 5]!,
}));
export function matchScore(
  candidate: Pick<Candidate, "skills" | "city" | "experience" | "salary" | "shift">,
  job: Job,
) {
  const factors = [
    {
      label: "Skills",
      score: Math.round(
        (candidate.skills.filter((s) => job.skills.includes(s)).length /
          Math.max(job.skills.length, 1)) *
          35,
      ),
      max: 35,
    },
    { label: "Location", score: candidate.city === job.city ? 20 : 0, max: 20 },
    {
      label: "Experience",
      score:
        candidate.experience >= job.minExperience && candidate.experience <= job.maxExperience
          ? 20
          : 5,
      max: 20,
    },
    { label: "Salary", score: candidate.salary <= job.salaryMax ? 15 : 0, max: 15 },
    { label: "Shift", score: candidate.shift === job.shift ? 10 : 0, max: 10 },
  ];
  return { score: factors.reduce((sum, f) => sum + f.score, 0), factors };
}
