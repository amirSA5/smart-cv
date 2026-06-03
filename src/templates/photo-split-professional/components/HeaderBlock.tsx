import type { PersonalInfo } from "../../../types/cv";

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return { first: fullName || "Your", rest: "Name" };
  }

  return {
    first: parts[0],
    rest: parts.slice(1).join(" "),
  };
};

const HeaderBlock = ({
  personal,
  pageLabel,
}: {
  personal: PersonalInfo;
  pageLabel?: string;
}) => {
  const name = splitName(personal.fullName);

  return (
    <header className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <h1 className="text-[37px] font-black uppercase leading-[38px] tracking-[0.04em] text-black">
          <span>{name.first}</span>
          <br />
          <span className="font-light">{name.rest}</span>
        </h1>
        <p className="mt-2 text-[calc(11px*var(--photo-heading-scale))] font-black uppercase tracking-[0.08em] text-black">
          {personal.jobTitle || "Professional Title"}
        </p>
      </div>
      {pageLabel ? (
        <p
          className="mt-2 shrink-0 text-[calc(10px*var(--photo-heading-scale))] font-black uppercase tracking-[0.16em]"
          style={{ color: "var(--photo-accent)" }}
        >
          {pageLabel}
        </p>
      ) : null}
    </header>
  );
};

export default HeaderBlock;
