import type {
  AchievementEntry,
  CertificationEntry,
  CVData,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  ReferenceEntry,
  Skill,
} from "../../types/cv";

const PAGE_HEIGHT = 1123;
const PAGE_TOP = 48;
const PAGE_BOTTOM = 56;
const PAGE_ONE_HEADER = 154;
const PAGE_TWO_HEADER = 84;

export type YellowTimelinePageData = {
  kind: "primary" | "continuation";
  pageNumber: number;
  personal: CVData["personal"];
  profileSummary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: Skill[];
  itSkills: Skill[];
  languages: LanguageEntry[];
  references: ReferenceEntry[];
  certifications: CertificationEntry[];
  achievements: AchievementEntry[];
  remainingReferences: ReferenceEntry[];
  isTooLong: boolean;
};

type SplitResult<T> = {
  fit: T[];
  remaining: T[];
  height: number;
};

const lineCount = (text: string | undefined, charsPerLine: number) => {
  const normalized = text?.trim();

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

const hasText = (...values: Array<string | undefined>) =>
  values.some((value) => Boolean(value?.trim()));

const visibleBullets = (entry: ExperienceEntry) =>
  entry.bullets.filter((bullet) => bullet.text.trim());

const estimateExperienceHeight = (entry: ExperienceEntry, compact = false) => {
  const titleLines = lineCount(
    [entry.jobTitle, entry.company].filter(Boolean).join(" - "),
    compact ? 58 : 62,
  );
  const dateLines = lineCount(
    [entry.location, entry.startDate, entry.endDate].filter(Boolean).join(" | "),
    compact ? 62 : 68,
  );
  const bulletLines = visibleBullets(entry).reduce(
    (total, bullet) => total + lineCount(bullet.text, compact ? 70 : 76),
    0,
  );

  return (
    Math.max(1, titleLines) * (compact ? 14 : 15) +
    Math.max(1, dateLines) * (compact ? 12 : 12) +
    bulletLines * (compact ? 12 : 12) +
    Math.max(0, visibleBullets(entry).length - 1) * 2 +
    (compact ? 18 : 20)
  );
};

const splitExperience = (
  entries: ExperienceEntry[],
  budget: number,
  compact = false,
  maxItems = Number.POSITIVE_INFINITY,
): SplitResult<ExperienceEntry> => {
  const fit: ExperienceEntry[] = [];
  let height = 0;
  const base = compact ? 36 : 38;
  const gap = compact ? 10 : 12;

  for (const [index, entry] of entries.entries()) {
    if (fit.length >= maxItems) {
      return { fit, remaining: entries.slice(index), height };
    }

    const visible = hasText(
      entry.jobTitle,
      entry.company,
      ...entry.bullets.map((bullet) => bullet.text),
    );

    if (!visible) {
      continue;
    }

    const nextHeight =
      (fit.length === 0 ? base : gap) + estimateExperienceHeight(entry, compact);

    if (height + nextHeight > budget) {
      return { fit, remaining: entries.slice(index), height };
    }

    fit.push(entry);
    height += nextHeight;
  }

  return { fit, remaining: [], height };
};

const estimateEducationHeight = (entries: EducationEntry[], compact = false) => {
  const visible = entries.filter((item) =>
    hasText(item.degree, item.school, item.location, item.startYear, item.endYear, item.description),
  );

  if (visible.length === 0) {
    return 0;
  }

  return (
    (compact ? 32 : 38) +
    visible.reduce(
      (total, item) =>
        total +
        lineCount(item.degree, compact ? 44 : 48) * (compact ? 11 : 12) +
        lineCount(item.school, compact ? 52 : 58) * (compact ? 10 : 11) +
        lineCount(
          [item.location, item.startYear, item.endYear].join(" | "),
          compact ? 56 : 62,
        ) *
          (compact ? 9 : 10) +
        lineCount(item.description, compact ? 66 : 72) * (compact ? 9 : 10) +
        (compact ? 12 : 14),
      0,
    )
  );
};

const estimateSidebarHeight = (
  data: Pick<CVData, "skills" | "itSkills" | "languages">,
) => {
  const skills =
    data.skills.length > 0 ? 30 + data.skills.filter((skill) => skill.name).length * 24 : 0;
  const itSkills =
    data.itSkills.length > 0
      ? 30 + data.itSkills.filter((skill) => skill.name).length * 24
      : 0;
  const languages =
    data.languages.length > 0
      ? 28 + data.languages.filter((item) => hasText(item.name, item.level)).length * 16
      : 0;

  return skills + itSkills + languages;
};

const skillGroupHeight = (items: Skill[]) =>
  items.filter((skill) => skill.name).length > 0
    ? 30 + items.filter((skill) => skill.name).length * 24
    : 0;

const languageGroupHeight = (items: LanguageEntry[]) =>
  items.filter((item) => hasText(item.name, item.level)).length > 0
    ? 28 + items.filter((item) => hasText(item.name, item.level)).length * 16
    : 0;

const splitSidebarSkills = (data: CVData, sidebarBudget: number) => {
  const skills = data.skills ?? [];
  const itSkills = data.itSkills ?? [];
  const contactHeight =
    10 +
    [
      data.personal.phone,
      data.personal.email,
      data.personal.website,
      data.personal.location,
    ].filter((item) => item?.trim()).length *
      36;
  const baseHeight = contactHeight;
  let skillLimit = skills.length;
  let itSkillLimit = itSkills.length;

  while (
    itSkillLimit > 0 &&
    baseHeight +
      skillGroupHeight(skills.slice(0, skillLimit)) +
      skillGroupHeight(itSkills.slice(0, itSkillLimit)) >
      sidebarBudget
  ) {
    itSkillLimit -= 1;
  }

  while (
    skillLimit > 0 &&
    baseHeight +
      skillGroupHeight(skills.slice(0, skillLimit)) +
      skillGroupHeight(itSkills.slice(0, itSkillLimit)) >
      sidebarBudget
  ) {
    skillLimit -= 1;
  }

  const pageOneSkills = skills.slice(0, skillLimit);
  const pageOneItSkills = itSkills.slice(0, itSkillLimit);

  return {
    pageOneSkills,
    pageTwoSkills: skills.slice(skillLimit),
    pageOneItSkills,
    pageTwoItSkills: itSkills.slice(itSkillLimit),
    pageOneLanguages: [],
    pageTwoLanguages: data.languages ?? [],
  };
};

const splitReferences = (
  references: ReferenceEntry[],
  budget: number,
): SplitResult<ReferenceEntry> => {
  const fit: ReferenceEntry[] = [];
  let height = 0;

  for (const [index, reference] of references.entries()) {
    const nextHeight =
      lineCount(reference.name, 26) * 12 +
      lineCount([reference.position, reference.company].join(" "), 28) * 10 +
      lineCount([reference.phone, reference.email].join(" "), 28) * 10 +
      13;

    if (height + nextHeight > budget && fit.length > 0) {
      return { fit, remaining: references.slice(index), height };
    }

    fit.push(reference);
    height += nextHeight;
  }

  return { fit, remaining: [], height };
};

const estimateSimpleSectionHeight = (data: CVData) => {
  const certificationHeight =
    data.certifications.length > 0
      ? 36 +
        data.certifications.reduce(
          (total, item) =>
            total +
            lineCount(item.title, 58) * 11 +
            lineCount(
              [
                item.issuer,
                item.reference,
                item.issueDate || item.year,
                item.expiryDate,
              ]
                .filter(Boolean)
                .join(" | "),
              64,
            ) *
              9 +
            lineCount(item.description, 64) * 9 +
            (Array.isArray(item.bullets)
              ? item.bullets.reduce(
                  (sum, bullet) => sum + lineCount(bullet.text, 64) * 9,
                  0,
                )
              : 0) +
            10,
          0,
        )
      : 0;
  const achievementHeight =
    data.achievements.length > 0
      ? 34 +
        data.achievements.reduce(
          (total, item) =>
            total +
            lineCount(item.title, 62) * 11 +
            lineCount(item.description, 72) * 10 +
            10,
          0,
        )
      : 0;

  return certificationHeight + achievementHeight;
};

export const paginateYellowProfessionalTimeline = (
  data: CVData,
): YellowTimelinePageData[] => {
  const pageOneMainBudget =
    PAGE_HEIGHT - PAGE_TOP - PAGE_BOTTOM - PAGE_ONE_HEADER;
  const profileHeight =
    data.profileSummary.trim().length > 0
      ? 48 + lineCount(data.profileSummary, 76) * 13
      : 0;
  const pageOneExperienceBudget = Math.max(
    0,
    pageOneMainBudget - profileHeight - 18,
  );
  const pageOneExperience = splitExperience(
    data.experience,
    pageOneExperienceBudget,
    false,
    3,
  );
  const educationHeight = estimateEducationHeight(data.education);
  const pageOneEducationFits =
    educationHeight > 0 &&
    profileHeight + pageOneExperience.height + educationHeight + 18 <=
      pageOneMainBudget - 36;
  const pageOneEducation = pageOneEducationFits ? data.education : [];
  const pageTwoEducation = pageOneEducationFits ? [] : data.education;
  const sidebarBudget = PAGE_HEIGHT - PAGE_TOP - PAGE_BOTTOM - PAGE_ONE_HEADER - 6;
  const sidebarSplit = splitSidebarSkills(data, sidebarBudget);
  const sidebarHeight = estimateSidebarHeight({
    skills: sidebarSplit.pageOneSkills,
    itSkills: sidebarSplit.pageOneItSkills,
    languages: sidebarSplit.pageOneLanguages,
  });

  const firstPage: YellowTimelinePageData = {
    kind: "primary",
    pageNumber: 1,
    personal: data.personal,
    profileSummary: data.profileSummary,
    experience: pageOneExperience.fit,
    education: pageOneEducation,
    skills: sidebarSplit.pageOneSkills,
    itSkills: sidebarSplit.pageOneItSkills,
    languages: sidebarSplit.pageOneLanguages,
    references: [],
    certifications: [],
    achievements: [],
    remainingReferences: [],
    isTooLong: false,
  };

  const pageTwo: YellowTimelinePageData = {
    kind: "continuation",
    pageNumber: 2,
    personal: data.personal,
    profileSummary: "",
    experience: pageOneExperience.remaining,
    education: pageTwoEducation,
    skills: sidebarSplit.pageTwoSkills,
    itSkills: sidebarSplit.pageTwoItSkills,
    languages: sidebarSplit.pageTwoLanguages,
    references: [],
    certifications: data.certifications,
    achievements: data.achievements ?? [],
    remainingReferences: data.references ?? [],
    isTooLong: false,
  };

  const pageTwoBudget = PAGE_HEIGHT - PAGE_TOP - PAGE_BOTTOM - PAGE_TWO_HEADER;
  const pageTwoExperience = splitExperience(pageTwo.experience, pageTwoBudget, true);
  const pageTwoUsed =
    pageTwoExperience.height +
    estimateEducationHeight(pageTwo.education, true) +
    estimateSimpleSectionHeight(data) +
    skillGroupHeight(pageTwo.skills) +
    skillGroupHeight(pageTwo.itSkills) +
    languageGroupHeight(pageTwo.languages) +
    splitReferences(pageTwo.remainingReferences, Number.POSITIVE_INFINITY).height;
  const hasOverflow =
    pageTwoExperience.remaining.length > 0 ||
    pageTwoUsed > pageTwoBudget ||
    sidebarHeight > sidebarBudget;

  pageTwo.experience = [
    ...pageTwoExperience.fit,
    ...pageTwoExperience.remaining,
  ];
  pageTwo.isTooLong = hasOverflow;
  firstPage.isTooLong = hasOverflow;

  const needsPageTwo =
    pageTwo.experience.length > 0 ||
    pageTwo.education.length > 0 ||
    pageTwo.certifications.length > 0 ||
    pageTwo.achievements.length > 0 ||
    pageTwo.skills.length > 0 ||
    pageTwo.itSkills.length > 0 ||
    pageTwo.languages.length > 0 ||
    pageTwo.remainingReferences.length > 0;

  return needsPageTwo ? [firstPage, pageTwo] : [firstPage];
};

export const isYellowProfessionalTimelineTooLong = (data: CVData) =>
  paginateYellowProfessionalTimeline(data).some((page) => page.isTooLong);
