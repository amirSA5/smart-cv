import type { ReferenceEntry } from "../../../types/cv";
import SectionTitle from "./SectionTitle";

const joinParts = (items: Array<string | undefined>) =>
  items.map((item) => item?.trim()).filter(Boolean).join(" | ");

const ReferenceCards = ({
  entries,
  title,
}: {
  entries: ReferenceEntry[];
  title: string;
}) => {
  const visible = entries.filter(
    (entry) => entry.name || entry.position || entry.company || entry.phone || entry.email,
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle mark="R" title={title} />
      <div className={visible.length === 1 ? "grid gap-3" : "grid grid-cols-2 gap-4"}>
        {visible.map((entry) => (
          <article key={entry.id} className="break-inside-avoid">
            <p className="text-[calc(10px*var(--photo-font-scale))] font-black leading-[calc(12px*var(--photo-font-scale))] text-black">
              {entry.name}
            </p>
            <p className="mt-0.5 text-[calc(8.5px*var(--photo-font-scale))] font-medium leading-[calc(10px*var(--photo-font-scale))] text-neutral-700">
              {joinParts([entry.position, entry.company])}
            </p>
            {entry.phone ? (
              <p className="mt-1 text-[calc(8.2px*var(--photo-font-scale))] font-semibold leading-[calc(9.6px*var(--photo-font-scale))] text-neutral-600">
                <span className="font-black text-black">Phone: </span>
                {entry.phone}
              </p>
            ) : null}
            {entry.email ? (
              <p className="text-[calc(8.2px*var(--photo-font-scale))] font-semibold leading-[calc(9.6px*var(--photo-font-scale))] text-neutral-600">
                <span className="font-black text-black">Email: </span>
                {entry.email}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ReferenceCards;
