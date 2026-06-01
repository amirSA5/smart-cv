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
};

export type CVData = {
  personal: PersonalInfo;
  profileSummary: string;
  skills: Skill[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  languages: LanguageEntry[];
  certifications: CertificationEntry[];
};

export type CvClientPayload = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photoUrl: string;
  profile: string;
  skills: string[];
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
  }[];
  languages: {
    name: string;
    level: string;
  }[];
  template: {
    name: string;
    color: string;
  };
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
  | { type: "certifications"; title: string; entries: CertificationEntry[] };

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
};

export type ContinuationPage = {
  kind: "continuation";
  pageNumber: number;
  personal: PersonalInfo;
  sections: ContinuationSection[];
};

export type CVPreviewPage = PrimaryPage | ContinuationPage;
