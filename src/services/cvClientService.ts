import axios from "axios";
import type {
  CVLanguage,
  CvClient,
  CvClientPayload,
  CvLanguageVersion,
  CvSharedClientPayload,
} from "../types/cv";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCvClients = async () => {
  const response = await api.get<CvClient[]>("/cv-clients");
  return response.data;
};

export const getCvClientById = async (id: string) => {
  const response = await api.get<CvClient>(`/cv-clients/${id}`);
  return response.data;
};

export const createCvClient = async (data: CvClientPayload) => {
  const response = await api.post<CvClient>("/cv-clients", data);
  return response.data;
};

export const updateCvClient = async (id: string, data: CvClientPayload) => {
  const response = await api.put<CvClient>(`/cv-clients/${id}`, data);
  return response.data;
};

export const deleteCvClient = async (id: string) => {
  const response = await api.delete<{ message: string; id: string }>(
    `/cv-clients/${id}`,
  );
  return response.data;
};

export const duplicateCvClient = async (id: string) => {
  const response = await api.post<CvClient>(`/cv-clients/${id}/duplicate`);
  return response.data;
};

export const getCvClientVersion = async (id: string, language: CVLanguage) => {
  const response = await api.get<CvLanguageVersion>(
    `/cv-clients/${id}/versions/${language}`,
  );
  return response.data;
};

export const updateCvClientVersion = async (
  id: string,
  language: CVLanguage,
  version: CvLanguageVersion,
  shared: CvSharedClientPayload,
) => {
  const response = await api.put<CvClient>(
    `/cv-clients/${id}/versions/${language}`,
    {
      ...shared,
      version,
    },
  );
  return response.data;
};

export const cloneCvClientVersion = async (
  id: string,
  fromLanguage: CVLanguage,
  toLanguage: CVLanguage,
) => {
  const response = await api.post<CvClient>(
    `/cv-clients/${id}/versions/${fromLanguage}/clone/${toLanguage}`,
  );
  return response.data;
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: string[] }
      | undefined;

    if (data?.errors?.length) {
      return data.errors.join(" ");
    }

    return data?.message ?? error.message;
  }

  return error instanceof Error ? error.message : "Unexpected error.";
};
