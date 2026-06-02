import type { PersonalInfo } from "../../../types/cv";
import { yellowAccent } from "../yellowProfessionalTimelineStyles";

type ContactBlockProps = {
  personal: PersonalInfo;
};

const contactItems = (personal: PersonalInfo) => [
  { marker: "P", value: personal.phone },
  { marker: "E", value: personal.email },
  { marker: "W", value: personal.website },
  { marker: "L", value: personal.location },
];

const ContactBlock = ({ personal }: ContactBlockProps) => {
  const visible = contactItems(personal).filter((item) => item.value?.trim());

  if (visible.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      <div className="space-y-0">
        {visible.map((item) => (
          <div
            key={item.marker}
            className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-2 border-b border-black py-2.5"
          >
            <span
              className="flex h-[18px] w-[18px] items-center justify-center text-[8px] font-black text-black"
              style={{ background: yellowAccent }}
            >
              {item.marker}
            </span>
            <span className="break-words text-[9.3px] font-semibold leading-[12px] text-neutral-800">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactBlock;
