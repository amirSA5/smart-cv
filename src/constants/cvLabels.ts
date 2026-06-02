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

export const yellowProfessionalTimelineLabels: Record<
  CVLanguage,
  {
    profile: string;
    experience: string;
    experienceContinued: string;
    education: string;
    skills: string;
    skillsContinued: string;
    itSkills: string;
    itSkillsContinued: string;
    languages: string;
    references: string;
    certifications: string;
    achievements: string;
    additional: string;
    contact: string;
    phone: string;
    email: string;
  }
> = {
  en: {
    profile: "PROFILE",
    experience: "EXPERIENCE",
    experienceContinued: "EXPERIENCE CONTINUED",
    education: "EDUCATION",
    skills: "CORE SKILLS",
    skillsContinued: "SKILLS CONTINUED",
    itSkills: "IT SKILLS",
    itSkillsContinued: "IT SKILLS CONTINUED",
    languages: "LANGUAGES",
    references: "REFERENCES",
    certifications: "CERTIFICATIONS",
    achievements: "KEY ACHIEVEMENTS",
    additional: "ADDITIONAL INFORMATION",
    contact: "CONTACT",
    phone: "Phone",
    email: "Email",
  },
  fr: {
    profile: "PROFIL",
    experience: "EXPÉRIENCE",
    experienceContinued: "EXPÉRIENCE SUITE",
    education: "FORMATION",
    skills: "COMPÉTENCES CLÉS",
    skillsContinued: "COMPÉTENCES SUITE",
    itSkills: "COMPÉTENCES INFORMATIQUES",
    itSkillsContinued: "COMPÉTENCES INFORMATIQUES SUITE",
    languages: "LANGUES",
    references: "RÉFÉRENCES",
    certifications: "CERTIFICATIONS",
    achievements: "RÉALISATIONS CLÉS",
    additional: "INFORMATIONS COMPLÉMENTAIRES",
    contact: "CONTACT",
    phone: "Téléphone",
    email: "Email",
  },
};

export type YellowProfessionalTimelineLabelSet =
  (typeof yellowProfessionalTimelineLabels)[CVLanguage];
