import type { InterestEntry } from "../../../types/cv";
import SectionTitle from "./SectionTitle";

const InterestList = ({
  entries,
  title,
}: {
  entries: InterestEntry[];
  title: string;
}) => {
  const visible = entries.filter((entry) => entry.name.trim());

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle mark="I" title={title} />
      <div className="flex flex-wrap gap-1.5">
        {visible.map((entry) => (
          <span
            key={entry.id}
            className="rounded-full border px-2 py-1 text-[calc(8.6px*var(--photo-font-scale))] font-black leading-none text-neutral-700"
            style={{ borderColor: "var(--photo-accent)" }}
          >
            {entry.name}
          </span>
        ))}
      </div>
    </section>
  );
};

export default InterestList;
