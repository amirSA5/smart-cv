import type { CVLanguage } from "../types/cv";
import { languageNames } from "../utils/cvClientMapper";

type LanguageSwitcherProps = {
  value: CVLanguage;
  onChange: (language: CVLanguage) => void;
  disabled?: boolean;
};

const languages: CVLanguage[] = ["en", "fr"];

const LanguageSwitcher = ({
  value,
  onChange,
  disabled = false,
}: LanguageSwitcherProps) => (
  <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
    {languages.map((language) => {
      const active = value === language;

      return (
        <button
          key={language}
          type="button"
          className={[
            "rounded px-3 py-1.5 text-sm font-black transition",
            active ? "bg-evergreen text-white" : "text-slate-600 hover:text-evergreen",
          ].join(" ")}
          disabled={disabled}
          onClick={() => onChange(language)}
        >
          {languageNames[language]}
        </button>
      );
    })}
  </div>
);

export default LanguageSwitcher;
