import type { CSSProperties } from "react";
import type { TemplateSettings } from "../../types/cv";
import { defaultTemplateSettings, normalizeTemplateSettings } from "../../utils/cvClientMapper";

export const photoSplitInk = "#050505";
export const photoSplitMuted = "#555555";
export const photoSplitBorder = "#7c5cff";
export const photoSplitSoft = "#f2f2f2";

export const photoSplitPageClass =
  "cv-page bg-white px-[34px] py-[34px] text-black";

type PhotoSplitPageStyle = CSSProperties & {
  "--photo-accent": string;
  "--photo-secondary": string;
  "--photo-soft": string;
  "--photo-font-scale": string;
  "--photo-heading-scale": string;
};

const quoteFont = (fontFamily: string) =>
  /\s/.test(fontFamily) ? `"${fontFamily}"` : fontFamily;

export const getPhotoSplitSettings = (settings?: Partial<TemplateSettings>) =>
  normalizeTemplateSettings(settings ?? defaultTemplateSettings);

export const getPhotoSplitPageClass = (
  settings?: Partial<TemplateSettings>,
) => {
  const normalized = getPhotoSplitSettings(settings);
  const borderClass =
    normalized.borderStyle === "none"
      ? ""
      : normalized.borderStyle === "thin"
        ? "border border-black"
        : normalized.borderStyle === "rounded"
          ? "border-[3px] rounded-[16px]"
          : "border-[3px]";

  return [photoSplitPageClass, borderClass].filter(Boolean).join(" ");
};

export const getPhotoSplitPageStyle = (
  settings?: Partial<TemplateSettings>,
): PhotoSplitPageStyle => {
  const normalized = getPhotoSplitSettings(settings);
  const borderColor =
    normalized.borderStyle === "thin"
      ? photoSplitInk
      : normalized.secondaryColor || normalized.accentColor;

  return {
    "--photo-accent": normalized.accentColor,
    "--photo-secondary": normalized.secondaryColor,
    "--photo-soft": normalized.styleVariant === "minimal" ? "#f7f7f7" : photoSplitSoft,
    "--photo-font-scale": String(normalized.fontSizeScale),
    "--photo-heading-scale": String(Math.min(1.12, normalized.fontSizeScale)),
    borderColor,
    fontFamily: `${quoteFont(normalized.fontFamily)}, Inter, Arial, sans-serif`,
  };
};

export const getPhotoSplitStackClass = (
  settings?: Partial<TemplateSettings>,
) => {
  const normalized = getPhotoSplitSettings(settings);

  if (normalized.styleVariant === "minimal") {
    return "space-y-3.5";
  }

  if (normalized.styleVariant === "elegant") {
    return "space-y-5";
  }

  return "space-y-4";
};

export const sectionTitleClass =
  "mb-2.5 flex items-center gap-[7px] text-[calc(12px*var(--photo-heading-scale))] font-black uppercase leading-none tracking-[0.15em] text-black";

export const bodyTextClass =
  "text-[calc(9.4px*var(--photo-font-scale))] font-medium leading-[calc(12.2px*var(--photo-font-scale))] text-neutral-700";
