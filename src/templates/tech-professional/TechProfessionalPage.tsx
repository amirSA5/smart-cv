import { techProfessionalLabels } from "../../constants/cvLabels";
import type { ReactNode } from "react";
import type {
  CertificationEntry,
  CVLanguage,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  Skill,
  AchievementEntry,
} from "../../types/cv";
import type { TechProfessionalPageData } from "./techProfessionalPagination";

type TechProfessionalPageProps = {
  page: TechProfessionalPageData;
  language: CVLanguage;
};

const joinParts = (parts: Array<string | undefined>) =>
  parts.map((part) => part?.trim()).filter(Boolean).join(" | ");

const hasText = (...values: Array<string | undefined>) =>
  values.some((value) => Boolean(value?.trim()));

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="break-inside-avoid">
    <h2 className="border-b border-black pb-1 text-[13px] font-black uppercase leading-[16px] tracking-[0.2em] text-black">
      {title}
    </h2>
    <div className="mt-3">{children}</div>
  </section>
);

const ContactLine = ({ page }: { page: TechProfessionalPageData }) => {
  const items = [
    page.personal.phone,
    page.personal.email,
    page.personal.location,
    page.personal.website,
  ].filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] font-bold uppercase leading-[14px] tracking-[0.08em] text-neutral-700">
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </div>
  );
};

const PageHeader = ({ page }: { page: TechProfessionalPageData }) => {
  if (page.kind === "continuation") {
    return (
      <header className="mb-7 flex items-end justify-between border-b-2 border-black pb-3">
        <div>
          <p className="text-[18px] font-black uppercase leading-[22px] tracking-[0.14em] text-black">
            {page.personal.fullName || "Untitled CV"}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-600">
            {page.personal.jobTitle}
          </p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
          Page 2
        </p>
      </header>
    );
  }

  return (
    <header className="mb-7 border-b-2 border-black pb-5">
      <h1 className="max-w-[650px] text-[40px] font-black uppercase leading-[43px] tracking-[0.12em] text-black">
        {page.personal.fullName || "Untitled CV"}
      </h1>
      {page.personal.jobTitle ? (
        <p className="mt-2 text-[13px] font-black uppercase leading-[18px] tracking-[0.22em] text-neutral-700">
          {page.personal.jobTitle}
        </p>
      ) : null}
      <ContactLine page={page} />
      {page.profileSummary ? (
        <p className="mt-5 max-w-[650px] text-[11px] font-medium leading-[15px] text-neutral-700">
          {page.profileSummary}
        </p>
      ) : null}
    </header>
  );
};

const ExpertiseBlock = ({
  skills,
  language,
}: {
  skills: Skill[];
  language: CVLanguage;
}) => {
  const visible = skills.filter((skill) => skill.name.trim());

  if (visible.length === 0) {
    return null;
  }

  return (
    <Section title={techProfessionalLabels[language].expertise}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px] font-bold leading-[15px] text-neutral-800">
        {visible.map((skill) => (
          <div key={skill.id} className="flex gap-2">
            <span className="mt-[6px] h-[3px] w-[12px] shrink-0 bg-black" />
            <span>{skill.name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
};

const ExperienceList = ({
  entries,
  title,
}: {
  entries: ExperienceEntry[];
  title: string;
}) => {
  const visible = entries.filter((entry) =>
    hasText(entry.jobTitle, entry.company, ...entry.bullets.map((bullet) => bullet.text)),
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <Section title={title}>
      <div className="space-y-3.5">
        {visible.map((entry) => {
          const bullets = entry.bullets.filter((bullet) => bullet.text.trim());

          return (
            <article key={entry.id} className="break-inside-avoid">
              <div className="flex gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[12px] font-black uppercase leading-[16px] tracking-[0.04em] text-black">
                    {entry.jobTitle}
                  </h3>
                  <p className="mt-0.5 text-[10.5px] font-bold leading-[14px] text-neutral-700">
                    {joinParts([entry.company, entry.location])}
                  </p>
                </div>
                <p className="w-[130px] shrink-0 text-right text-[10px] font-black uppercase leading-[14px] tracking-[0.08em] text-neutral-600">
                  {joinParts([entry.startDate, entry.current ? "Present" : entry.endDate])}
                </p>
              </div>
              {bullets.length > 0 ? (
                <ul className="mt-1.5 space-y-1 text-[10.5px] font-medium leading-[14px] text-neutral-700">
                  {bullets.map((bullet) => (
                    <li key={bullet.id} className="flex gap-2">
                      <span className="mt-[6px] h-[3px] w-[3px] shrink-0 rounded-full bg-black" />
                      <span>{bullet.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </Section>
  );
};

const EducationBlock = ({
  entries,
  language,
}: {
  entries: EducationEntry[];
  language: CVLanguage;
}) => {
  const visible = entries.filter((entry) =>
    hasText(entry.degree, entry.school, entry.description),
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <Section title={techProfessionalLabels[language].education}>
      <div className="space-y-3">
        {visible.map((entry) => (
          <article key={entry.id} className="break-inside-avoid">
            <h3 className="text-[11.5px] font-black uppercase leading-[15px] tracking-[0.04em] text-black">
              {entry.degree}
            </h3>
            <p className="mt-0.5 text-[10.5px] font-bold leading-[14px] text-neutral-700">
              {joinParts([
                entry.school,
                entry.location,
                [entry.startYear, entry.endYear].filter(Boolean).join(" - "),
              ])}
            </p>
            {entry.description ? (
              <p className="mt-1 text-[10.5px] font-medium leading-[14px] text-neutral-700">
                {entry.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
};

const AchievementsBlock = ({
  entries,
  language,
}: {
  entries: AchievementEntry[];
  language: CVLanguage;
}) => {
  const visible = entries.filter((entry) =>
    hasText(entry.title, entry.description),
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <Section title={techProfessionalLabels[language].achievements}>
      <div className="grid gap-2">
        {visible.map((entry) => (
          <article key={entry.id} className="break-inside-avoid border-l-4 border-black pl-3">
            <h3 className="text-[11.5px] font-black uppercase leading-[15px] text-black">
              {entry.title}
            </h3>
            {entry.description ? (
              <p className="mt-1 text-[10.5px] font-medium leading-[14px] text-neutral-700">
                {entry.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
};

const CertificationCard = ({ entry }: { entry: CertificationEntry }) => {
  const dates = [entry.issueDate || entry.year, entry.expiryDate]
    .filter(Boolean)
    .join(" - ");

  return (
    <article className="break-inside-avoid rounded border border-neutral-200 bg-neutral-50 px-3 py-2">
      <h3 className="text-[10.5px] font-black uppercase leading-[13px] text-black">
        {entry.title}
      </h3>
      <p className="mt-1 text-[9.5px] font-bold leading-[12px] text-neutral-600">
        {joinParts([entry.issuer, entry.reference, dates])}
      </p>
      {entry.description ? (
        <p className="mt-1 text-[9.5px] font-medium leading-[12px] text-neutral-700">
          {entry.description}
        </p>
      ) : null}
    </article>
  );
};

const AdditionalInfoBlock = ({
  certifications,
  languages,
  language,
}: {
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  language: CVLanguage;
}) => {
  const visibleCertifications = certifications.filter((entry) =>
    hasText(entry.title, entry.issuer, entry.description),
  );
  const visibleLanguages = languages.filter((entry) =>
    hasText(entry.name, entry.level),
  );

  if (visibleCertifications.length === 0 && visibleLanguages.length === 0) {
    return null;
  }

  return (
    <Section title={techProfessionalLabels[language].additional}>
      <div className="space-y-3">
        {visibleCertifications.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {visibleCertifications.map((entry) => (
              <CertificationCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : null}
        {visibleLanguages.length > 0 ? (
          <div>
            <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">
              {language === "fr" ? "Langues" : "Languages"}
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold leading-[13px] text-neutral-700">
              {visibleLanguages.map((entry) => (
                <span
                  key={entry.id}
                  className="rounded-full border border-neutral-300 px-2.5 py-1"
                >
                  {joinParts([entry.name, entry.level])}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
};

const TechProfessionalPage = ({
  page,
  language,
}: TechProfessionalPageProps) => {
  const labels = techProfessionalLabels[language];

  return (
    <article className="cv-page bg-white px-[70px] py-[58px] font-body text-black">
      <div className="absolute left-[70px] top-[34px] h-[3px] w-[72px] bg-black" />
      <div className="absolute bottom-[34px] right-[70px] h-[3px] w-[72px] bg-black" />
      <PageHeader page={page} />

      <div className="space-y-5">
        {page.kind === "continuation" && page.skills.length > 0 ? (
          <ExpertiseBlock skills={page.skills} language={language} />
        ) : null}
        {page.kind === "primary" ? (
          <ExpertiseBlock skills={page.skills} language={language} />
        ) : null}
        <ExperienceList
          entries={page.experience}
          title={
            page.hasExperienceContinuation && page.kind === "continuation"
              ? labels.experienceContinued
              : labels.experience
          }
        />
        <EducationBlock entries={page.education} language={language} />
        <AchievementsBlock entries={page.achievements} language={language} />
        <AdditionalInfoBlock
          certifications={page.certifications}
          languages={page.languages}
          language={language}
        />
      </div>
    </article>
  );
};

export default TechProfessionalPage;
