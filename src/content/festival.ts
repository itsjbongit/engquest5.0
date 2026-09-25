import type { Festival } from "./types";

// Official values come from the supplied poster. Items marked PLACEHOLDER are creative direction, not organizer copy.
export const festival: Festival = {
  name: "ENGQUEST", edition: "5.0", year: 2026, subtitle: "SoE TechFest",
  school: "School of Engineering", university: "Jawaharlal Nehru University",
  tagline: "THE QUEST BEGINS", // PLACEHOLDER: replace with the organizers' tagline
  date: "1st October, 2026", hours: "10:00 AM – 07:30 PM",
  venue: "Engineering Lecture Complex (ELC), JNU", address: "New Delhi – 110067",
  patron: { name: "Prof. Santishree Dhulipudi Pandit", role: "Vice-Chancellor, JNU" },
  chairperson: { name: "Prof. Pawan Kumar Kulriya", role: "Dean, SoE" },
  logo: "/assets/brand/logo-circular.png",
  copy: { // PLACEHOLDER copy from the creative brief
    introWords: ["Engineering.", "Technology.", "Ideas.", "Exploration."],
    contactHeading: "Lost your direction?",
    contactLine: "Find the right coordinates.",
  },
};
