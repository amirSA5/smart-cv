import type { ReferenceEntry } from "../../../types/cv";
import { subtleCardClass } from "../yellowProfessionalTimelineStyles";
import SectionHeader from "./SectionHeader";

type ReferencesBlockProps = {
  entries: ReferenceEntry[];
  title: string;
  phoneLabel: string;
  emailLabel: string;
};

const joinParts = (items: Array<string | undefined>) =>
  items.map((item) => item?.trim()).filter(Boolean).join(" | ");

const ReferencesBlock = ({
  entries,
  title,
  phoneLabel,
  emailLabel,
}: ReferencesBlockProps) => {
  const visible = entries.filter(
    (entry) =>
      entry.name ||
      entry.position ||
      entry.company ||
      entry.phone ||
      entry.email,
  );

  if (visible.length === 0) {
    return null;
  }

  return (
    <section className="break-inside-avoid">
      <SectionHeader title={title} />
      <div className={visible.length === 1 ? "grid gap-2" : "grid grid-cols-2 gap-2"}>
        {visible.map((entry) => (
          <article key={entry.id} className={`${subtleCardClass} px-3 py-2`}>
            <p className="text-[10px] font-black uppercase leading-[12px] text-black">
              {entry.name}
            </p>
            <p className="text-[8.8px] font-bold leading-[10.8px] text-neutral-700">
              {joinParts([entry.position, entry.company])}
            </p>
            {entry.phone ? (
              <p className="mt-0.5 text-[8.5px] font-semibold leading-[10px] text-neutral-500">
                <span className="font-black text-black">{phoneLabel}: </span>
                {entry.phone}
              </p>
            ) : null}
            {entry.email ? (
              <p className="text-[8.5px] font-semibold leading-[10px] text-neutral-500">
                <span className="font-black text-black">{emailLabel}: </span>
                {entry.email}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ReferencesBlock;
