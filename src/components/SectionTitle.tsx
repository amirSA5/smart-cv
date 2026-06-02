type SectionTitleProps = {
  children: string;
  tone?: "dark" | "light";
  compact?: boolean;
};

const letterSpace = (value: string) => value.toUpperCase().split("").join(" ");
const wordGap = (compact: boolean) => (compact ? "14px" : "18px");

const SectionTitle = ({
  children,
  tone = "dark",
  compact = false,
}: SectionTitleProps) => {
  const words = children.trim().split(/\s+/).filter(Boolean);

  return (
    <h2
      className={[
        "whitespace-nowrap font-black uppercase tracking-[0.08em]",
        compact ? "text-[18px] leading-[22px]" : "text-[25px] leading-[30px]",
        tone === "light" ? "text-white" : "text-charcoal",
      ].join(" ")}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          style={index > 0 ? { marginLeft: wordGap(compact) } : undefined}
        >
          {letterSpace(word)}
        </span>
      ))}
    </h2>
  );
};

export default SectionTitle;
