import type { CertificationEntry } from "../../../types/cv";
import { subtleCardClass } from "../yellowProfessionalTimelineStyles";
import SectionHeader from "./SectionHeader";

type CertificationGridProps = {
  entries: CertificationEntry[];
  title: string;
};

const joinParts = (items: Array<string | undefined>) =>
  items.map((item) => item?.trim()).filter(Boolean).join(" | ");

const CertificationGrid = ({ entries, title }: CertificationGridProps) => {
  const visible = entries.filter((entry) => entry.title || entry.issuer);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section className="break-inside-avoid">
      <SectionHeader title={title} />
      <div className="grid grid-cols-2 gap-2">
        {visible.map((entry) => {
          const visibleBullets =
            entry.bullets?.filter((bullet) => bullet.text.trim()) ?? [];
          const shouldSpan =
            visibleBullets.length > 3 ||
            entry.title.length > 74 ||
            (entry.description?.length ?? 0) > 150;

          return (
            <article
              key={entry.id}
              className={[
                `${subtleCardClass} px-2.5 py-1.5`,
                shouldSpan ? "col-span-2" : "",
              ].join(" ")}
            >
              <h3 className="text-[9.6px] font-black uppercase leading-[11.2px] text-black">
                {entry.title}
              </h3>
              <p className="mt-0.5 text-[8.2px] font-bold leading-[9.7px] text-neutral-600">
                {joinParts([
                  entry.issuer,
                  entry.reference,
                  entry.issueDate || entry.year,
                  entry.expiryDate,
                ])}
              </p>
              {entry.description ? (
                <p className="mt-0.5 text-[8.2px] font-medium leading-[9.7px] text-neutral-700">
                  {entry.description}
                </p>
              ) : null}
              {visibleBullets.length ? (
                <ul className="mt-0.5 space-y-0.5 text-[7.9px] font-medium leading-[9px] text-neutral-700">
                  {visibleBullets.map((bullet) => (
                    <li key={bullet.id} className="flex gap-1.5">
                      <span className="mt-[3.7px] h-[2.5px] w-[2.5px] shrink-0 rounded-full bg-black" />
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

export default CertificationGrid;
