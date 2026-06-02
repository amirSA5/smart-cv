import type { ExperienceEntry } from "../../../types/cv";
import { yellowAccent } from "../yellowProfessionalTimelineStyles";
import SectionHeader from "./SectionHeader";

type ExperienceTimelineProps = {
  entries: ExperienceEntry[];
  title: string;
  compact?: boolean;
  className?: string;
};

const joinParts = (items: Array<string | undefined>) =>
  items.map((item) => item?.trim()).filter(Boolean).join(" | ");

const ExperienceTimeline = ({
  entries,
  title,
  compact = false,
  className = "",
}: ExperienceTimelineProps) => {
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
    <section className={className}>
      <SectionHeader title={title} />
      <div className="relative border-l border-black pl-5">
        {visible.map((entry) => {
          const bullets = entry.bullets.filter((bullet) => bullet.text.trim());

          return (
            <article
              key={entry.id}
              className={[
                "relative break-inside-avoid",
                compact ? "mb-3 last:mb-0" : "mb-4 last:mb-0",
              ].join(" ")}
            >
              <span
                className="absolute -left-[25px] top-[3px] h-[10px] w-[10px] rounded-full border-2 border-black bg-white"
              />
              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <h3
                    className={[
                      "font-black uppercase text-black",
                      compact ? "text-[11px] leading-[13.5px]" : "text-[11.8px] leading-[14.5px]",
                    ].join(" ")}
                  >
                    {entry.jobTitle}
                  </h3>
                  <p className="mt-0.5 text-[9.2px] font-black uppercase tracking-[0.06em] text-neutral-600">
                    {joinParts([entry.company, entry.location])}
                  </p>
                </div>
                <p className="w-[112px] shrink-0 text-right text-[8.8px] font-black uppercase leading-[10.5px] text-neutral-500">
                  {joinParts([entry.startDate, entry.current ? "Present" : entry.endDate])}
                </p>
              </div>
              {bullets.length > 0 ? (
                <ul
                  className={[
                    "mt-1.5 font-medium text-neutral-700",
                    compact
                      ? "space-y-0.5 text-[9.2px] leading-[11.4px]"
                      : "space-y-0.5 text-[9.6px] leading-[11.9px]",
                  ].join(" ")}
                >
                  {bullets.map((bullet) => (
                    <li key={bullet.id} className="flex gap-2">
                      <span
                        className="mt-[4.5px] h-[3px] w-[3px] shrink-0 rounded-full"
                        style={{ background: "#111111" }}
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

export default ExperienceTimeline;
