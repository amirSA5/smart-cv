import mongoose from "mongoose";
import CvClient from "../models/CvClient.js";

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const supportedLanguages = ["en", "fr"];
const versionArrayFields = [
  "skills",
  "experiences",
  "education",
  "certifications",
  "languages",
];
const sharedFields = [
  "fullName",
  "mainJobTitle",
  "email",
  "phone",
  "location",
  "website",
  "photoUrl",
  "template",
];

const sendServerError = (response, error) =>
  response.status(500).json({
    message: "Server error.",
    error: error instanceof Error ? error.message : "Unknown error.",
  });

const cleanValidationError = (error) => ({
  message: "Validation failed.",
  errors: Object.values(error.errors ?? {}).map((item) => item.message),
});

const isValidLanguage = (lang) => supportedLanguages.includes(lang);

const validateLanguageParam = (response, lang) => {
  if (isValidLanguage(lang)) {
    return true;
  }

  response.status(400).json({
    message: 'Language must be either "en" or "fr".',
  });
  return false;
};

const normalizeVersion = (version, lang) => ({
  language: lang,
  jobTitle: version?.jobTitle ?? "",
  profile: version?.profile ?? "",
  skills: Array.isArray(version?.skills) ? version.skills : [],
  experiences: Array.isArray(version?.experiences) ? version.experiences : [],
  education: Array.isArray(version?.education) ? version.education : [],
  certifications: Array.isArray(version?.certifications)
    ? version.certifications
    : [],
  languages: Array.isArray(version?.languages) ? version.languages : [],
});

const normalizeVersions = (body) => {
  const versions = {};

  supportedLanguages.forEach((lang) => {
    if (body.versions?.[lang]) {
      versions[lang] = normalizeVersion(body.versions[lang], lang);
    }
  });

  if (Object.keys(versions).length > 0) {
    return versions;
  }

  const legacyHasCvContent =
    body.jobTitle ||
    body.profile ||
    body.skills ||
    body.experiences ||
    body.education ||
    body.certifications ||
    body.languages;

  if (!legacyHasCvContent) {
    return versions;
  }

  return {
    en: normalizeVersion(
      {
        jobTitle: body.jobTitle,
        profile: body.profile,
        skills: body.skills,
        experiences: body.experiences,
        education: body.education,
        certifications: body.certifications,
        languages: body.languages,
      },
      "en",
    ),
  };
};

const normalizeClientPayload = (body) => {
  const versions = normalizeVersions(body);

  return {
    fullName: body.fullName,
    mainJobTitle: body.mainJobTitle ?? body.jobTitle ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    location: body.location ?? "",
    website: body.website ?? "",
    photoUrl: body.photoUrl ?? "",
    versions,
    template: body.template ?? {
      name: "modern-sidebar",
      color: "#2f574d",
    },
  };
};

const validateVersionPayload = (version, lang) => {
  const errors = [];

  if (version.language && version.language !== lang) {
    errors.push(`Version language must match "${lang}".`);
  }

  versionArrayFields.forEach((field) => {
    if (field in version && !Array.isArray(version[field])) {
      errors.push(`${field} must be an array.`);
    }
  });

  return errors;
};

const validatePayload = (
  body,
  { requireFullName = false, requireVersion = false } = {},
) => {
  const errors = [];
  const versions = normalizeVersions(body);

  if (requireFullName && !body.fullName?.trim()) {
    errors.push("Full name is required.");
  }

  if (body.email && !emailRegex.test(body.email)) {
    errors.push("Email must be valid.");
  }

  supportedLanguages.forEach((lang) => {
    if (body.versions?.[lang]) {
      errors.push(...validateVersionPayload(body.versions[lang], lang));
    }
  });

  if (!body.versions) {
    errors.push(...validateVersionPayload(body, "en"));
  }

  if (requireVersion && Object.keys(versions).length === 0) {
    errors.push("At least one CV language version is required.");
  }

  return errors;
};

const applySharedFields = (client, body) => {
  sharedFields.forEach((field) => {
    if (field in body) {
      client[field] = body[field];
    }
  });

  if (!client.mainJobTitle) {
    client.mainJobTitle =
      client.versions?.en?.jobTitle || client.versions?.fr?.jobTitle || "";
  }
};

export const getAllCvClients = async (_request, response) => {
  try {
    const clients = await CvClient.find().sort({ updatedAt: -1 });
    response.json(clients);
  } catch (error) {
    sendServerError(response, error);
  }
};

export const getCvClientById = async (request, response) => {
  try {
    if (!isObjectId(request.params.id)) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const client = await CvClient.findById(request.params.id);

    if (!client) {
      return response.status(404).json({ message: "CV client not found." });
    }

    return response.json(client);
  } catch (error) {
    return sendServerError(response, error);
  }
};

export const createCvClient = async (request, response) => {
  try {
    const errors = validatePayload(request.body, {
      requireFullName: true,
      requireVersion: true,
    });

    if (errors.length > 0) {
      return response.status(400).json({ message: "Validation failed.", errors });
    }

    const client = await CvClient.create(normalizeClientPayload(request.body));
    return response.status(201).json(client);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return response.status(400).json(cleanValidationError(error));
    }

    return sendServerError(response, error);
  }
};

export const updateCvClient = async (request, response) => {
  try {
    if (!isObjectId(request.params.id)) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const errors = validatePayload(request.body, { requireVersion: true });

    if (errors.length > 0) {
      return response.status(400).json({ message: "Validation failed.", errors });
    }

    const client = await CvClient.findByIdAndUpdate(
      request.params.id,
      normalizeClientPayload(request.body),
      {
        new: true,
        runValidators: true,
      },
    );

    if (!client) {
      return response.status(404).json({ message: "CV client not found." });
    }

    return response.json(client);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return response.status(400).json(cleanValidationError(error));
    }

    return sendServerError(response, error);
  }
};

export const deleteCvClient = async (request, response) => {
  try {
    if (!isObjectId(request.params.id)) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const client = await CvClient.findByIdAndDelete(request.params.id);

    if (!client) {
      return response.status(404).json({ message: "CV client not found." });
    }

    return response.json({ message: "CV client deleted.", id: request.params.id });
  } catch (error) {
    return sendServerError(response, error);
  }
};

export const duplicateCvClient = async (request, response) => {
  try {
    if (!isObjectId(request.params.id)) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const client = await CvClient.findById(request.params.id).lean();

    if (!client) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const { _id, createdAt, updatedAt, __v, ...copyData } = client;
    const duplicated = await CvClient.create({
      ...copyData,
      fullName: `${client.fullName} - Copy`,
    });

    return response.status(201).json(duplicated);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return response.status(400).json(cleanValidationError(error));
    }

    return sendServerError(response, error);
  }
};

export const getCvClientVersion = async (request, response) => {
  try {
    const { id, lang } = request.params;

    if (!validateLanguageParam(response, lang)) {
      return;
    }

    if (!isObjectId(id)) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const client = await CvClient.findById(id);

    if (!client) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const version = client.versions?.[lang];

    if (!version) {
      return response.status(404).json({ message: "CV version not found." });
    }

    return response.json(version);
  } catch (error) {
    return sendServerError(response, error);
  }
};

export const updateCvClientVersion = async (request, response) => {
  try {
    const { id, lang } = request.params;

    if (!validateLanguageParam(response, lang)) {
      return;
    }

    if (!isObjectId(id)) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const bodyVersion = request.body.version ?? request.body;
    const errors = validateVersionPayload(bodyVersion, lang);

    if (request.body.email && !emailRegex.test(request.body.email)) {
      errors.push("Email must be valid.");
    }

    if (request.body.fullName !== undefined && !request.body.fullName?.trim()) {
      errors.push("Full name is required.");
    }

    if (errors.length > 0) {
      return response.status(400).json({ message: "Validation failed.", errors });
    }

    const client = await CvClient.findById(id);

    if (!client) {
      return response.status(404).json({ message: "CV client not found." });
    }

    applySharedFields(client, request.body);
    client.versions = client.versions ?? {};
    client.versions[lang] = normalizeVersion(bodyVersion, lang);
    client.mainJobTitle =
      request.body.mainJobTitle ??
      client.versions.en?.jobTitle ??
      client.versions.fr?.jobTitle ??
      client.mainJobTitle;
    client.markModified("versions");

    const saved = await client.save();
    return response.json(saved);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return response.status(400).json(cleanValidationError(error));
    }

    return sendServerError(response, error);
  }
};

export const cloneCvClientVersion = async (request, response) => {
  try {
    const { id, fromLang, toLang } = request.params;

    if (
      !validateLanguageParam(response, fromLang) ||
      !validateLanguageParam(response, toLang)
    ) {
      return;
    }

    if (fromLang === toLang) {
      return response.status(400).json({
        message: "Source and target language must be different.",
      });
    }

    if (!isObjectId(id)) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const client = await CvClient.findById(id);

    if (!client) {
      return response.status(404).json({ message: "CV client not found." });
    }

    const sourceVersion = client.versions?.[fromLang];

    if (!sourceVersion) {
      return response.status(404).json({
        message: `Source ${fromLang.toUpperCase()} CV version not found.`,
      });
    }

    const sourceData =
      typeof sourceVersion.toObject === "function"
        ? sourceVersion.toObject()
        : sourceVersion;

    client.versions = client.versions ?? {};
    client.versions[toLang] = normalizeVersion(sourceData, toLang);
    client.markModified("versions");

    const saved = await client.save();
    return response.status(201).json(saved);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return response.status(400).json(cleanValidationError(error));
    }

    return sendServerError(response, error);
  }
};
