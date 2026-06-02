import type { CVData, CVLanguage } from "../../types/cv";
import type { RenderedTemplatePage } from "../modern-sidebar/ModernSidebarTemplate";
import TechProfessionalPage from "./TechProfessionalPage";
import { paginateTechProfessional } from "./techProfessionalPagination";

export const renderTechProfessionalPages = (
  data: CVData,
  language: CVLanguage,
): RenderedTemplatePage[] =>
  paginateTechProfessional(data).map((page) => ({
    pageNumber: page.pageNumber,
    element: <TechProfessionalPage page={page} language={language} />,
  }));
