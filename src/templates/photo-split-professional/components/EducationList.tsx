import type { EducationEntry } from "../../../types/cv";
import SectionTitle from "./SectionTitle";

const joinParts = (items: Array<string | undefined>) =>
  items.map((item) => item?.trim()).filter(Boolean).join(" | ");

const EducationList = ({
  entries,
  title,
  compact = false,
}: {
  entries: EducationEntry[];
  title: string;
  compact?: boolean;
}) => {
  const visible = entries.filter((entry) => entry.degree || entry.school);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle mark="E" title={title} />
      <div className="space-y-2.5">
        {visible.map((entry) => (
          <article key={entry.id} className="break-inside-avoid">
            {compact ? (
              <>
                <p className="text-[calc(9.8px*var(--photo-font-scale))] font-black leading-[calc(11.5px*var(--photo-font-scale))] text-black">
                  {entry.degree}
                </p>
                <p className="mt-0.5 text-[calc(8.4px*var(--photo-font-scale))] font-medium leading-[calc(10px*var(--photo-font-scale))] text-neutral-700">
                  {joinParts([entry.school, entry.location])}
                </p>
                <p className="mt-0.5 text-[calc(8px*var(--photo-font-scale))] font-black leading-[calc(9.5px*var(--photo-font-scale))] text-black">
                  {joinParts([entry.startYear, entry.endYear])}
                </p>
              </>
            ) : (
              <div className="grid grid-cols-[minmax(0,1fr)_92px] gap-3">
                <div className="min-w-0">
                  <p className="text-[calc(10px*var(--photo-font-scale))] font-black leading-[calc(12px*var(--photo-font-scale))] text-black">
                    {entry.degree}
                  </p>
                  <p className="mt-0.5 text-[calc(8.6px*var(--photo-font-scale))] font-medium leading-[calc(10px*var(--photo-font-scale))] text-neutral-700">
                    {joinParts([entry.school, entry.location])}
                  </p>
                </div>
                <p className="shrink-0 whitespace-nowrap text-right text-[calc(8.4px*var(--photo-font-scale))] font-black leading-[calc(10px*var(--photo-font-scale))] text-black">
                  {joinParts([entry.startYear, entry.endYear])}
                </p>
              </div>
            )}
            {entry.description ? (
              <p className="mt-0.5 text-[calc(8.4px*var(--photo-font-scale))] font-medium leading-[calc(10px*var(--photo-font-scale))] text-neutral-600">
                {entry.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default EducationList;
