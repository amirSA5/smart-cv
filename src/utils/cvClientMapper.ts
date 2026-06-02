import { createId, defaultCv } from "../data/defaultCv";
import { defaultTemplate, getTemplateMeta } from "../constants/templates";
import type {
  CVData,
  CVLanguage,
  CvClient,
  CvClientPayload,
  CvLanguageVersion,
  CvSharedClientPayload,
  CVTemplateMeta,
} from "../types/cv";

export const fallbackLanguage: CVLanguage = "en";

export const languageNames: Record<CVLanguage, string> = {
  en: "English",
  fr: "Français",
};

export const languageCodeLabels: Record<CVLanguage, string> = {
  en: "EN",
  fr: "FR",
};

export const isCvLanguage = (value: string | null): value is CVLanguage =>
  value === "en" || value === "fr";

export const getOppositeLanguage = (language: CVLanguage): CVLanguage =>
  language === "en" ? "fr" : "en";

const cleanList = (items: string[]) =>
  items.map((item) => item.trim()).filter(Boolean);

const isCurrentRole = (value: string) => /present|current|now/i.test(value);

export const hasLanguageVersion = (
  client: CvClient | null | undefined,
  language: CVLanguage,
) => Boolean(client?.versions?.[language]);

export const getClientVersion = (
  client: CvClient,
  language: CVLanguage,
) => client.versions?.[language];

export const getDisplayJobTitle = (
  client: Pick<CvClient, "mainJobTitle" | "versions">,
  language: CVLanguage = fallbackLanguage,
) =>
  client.versions?.[language]?.jobTitle ||
  client.mainJobTitle ||
  client.versions?.en?.jobTitle ||
  client.versions?.fr?.jobTitle ||
  "";

export const getClientTemplate = (
  client?: Pick<CvClient, "template"> | null,
): CVTemplateMeta => getTemplateMeta(client?.template);

export const cvDataToSharedClientPayload = (
  data: CVData,
  template: CVTemplateMeta = defaultTemplate,
): CvSharedClientPayload => ({
  fullName: data.personal.fullName.trim() || "Untitled CV",
  mainJobTitle: data.personal.jobTitle.trim(),
  email: data.personal.email.trim(),
  phone: data.personal.phone.trim(),
  location: data.personal.location.trim(),
  website: data.personal.website.trim(),
  photoUrl: data.personal.profileImage?.trim() ?? "",
  template: getTemplateMeta(template),
});

export const cvDataToClientVersion = (
  data: CVData,
  language: CVLanguage,
): CvLanguageVersion => ({
  language,
  jobTitle: data.personal.jobTitle.trim(),
  profile: data.profileSummary.trim(),
  skills: cleanList(data.skills.map((skill) => skill.name)),
  experiences: data.experience.map((entry) => ({
    jobTitle: entry.jobTitle.trim(),
    company: entry.company.trim(),
    location: entry.location?.trim() ?? "",
    startDate: entry.startDate.trim(),
    endDate: entry.current ? "" : entry.endDate.trim(),
    current: entry.current ?? isCurrentRole(entry.endDate),
    descriptions: cleanList(entry.bullets.map((bullet) => bullet.text)),
  })),
  education: data.education.map((entry) => ({
    degree: entry.degree.trim(),
    school: entry.school.trim(),
    location: entry.location?.trim() ?? "",
    startDate: entry.startYear.trim(),
    endDate: entry.endYear.trim(),
    description: entry.description.trim(),
  })),
  certifications: data.certifications.map((entry) => ({
    title: entry.title.trim(),
    issuer: entry.issuer.trim(),
    reference: entry.reference?.trim() ?? "",
    issueDate: (entry.issueDate || entry.year).trim(),
    expiryDate: entry.expiryDate?.trim() ?? "",
    description: entry.description?.trim() ?? "",
  })),
  languages: data.languages.map((entry) => ({
    name: entry.name.trim(),
    level: entry.level.trim(),
  })),
  achievements: (data.achievements ?? []).map((entry) => ({
    title: entry.title.trim(),
    description: entry.description.trim(),
  })),
});

export const cvDataToClientPayload = (
  data: CVData,
  language: CVLanguage = fallbackLanguage,
  template: CVTemplateMeta = defaultTemplate,
): CvClientPayload => ({
  ...cvDataToSharedClientPayload(data, template),
  versions: {
    [language]: cvDataToClientVersion(data, language),
  },
});

const emptyVersion = (language: CVLanguage): CvLanguageVersion => ({
  language,
  jobTitle: "",
  profile: "",
  skills: [],
  experiences: [],
  education: [],
  certifications: [],
  languages: [],
  achievements: [],
});

export const cvClientToCvData = (
  client: CvClient,
  language: CVLanguage = fallbackLanguage,
): CVData => {
  const version = getClientVersion(client, language) ?? emptyVersion(language);

  return {
    personal: {
      fullName: client.fullName ?? "",
      jobTitle: version.jobTitle ?? client.mainJobTitle ?? "",
      phone: client.phone ?? "",
      email: client.email ?? "",
      website: client.website ?? "",
      location: client.location ?? "",
      profileImage: client.photoUrl ?? "",
    },
    profileSummary: version.profile ?? "",
    skills:
      version.skills?.map((name) => ({
        id: createId("skill"),
        name,
      })) ?? [],
    education:
      version.education?.map((entry) => ({
        id: createId("education"),
        degree: entry.degree ?? "",
        school: entry.school ?? "",
        location: entry.location ?? "",
        startYear: entry.startDate ?? "",
        endYear: entry.endDate ?? "",
        description: entry.description ?? "",
      })) ?? [],
    experience:
      version.experiences?.map((entry) => ({
        id: createId("experience"),
        jobTitle: entry.jobTitle ?? "",
        company: entry.company ?? "",
        location: entry.location ?? "",
        startDate: entry.startDate ?? "",
        endDate: entry.current ? "Present" : entry.endDate ?? "",
        current: entry.current ?? false,
        bullets:
          entry.descriptions?.map((text) => ({
            id: createId("bullet"),
            text,
          })) ?? [],
      })) ?? [],
    languages:
      version.languages?.map((entry) => ({
        id: createId("language"),
        name: entry.name ?? "",
        level: entry.level ?? "",
      })) ?? [],
    certifications:
      version.certifications?.map((entry) => ({
        id: createId("certification"),
        title: entry.title ?? "",
        issuer: entry.issuer ?? "",
        year: entry.issueDate ?? "",
        reference: entry.reference ?? "",
        issueDate: entry.issueDate ?? "",
        expiryDate: entry.expiryDate ?? "",
        description: entry.description ?? "",
      })) ?? [],
    achievements:
      version.achievements?.map((entry) => ({
        id: createId("achievement"),
        title: entry.title ?? "",
        description: entry.description ?? "",
      })) ?? [],
  };
};

export const createNewCvData = (): CVData => ({
  ...(JSON.parse(JSON.stringify(defaultCv)) as CVData),
  personal: {
    ...defaultCv.personal,
    fullName: "",
    jobTitle: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    profileImage: "",
  },
});
