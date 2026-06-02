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

export const techProfessionalLabels: Record<
  CVLanguage,
  {
    expertise: string;
    experience: string;
    experienceContinued: string;
    education: string;
    achievements: string;
    additional: string;
  }
> = {
  en: {
    expertise: "AREA OF EXPERTISE",
    experience: "PROFESSIONAL EXPERIENCE",
    experienceContinued: "PROFESSIONAL EXPERIENCE CONTINUED",
    education: "EDUCATION",
    achievements: "KEY ACHIEVEMENTS",
    additional: "ADDITIONAL INFORMATION",
  },
  fr: {
    expertise: "DOMAINES D’EXPERTISE",
    experience: "EXPÉRIENCE PROFESSIONNELLE",
    experienceContinued: "EXPÉRIENCE PROFESSIONNELLE SUITE",
    education: "FORMATION",
    achievements: "RÉALISATIONS CLÉS",
    additional: "INFORMATIONS COMPLÉMENTAIRES",
  },
};

export type TechProfessionalLabelSet =
  (typeof techProfessionalLabels)[CVLanguage];
