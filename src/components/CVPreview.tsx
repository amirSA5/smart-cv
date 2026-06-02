import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { getTemplateMeta } from "../constants/templates";
import { renderModernSidebarPages } from "../templates/modern-sidebar/ModernSidebarTemplate";
import { renderTechProfessionalPages } from "../templates/tech-professional/TechProfessionalTemplate";
import { renderYellowProfessionalTimelinePages } from "../templates/yellow-professional-timeline/YellowProfessionalTimelineTemplate";
import { isYellowProfessionalTimelineTooLong } from "../templates/yellow-professional-timeline/yellowProfessionalTimelinePagination";
import type { CVData, CVLanguage, CVTemplateMeta } from "../types/cv";

type CVPreviewProps = {
  data: CVData;
  language?: CVLanguage;
  template?: Partial<CVTemplateMeta> | null;
};

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_LABEL_HEIGHT = 24;
const PAGE_GAP = 32;

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ data, language = "en", template }, ref) => {
    const selectedTemplate = getTemplateMeta(template);
    const pages = useMemo(
      () =>
        selectedTemplate.id === "yellow-professional-timeline"
          ? renderYellowProfessionalTimelinePages(data, language)
          : selectedTemplate.id === "tech-professional"
            ? renderTechProfessionalPages(data, language)
            : renderModernSidebarPages(data, language),
      [data, language, selectedTemplate.id],
    );
    const isTooLong =
      selectedTemplate.id === "yellow-professional-timeline" &&
      isYellowProfessionalTimelineTooLong(data);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1);
    const stackHeight =
      pages.length * (PAGE_HEIGHT + PAGE_LABEL_HEIGHT) +
      Math.max(0, pages.length - 1) * PAGE_GAP;

    useImperativeHandle(ref, () => contentRef.current as HTMLDivElement);

    useEffect(() => {
      const node = viewportRef.current;
      if (!node) {
        return undefined;
      }

      const updateScale = () => {
        setScale(Math.min(1, Math.max(0.38, node.clientWidth / PAGE_WIDTH)));
      };

      updateScale();
      const observer = new ResizeObserver(updateScale);
      observer.observe(node);

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={viewportRef} className="w-full">
        {isTooLong ? (
          <p className="no-print mb-3 max-w-[794px] rounded-md border border-yellow-400 bg-yellow-50 px-3 py-2 text-center text-xs font-black text-neutral-800 lg:text-left">
            This CV content is too long for the selected template. Please
            shorten some sections to keep it within 2 pages.
          </p>
        ) : null}
        <div
          className="mx-auto lg:mx-0"
          style={{
            width: PAGE_WIDTH * scale,
            height: stackHeight * scale,
          }}
        >
          <div
            ref={contentRef}
            className="flex flex-col items-start gap-8"
            style={{
              width: PAGE_WIDTH,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {pages.map((page, index) => (
              <div key={page.pageNumber} className="relative">
                <div className="mb-2 h-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  Page {index + 1} of {pages.length}
                </div>
                {page.element}
              </div>
            ))}
          </div>
        </div>
        {pages.length === 2 ? (
          <p className="no-print mt-3 text-center text-xs font-semibold text-slate-500 lg:text-left">
            Preview is capped at two A4 pages.
          </p>
        ) : null}
      </div>
    );
  },
);

CVPreview.displayName = "CVPreview";

export default CVPreview;
