import type { CertificationEntry } from "../../../types/cv";
import SectionTitle from "./SectionTitle";

const joinParts = (items: Array<string | undefined>) =>
  items.map((item) => item?.trim()).filter(Boolean).join(" | ");

const CertificateList = ({
  entries,
  title,
  grid = false,
}: {
  entries: CertificationEntry[];
  title: string;
  grid?: boolean;
}) => {
  const visible = entries.filter((entry) => entry.title || entry.issuer);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionTitle mark="C" title={title} />
      <div className={grid ? "grid grid-cols-2 gap-x-4 gap-y-2.5" : "space-y-2.5"}>
        {visible.map((entry) => {
          const bullets = entry.bullets?.filter((bullet) => bullet.text.trim()) ?? [];
          const shouldSpan = grid && (bullets.length > 3 || entry.title.length > 72);

          return (
            <article
              key={entry.id}
              className={[
                "break-inside-avoid",
                grid ? "border-l-2 bg-neutral-50 px-2 py-1.5" : "",
                shouldSpan ? "col-span-2" : "",
              ].join(" ")}
              style={grid ? { borderColor: "var(--photo-accent)" } : undefined}
            >
              <p className="text-[calc(9.2px*var(--photo-font-scale))] font-black leading-[calc(11px*var(--photo-font-scale))] text-black">
                {entry.title}
              </p>
              <p className="mt-0.5 text-[calc(8px*var(--photo-font-scale))] font-medium leading-[calc(9.5px*var(--photo-font-scale))] text-neutral-600">
                {joinParts([
                  entry.issuer,
                  entry.reference,
                  entry.issueDate || entry.year,
                  entry.expiryDate,
                ])}
              </p>
              {entry.description ? (
                <p className="mt-0.5 text-[calc(8.2px*var(--photo-font-scale))] font-medium leading-[calc(9.8px*var(--photo-font-scale))] text-neutral-700">
                  {entry.description}
                </p>
              ) : null}
              {bullets.length ? (
                <ul className="mt-0.5 space-y-0.5 text-[calc(7.8px*var(--photo-font-scale))] font-medium leading-[calc(9px*var(--photo-font-scale))] text-neutral-700">
                  {bullets.map((bullet) => (
                    <li key={bullet.id} className="flex gap-1.5">
                      <span
                        className="mt-[3.5px] h-[2px] w-[2px] shrink-0 rounded-full"
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

export default CertificateList;
