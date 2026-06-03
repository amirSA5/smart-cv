import type { LanguageEntry } from "../../../types/cv";
import SectionTitle from "./SectionTitle";

const LanguageList = ({
  entries,
  title,
  compact = false,
}: {
  entries: LanguageEntry[];
  title: string;
  compact?: boolean;
}) => {
  const visible = entries.filter((entry) => entry.name || entry.level);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle mark="L" title={title} />
      <div className={compact ? "space-y-1.5" : "grid grid-cols-3 gap-2"}>
        {visible.map((entry) => (
          <p
            key={entry.id}
            className={[
              "font-medium text-neutral-700",
              compact
                ? "text-[calc(8.8px*var(--photo-font-scale))] leading-[calc(10.5px*var(--photo-font-scale))]"
                : "text-[calc(9px*var(--photo-font-scale))] leading-[calc(11px*var(--photo-font-scale))]",
            ].join(" ")}
          >
            <span className="font-black text-black">{entry.name}</span>
            {entry.level ? ` - ${entry.level}` : ""}
          </p>
        ))}
      </div>
    </section>
  );
};

export default LanguageList;
