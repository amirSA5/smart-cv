import type {
  BulletPoint,
  CVData,
  CVPreviewPage,
  CertificationEntry,
  ContinuationSection,
  EducationEntry,
  ExperienceEntry,
  Skill,
} from "../types/cv";

const PAGE_HEIGHT = 1123;
const PAGE_ONE_TOP_SAFE = 64;
const PAGE_ONE_BOTTOM_SAFE = 180;

const MAIN_CHARS_PER_LINE = 58;
const COMPACT_CHARS_PER_LINE = 48;
const SIDEBAR_CHARS_PER_LINE = 28;

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

const estimateHeaderHeight = (data: CVData) => {
  const nameLines = Math.max(1, Math.ceil(data.personal.fullName.length / 15));
  const titleLines = Math.max(1, Math.ceil(data.personal.jobTitle.length / 28));
  const profileLines = lineCount(data.profileSummary, 50);
  const rightColumnHeight =
    PAGE_ONE_TOP_SAFE +
    nameLines * 45 +
    10 +
    titleLines * 22 +
    28 +
    30 +
    10 +
    profileLines * 17 +
    22;

  return Math.max(330, rightColumnHeight);
};

const estimateContactHeight = (data: CVData) => {
  const primaryRowHeight = [
    data.personal.phone,
    data.personal.email,
    data.personal.location,
  ].reduce(
    (height, value) => Math.max(height, lineCount(value, 28) * 16),
    0,
  );
  const websiteHeight = lineCount(data.personal.website, 76) * 16;
  const rowGap = primaryRowHeight > 0 && websiteHeight > 0 ? 8 : 0;

  return 28 + 16 + primaryRowHeight + websiteHeight + rowGap + 40;
};

const sectionTitleHeight = (compact = false) => (compact ? 22 : 30);

const skillHeight = (skill: Skill, compact = false) =>
  Math.max(1, lineCount(skill.name, compact ? 42 : SIDEBAR_CHARS_PER_LINE)) *
  (compact ? 17 : 21);

const skillsSectionHeight = (items: Skill[], compact = false) => {
  if (items.length === 0) {
    return 0;
  }

  return (
    sectionTitleHeight(true) +
    16 +
    items.reduce((total, skill) => total + skillHeight(skill, compact), 0) +
    Math.max(0, items.length - 1) * (compact ? 4 : 8)
  );
};

const educationEntryHeight = (
  entry: EducationEntry,
  options: { compact?: boolean; showDescription?: boolean; chars?: number } = {},
) => {
  const compact = options.compact ?? false;
  const showDescription = options.showDescription ?? true;
  const chars = options.chars ?? (compact ? COMPACT_CHARS_PER_LINE : SIDEBAR_CHARS_PER_LINE);

  return (
    (compact ? 16 : 20) +
    (compact ? 5 : 8) +
    lineCount(entry.school, chars) * (compact ? 17 : 20) +
    (compact ? 17 : 20) +
    (showDescription && entry.description
      ? 6 + lineCount(entry.description, chars) * (compact ? 16 : 18)
      : 0)
  );
};

const educationSectionHeight = (
  items: EducationEntry[],
  options: { compact?: boolean; showDescription?: boolean; chars?: number } = {},
) => {
  if (items.length === 0) {
    return 0;
  }

  const compact = options.compact ?? false;
  return (
    sectionTitleHeight(true) +
    14 +
    items.reduce(
      (total, entry) => total + educationEntryHeight(entry, options),
      0,
    ) +
    Math.max(0, items.length - 1) * (compact ? 12 : 20)
  );
};

const bulletHeight = (bullet: BulletPoint, compact = false) =>
  lineCount(bullet.text, compact ? COMPACT_CHARS_PER_LINE : MAIN_CHARS_PER_LINE) *
  (compact ? 17 : 21);

const visibleBullets = (entry: ExperienceEntry) =>
  entry.bullets.filter((bullet) => bullet.text.trim());

const experienceEntryHeightForBullets = (
  entry: ExperienceEntry,
  bullets: BulletPoint[],
  compact = false,
) => {
  const bulletCount = bullets.length;

  return (
    (compact ? 16 : 20) +
    (compact ? 5 : 8) +
    lineCount(entry.company, compact ? 52 : 40) * (compact ? 17 : 20) +
    (compact ? 17 : 20) +
    (bulletCount > 0 ? (compact ? 5 : 8) : 0) +
    bullets.reduce((total, bullet) => total + bulletHeight(bullet, compact), 0) +
    Math.max(0, bulletCount - 1) * (compact ? 4 : 8)
  );
};

const experienceEntryHeight = (entry: ExperienceEntry, compact = false) =>
  experienceEntryHeightForBullets(entry, visibleBullets(entry), compact);

const certificationHeight = (entry: CertificationEntry, compact = false) => {
  const important =
    /licen[cs]e|aircraft maintenance|b1|a320|neo|ewis|sms|quality|part-145|moe|human factors/i.test(
      entry.title,
    );

  return (
    (important ? 8 : 0) +
    (compact ? 16 : 20) +
    5 +
    lineCount(
      [entry.issuer, entry.year].filter(Boolean).join(" - "),
      compact ? 44 : 46,
    ) *
      (compact ? 17 : 20) +
    (important ? 8 : 0)
  );
};

const splitByHeight = <T>(
  items: T[],
  budget: number,
  itemHeight: (item: T) => number,
  sectionBaseHeight: number,
  itemGap: number,
): SplitResult<T> => {
  const fit: T[] = [];
  let height = 0;

  for (const item of items) {
    const nextHeight =
      (fit.length === 0 ? sectionBaseHeight : itemGap) + itemHeight(item);

    if (height + nextHeight > budget) {
      break;
    }

    fit.push(item);
    height += nextHeight;
  }

  return {
    fit,
    remaining: items.slice(fit.length),
    height,
  };
};

const splitSkills = (items: Skill[], budget: number, compact = false) =>
  splitByHeight(
    items,
    budget,
    (item) => skillHeight(item, compact),
    sectionTitleHeight(true) + 16,
    compact ? 4 : 8,
  );

const splitExperience = (
  items: ExperienceEntry[],
  budget: number,
  compact = false,
): SplitResult<ExperienceEntry> => {
  const fit: ExperienceEntry[] = [];
  let height = 0;
  const sectionBaseHeight = sectionTitleHeight(compact) + (compact ? 12 : 20);
  const itemGap = compact ? 16 : 24;

  for (const [entryIndex, entry] of items.entries()) {
    const prefixHeight = fit.length === 0 ? sectionBaseHeight : itemGap;
    const fullEntryHeight = experienceEntryHeight(entry, compact);

    if (height + prefixHeight + fullEntryHeight <= budget) {
      fit.push(entry);
      height += prefixHeight + fullEntryHeight;
      continue;
    }

    const bullets = visibleBullets(entry);
    const availableForEntry = budget - height - prefixHeight;

    if (availableForEntry > 0 && bullets.length > 1) {
      const partialBullets: BulletPoint[] = [];

      for (const bullet of bullets) {
        const nextBullets = [...partialBullets, bullet];
        const nextEntryHeight = experienceEntryHeightForBullets(
          entry,
          nextBullets,
          compact,
        );

        if (nextEntryHeight > availableForEntry) {
          break;
        }

        partialBullets.push(bullet);
      }

      if (partialBullets.length > 0) {
        const remainingBulletIds = new Set(
          partialBullets.map((bullet) => bullet.id),
        );
        const remainingBullets = bullets.filter(
          (bullet) => !remainingBulletIds.has(bullet.id),
        );
        const partialEntry: ExperienceEntry = {
          ...entry,
          bullets: partialBullets,
        };
        const remainingEntry: ExperienceEntry = {
          ...entry,
          id: `${entry.id}-continued`,
          continued: true,
          bullets: remainingBullets,
        };

        fit.push(partialEntry);
        height +=
          prefixHeight +
          experienceEntryHeightForBullets(entry, partialBullets, compact);

        return {
          fit,
          remaining: [remainingEntry, ...items.slice(entryIndex + 1)],
          height,
        };
      }
    }

    return {
      fit,
      remaining: items.slice(entryIndex),
      height,
    };
  }

  return {
    fit,
    remaining: [],
    height,
  };
};

const splitCertifications = (
  items: CertificationEntry[],
  budget: number,
  compact = false,
) =>
  splitByHeight(
    items,
    budget,
    (item) => certificationHeight(item, compact),
    sectionTitleHeight(compact) + (compact ? 14 : 18),
    compact ? 12 : 16,
  );

const addContinuationSection = (
  sections: ContinuationSection[],
  section: ContinuationSection,
) => {
  const hasEntries =
    "entries" in section ? section.entries.length > 0 : Boolean(section.text.trim());

  if (hasEntries) {
    sections.push(section);
  }
};

const packSecondPage = (
  personal: CVData["personal"],
  sections: ContinuationSection[],
) => {
  if (sections.length === 0) {
    return [];
  }

  return [
    {
      kind: "continuation",
      pageNumber: 2,
      personal,
      sections,
    } satisfies CVPreviewPage,
  ];
};

export const paginateCv = (data: CVData): CVPreviewPage[] => {
  const headerHeight = estimateHeaderHeight(data);
  const contactHeight = estimateContactHeight(data);
  const bodyHeight = PAGE_HEIGHT - headerHeight - contactHeight;
  const mainBudget = Math.max(0, bodyHeight - 40 - PAGE_ONE_BOTTOM_SAFE);
  const sidebarBudget = Math.max(0, bodyHeight - 50 - 34);

  const fullSkillsHeight = skillsSectionHeight(data.skills);
  const fullEducationHeight = educationSectionHeight(data.education, {
    compact: false,
    showDescription: false,
  });
  const sidebarDecorationReserve = 126;
  const skillsAndEducationHeight =
    fullSkillsHeight +
    (data.education.length > 0 ? 36 + fullEducationHeight : 0) +
    sidebarDecorationReserve;
  const educationFits =
    data.education.length > 0 && skillsAndEducationHeight <= sidebarBudget;
  const skillBudget = educationFits
    ? sidebarBudget - fullEducationHeight - 36 - sidebarDecorationReserve
    : sidebarBudget - sidebarDecorationReserve;
  const pageOneSkills = splitSkills(data.skills, Math.max(0, skillBudget));
  const pageOneEducation = educationFits ? data.education : [];

  const pageOneExperience = splitExperience(data.experience, mainBudget);
  const needsContinuation =
    pageOneExperience.remaining.length > 0 ||
    pageOneSkills.remaining.length > 0 ||
    (data.education.length > 0 && !educationFits) ||
    data.languages.length > 0;
  const remainingMain = mainBudget - pageOneExperience.height - 28;
  const pageOneCertifications = needsContinuation
    ? { fit: [], remaining: data.certifications, height: 0 }
    : splitCertifications(data.certifications, Math.max(0, remainingMain));

  const firstPage: CVPreviewPage = {
    kind: "primary",
    pageNumber: 1,
    personal: data.personal,
    profileSummary: data.profileSummary.trim(),
    skills: pageOneSkills.fit,
    education: pageOneEducation,
    languages: [],
    experience: pageOneExperience.fit,
    certifications: pageOneCertifications.fit,
  };

  const continuationSections: ContinuationSection[] = [];

  addContinuationSection(continuationSections, {
    type: "experience",
    title: "Experience Continued",
    entries: pageOneExperience.remaining,
  });
  addContinuationSection(continuationSections, {
    type: "certifications",
    title: "Certifications",
    entries: pageOneCertifications.remaining,
  });
  addContinuationSection(continuationSections, {
    type: "education",
    title: "Education",
    entries: educationFits ? [] : data.education,
  });
  addContinuationSection(continuationSections, {
    type: "languages",
    title: "Languages",
    entries: data.languages,
  });
  addContinuationSection(continuationSections, {
    type: "skills",
    title: "Skills",
    entries: pageOneSkills.remaining,
  });

  return [firstPage, ...packSecondPage(data.personal, continuationSections)];
};
