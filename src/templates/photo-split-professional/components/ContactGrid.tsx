import type { PersonalInfo } from "../../../types/cv";

const contactItems = (personal: PersonalInfo) => [
  { marker: "P", value: personal.phone },
  { marker: "E", value: personal.email },
  { marker: "W", value: personal.website },
  { marker: "L", value: personal.location },
];

const ContactGrid = ({ personal }: { personal: PersonalInfo }) => {
  const visible = contactItems(personal).filter((item) => item.value?.trim());

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-2.5">
      {visible.map((item) => (
        <div key={item.marker} className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[8px] font-black text-white"
            style={{ backgroundColor: "var(--photo-accent)" }}
          >
            {item.marker}
          </span>
          <span className="break-words text-[calc(8.6px*var(--photo-font-scale))] font-medium leading-[calc(10.5px*var(--photo-font-scale))] text-neutral-700">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ContactGrid;
