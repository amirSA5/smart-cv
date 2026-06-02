import type { CVData, CVLanguage } from "../../types/cv";
import type { RenderedTemplatePage } from "../modern-sidebar/ModernSidebarTemplate";
import YellowProfessionalTimelinePage1 from "./YellowProfessionalTimelinePage1";
import YellowProfessionalTimelinePage2 from "./YellowProfessionalTimelinePage2";
import { paginateYellowProfessionalTimeline } from "./yellowProfessionalTimelinePagination";

export const renderYellowProfessionalTimelinePages = (
  data: CVData,
  language: CVLanguage,
): RenderedTemplatePage[] =>
  paginateYellowProfessionalTimeline(data).map((page) => ({
    pageNumber: page.pageNumber,
    element:
      page.kind === "primary" ? (
        <YellowProfessionalTimelinePage1 page={page} language={language} />
      ) : (
        <YellowProfessionalTimelinePage2 page={page} language={language} />
      ),
  }));
