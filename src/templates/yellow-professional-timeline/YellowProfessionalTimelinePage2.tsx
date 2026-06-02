import { yellowProfessionalTimelineLabels } from "../../constants/cvLabels";
import type {
  AchievementEntry,
  CVLanguage,
  LanguageEntry,
  Skill,
} from "../../types/cv";
import CertificationGrid from "./components/CertificationGrid";
import EducationSection from "./components/EducationSection";
import ExperienceTimeline from "./components/ExperienceTimeline";
import HeaderWithPhoto from "./components/HeaderWithPhoto";
import ReferencesBlock from "./components/ReferencesBlock";
import SectionHeader from "./components/SectionHeader";
import SkillBar from "./components/SkillBar";
import type { YellowTimelinePageData } from "./yellowProfessionalTimelinePagination";
import { pageShellClass, subtleCardClass } from "./yellowProfessionalTimelineStyles";

type YellowPage2Props = {
  page: YellowTimelinePageData;
  language: CVLanguage;
};

const ContinuedSkills = ({
  entries,
  title,
}: {
  entries: Skill[];
  title: string;
}) => {
  const visible = entries.filter((entry) => entry.name.trim());

  if (visible.length === 0) {
    return null;
  }

  return (
    <section className="break-inside-avoid">
      <SectionHeader title={title} />
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {visible.map((skill) => (
          <SkillBar key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
};

const LanguagesBlock = ({
  entries,
  title,
}: {
  entries: LanguageEntry[];
  title: string;
}) => {
  const visible = entries.filter((entry) => entry.name || entry.level);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section className="break-inside-avoid">
      <SectionHeader title={title} />
      <div className="grid grid-cols-3 gap-2">
        {visible.map((entry) => (
          <p
            key={entry.id}
            className={`${subtleCardClass} px-2.5 py-1.5 text-[8.8px] font-semibold leading-[10.5px] text-neutral-700`}
          >
            <span className="font-black text-black">{entry.name}</span>
            {entry.level ? ` - ${entry.level}` : ""}
          </p>
        ))}
      </div>
    </section>
  );
};

const AchievementsBlock = ({
  entries,
  title,
}: {
  entries: AchievementEntry[];
  title: string;
}) => {
  const visible = entries.filter((entry) => entry.title || entry.description);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section className="break-inside-avoid">
      <SectionHeader title={title} />
      <div className="grid grid-cols-2 gap-2">
        {visible.map((entry) => (
          <article key={entry.id} className={`${subtleCardClass} px-2.5 py-1.5`}>
            <h3 className="text-[9.5px] font-black uppercase leading-[11.5px] text-black">
              {entry.title}
            </h3>
            {entry.description ? (
              <p className="mt-0.5 text-[8.6px] font-medium leading-[10.2px] text-neutral-700">
                {entry.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

const YellowProfessionalTimelinePage2 = ({
  page,
  language,
}: YellowPage2Props) => {
  const labels = yellowProfessionalTimelineLabels[language];

  return (
    <article className={pageShellClass}>
      <HeaderWithPhoto compact personal={page.personal} />

      <div className="space-y-3.5">
        <ExperienceTimeline
          compact
          entries={page.experience}
          title={labels.experienceContinued}
        />
        <EducationSection compact entries={page.education} title={labels.education} />
        <CertificationGrid
          entries={page.certifications}
          title={labels.certifications}
        />
        <LanguagesBlock entries={page.languages} title={labels.languages} />
        <ContinuedSkills entries={page.skills} title={labels.skillsContinued} />
        <ContinuedSkills entries={page.itSkills} title={labels.itSkillsContinued} />
        <ReferencesBlock
          entries={page.remainingReferences}
          emailLabel={labels.email}
          phoneLabel={labels.phone}
          title={labels.references}
        />
        <AchievementsBlock
          entries={page.achievements}
          title={labels.achievements}
        />
      </div>
    </article>
  );
};

export default YellowProfessionalTimelinePage2;
