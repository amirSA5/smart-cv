import type { ExperienceEntry } from "../../../types/cv";
import SectionTitle from "./SectionTitle";

const joinParts = (items: Array<string | undefined>) =>
  items.map((item) => item?.trim()).filter(Boolean).join(" | ");

const ExperienceList = ({
  entries,
  title,
  compact = false,
}: {
  entries: ExperienceEntry[];
  title: string;
  compact?: boolean;
}) => {
  const visible = entries.filter(
    (entry) =>
      entry.jobTitle ||
      entry.company ||
      entry.bullets.some((bullet) => bullet.text.trim()),
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle mark="W" title={title} />
      <div className={compact ? "space-y-2.5" : "space-y-3"}>
        {visible.map((entry) => {
          const bullets = entry.bullets.filter((bullet) => bullet.text.trim());
          const meta = joinParts([entry.company, entry.location]);

          return (
            <article key={entry.id} className="break-inside-avoid">
              <div className="grid grid-cols-[minmax(0,1fr)_86px] gap-3">
                <div className="min-w-0">
                  <h3 className="text-[calc(10.5px*var(--photo-font-scale))] font-black leading-[calc(12.5px*var(--photo-font-scale))] text-black">
                    {entry.jobTitle}
                  </h3>
                  {meta ? (
                    <p className="mt-0.5 text-[calc(8.6px*var(--photo-font-scale))] font-semibold leading-[calc(10px*var(--photo-font-scale))] text-neutral-600">
                      {meta}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 text-right text-[calc(8.2px*var(--photo-font-scale))] font-black leading-[calc(9.5px*var(--photo-font-scale))] text-black">
                  {joinParts([entry.startDate, entry.current ? "Present" : entry.endDate])}
                </p>
              </div>
              {bullets.length ? (
                <ul className="mt-1 space-y-0.5 text-[calc(8.6px*var(--photo-font-scale))] font-medium leading-[calc(10.5px*var(--photo-font-scale))] text-neutral-700">
                  {bullets.map((bullet) => (
                    <li key={bullet.id} className="flex gap-1.5">
                      <span
                        className="mt-[4px] h-[2.5px] w-[2.5px] shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--photo-accent)" }}
                      />
                      <span>{bullet.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceList;
