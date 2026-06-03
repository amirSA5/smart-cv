export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  profileImage?: string;
};

export type Skill = {
  id: string;
  name: string;
  level?: number;
};

export type EducationEntry = {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startYear: string;
  endYear: string;
  description: string;
};

export type BulletPoint = {
  id: string;
  text: string;
};

export type ExperienceEntry = {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  bullets: BulletPoint[];
  continued?: boolean;
};

export type LanguageEntry = {
  id: string;
  name: string;
  level: string;
};

export type CertificationEntry = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  reference?: string;
  issueDate?: string;
  expiryDate?: string;
  description?: string;
  bullets?: BulletPoint[];
};

export type AchievementEntry = {
  id: string;
  title: string;
  description: string;
};

export type ReferenceEntry = {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
};

export type StrengthEntry = {
  id: string;
  title: string;
  description: string;
};

export type InterestEntry = {
  id: string;
  name: string;
};

export type TemplateSettings = {
  accentColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSizeScale: 0.9 | 1 | 1.1 | 1.2;
  styleVariant: "classic" | "modern" | "minimal" | "elegant";
  borderStyle: "none" | "thin" | "colored" | "rounded";
  photoStyle: "rectangle" | "rounded" | "circle";
};

export type CVTemplateId =
  | "modern-sidebar"
  | "tech-professional"
  | "yellow-professional-timeline"
  | "photo-split-professional";

export type CVTemplateMeta = {
  id: CVTemplateId;
  name: string;
  color?: string;
};

export type CVData = {
  personal: PersonalInfo;
  profileSummary: string;
  skills: Skill[];
  itSkills: Skill[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  languages: LanguageEntry[];
  certifications: CertificationEntry[];
  achievements: AchievementEntry[];
  references: ReferenceEntry[];
  strengths: StrengthEntry[];
  interests: InterestEntry[];
  templateSettings: TemplateSettings;
};

export type CVLanguage = "en" | "fr";

export type CvLanguageVersion = {
  language: CVLanguage;
  jobTitle: string;
  profile: string;
  skills: Array<
    | string
    | {
        name: string;
        level: number;
      }
  >;
  itSkills: {
    name: string;
    level: number;
  }[];
  experiences: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    descriptions: string[];
  }[];
  education: {
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  certifications: {
    title: string;
    issuer: string;
    reference: string;
    issueDate: string;
    expiryDate: string;
    description: string;
    bullets: string[];
  }[];
  languages: {
    name: string;
    level: string;
  }[];
  achievements: {
    title: string;
    description: string;
  }[];
  references: {
    name: string;
    position: string;
    company: string;
    phone: string;
    email: string;
  }[];
  strengths: {
    title: string;
    description: string;
  }[];
  interests: {
    name: string;
  }[];
};

export type CvSharedClientPayload = {
  fullName: string;
  mainJobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photoUrl: string;
  template: CVTemplateMeta;
  templateSettings: TemplateSettings;
};

export type CvClientPayload = CvSharedClientPayload & {
  versions: Partial<Record<CVLanguage, CvLanguageVersion>>;
};

export type CvClient = CvClientPayload & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type ContinuationSection =
  | { type: "profile"; title: string; text: string }
  | { type: "experience"; title: string; entries: ExperienceEntry[] }
  | { type: "skills"; title: string; entries: Skill[] }
  | { type: "education"; title: string; entries: EducationEntry[] }
  | { type: "languages"; title: string; entries: LanguageEntry[] }
  | { type: "certifications"; title: string; entries: CertificationEntry[] }
  | { type: "achievements"; title: string; entries: AchievementEntry[] };

export type PrimaryPage = {
  kind: "primary";
  pageNumber: number;
  personal: PersonalInfo;
  profileSummary: string;
  skills: Skill[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  languages: LanguageEntry[];
  certifications: CertificationEntry[];
  achievements: AchievementEntry[];
};

export type ContinuationPage = {
  kind: "continuation";
  pageNumber: number;
  personal: PersonalInfo;
  sections: ContinuationSection[];
};

export type CVPreviewPage = PrimaryPage | ContinuationPage;
