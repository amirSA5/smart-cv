import type { EducationEntry } from "../../../types/cv";
import SectionHeader from "./SectionHeader";

type EducationSectionProps = {
  entries: EducationEntry[];
  title: string;
  className?: string;
  compact?: boolean;
};

const joinParts = (items: Array<string | undefined>) =>
  items.map((item) => item?.trim()).filter(Boolean).join(" | ");

const EducationSection = ({
  entries,
  title,
  className = "",
  compact = false,
}: EducationSectionProps) => {
  const visible = entries.filter(
    (entry) =>
      entry.degree ||
      entry.school ||
      entry.location ||
      entry.startYear ||
      entry.endYear ||
      entry.description,
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <section className={["break-inside-avoid", className].filter(Boolean).join(" ")}>
      <SectionHeader title={title} />
      <div className="relative border-l border-black pl-5">
        {visible.map((entry) => (
          <article
            key={entry.id}
            className={[
              "relative break-inside-avoid",
              compact ? "mb-2.5 last:mb-0" : "mb-3 last:mb-0",
            ].join(" ")}
          >
            <span className="absolute -left-[25px] top-[3px] h-[10px] w-[10px] rounded-full border-2 border-black bg-white" />
            <div className="flex gap-3">
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "font-black uppercase text-black",
                    compact ? "text-[10px] leading-[12px]" : "text-[10.5px] leading-[13px]",
                  ].join(" ")}
                >
                  {entry.degree}
                </p>
                <p className="mt-0.5 text-[8.8px] font-bold leading-[10.8px] text-neutral-700">
                  {joinParts([entry.school, entry.location])}
                </p>
              </div>
              <p className="w-[96px] shrink-0 text-right text-[8.4px] font-black uppercase leading-[10px] text-neutral-500">
                {joinParts([entry.startYear, entry.endYear])}
              </p>
            </div>
            {entry.description ? (
              <p className="mt-1 text-[8.7px] font-medium leading-[10.5px] text-neutral-600">
                {entry.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
