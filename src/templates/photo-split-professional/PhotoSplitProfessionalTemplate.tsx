import type { CVData, CVLanguage } from "../../types/cv";
import type { RenderedTemplatePage } from "../modern-sidebar/ModernSidebarTemplate";
import PhotoSplitProfessionalPage1 from "./PhotoSplitProfessionalPage1";
import PhotoSplitProfessionalPage2 from "./PhotoSplitProfessionalPage2";
import { paginatePhotoSplitProfessional } from "./photoSplitProfessionalPagination";

export const renderPhotoSplitProfessionalPages = (
  data: CVData,
  language: CVLanguage,
): RenderedTemplatePage[] =>
  paginatePhotoSplitProfessional(data).map((page) => ({
    pageNumber: page.pageNumber,
    element:
      page.kind === "primary" ? (
        <PhotoSplitProfessionalPage1 page={page} language={language} />
      ) : (
        <PhotoSplitProfessionalPage2 page={page} language={language} />
      ),
  }));
