import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CVData, CVLanguage } from "../types/cv";
import { paginateCv } from "../utils/pagination";
import CVPage from "./CVPage";

type CVPreviewProps = {
  data: CVData;
  language?: CVLanguage;
};

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_LABEL_HEIGHT = 24;
const PAGE_GAP = 32;

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ data, language = "en" }, ref) => {
  const pages = useMemo(() => paginateCv(data), [data]);
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
          {pages.map((page) => (
            <div key={page.pageNumber} className="relative">
              <div className="mb-2 h-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Page {page.pageNumber} of {pages.length}
              </div>
              <CVPage language={language} page={page} />
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
