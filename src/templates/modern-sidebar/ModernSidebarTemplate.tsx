import type { ReactNode } from "react";
import CVPage from "../../components/CVPage";
import type { CVData, CVLanguage } from "../../types/cv";
import { paginateCv } from "../../utils/pagination";

export type RenderedTemplatePage = {
  pageNumber: number;
  element: ReactNode;
};

export const renderModernSidebarPages = (
  data: CVData,
  language: CVLanguage,
): RenderedTemplatePage[] =>
  paginateCv(data).map((page) => ({
    pageNumber: page.pageNumber,
    element: <CVPage language={language} page={page} />,
  }));
