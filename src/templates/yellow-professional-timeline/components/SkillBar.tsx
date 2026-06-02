import type { Skill } from "../../../types/cv";
import { yellowAccent } from "../yellowProfessionalTimelineStyles";

type SkillBarProps = {
  skill: Skill;
  compact?: boolean;
};

const levelValue = (value?: number) =>
  Math.min(100, Math.max(0, Number.isFinite(value) ? value ?? 80 : 80));

const SkillBar = ({ skill, compact = false }: SkillBarProps) => {
  const level = levelValue(skill.level);

  return (
    <div className="break-inside-avoid">
      <div
        className={[
          "mb-1 flex justify-between gap-2 font-black uppercase text-black",
          compact ? "text-[8.7px] leading-[10px]" : "text-[9px] leading-[10.5px]",
        ].join(" ")}
      >
        <span className="min-w-0">{skill.name}</span>
        <span>{level}%</span>
      </div>
      <div className={compact ? "h-[4px] bg-neutral-200" : "h-[4.5px] bg-neutral-200"}>
        <div className="h-full" style={{ background: yellowAccent, width: `${level}%` }} />
      </div>
    </div>
  );
};

export default SkillBar;
