import type {
  CVPreviewPage,
  CertificationEntry,
  ContinuationSection,
  EducationEntry,
  ExperienceEntry,
  LanguageEntry,
  Skill,
} from "../types/cv";
import type { ReactNode } from "react";
import SectionTitle from "./SectionTitle";

type CVPageProps = {
  page: CVPreviewPage;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "CV";

const BulletList = ({
  items,
  light = false,
  compact = false,
}: {
  items: string[];
  light?: boolean;
  compact?: boolean;
}) => (
  <ul
    className={[
      "m-0 list-none p-0",
      compact ? "space-y-0.5" : "space-y-2",
      light ? "text-white" : "text-ink",
    ].join(" ")}
  >
    {items
      .filter((item) => item.trim())
      .map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={[
            "grid grid-cols-[8px_1fr] gap-3",
            compact ? "text-[10.5px] leading-[14px]" : "text-[14px] leading-[21px]",
          ].join(" ")}
        >
          <span
            className={[
              "rounded-full bg-current",
              compact ? "mt-[5px]" : "mt-[7px]",
              compact ? "h-1 w-1" : "h-1.5 w-1.5",
            ].join(" ")}
          />
          <span>{item}</span>
        </li>
      ))}
  </ul>
);

const ContactItem = ({
  value,
  className = "",
}: {
  value?: string;
  className?: string;
}) => {
  if (!value?.trim()) {
    return null;
  }

  return (
    <li
      className={[
        "grid min-w-0 grid-cols-[7px_1fr] items-start gap-3 text-[12px] font-semibold leading-4 text-white",
        className,
      ].join(" ")}
    >
      <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-white" />
      <span className="min-w-0 break-words">{value}</span>
    </li>
  );
};

const ProfileImage = ({
  image,
  fullName,
}: {
  image?: string;
  fullName: string;
}) => (
  <div className="relative mx-auto h-[225px] w-[225px] rounded-[20px] border-[9px] border-evergreen bg-sage">
    {image ? (
      <img
        src={image}
        alt={`${fullName || "Profile"} portrait`}
        className="h-full w-full rounded-[10px] object-cover"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gradient-to-br from-sage to-white text-5xl font-black tracking-[0.12em] text-evergreen">
        {initials(fullName)}
      </div>
    )}
  </div>
);

const DotGrid = ({ light = false }: { light?: boolean }) => (
  <div className="grid w-[104px] grid-cols-6 gap-x-4 gap-y-4">
    {Array.from({ length: 18 }).map((_, index) => (
      <span
        key={index}
        className={[
          "h-1.5 w-1.5 rounded-full",
          light ? "bg-white" : "bg-charcoal",
        ].join(" ")}
      />
    ))}
  </div>
);

const EducationBlock = ({
  entries,
  light = true,
  showDescription = true,
  compact = false,
}: {
  entries: EducationEntry[];
  light?: boolean;
  showDescription?: boolean;
  compact?: boolean;
}) => (
  <div className={compact ? "space-y-2.5" : "space-y-5"}>
    {entries.map((entry) => (
      <article key={entry.id} className={light ? "text-white" : "text-ink"}>
        <h3
          className={[
            "font-black uppercase tracking-[0.12em]",
            compact ? "text-[9.5px] leading-[13px]" : "text-[13px] leading-5",
          ].join(" ")}
        >
          {entry.degree}
        </h3>
        <p
          className={[
            compact ? "mt-0.5 text-[10.5px] leading-[14px]" : "mt-2 text-[14px] leading-5",
          ].join(" ")}
        >
          {[entry.school, entry.location].filter(Boolean).join(" - ")}
        </p>
        <p className={compact ? "text-[10.5px] leading-[14px]" : "text-[14px] leading-5"}>
          {[entry.startYear, entry.endYear].filter(Boolean).join(" - ")}
        </p>
        {showDescription && entry.description ? (
          <p
            className={[
              "opacity-85",
              compact ? "mt-0.5 text-[9.5px] leading-[13px]" : "mt-2 text-[12px] leading-[18px]",
            ].join(" ")}
          >
            {entry.description}
          </p>
        ) : null}
      </article>
    ))}
  </div>
);

const ExperienceBlock = ({
  entries,
  compact = false,
}: {
  entries: ExperienceEntry[];
  compact?: boolean;
}) => (
  <div className={compact ? "space-y-2.5" : "space-y-6"}>
    {entries.map((entry) => (
      <article key={`${entry.id}-${entry.continued ? "continued" : "main"}`}>
        <h3
          className={[
            "font-black uppercase tracking-[0.13em]",
            compact ? "text-[9.5px] leading-[13px]" : "text-[13px] leading-5",
          ].join(" ")}
        >
          {entry.jobTitle}
        </h3>
        <p
          className={[
            compact ? "mt-0.5 text-[10.5px] leading-[14px]" : "mt-2 text-[14px] leading-5",
          ].join(" ")}
        >
          {[entry.company, entry.location].filter(Boolean).join(" - ")}
        </p>
        <p className={compact ? "text-[10.5px] leading-[14px]" : "text-[14px] leading-5"}>
          {[entry.startDate, entry.current ? "Present" : entry.endDate]
            .filter(Boolean)
            .join(" - ")}
        </p>
        <div className={compact ? "mt-0.5" : "mt-2"}>
          <BulletList compact={compact} items={entry.bullets.map((bullet) => bullet.text)} />
        </div>
      </article>
    ))}
  </div>
);

const LanguagesBlock = ({
  entries,
  light = true,
  compact = false,
}: {
  entries: LanguageEntry[];
  light?: boolean;
  compact?: boolean;
}) => {
  const normalizeLanguageName = (name: string) =>
    name.trim().toLowerCase() === "frnch" ? "French" : name;

  return (
    <div className={compact ? "space-y-1" : "space-y-2"}>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={[
            "flex items-baseline justify-between gap-4",
            compact ? "text-[10.5px] leading-[14px]" : "text-[13px] leading-5",
            light ? "text-white" : "text-ink",
          ].join(" ")}
        >
          <span className="font-bold">{normalizeLanguageName(entry.name)}</span>
          <span className="opacity-80">{entry.level}</span>
        </div>
      ))}
    </div>
  );
};

const CertificationsBlock = ({
  entries,
  compact = false,
  columns = false,
}: {
  entries: CertificationEntry[];
  compact?: boolean;
  columns?: boolean;
}) => {
  const normalizeCertificationTitle = (title: string) =>
    /^electrical wiring interconnect system$/i.test(title.trim())
      ? "Electrical Wiring Interconnection System — EWIS"
      : title;

  // Keep issuer text such as "Sabena Technics MiR" as entered until the source is confirmed.
  const normalizeCertificationIssuer = (issuer: string) => issuer;
  const formatCertificationMeta = (entry: CertificationEntry) =>
    [
      normalizeCertificationIssuer(entry.issuer),
      entry.reference,
      entry.issueDate || entry.year,
      entry.expiryDate ? `Expires ${entry.expiryDate}` : "",
    ]
      .filter((value): value is string => Boolean(value?.trim()))
      .join(" - ");

  return (
    <div
      className={
        columns ? "grid grid-cols-2 gap-2" : compact ? "space-y-2" : "space-y-4"
      }
    >
      {entries.map((entry) => (
        <article
          key={entry.id}
          className="rounded-md border-l-4 border-evergreen bg-[#f4f6f1] py-1.5 pl-3 pr-2"
        >
          <h3
            className={[
              "font-black uppercase tracking-[0.12em]",
              compact ? "text-[9.5px] leading-[13px]" : "text-[13px] leading-5",
            ].join(" ")}
          >
            {normalizeCertificationTitle(entry.title)}
          </h3>
          <p
            className={
              compact ? "mt-0.5 text-[10.5px] leading-[14px]" : "mt-1 text-[14px] leading-5"
            }
          >
            {formatCertificationMeta(entry)}
          </p>
          {entry.description ? (
            <p
              className={
                compact
                  ? "mt-0.5 text-[9.5px] leading-[13px] text-slate-600"
                  : "mt-1 text-[12px] leading-[18px] text-slate-600"
              }
            >
              {entry.description}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
};

const SkillsBlock = ({
  entries,
  light = true,
  compact = false,
}: {
  entries: Skill[];
  light?: boolean;
  compact?: boolean;
}) => (
  <BulletList compact={compact} light={light} items={entries.map((entry) => entry.name)} />
);

const SidebarSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="break-inside-avoid">
    <SectionTitle tone="light" compact>
      {title}
    </SectionTitle>
    <div className="mt-4">{children}</div>
  </section>
);

const getContinuationSection = <T extends ContinuationSection["type"]>(
  sections: ContinuationSection[],
  type: T,
) =>
  sections.find((section): section is Extract<ContinuationSection, { type: T }> =>
    section.type === type,
  );

const PrimaryPageView = ({ page }: { page: Extract<CVPreviewPage, { kind: "primary" }> }) => (
  <article className="cv-page flex flex-col">
    <div className="pointer-events-none absolute -left-[118px] -top-[118px] h-[220px] w-[220px] rounded-full bg-charcoal" />
    <div className="pointer-events-none absolute -bottom-[104px] -right-[104px] h-[190px] w-[190px] rounded-full bg-evergreen" />

    <header className="relative z-10 grid min-h-[330px] shrink-0 grid-cols-[330px_1fr] gap-8 px-[60px] pb-6 pt-[64px]">
      <div className="relative flex items-start justify-center">
        <div className="absolute left-0 right-0 top-[118px] h-[158px] rounded-t-[58px] bg-charcoal" />
        <ProfileImage image={page.personal.profileImage} fullName={page.personal.fullName} />
      </div>

      <div className="min-w-0 pt-3">
        <h1 className="text-[46px] font-black uppercase leading-[48px] tracking-[0.02em] text-charcoal">
          {page.personal.fullName || "Your Name"}
        </h1>
        <p className="mt-3 text-[18px] font-black uppercase leading-6 text-charcoal">
          {page.personal.jobTitle || "Professional Title"}
        </p>
        <section className="mt-8">
          <SectionTitle>Profile</SectionTitle>
          <p className="mt-3 whitespace-pre-line text-[13px] leading-[19px] text-ink">
            {page.profileSummary}
          </p>
        </section>
      </div>
    </header>

    <section className="relative z-20 mx-[60px] shrink-0 bg-evergreen px-7 py-5 text-white">
      <div className="flex items-center gap-6">
        <h2 className="shrink-0 text-[23px] font-black uppercase tracking-[0.16em]">
          Contact Me:
        </h2>
        <span className="h-px min-w-[80px] flex-1 bg-white/80" />
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-x-6 gap-y-2">
        <ContactItem value={page.personal.phone} />
        <ContactItem value={page.personal.email} />
        <ContactItem value={page.personal.location} />
        <ContactItem className="col-span-3" value={page.personal.website} />
      </ul>
    </section>

    <div className="relative z-10 grid min-h-0 flex-1 grid-cols-[360px_1fr]">
      <aside className="ml-[60px] flex min-h-0 w-[300px] flex-col overflow-hidden bg-charcoal text-white">
        <div className="space-y-7 px-7 pb-7 pt-10">
          {page.skills.length > 0 ? (
            <SidebarSection title="Skills">
              <SkillsBlock entries={page.skills} />
            </SidebarSection>
          ) : null}
          {page.education.length > 0 ? (
            <SidebarSection title="Education">
              <EducationBlock entries={page.education} showDescription={false} />
            </SidebarSection>
          ) : null}
        </div>

        <div className="mt-auto rounded-t-[34px] bg-evergreen px-7 pb-8 pt-7">
          <DotGrid light />
          {page.languages.length > 0 ? (
            <div className="mt-6">
              <SidebarSection title="Languages">
                <LanguagesBlock entries={page.languages} />
              </SidebarSection>
            </div>
          ) : null}
        </div>
      </aside>

      <main className="min-h-0 overflow-hidden px-11 pb-[170px] pt-10">
        {page.experience.length > 0 ? (
          <section className="break-inside-avoid">
            <SectionTitle>Experience</SectionTitle>
            <div className="mt-5">
              <ExperienceBlock entries={page.experience} />
            </div>
          </section>
        ) : null}
        {page.certifications.length > 0 ? (
          <section className="mt-7 break-inside-avoid">
            <SectionTitle compact>Certifications</SectionTitle>
            <div className="mt-4">
              <CertificationsBlock entries={page.certifications} />
            </div>
          </section>
        ) : null}
      </main>
    </div>
  </article>
);

const ContinuationPageView = ({
  page,
}: {
  page: Extract<CVPreviewPage, { kind: "continuation" }>;
}) => {
  const experience = getContinuationSection(page.sections, "experience");
  const certifications = getContinuationSection(page.sections, "certifications");
  const education = getContinuationSection(page.sections, "education");
  const languages = getContinuationSection(page.sections, "languages");
  const skills = getContinuationSection(page.sections, "skills");

  return (
    <article className="cv-page flex">
      <aside className="relative w-[64px] shrink-0 bg-charcoal">
        <div className="absolute bottom-[238px] left-[22px]">
          <DotGrid light />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[96px] shrink-0 items-end justify-between bg-evergreen px-11 pb-6 text-white">
          <div className="min-w-0">
            <h1 className="text-[26px] font-black uppercase leading-7 tracking-[0.08em]">
              {page.personal.fullName || "Your Name"}
            </h1>
            <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.18em]">
              {page.personal.jobTitle || "Professional Title"}
            </p>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Page 2</p>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden px-11 pb-[120px] pt-[30px]">
          <div className="space-y-4">
            {experience ? (
              <section className="break-inside-avoid">
                <SectionTitle compact>Experience Continued</SectionTitle>
                <div className="mt-2.5">
                  <ExperienceBlock entries={experience.entries} compact />
                </div>
              </section>
            ) : null}

            {certifications ? (
              <section className="break-inside-avoid">
                <SectionTitle compact>Certifications</SectionTitle>
                <div className="mt-2.5">
                  <CertificationsBlock entries={certifications.entries} compact columns />
                </div>
              </section>
            ) : null}

            <div className="grid grid-cols-[1.25fr_0.85fr] gap-7">
              {education ? (
                <section className="break-inside-avoid">
                  <SectionTitle compact>Education</SectionTitle>
                  <div className="mt-2.5">
                    <EducationBlock entries={education.entries} light={false} compact />
                  </div>
                </section>
              ) : null}
              {languages ? (
                <section className="break-inside-avoid">
                  <SectionTitle compact>Languages</SectionTitle>
                  <div className="mt-2.5">
                    <LanguagesBlock entries={languages.entries} light={false} compact />
                  </div>
                </section>
              ) : null}
            </div>

            {skills ? (
              <section className="break-inside-avoid">
                <SectionTitle compact>Skills</SectionTitle>
                <div className="mt-3 grid grid-cols-2 gap-x-6">
                  <SkillsBlock entries={skills.entries} light={false} compact />
                </div>
              </section>
            ) : null}
          </div>
        </main>
      </div>

      <div className="pointer-events-none absolute -bottom-[94px] -right-[92px] h-[190px] w-[190px] rounded-full bg-evergreen" />
    </article>
  );
};

const CVPage = ({ page }: CVPageProps) => {
  if (page.kind === "primary") {
    return <PrimaryPageView page={page} />;
  }

  return <ContinuationPageView page={page} />;
};

export default CVPage;
