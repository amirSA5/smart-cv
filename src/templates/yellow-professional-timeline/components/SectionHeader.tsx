import { sectionHeadingClass, sidebarHeadingClass, yellowAccent } from "../yellowProfessionalTimelineStyles";

type SectionHeaderProps = {
  title: string;
  sidebar?: boolean;
};

const SectionHeader = ({ title, sidebar = false }: SectionHeaderProps) => {
  if (sidebar) {
    return (
      <h3 className={sidebarHeadingClass}>
        {title}
      </h3>
    );
  }

  return (
    <h2 className={sectionHeadingClass}>
      <span className="h-[4px] w-8 rounded-full" style={{ background: yellowAccent }} />
      {title}
    </h2>
  );
};

export default SectionHeader;
