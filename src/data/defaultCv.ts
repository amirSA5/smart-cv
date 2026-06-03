import type { CVData } from "../types/cv";

export const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

export const defaultCv: CVData = {
  personal: {
    fullName: "Drew Feig",
    jobTitle: "Graphic Designer",
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    website: "www.reallygreatsite.com",
    location: "New York, NY",
    profileImage: "",
  },
  profileSummary:
    "As a seasoned graphic designer, I fuse creativity with technical expertise to craft compelling visual experiences. With a background in brand identity, digital campaigns, and editorial design, I bring thoughtful concept development and polished execution to every project.",
  skills: [
    { id: "skill-organized", name: "Organized" },
    { id: "skill-communication", name: "Communication" },
    { id: "skill-teamwork", name: "Teamwork" },
    { id: "skill-deadlines", name: "Meeting deadlines" },
    { id: "skill-creativity", name: "Creativity" },
    { id: "skill-leadership", name: "Leadership" },
  ],
  itSkills: [],
  education: [
    {
      id: "education-secondary",
      degree: "Secondary School",
      school: "Keithston and Partners High School",
      startYear: "2015",
      endYear: "2018",
      description: "Visual arts track with extracurricular design projects.",
    },
    {
      id: "education-bachelor",
      degree: "Bachelor of Technology",
      school: "Warner & Spencer University",
      startYear: "2018",
      endYear: "2020",
      description: "Focused on communication design and digital production.",
    },
  ],
  experience: [
    {
      id: "experience-rimberio",
      jobTitle: "Graphic Designer",
      company: "Rimberio Company",
      startDate: "2020",
      endDate: "2021",
      bullets: [
        {
          id: "bullet-rimberio-1",
          text: "Collaborated closely with cross-functional teams to develop brand assets, social campaigns, and presentation systems.",
        },
      ],
    },
    {
      id: "experience-paucek",
      jobTitle: "Graphic Designer",
      company: "Paucek and Lage Company",
      startDate: "2021",
      endDate: "2022",
      bullets: [
        {
          id: "bullet-paucek-1",
          text: "Produced visually compelling materials that consistently met client expectations and improved campaign consistency.",
        },
        {
          id: "bullet-paucek-2",
          text: "Used industry-standard design software to translate creative briefs into polished print and digital deliverables.",
        },
      ],
    },
  ],
  languages: [],
  certifications: [],
  achievements: [
    {
      id: "achievement-brand-system",
      title: "Brand system delivery",
      description:
        "Built reusable visual systems that improved consistency across print and digital assets.",
    },
  ],
  references: [],
  strengths: [],
  interests: [],
  templateSettings: {
    accentColor: "#000000",
    secondaryColor: "#6C63FF",
    fontFamily: "Montserrat",
    fontSizeScale: 1,
    styleVariant: "classic",
    borderStyle: "thin",
    photoStyle: "rectangle",
  },
};

export const emptyCv: CVData = {
  personal: {
    fullName: "",
    jobTitle: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    profileImage: "",
  },
  profileSummary: "",
  skills: [],
  itSkills: [],
  education: [],
  experience: [],
  languages: [],
  certifications: [],
  achievements: [],
  references: [],
  strengths: [],
  interests: [],
  templateSettings: {
    accentColor: "#000000",
    secondaryColor: "#6C63FF",
    fontFamily: "Montserrat",
    fontSizeScale: 1,
    styleVariant: "classic",
    borderStyle: "thin",
    photoStyle: "rectangle",
  },
};
