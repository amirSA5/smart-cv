import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CVPreview from "../components/CVPreview";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { getApiErrorMessage, getCvClientById } from "../services/cvClientService";
import type { CVData, CVLanguage, CvClient } from "../types/cv";
import {
  cvClientToCvData,
  getDisplayJobTitle,
  hasLanguageVersion,
  isCvLanguage,
  languageCodeLabels,
} from "../utils/cvClientMapper";
import { exportCvToPdf } from "../utils/pdfExport";

const getLanguageFromSearch = (value: string | null): CVLanguage =>
  isCvLanguage(value) ? value : "en";

const CVPreviewPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLanguage = getLanguageFromSearch(searchParams.get("lang"));
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [client, setClient] = useState<CvClient | null>(null);
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
        setClient(await getCvClientById(id));
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void loadClient();
  }, [id]);

  const cvData = useMemo<CVData | null>(() => {
    if (!client || !hasLanguageVersion(client, selectedLanguage)) {
      return null;
    }

    return cvClientToCvData(client, selectedLanguage);
  }, [client, selectedLanguage]);

  const handleDownload = async () => {
    if (!previewRef.current || !client || !cvData) {
      setError("Preview is not ready yet.");
      return;
    }

    try {
      setExporting(true);
      setMessage("Preparing PDF...");
      await exportCvToPdf(previewRef.current, client.fullName, selectedLanguage);
      setMessage(`${languageCodeLabels[selectedLanguage]} PDF downloaded.`);
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
          {client ? (
            <p className="mt-1 text-sm font-semibold text-slate-600">
              {getDisplayJobTitle(client, selectedLanguage)}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <LanguageSwitcher
            disabled={loading || exporting}
            value={selectedLanguage}
            onChange={(language) => setSearchParams({ lang: language })}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            {id ? (
              <Link
                className="secondary-button text-center"
                to={`/cv/edit/${id}?lang=${selectedLanguage}`}
              >
                Edit {languageCodeLabels[selectedLanguage]}
              </Link>
            ) : null}
            <button
              type="button"
              className="primary-button"
              disabled={exporting || loading || !cvData}
              onClick={handleDownload}
            >
              {exporting
                ? "Exporting..."
                : `Download ${languageCodeLabels[selectedLanguage]}`}
            </button>
          </div>
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
        <CVPreview
          ref={previewRef}
          data={cvData}
          language={selectedLanguage}
        />
      ) : (
        <div className="rounded-lg bg-white p-6 text-sm font-semibold text-slate-500">
          {languageCodeLabels[selectedLanguage]} version does not exist yet.
        </div>
      )}
    </main>
  );
};

export default CVPreviewPage;
