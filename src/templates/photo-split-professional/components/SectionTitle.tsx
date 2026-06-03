import { sectionTitleClass } from "../photoSplitProfessionalStyles";

type SectionTitleProps = {
  title: string;
  mark?: string;
};

const SectionTitle = ({ title, mark = "" }: SectionTitleProps) => (
  <h2 className={sectionTitleClass}>
    <span
      className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border text-[7.5px] font-black leading-none"
      style={{
        borderColor: "var(--photo-accent)",
        borderWidth: "1.2px",
        color: "var(--photo-accent)",
      }}
    >
      {mark}
    </span>
    <span>{title}</span>
  </h2>
);

export default SectionTitle;
