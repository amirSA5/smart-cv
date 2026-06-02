import type {
  AchievementEntry,
  CVData,
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  Skill,
} from "../../types/cv";

const PAGE_HEIGHT = 1123;
const PAGE_TOP = 58;
const PAGE_BOTTOM = 64;
const PAGE_TWO_HEADER = 58;
const BODY_WIDTH_CHARS = 88;

export type TechProfessionalPageData = {
  kind: "primary" | "continuation";
  pageNumber: number;
  personal: CVData["personal"];
  profileSummary: string;
  skills: Skill[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  achievements: AchievementEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  hasExperienceContinuation: boolean;
};

type SplitResult<T> = {
  fit: T[];
  remaining: T[];
  height: number;
};

const lineCount = (text: string, charsPerLine: number) => {
  const normalized = text.trim();

  if (!normalized) {
    return 0;
  }

  return normalized
    .split(/\n+/)
    .reduce(
      (total, line) => total + Math.max(1, Math.ceil(line.length / charsPerLine)),
      0,
    );
};

const contactLineCount = (values: string[]) => {
  const length = values.filter(Boolean).join("  |  ").length;
  return Math.max(1, Math.ceil(length / 94));
};

const estimateHeaderHeight = (data: CVData) => {
  const nameLines = Math.max(1, Math.ceil(data.personal.fullName.length / 22));
  const titleLines = Math.max(1, Math.ceil(data.personal.jobTitle.length / 56));
  const contactLines = contactLineCount([
    data.personal.phone,
    data.personal.email,
    data.personal.location,
    data.personal.website,
  ]);
  const profileLines = lineCount(data.profileSummary, BODY_WIDTH_CHARS);

  return (
    nameLines * 44 +
    titleLines * 18 +
    contactLines * 15 +
    40 +
    (profileLines > 0 ? profileLines * 15 + 20 : 0)
  );
};

const sectionTitleHeight = 29;

const estimateSkillsHeight = (skills: Skill[]) => {
  const visible = skills.filter((skill) => skill.name.trim());

  if (visible.length === 0) {
    return 0;
  }

  return sectionTitleHeight + Math.ceil(visible.length / 2) * 18 + 8;
};

const visibleBullets = (entry: ExperienceEntry) =>
  entry.bullets.filter((bullet) => bullet.text.trim());

const estimateExperienceHeight = (entry: ExperienceEntry) => {
  const headingLines = lineCount(
    [entry.jobTitle, entry.company].filter(Boolean).join(" - "),
    78,
  );
  const metaLines = lineCount(
    [entry.location, entry.startDate, entry.endDate].filter(Boolean).join(" | "),
    86,
  );
  const bullets = visibleBullets(entry);

  return (
    Math.max(1, headingLines) * 16 +
    Math.max(1, metaLines) * 14 +
    (bullets.length > 0 ? 7 : 0) +
    bullets.reduce(
      (total, bullet) => total + lineCount(bullet.text, 94) * 14,
      0,
    ) +
    Math.max(0, bullets.length - 1) * 4
  );
};

const splitExperience = (
  items: ExperienceEntry[],
  budget: number,
  includeTitle = true,
): SplitResult<ExperienceEntry> => {
  const fit: ExperienceEntry[] = [];
  let height = 0;
  const base = includeTitle ? sectionTitleHeight + 6 : 0;
  const itemGap = 15;

  for (const [index, item] of items.entries()) {
    const itemHeight = estimateExperienceHeight(item);
    const nextHeight = (fit.length === 0 ? base : itemGap) + itemHeight;

    if (height + nextHeight > budget) {
      return {
        fit,
        remaining: items.slice(index),
        height,
      };
    }

    fit.push(item);
    height += nextHeight;
  }

  return { fit, remaining: [], height };
};

const estimateEducationHeight = (items: EducationEntry[]) => {
  const visible = items.filter(
    (entry) => entry.degree || entry.school || entry.description,
  );

  if (visible.length === 0) {
    return 0;
  }

  return (
    sectionTitleHeight +
    visible.reduce((total, entry) => {
      const titleLines = lineCount(entry.degree, 72);
      const metaLines = lineCount(
        [entry.school, entry.location, entry.startYear, entry.endYear]
          .filter(Boolean)
          .join(" | "),
        90,
      );
      const descriptionLines = lineCount(entry.description, 94);

      return (
        total +
        Math.max(1, titleLines) * 15 +
        Math.max(1, metaLines) * 14 +
        descriptionLines * 14 +
        8
      );
    }, 0)
  );
};

const estimateAchievementsHeight = (items: AchievementEntry[]) => {
  const visible = items.filter((entry) => entry.title || entry.description);

  if (visible.length === 0) {
    return 0;
  }

  return (
    sectionTitleHeight +
    visible.reduce(
      (total, entry) =>
        total +
        Math.max(1, lineCount(entry.title, 76)) * 15 +
        lineCount(entry.description, 96) * 14 +
        8,
      0,
    )
  );
};

const estimateAdditionalHeight = (
  certifications: CertificationEntry[],
  languages: LanguageEntry[],
) => {
  const visibleCerts = certifications.filter(
    (entry) => entry.title || entry.issuer || entry.description,
  );
  const visibleLanguages = languages.filter((entry) => entry.name || entry.level);

  if (visibleCerts.length === 0 && visibleLanguages.length === 0) {
    return 0;
  }

  const certHeight = visibleCerts.reduce((total, entry) => {
    const titleLines = lineCount(entry.title, 58);
    const detailLines = lineCount(
      [
        entry.issuer,
        entry.reference,
        entry.issueDate || entry.year,
        entry.expiryDate,
      ]
        .filter(Boolean)
        .join(" | "),
      66,
    );
    const descriptionLines = lineCount(entry.description ?? "", 66);

    return (
      total +
      Math.max(1, titleLines) * 14 +
      detailLines * 12 +
      descriptionLines * 12 +
      14
    );
  }, 0);
  const languageHeight =
    visibleLanguages.length > 0 ? Math.ceil(visibleLanguages.length / 3) * 18 + 12 : 0;

  return sectionTitleHeight + certHeight + languageHeight + 4;
};

const fits = (used: number, next: number, budget: number) =>
  next === 0 || used + (used > 0 ? 20 : 0) + next <= budget;

export const paginateTechProfessional = (
  data: CVData,
): TechProfessionalPageData[] => {
  const pageOneBudget =
    PAGE_HEIGHT - PAGE_TOP - PAGE_BOTTOM - estimateHeaderHeight(data);
  let pageOneUsed = 0;
  const firstPage: TechProfessionalPageData = {
    kind: "primary",
    pageNumber: 1,
    personal: data.personal,
    profileSummary: data.profileSummary,
    skills: [],
    experience: [],
    education: [],
    achievements: [],
    certifications: [],
    languages: [],
    hasExperienceContinuation: false,
  };

  const skillsHeight = estimateSkillsHeight(data.skills);
  if (fits(pageOneUsed, skillsHeight, pageOneBudget)) {
    firstPage.skills = data.skills;
    pageOneUsed += (pageOneUsed > 0 ? 20 : 0) + skillsHeight;
  }

  const pageOneExperience = splitExperience(
    data.experience,
    Math.max(0, pageOneBudget - pageOneUsed - (pageOneUsed > 0 ? 20 : 0)),
  );
  firstPage.experience = pageOneExperience.fit;
  pageOneUsed +=
    pageOneExperience.height > 0
      ? (pageOneUsed > 0 ? 20 : 0) + pageOneExperience.height
      : 0;

  const secondPage: TechProfessionalPageData = {
    kind: "continuation",
    pageNumber: 2,
    personal: data.personal,
    profileSummary: "",
    skills: firstPage.skills.length > 0 ? [] : data.skills,
    experience: pageOneExperience.remaining,
    education: [],
    achievements: [],
    certifications: [],
    languages: [],
    hasExperienceContinuation: pageOneExperience.remaining.length > 0,
  };

  const sections = [
    {
      height: estimateEducationHeight(data.education),
      applyToFirst: () => {
        firstPage.education = data.education;
      },
      applyToSecond: () => {
        secondPage.education = data.education;
      },
    },
    {
      height: estimateAchievementsHeight(data.achievements ?? []),
      applyToFirst: () => {
        firstPage.achievements = data.achievements ?? [];
      },
      applyToSecond: () => {
        secondPage.achievements = data.achievements ?? [];
      },
    },
    {
      height: estimateAdditionalHeight(data.certifications, data.languages),
      applyToFirst: () => {
        firstPage.certifications = data.certifications;
        firstPage.languages = data.languages;
      },
      applyToSecond: () => {
        secondPage.certifications = data.certifications;
        secondPage.languages = data.languages;
      },
    },
  ];

  for (const section of sections) {
    if (
      pageOneExperience.remaining.length === 0 &&
      fits(pageOneUsed, section.height, pageOneBudget)
    ) {
      section.applyToFirst();
      pageOneUsed += (pageOneUsed > 0 ? 20 : 0) + section.height;
    } else {
      section.applyToSecond();
    }
  }

  const hasSecondPage =
    secondPage.skills.length > 0 ||
    secondPage.experience.length > 0 ||
    secondPage.education.length > 0 ||
    secondPage.achievements.length > 0 ||
    secondPage.certifications.length > 0 ||
    secondPage.languages.length > 0;

  if (hasSecondPage) {
    const pageTwoBudget = PAGE_HEIGHT - PAGE_TOP - PAGE_BOTTOM - PAGE_TWO_HEADER;
    const pageTwoExperience = splitExperience(
      secondPage.experience,
      pageTwoBudget,
      secondPage.hasExperienceContinuation,
    );

    secondPage.experience = [
      ...pageTwoExperience.fit,
      ...pageTwoExperience.remaining,
    ];
  }

  return hasSecondPage ? [firstPage, secondPage] : [firstPage];
};
