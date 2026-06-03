import type {
  AchievementEntry,
  CertificationEntry,
  CVData,
  EducationEntry,
  ExperienceEntry,
  InterestEntry,
  LanguageEntry,
  ReferenceEntry,
  Skill,
  StrengthEntry,
} from "../../types/cv";

const PAGE_HEIGHT = 1123;
const PAGE_PADDING = 34;
const PAGE_TWO_HEADER = 72;
const PAGE_ONE_PHOTO = 278;
const PAGE_ONE_HEADER_RESERVED = 178;

export type PhotoSplitPageData = {
  kind: "primary" | "continuation";
  pageNumber: number;
  personal: CVData["personal"];
  profileSummary: string;
  skills: Skill[];
  certifications: CertificationEntry[];
  achievements: AchievementEntry[];
  strengths: StrengthEntry[];
  interests: InterestEntry[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  languages: LanguageEntry[];
  references: ReferenceEntry[];
  templateSettings: CVData["templateSettings"];
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

const visibleExperience = (entry: ExperienceEntry) =>
  hasText(
    entry.jobTitle,
    entry.company,
    entry.location,
    entry.startDate,
    entry.endDate,
    ...entry.bullets.map((bullet) => bullet.text),
  );

const estimateExperienceHeight = (entry: ExperienceEntry, compact = false) => {
  const bullets = entry.bullets.filter((bullet) => bullet.text.trim());

  return (
    lineCount([entry.jobTitle, entry.company].join(" - "), compact ? 62 : 56) *
      (compact ? 12 : 13) +
    lineCount([entry.location, entry.startDate, entry.endDate].join(" | "), 64) *
      10 +
    bullets.reduce(
      (total, bullet) => total + lineCount(bullet.text, compact ? 78 : 68) * (compact ? 10 : 11),
      0,
    ) +
    Math.max(0, bullets.length - 1) * 2 +
    (compact ? 14 : 16)
  );
};

const estimateEducationHeight = (entry: EducationEntry, compact = false) =>
  lineCount(entry.degree, compact ? 64 : 58) * (compact ? 11 : 12) +
  lineCount(entry.school, compact ? 66 : 60) * 10 +
  lineCount([entry.location, entry.startYear, entry.endYear].join(" | "), 72) * 9 +
  lineCount(entry.description, compact ? 74 : 68) * 9 +
  (compact ? 14 : 18);

const estimateSkillHeight = () => 19;

const estimateCertificationHeight = (entry: CertificationEntry, compact = false) => {
  const bullets = entry.bullets?.filter((bullet) => bullet.text.trim()) ?? [];

  return (
    lineCount(entry.title, compact ? 60 : 28) * (compact ? 10 : 11) +
    lineCount(
      [entry.issuer, entry.reference, entry.issueDate || entry.year, entry.expiryDate]
        .filter(Boolean)
        .join(" | "),
      compact ? 74 : 32,
    ) *
      9 +
    lineCount(entry.description, compact ? 76 : 34) * 9 +
    bullets.reduce(
      (total, bullet) => total + lineCount(bullet.text, compact ? 76 : 34) * 8,
      0,
    ) +
    14
  );
};

const estimateAchievementHeight = (entry: AchievementEntry, compact = false) =>
  lineCount(entry.title, compact ? 64 : 30) * 11 +
  lineCount(entry.description, compact ? 76 : 34) * 9 +
  12;

const estimateStrengthHeight = (entry: StrengthEntry, compact = false) =>
  lineCount(entry.title, compact ? 64 : 30) * 11 +
  lineCount(entry.description, compact ? 76 : 34) * 9 +
  12;

const estimateInterestCollectionHeight = (entries: InterestEntry[]) => {
  const visible = entries.filter((entry) => entry.name.trim());

  return visible.length > 0 ? 26 + Math.ceil(visible.length / 4) * 18 : 0;
};

const estimateLanguageCollectionHeight = (entries: LanguageEntry[]) => {
  const visible = entries.filter((entry) => entry.name || entry.level);

  return visible.length > 0 ? 26 + visible.length * 15 : 0;
};

const splitByHeight = <T>(
  entries: T[],
  budget: number,
  estimate: (entry: T) => number,
  titleHeight = 26,
): SplitResult<T> => {
  const fit: T[] = [];
  let height = entries.length > 0 ? titleHeight : 0;

  for (const [index, entry] of entries.entries()) {
    const itemHeight = estimate(entry);

    if (height + itemHeight > budget && fit.length > 0) {
      return { fit, remaining: entries.slice(index), height };
    }

    if (height + itemHeight > budget) {
      return { fit, remaining: entries.slice(index), height: 0 };
    }

    fit.push(entry);
    height += itemHeight;
  }

  return { fit, remaining: [], height };
};

const estimateCollectionHeight = <T>(
  entries: T[],
  estimate: (entry: T) => number,
  titleHeight = 26,
) =>
  entries.length > 0
    ? titleHeight + entries.reduce((total, entry) => total + estimate(entry), 0)
    : 0;

const getFontSizeScale = (data: CVData) => {
  const scale = Number(data.templateSettings?.fontSizeScale);

  return scale === 0.9 || scale === 1 || scale === 1.1 || scale === 1.2
    ? scale
    : 1;
};

const scaleHeight = (height: number, scale: number) =>
  Math.ceil(height * scale);

export const paginatePhotoSplitProfessional = (data: CVData): PhotoSplitPageData[] => {
  const fontScale = getFontSizeScale(data);
  const estimateScaledExperience = (entry: ExperienceEntry, compact = false) =>
    scaleHeight(estimateExperienceHeight(entry, compact), fontScale);
  const estimateScaledEducation = (entry: EducationEntry, compact = false) =>
    scaleHeight(estimateEducationHeight(entry, compact), fontScale);
  const estimateScaledSkill = () => scaleHeight(estimateSkillHeight(), fontScale);
  const estimateScaledCertification = (
    entry: CertificationEntry,
    compact = false,
  ) => scaleHeight(estimateCertificationHeight(entry, compact), fontScale);
  const estimateScaledAchievement = (entry: AchievementEntry, compact = false) =>
    scaleHeight(estimateAchievementHeight(entry, compact), fontScale);
  const estimateScaledStrength = (entry: StrengthEntry, compact = false) =>
    scaleHeight(estimateStrengthHeight(entry, compact), fontScale);
  const pageOneLeftBudget = PAGE_HEIGHT - PAGE_PADDING * 2 - PAGE_ONE_PHOTO - 28;
  const pageOneRightBudget =
    PAGE_HEIGHT - PAGE_PADDING * 2 - PAGE_ONE_HEADER_RESERVED;
  const visibleExperiences = data.experience.filter(visibleExperience);
  const leftEducation = splitByHeight(
    data.education,
    pageOneLeftBudget,
    (entry) => estimateScaledEducation(entry, true),
  );
  const leftStrengths = splitByHeight(
    data.strengths ?? [],
    Math.max(0, pageOneLeftBudget - leftEducation.height - 18),
    (entry) => estimateScaledStrength(entry),
  );
  const languageHeight = scaleHeight(
    estimateLanguageCollectionHeight(data.languages),
    fontScale,
  );
  const remainingLeftBudget = Math.max(
    0,
    pageOneLeftBudget - leftEducation.height - leftStrengths.height - 18,
  );
  const pageOneLanguages =
    languageHeight > 0 && languageHeight <= remainingLeftBudget
      ? data.languages
      : [];
  const pageTwoLanguages = pageOneLanguages.length > 0 ? [] : data.languages;
  const profileHeight =
    data.profileSummary.trim().length > 0
      ? 28 + lineCount(data.profileSummary, 74) * 12 * fontScale
      : 0;
  const experienceBudget = Math.max(0, pageOneRightBudget - profileHeight - 26);
  const pageOneExperience = splitByHeight(
    visibleExperiences,
    experienceBudget,
    (entry) => estimateScaledExperience(entry),
  );

  const firstPage: PhotoSplitPageData = {
    kind: "primary",
    pageNumber: 1,
    personal: data.personal,
    profileSummary: data.profileSummary,
    skills: [],
    certifications: [],
    achievements: [],
    strengths: leftStrengths.fit,
    interests: [],
    experience: pageOneExperience.fit,
    education: leftEducation.fit,
    languages: pageOneLanguages,
    references: [],
    templateSettings: data.templateSettings,
    isTooLong: false,
  };

  const pageTwo: PhotoSplitPageData = {
    kind: "continuation",
    pageNumber: 2,
    personal: data.personal,
    profileSummary: "",
    skills: data.skills,
    certifications: data.certifications,
    achievements: data.achievements ?? [],
    strengths: leftStrengths.remaining,
    interests: data.interests ?? [],
    experience: pageOneExperience.remaining,
    education: leftEducation.remaining,
    languages: pageTwoLanguages,
    references: data.references ?? [],
    templateSettings: data.templateSettings,
    isTooLong: false,
  };

  const pageTwoBudget = PAGE_HEIGHT - PAGE_PADDING * 2 - PAGE_TWO_HEADER;
  const pageTwoUsed =
    estimateCollectionHeight(pageTwo.experience, (entry) =>
      estimateScaledExperience(entry, true),
    ) +
    estimateCollectionHeight(pageTwo.education, (entry) =>
      estimateScaledEducation(entry, true),
    ) +
    estimateCollectionHeight(pageTwo.certifications, (entry) =>
      estimateScaledCertification(entry, true),
    ) +
    estimateCollectionHeight(pageTwo.skills, estimateScaledSkill) +
    estimateCollectionHeight(pageTwo.achievements, (entry) =>
      estimateScaledAchievement(entry, true),
    ) +
    estimateCollectionHeight(pageTwo.strengths, (entry) =>
      estimateScaledStrength(entry, true),
    ) +
    scaleHeight(estimateInterestCollectionHeight(pageTwo.interests), fontScale) +
    scaleHeight(estimateLanguageCollectionHeight(pageTwo.languages), fontScale) +
    (pageTwo.references.length > 0 ? 30 + pageTwo.references.length * 42 : 0);
  const isTooLong = pageTwoUsed > pageTwoBudget;

  firstPage.isTooLong = isTooLong;
  pageTwo.isTooLong = isTooLong;

  const needsPageTwo =
    pageTwo.experience.length > 0 ||
    pageTwo.education.length > 0 ||
    pageTwo.certifications.length > 0 ||
    pageTwo.skills.length > 0 ||
    pageTwo.achievements.length > 0 ||
    pageTwo.strengths.length > 0 ||
    pageTwo.interests.length > 0 ||
    pageTwo.languages.length > 0 ||
    pageTwo.references.length > 0;

  return needsPageTwo ? [firstPage, pageTwo] : [firstPage];
};

export const isPhotoSplitProfessionalTooLong = (data: CVData) =>
  paginatePhotoSplitProfessional(data).some((page) => page.isTooLong);
