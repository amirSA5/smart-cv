import type { CVLanguage } from "../types/cv";

export const cvLabels: Record<
  CVLanguage,
  {
    profile: string;
    contact: string;
    skills: string;
    experience: string;
    experienceContinued: string;
    certifications: string;
    education: string;
    languages: string;
  }
> = {
  en: {
    profile: "PROFILE",
    contact: "CONTACT ME",
    skills: "SKILLS",
    experience: "EXPERIENCE",
    experienceContinued: "EXPERIENCE CONTINUED",
    certifications: "CERTIFICATIONS",
    education: "EDUCATION",
    languages: "LANGUAGES",
  },
  fr: {
    profile: "PROFIL",
    contact: "CONTACT",
    skills: "COMPÉTENCES",
    experience: "EXPÉRIENCE",
    experienceContinued: "EXPÉRIENCE SUITE",
    certifications: "CERTIFICATIONS",
    education: "FORMATION",
    languages: "LANGUES",
  },
};

export type CvLabelSet = (typeof cvLabels)[CVLanguage];
