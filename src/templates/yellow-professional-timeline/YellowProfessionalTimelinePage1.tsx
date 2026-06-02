import { yellowProfessionalTimelineLabels } from "../../constants/cvLabels";
import type {
  CVLanguage,
  LanguageEntry,
  Skill,
} from "../../types/cv";
import ContactBlock from "./components/ContactBlock";
import EducationSection from "./components/EducationSection";
import ExperienceTimeline from "./components/ExperienceTimeline";
import HeaderWithPhoto from "./components/HeaderWithPhoto";
import SectionHeader from "./components/SectionHeader";
import SkillBar from "./components/SkillBar";
import type { YellowTimelinePageData } from "./yellowProfessionalTimelinePagination";
import { pageShellClass, yellowAccent } from "./yellowProfessionalTimelineStyles";

type YellowPageProps = {
  page: YellowTimelinePageData;
  language: CVLanguage;
};

const SidebarSkills = ({ entries, title }: { entries: Skill[]; title: string }) => {
  const visible = entries.filter((entry) => entry.name.trim());

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader sidebar title={title} />
      <div className="space-y-2">
        {visible.map((skill) => (
          <SkillBar key={skill.id} compact skill={skill} />
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
    <section>
      <SectionHeader sidebar title={title} />
      <div className="space-y-1.5">
        {visible.map((entry) => (
          <p key={entry.id} className="text-[9.4px] font-semibold leading-[11.5px] text-neutral-700">
            <span className="font-black text-black">{entry.name}</span>
            {entry.level ? ` - ${entry.level}` : ""}
          </p>
        ))}
      </div>
    </section>
  );
};

const YellowProfessionalTimelinePage1 = ({
  page,
  language,
}: YellowPageProps) => {
  const labels = yellowProfessionalTimelineLabels[language];

  return (
    <article className={pageShellClass}>
      <HeaderWithPhoto personal={page.personal} />

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_16px_236px] gap-x-4">
        <main className="min-w-0 pr-1">
          {page.profileSummary ? (
            <section>
              <SectionHeader title={labels.profile} />
              <p className="text-[10.2px] font-medium leading-[13px] text-neutral-700">
                {page.profileSummary}
              </p>
            </section>
          ) : null}

          <ExperienceTimeline
            className="mt-5"
            entries={page.experience}
            title={labels.experience}
          />
          <EducationSection
            className="mt-5"
            entries={page.education}
            title={labels.education}
          />
        </main>

        <div className="flex justify-center">
          <div className="h-[650px] w-[4px]" style={{ background: yellowAccent }} />
        </div>

        <aside className="min-w-0">
          <div className="space-y-5">
            <ContactBlock personal={page.personal} />
            <SidebarSkills entries={page.skills} title={labels.skills} />
            <SidebarSkills entries={page.itSkills} title={labels.itSkills} />
            <LanguagesBlock entries={page.languages} title={labels.languages} />
          </div>
        </aside>
      </div>
    </article>
  );
};

export default YellowProfessionalTimelinePage1;
