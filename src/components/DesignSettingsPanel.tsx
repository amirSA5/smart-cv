import { useFormContext, useWatch } from "react-hook-form";
import { defaultTemplateSettings } from "../utils/cvClientMapper";
import type { CVData, TemplateSettings } from "../types/cv";

const colorOptions = [
  { label: "Black", value: "#000000" },
  { label: "Purple", value: "#6C63FF" },
  { label: "Blue", value: "#2563EB" },
  { label: "Green", value: "#15803D" },
  { label: "Yellow", value: "#D6A600" },
  { label: "Red", value: "#DC2626" },
];

const fonts = [
  "Montserrat",
  "Inter",
  "Poppins",
  "Raleway",
  "Arial",
  "Times New Roman",
  "Georgia",
];

const fontSizeOptions: Array<{
  label: string;
  value: TemplateSettings["fontSizeScale"];
}> = [
  { label: "Small / Petite", value: 0.9 },
  { label: "Normal", value: 1 },
  { label: "Large / Grande", value: 1.1 },
  { label: "Extra Large / Tres grande", value: 1.2 },
];

const styleVariants: Array<TemplateSettings["styleVariant"]> = [
  "classic",
  "modern",
  "minimal",
  "elegant",
];

const borderStyles: Array<TemplateSettings["borderStyle"]> = [
  "none",
  "thin",
  "colored",
  "rounded",
];

const photoStyles: Array<TemplateSettings["photoStyle"]> = [
  "rectangle",
  "rounded",
  "circle",
];

const toLabel = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const DesignSettingsPanel = () => {
  const { control, register, setValue } = useFormContext<CVData>();
  const settings =
    useWatch({ control, name: "templateSettings" }) ?? defaultTemplateSettings;

  const setAccentColor = (value: string) => {
    setValue("templateSettings.accentColor", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const resetSettings = () => {
    setValue("templateSettings", { ...defaultTemplateSettings }, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <section className="editor-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-charcoal">Design Settings</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Applies to the Photo Split Professional template preview and PDF.
          </p>
        </div>
        <button type="button" className="secondary-button" onClick={resetSettings}>
          Reset
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <span className="field-label">Accent color</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {colorOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={[
                  "flex items-center gap-2 rounded-md border px-2.5 py-2 text-xs font-black",
                  settings.accentColor === option.value
                    ? "border-charcoal bg-slate-100 text-charcoal"
                    : "border-slate-200 text-slate-600",
                ].join(" ")}
                onClick={() => setAccentColor(option.value)}
              >
                <span
                  className="h-4 w-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: option.value }}
                />
                {option.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-[48px_minmax(0,1fr)] gap-3">
            <input
              type="color"
              className="h-10 w-12 cursor-pointer rounded border border-slate-200 bg-white p-1"
              {...register("templateSettings.accentColor")}
            />
            <input
              className="field-input mt-0"
              placeholder="#000000"
              {...register("templateSettings.accentColor")}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="field-label">Secondary color</span>
            <input
              type="color"
              className="mt-2 h-10 w-full cursor-pointer rounded border border-slate-200 bg-white p-1"
              {...register("templateSettings.secondaryColor")}
            />
          </label>

          <label>
            <span className="field-label">Font / Police</span>
            <select
              className="field-input"
              {...register("templateSettings.fontFamily")}
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="field-label">Font Size / Taille de police</span>
            <select
              className="field-input"
              {...register("templateSettings.fontSizeScale", {
                valueAsNumber: true,
              })}
            >
              {fontSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label>
            <span className="field-label">Style</span>
            <select
              className="field-input"
              {...register("templateSettings.styleVariant")}
            >
              {styleVariants.map((variant) => (
                <option key={variant} value={variant}>
                  {toLabel(variant)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="field-label">Border</span>
            <select
              className="field-input"
              {...register("templateSettings.borderStyle")}
            >
              {borderStyles.map((style) => (
                <option key={style} value={style}>
                  {toLabel(style)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="field-label">Photo</span>
            <select
              className="field-input"
              {...register("templateSettings.photoStyle")}
            >
              {photoStyles.map((style) => (
                <option key={style} value={style}>
                  {toLabel(style)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  );
};

export default DesignSettingsPanel;
