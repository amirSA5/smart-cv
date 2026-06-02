import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { CVLanguage } from "../types/cv";

const sanitizeFilePart = (value: string) =>
  value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-");

export const buildPdfFileName = (fullName: string, language?: CVLanguage) => {
  const name = sanitizeFilePart(fullName) || "CV";
  const suffix = language ? `-${language.toUpperCase()}` : "";
  return `${name}-CV${suffix}.pdf`;
};

export const exportCvToPdf = async (
  previewRoot: HTMLElement,
  fullName: string,
  language?: CVLanguage,
) => {
  const pageNodes = Array.from(
    previewRoot.querySelectorAll<HTMLElement>(".cv-page"),
  );

  if (pageNodes.length === 0) {
    throw new Error("No CV pages were found to export.");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const exportHost = document.createElement("div");
  exportHost.style.position = "fixed";
  exportHost.style.left = "-10000px";
  exportHost.style.top = "0";
  exportHost.style.width = "794px";
  exportHost.style.background = "#ffffff";
  document.body.appendChild(exportHost);

  try {
    for (const [index, pageNode] of pageNodes.entries()) {
      const clone = pageNode.cloneNode(true) as HTMLElement;
      clone.style.transform = "none";
      clone.style.boxShadow = "none";
      exportHost.replaceChildren(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 794,
        windowHeight: 1123,
      });

      const image = canvas.toDataURL("image/png", 1);

      if (index > 0) {
        pdf.addPage();
      }

      pdf.addImage(image, "PNG", 0, 0, 210, 297, undefined, "FAST");
    }
  } finally {
    exportHost.remove();
  }

  pdf.save(buildPdfFileName(fullName, language));
};
