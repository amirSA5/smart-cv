import { createId, defaultCv } from "../data/defaultCv";
import type { CVData, CvClient, CvClientPayload } from "../types/cv";

const cleanList = (items: string[]) =>
  items.map((item) => item.trim()).filter(Boolean);

const isCurrentRole = (value: string) => /present|current|now/i.test(value);

export const cvDataToClientPayload = (data: CVData): CvClientPayload => ({
  fullName: data.personal.fullName.trim() || "Untitled CV",
  jobTitle: data.personal.jobTitle.trim(),
  email: data.personal.email.trim(),
  phone: data.personal.phone.trim(),
  location: data.personal.location.trim(),
  website: data.personal.website.trim(),
  photoUrl: data.personal.profileImage?.trim() ?? "",
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
  template: {
    name: "modern-sidebar",
    color: "#2f574d",
  },
});

export const cvClientToCvData = (client: CvClient): CVData => ({
  personal: {
    fullName: client.fullName ?? "",
    jobTitle: client.jobTitle ?? "",
    phone: client.phone ?? "",
    email: client.email ?? "",
    website: client.website ?? "",
    location: client.location ?? "",
    profileImage: client.photoUrl ?? "",
  },
  profileSummary: client.profile ?? "",
  skills:
    client.skills?.map((name) => ({
      id: createId("skill"),
      name,
    })) ?? [],
  education:
    client.education?.map((entry) => ({
      id: createId("education"),
      degree: entry.degree ?? "",
      school: entry.school ?? "",
      location: entry.location ?? "",
      startYear: entry.startDate ?? "",
      endYear: entry.endDate ?? "",
      description: entry.description ?? "",
    })) ?? [],
  experience:
    client.experiences?.map((entry) => ({
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
    client.languages?.map((entry) => ({
      id: createId("language"),
      name: entry.name ?? "",
      level: entry.level ?? "",
    })) ?? [],
  certifications:
    client.certifications?.map((entry) => ({
      id: createId("certification"),
      title: entry.title ?? "",
      issuer: entry.issuer ?? "",
      year: entry.issueDate ?? "",
      reference: entry.reference ?? "",
      issueDate: entry.issueDate ?? "",
      expiryDate: entry.expiryDate ?? "",
      description: entry.description ?? "",
    })) ?? [],
});

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
