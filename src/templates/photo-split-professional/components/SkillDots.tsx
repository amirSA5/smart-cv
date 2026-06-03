import type { Skill } from "../../../types/cv";
import SectionTitle from "./SectionTitle";

const dotCount = (level?: number) => {
  const safeLevel = Math.min(100, Math.max(0, Number.isFinite(level) ? level ?? 80 : 80));

  if (safeLevel <= 20) return 1;
  if (safeLevel <= 40) return 2;
  if (safeLevel <= 60) return 3;
  if (safeLevel <= 80) return 4;
  return 5;
};

const SkillDots = ({
  entries,
  title,
  columns = false,
}: {
  entries: Skill[];
  title: string;
  columns?: boolean;
}) => {
  const visible = entries.filter((entry) => entry.name.trim());

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle mark="S" title={title} />
      <div className={columns ? "grid grid-cols-2 gap-x-6 gap-y-1.5" : "space-y-2"}>
        {visible.map((skill) => {
          const filled = dotCount(skill.level);

          return (
            <div
              key={skill.id}
              className={[
                "grid items-center gap-2",
                columns
                  ? "grid-cols-[minmax(0,1fr)_58px]"
                  : "grid-cols-[minmax(0,1fr)_72px]",
              ].join(" ")}
            >
              <p className="min-w-0 text-[calc(9.5px*var(--photo-font-scale))] font-medium leading-[calc(11.5px*var(--photo-font-scale))] text-neutral-800">
                {skill.name}
              </p>
              <div className={columns ? "flex justify-end gap-1" : "flex justify-end gap-1.5"}>
                {[0, 1, 2, 3, 4].map((dot) => (
                  <span
                    key={dot}
                    className="rounded-full"
                    style={{
                      backgroundColor:
                        dot < filled ? "var(--photo-accent)" : "#e5e5e5",
                      height: columns
                        ? "calc(8px * var(--photo-font-scale))"
                        : "calc(9px * var(--photo-font-scale))",
                      width: columns
                        ? "calc(8px * var(--photo-font-scale))"
                        : "calc(9px * var(--photo-font-scale))",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SkillDots;
