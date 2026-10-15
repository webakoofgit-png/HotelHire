import type { Company } from "./demo-data";

/** Fictional directory insights for the prototype, never live employer reviews. */
export function companyInsights(company: Company) {
  const index = Math.max(0, (Number(company.id.replace("company-", "")) || 1) - 1);
  return {
    rating: [4.2, 4.5, 4.1, 4.3, 4.6, 4.4, 4.0, 4.2, 4.1, 4.7][index % 10]!,
    reviews: 48 + ((index * 37) % 650),
    size: ["51–200 employees", "201–500 employees", "11–50 employees", "500+ employees"][
      index % 4
    ]!,
    ownership: ["Independent business", "Hospitality group", "Multi-property group"][index % 3]!,
    tagline:
      {
        Hotel: "Exceptional stays begin with exceptional people.",
        Resort: "Create memorable escapes. Build a rewarding career.",
        Restaurant: "Great food. Warm service. A team that cares.",
        Café: "Bring your passion to the everyday moments.",
        Villa: "Thoughtful spaces, personal service and room to grow.",
        "Cloud Kitchen": "Fresh ideas and great food, delivered together.",
        Catering: "Bringing people together through remarkable food.",
        "Mess / Canteen": "Good food and good people, every single day.",
      }[company.type] ?? "A thoughtful team. A place to grow in hospitality.",
  };
}
export const companySizes = [
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "500+ employees",
];
