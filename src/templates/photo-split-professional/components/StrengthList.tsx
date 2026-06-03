import type { StrengthEntry } from "../../../types/cv";
import SectionTitle from "./SectionTitle";

const StrengthList = ({
  entries,
  title,
  grid = false,
}: {
  entries: StrengthEntry[];
  title: string;
  grid?: boolean;
}) => {
  const visible = entries.filter((entry) => entry.title || entry.description);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle mark="S" title={title} />
      <div className={grid ? "grid grid-cols-2 gap-x-4 gap-y-2.5" : "space-y-2.5"}>
        {visible.map((entry) => (
          <article key={entry.id} className="break-inside-avoid">
            <p className="text-[calc(9.4px*var(--photo-font-scale))] font-black leading-[calc(11px*var(--photo-font-scale))] text-black">
              {entry.title}
            </p>
            {entry.description ? (
              <p className="mt-0.5 text-[calc(8.4px*var(--photo-font-scale))] font-medium leading-[calc(10px*var(--photo-font-scale))] text-neutral-700">
                {entry.description}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default StrengthList;
