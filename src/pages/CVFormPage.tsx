import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import CVEditor from "../components/CVEditor";
import CVPreview from "../components/CVPreview";
import {
  createCvClient,
  getApiErrorMessage,
  getCvClientById,
  updateCvClient,
} from "../services/cvClientService";
import type { CVData } from "../types/cv";
import {
  createNewCvData,
  cvClientToCvData,
  cvDataToClientPayload,
} from "../utils/cvClientMapper";
import { exportCvToPdf } from "../utils/pdfExport";

const CVFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const methods = useForm<CVData>({
    defaultValues: createNewCvData(),
    mode: "onChange",
  });
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const watchedCv = useWatch({ control: methods.control }) as CVData;

  useEffect(() => {
    if (!id) {
      methods.reset(createNewCvData());
      setLoading(false);
      return;
    }

    const loadClient = async () => {
      try {
        setLoading(true);
        setError("");
        const client = await getCvClientById(id);
        methods.reset(cvClientToCvData(client));
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    void loadClient();
  }, [id, methods]);

  const handleSave = async () => {
    const valid = await methods.trigger();

    if (!valid) {
      setError("Please fix validation errors before saving.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = cvDataToClientPayload(methods.getValues());
      const saved = id
        ? await updateCvClient(id, payload)
        : await createCvClient(payload);

      methods.reset(cvClientToCvData(saved));
      setMessage(id ? "CV client updated." : "CV client created.");

      if (!id) {
        navigate(`/cv/edit/${saved._id}`, { replace: true });
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setSaving(false);
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
      await exportCvToPdf(previewRef.current, methods.getValues("personal.fullName"));
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
              <h1 className="mt-3 text-2xl font-black text-charcoal">
                {id ? "Edit CV client" : "Create CV client"}
              </h1>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="primary-button"
                  disabled={saving || loading}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save to MongoDB"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={exporting || loading}
                  onClick={handleDownload}
                >
                  {exporting ? "Exporting..." : "Download PDF"}
                </button>
              </div>
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
              Responsive A4 preview, max 2 pages
            </span>
          </div>
          <div className="overflow-hidden rounded-lg bg-white/30 pb-8">
            <CVPreview ref={previewRef} data={watchedCv} />
          </div>
        </section>
      </main>
    </FormProvider>
  );
};

export default CVFormPage;
