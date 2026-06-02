import type { CVTemplateId, CVTemplateMeta } from "../types/cv";

export const templates: Record<CVTemplateId, CVTemplateMeta> = {
  "modern-sidebar": {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    color: "#2f574d",
  },
  "tech-professional": {
    id: "tech-professional",
    name: "Tech Professional",
    color: "#111111",
  },
  "yellow-professional-timeline": {
    id: "yellow-professional-timeline",
    name: "Yellow Professional Timeline Template",
    color: "#f4c430",
  },
};

export const templateOptions = Object.values(templates);

export const defaultTemplate = templates["modern-sidebar"];

export const isTemplateId = (
  value: string | null | undefined,
): value is CVTemplateId =>
  value === "modern-sidebar" ||
  value === "tech-professional" ||
  value === "yellow-professional-timeline";

export const getTemplateMeta = (
  template?: Partial<CVTemplateMeta> | null,
): CVTemplateMeta => {
  const id = isTemplateId(template?.id)
    ? template.id
    : template?.name === "yellow-professional-timeline"
      ? "yellow-professional-timeline"
    : template?.name === "tech-professional"
      ? "tech-professional"
      : "modern-sidebar";
  const fallback = templates[id];
  const customName =
    template?.name && !isTemplateId(template.name) ? template.name : "";

  return {
    ...fallback,
    name: customName || fallback.name,
    color: template?.color ?? fallback.color,
  };
};
