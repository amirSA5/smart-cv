import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CVPreview from "../components/CVPreview";
import { getApiErrorMessage, getCvClientById } from "../services/cvClientService";
import type { CVData, CvClient } from "../types/cv";
import { cvClientToCvData } from "../utils/cvClientMapper";
import { exportCvToPdf } from "../utils/pdfExport";

const CVPreviewPage = () => {
  const { id } = useParams();
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [client, setClient] = useState<CvClient | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Missing CV client ID.");
      setLoading(false);
      return;
    }

    const loadClient = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getCvClientById(id);
        setClient(response);
        setCvData(cvClientToCvData(response));
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void loadClient();
  }, [id]);

  const handleDownload = async () => {
    if (!previewRef.current || !client) {
      setError("Preview is not ready yet.");
      return;
    }

    try {
      setExporting(true);
      setMessage("Preparing PDF...");
      await exportCvToPdf(previewRef.current, client.fullName);
      setMessage("PDF downloaded.");
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "The PDF export could not finish.",
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      <div className="no-print mb-5 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            className="text-xs font-black uppercase tracking-[0.2em] text-evergreen"
            to="/clients"
          >
            Back to clients
          </Link>
          <h1 className="mt-3 text-2xl font-black text-charcoal">
            {client?.fullName ?? "CV preview"}
          </h1>
          {client?.jobTitle ? (
            <p className="mt-1 text-sm font-semibold text-slate-600">
              {client.jobTitle}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {id ? (
            <Link className="secondary-button text-center" to={`/cv/edit/${id}`}>
              Edit
            </Link>
          ) : null}
          <button
            type="button"
            className="primary-button"
            disabled={exporting || loading || !cvData}
            onClick={handleDownload}
          >
            {exporting ? "Exporting..." : "Download PDF"}
          </button>
        </div>
      </div>

      {message ? (
        <div className="no-print mb-5 rounded-lg border border-evergreen/20 bg-white px-4 py-3 text-sm font-semibold text-evergreen">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="no-print mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-lg bg-white p-6 text-sm font-semibold text-slate-500">
          Loading preview...
        </div>
      ) : cvData ? (
        <CVPreview ref={previewRef} data={cvData} />
      ) : null}
    </main>
  );
};

export default CVPreviewPage;
