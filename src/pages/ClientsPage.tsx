import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CVPreview from "../components/CVPreview";
import {
  createCvClient,
  deleteCvClient,
  duplicateCvClient,
  getApiErrorMessage,
  getCvClients,
} from "../services/cvClientService";
import type { CVData, CvClient } from "../types/cv";
import { clearSavedCv, loadCv } from "../utils/localStorage";
import { cvClientToCvData, cvDataToClientPayload } from "../utils/cvClientMapper";
import { exportCvToPdf } from "../utils/pdfExport";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(value));

const ClientsPage = () => {
  const [clients, setClients] = useState<CvClient[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CvClient | null>(null);
  const [busyId, setBusyId] = useState("");
  const [hasLocalCv, setHasLocalCv] = useState(() => Boolean(loadCv()));
  const [downloadData, setDownloadData] = useState<{
    cv: CVData;
    fullName: string;
  } | null>(null);
  const downloadRef = useRef<HTMLDivElement | null>(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");
      setClients(await getCvClients());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClients();
  }, []);

  useEffect(() => {
    if (!downloadData) {
      return undefined;
    }

    let cancelled = false;

    const download = async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (!cancelled && downloadRef.current) {
        try {
          await exportCvToPdf(downloadRef.current, downloadData.fullName);
          setMessage("PDF downloaded.");
        } catch (downloadError) {
          setError(
            downloadError instanceof Error
              ? downloadError.message
              : "The PDF export could not finish.",
          );
        } finally {
          setDownloadData(null);
          setBusyId("");
        }
      }
    };

    void download();

    return () => {
      cancelled = true;
    };
  }, [downloadData]);

  const filteredClients = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return clients;
    }

    return clients.filter((client) =>
      [client.fullName, client.jobTitle, client.email, client.phone]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [clients, query]);

  const handleDuplicate = async (client: CvClient) => {
    try {
      setBusyId(client._id);
      const duplicated = await duplicateCvClient(client._id);
      setClients((current) => [duplicated, ...current]);
      setMessage(`${client.fullName} duplicated.`);
      setError("");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setBusyId(deleteTarget._id);
      await deleteCvClient(deleteTarget._id);
      setClients((current) =>
        current.filter((client) => client._id !== deleteTarget._id),
      );
      setMessage(`${deleteTarget.fullName} deleted.`);
      setError("");
      setDeleteTarget(null);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  };

  const handleDownload = (client: CvClient) => {
    setBusyId(client._id);
    setMessage("Preparing PDF...");
    setError("");
    setDownloadData({
      cv: cvClientToCvData(client),
      fullName: client.fullName,
    });
  };

  const handleImportLocalCv = async () => {
    const localCv = loadCv();

    if (!localCv) {
      setHasLocalCv(false);
      setMessage("No local CV data found.");
      return;
    }

    try {
      setBusyId("import-local");
      const imported = await createCvClient(cvDataToClientPayload(localCv));
      setClients((current) => [imported, ...current]);
      setMessage("Local CV imported into MongoDB.");
      setError("");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  };

  const handleClearLocalCv = () => {
    clearSavedCv();
    setHasLocalCv(false);
    setMessage("Local CV data cleared.");
  };

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-evergreen">
            Clients
          </p>
          <h1 className="mt-2 text-2xl font-black text-charcoal sm:text-4xl">
            CV client database
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {hasLocalCv ? (
            <>
              <button
                type="button"
                className="secondary-button"
                disabled={busyId === "import-local"}
                onClick={handleImportLocalCv}
              >
                Import Local CV
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={handleClearLocalCv}
              >
                Clear Local CV
              </button>
            </>
          ) : null}
          <Link className="primary-button text-center" to="/cv/new">
            Create New CV
          </Link>
        </div>
      </div>

      {message ? (
        <div className="mt-5 rounded-lg border border-evergreen/20 bg-white px-4 py-3 text-sm font-semibold text-evergreen">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label className="block">
          <span className="field-label">Search clients</span>
          <input
            className="field-input"
            placeholder="Search by name, job title, email, or phone"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </section>

      <section className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm font-semibold text-slate-500">
            Loading clients...
          </p>
        ) : filteredClients.length === 0 ? (
          <p className="p-6 text-sm font-semibold text-slate-500">
            No CV clients found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client._id}>
                    <td className="px-4 py-4">
                      <p className="font-black text-charcoal">{client.fullName}</p>
                      <p className="mt-1 text-slate-600">{client.jobTitle}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <p>{client.email || "No email"}</p>
                      <p>{client.phone || "No phone"}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                      {formatDate(client.updatedAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link
                          className="secondary-button"
                          to={`/cv/edit/${client._id}`}
                        >
                          Edit
                        </Link>
                        <Link
                          className="secondary-button"
                          to={`/cv/preview/${client._id}`}
                        >
                          Preview
                        </Link>
                        <button
                          type="button"
                          className="secondary-button"
                          disabled={busyId === client._id}
                          onClick={() => handleDownload(client)}
                        >
                          Download PDF
                        </button>
                        <button
                          type="button"
                          className="secondary-button"
                          disabled={busyId === client._id}
                          onClick={() => handleDuplicate(client)}
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          className="danger-button"
                          disabled={busyId === client._id}
                          onClick={() => setDeleteTarget(client)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-page">
            <h2 className="text-xl font-black text-charcoal">Delete CV?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This will permanently delete {deleteTarget.fullName}. This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-button"
                disabled={busyId === deleteTarget._id}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {downloadData ? (
        <div
          aria-hidden="true"
          className="fixed left-[-10000px] top-0 w-[794px] bg-white"
        >
          <CVPreview ref={downloadRef} data={downloadData.cv} />
        </div>
      ) : null}
    </main>
  );
};

export default ClientsPage;
