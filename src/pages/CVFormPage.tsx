import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import CVEditor from "../components/CVEditor";
import CVPreview from "../components/CVPreview";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {
  cloneCvClientVersion,
  createCvClient,
  getApiErrorMessage,
  getCvClientById,
  updateCvClientVersion,
} from "../services/cvClientService";
import type { CVData, CVLanguage, CvClient } from "../types/cv";
import {
  createNewCvData,
  cvClientToCvData,
  cvDataToClientPayload,
  cvDataToClientVersion,
  cvDataToSharedClientPayload,
  getOppositeLanguage,
  hasLanguageVersion,
  isCvLanguage,
  languageCodeLabels,
} from "../utils/cvClientMapper";
import { exportCvToPdf } from "../utils/pdfExport";

const getLanguageFromSearch = (value: string | null): CVLanguage =>
  isCvLanguage(value) ? value : "en";

const CVFormPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedLanguage = getLanguageFromSearch(searchParams.get("lang"));
  const methods = useForm<CVData>({
    defaultValues: createNewCvData(),
    mode: "onChange",
  });
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [client, setClient] = useState<CvClient | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const watchedCv = useWatch({ control: methods.control }) as CVData;

  useEffect(() => {
    if (!id) {
      methods.reset(createNewCvData());
      setClient(null);
      setLoading(false);
      return;
    }

    const loadClient = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getCvClientById(id);
        setClient(response);
        methods.reset(cvClientToCvData(response, selectedLanguage));

        if (!hasLanguageVersion(response, selectedLanguage)) {
          setMessage(
            `${languageCodeLabels[selectedLanguage]} version does not exist yet. Save this form or clone from the other language to create it.`,
          );
        } else {
          setMessage("");
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void loadClient();
  }, [id, methods, selectedLanguage]);

  const setLanguage = (language: CVLanguage) => {
    setSearchParams({ lang: language });

    if (client) {
      methods.reset(cvClientToCvData(client, language));
    }
  };

  const handleSave = async () => {
    const valid = await methods.trigger();

    if (!valid) {
      setError("Please fix validation errors before saving.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const values = methods.getValues();
      const saved = id
        ? await updateCvClientVersion(
            id,
            selectedLanguage,
            cvDataToClientVersion(values, selectedLanguage),
            cvDataToSharedClientPayload(values),
          )
        : await createCvClient(cvDataToClientPayload(values, selectedLanguage));

      setClient(saved);
      methods.reset(cvClientToCvData(saved, selectedLanguage));
      setMessage(
        id
          ? `${languageCodeLabels[selectedLanguage]} CV version saved.`
          : `CV client created with ${languageCodeLabels[selectedLanguage]} version.`,
      );

      if (!id) {
        navigate(`/cv/edit/${saved._id}?lang=${selectedLanguage}`, {
          replace: true,
        });
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleCloneLanguage = async () => {
    if (!id || !client) {
      return;
    }

    const targetLanguage = getOppositeLanguage(selectedLanguage);

    if (hasLanguageVersion(client, targetLanguage)) {
      setMessage(`${languageCodeLabels[targetLanguage]} version already exists.`);
      return;
    }

    try {
      setCloning(true);
      setError("");
      const saved = await cloneCvClientVersion(id, selectedLanguage, targetLanguage);
      setClient(saved);
      methods.reset(cvClientToCvData(saved, targetLanguage));
      setSearchParams({ lang: targetLanguage });
      setMessage(
        `${languageCodeLabels[targetLanguage]} version prepared from ${languageCodeLabels[selectedLanguage]}. You can now edit it manually.`,
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setCloning(false);
    }
  };

  const handleDownload = async () => {
    const valid = await methods.trigger();

    if (!valid || !previewRef.current) {
      setError("Preview is not ready or the form has validation errors.");
      return;
    }

    try {
      setExporting(true);
      setMessage("Preparing PDF...");
      await exportCvToPdf(
        previewRef.current,
        methods.getValues("personal.fullName"),
        selectedLanguage,
      );
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
    <FormProvider {...methods}>
      <main className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(360px,520px)_1fr]">
        <section className="no-print">
          <div className="sticky top-4 space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Link
                className="text-xs font-black uppercase tracking-[0.2em] text-evergreen"
                to="/clients"
              >
                Back to clients
              </Link>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-black text-charcoal">
                    {id ? "Edit CV client" : "Create CV client"}
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Editing {languageCodeLabels[selectedLanguage]} version
                  </p>
                </div>
                <LanguageSwitcher
                  disabled={loading || saving || cloning}
                  value={selectedLanguage}
                  onChange={setLanguage}
                />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="primary-button"
                  disabled={saving || loading}
                  onClick={handleSave}
                >
                  {saving
                    ? "Saving..."
                    : `Save ${languageCodeLabels[selectedLanguage]}`}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={exporting || loading}
                  onClick={handleDownload}
                >
                  {exporting
                    ? "Exporting..."
                    : `Download ${languageCodeLabels[selectedLanguage]}`}
                </button>
              </div>
              {id ? (
                <button
                  type="button"
                  className="secondary-button mt-2 w-full"
                  disabled={
                    loading ||
                    cloning ||
                    !client ||
                    !hasLanguageVersion(client, selectedLanguage)
                  }
                  onClick={handleCloneLanguage}
                >
                  {selectedLanguage === "en"
                    ? "Prepare French version"
                    : "Create English version from French"}
                </button>
              ) : null}
              {message ? (
                <p className="mt-4 text-sm font-semibold text-evergreen">
                  {message}
                </p>
              ) : null}
              {error ? (
                <p className="mt-4 text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}
            </div>

            {loading ? (
              <div className="editor-card text-sm font-semibold text-slate-500">
                Loading CV client...
              </div>
            ) : (
              <CVEditor />
            )}
          </div>
        </section>

        <section className="min-w-0">
          <div className="no-print mb-3 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              Live preview
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {languageCodeLabels[selectedLanguage]} A4 preview, max 2 pages
            </span>
          </div>
          <div className="overflow-hidden rounded-lg bg-white/30 pb-8">
            <CVPreview
              ref={previewRef}
              data={watchedCv}
              language={selectedLanguage}
            />
          </div>
        </section>
      </main>
    </FormProvider>
  );
};

export default CVFormPage;
