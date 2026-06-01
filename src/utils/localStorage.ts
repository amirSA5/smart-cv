import type { CVData } from "../types/cv";

const STORAGE_KEY = "smart-cv-builder:data";

export const saveCv = (data: CVData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadCv = (): CVData | null => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CVData;
  } catch {
    return null;
  }
};

export const clearSavedCv = () => {
  localStorage.removeItem(STORAGE_KEY);
};
