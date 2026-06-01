type SectionTitleProps = {
  children: string;
  tone?: "dark" | "light";
  compact?: boolean;
};

const letterSpace = (value: string) => value.toUpperCase().split("").join(" ");

const SectionTitle = ({
  children,
  tone = "dark",
  compact = false,
}: SectionTitleProps) => (
  <h2
    className={[
      "whitespace-nowrap font-black uppercase tracking-[0.08em]",
      compact ? "text-[18px] leading-[22px]" : "text-[25px] leading-[30px]",
      tone === "light" ? "text-white" : "text-charcoal",
    ].join(" ")}
  >
    {letterSpace(children)}
  </h2>
);

export default SectionTitle;
