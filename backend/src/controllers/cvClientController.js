import mongoose from "mongoose";
import CvClient from "../models/CvClient.js";

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const supportedLanguages = ["en", "fr"];
const templateCatalog = {
  "modern-sidebar": {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    color: "#2f574d",
  },
  "tech-professional": {
    id: "tech-professional",
    name: "Tech Professional",
    color: "#111111",
  },
  "yellow-professional-timeline": {
    id: "yellow-professional-timeline",
    name: "Yellow Professional Timeline Template",
    color: "#f4c430",
  },
  "photo-split-professional": {
    id: "photo-split-professional",
    name: "Photo Split Professional",
    color: "#111111",
  },
};
const versionArrayFields = [
  "skills",
  "itSkills",
  "experiences",
  "education",
  "certifications",
  "languages",
  "achievements",
  "references",
  "strengths",
  "interests",
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
  "templateSettings",
];

const defaultTemplateSettings = {
  accentColor: "#000000",
  secondaryColor: "#6C63FF",
  fontFamily: "Montserrat",
  fontSizeScale: 1,
  styleVariant: "classic",
  borderStyle: "thin",
  photoStyle: "rectangle",
};
const styleVariants = ["classic", "modern", "minimal", "elegant"];
const borderStyles = ["none", "thin", "colored", "rounded"];
const photoStyles = ["rectangle", "rounded", "circle"];
const fontSizeScales = [0.9, 1, 1.1, 1.2];

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

const normalizeLevel = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 80;
  }

  return Math.min(100, Math.max(0, Math.round(number)));
};

const normalizeSkill = (skill) => {
  if (typeof skill === "string") {
    return {
      name: skill,
      level: 80,
    };
  }

  return {
    name: skill?.name ?? "",
    level: normalizeLevel(skill?.level),
  };
};

const normalizeSkills = (skills) =>
  Array.isArray(skills) ? skills.map(normalizeSkill) : [];

const normalizeCertification = (certification) => ({
  title: certification?.title ?? "",
  issuer: certification?.issuer ?? "",
  reference: certification?.reference ?? "",
  issueDate: certification?.issueDate ?? "",
  expiryDate: certification?.expiryDate ?? "",
  description: certification?.description ?? "",
  bullets: Array.isArray(certification?.bullets)
    ? certification.bullets
    : [],
});

const normalizeVersion = (version, lang) => ({
  language: lang,
  jobTitle: version?.jobTitle ?? "",
  profile: version?.profile ?? "",
  skills: normalizeSkills(version?.skills),
  itSkills: normalizeSkills(version?.itSkills),
  experiences: Array.isArray(version?.experiences) ? version.experiences : [],
  education: Array.isArray(version?.education) ? version.education : [],
  certifications: Array.isArray(version?.certifications)
    ? version.certifications.map(normalizeCertification)
    : [],
  languages: Array.isArray(version?.languages) ? version.languages : [],
  achievements: Array.isArray(version?.achievements)
    ? version.achievements
    : [],
  references: Array.isArray(version?.references) ? version.references : [],
  strengths: Array.isArray(version?.strengths) ? version.strengths : [],
  interests: Array.isArray(version?.interests) ? version.interests : [],
});

const normalizeTemplate = (template) => {
  const legacyName = template?.name;
  const requestedId =
    template?.id ??
    (legacyName === "yellow-professional-timeline"
      ? "yellow-professional-timeline"
      : undefined) ??
    (legacyName === "tech-professional" ? "tech-professional" : undefined) ??
    (legacyName === "photo-split-professional"
      ? "photo-split-professional"
      : undefined) ??
    (legacyName === "modern-sidebar" ? "modern-sidebar" : undefined);
  const id =
    requestedId && templateCatalog[requestedId]
      ? requestedId
      : "modern-sidebar";
  const defaults = templateCatalog[id];

  return {
    ...defaults,
    name: template?.name && !templateCatalog[template.name]
      ? template.name
      : defaults.name,
    color: template?.color ?? defaults.color,
  };
};

const normalizeTemplateSettings = (settings = {}) => {
  const source =
    settings && typeof settings === "object" && !Array.isArray(settings)
      ? settings
      : {};

  return {
    accentColor: source.accentColor ?? defaultTemplateSettings.accentColor,
    secondaryColor:
      source.secondaryColor ?? defaultTemplateSettings.secondaryColor,
    fontFamily: source.fontFamily ?? defaultTemplateSettings.fontFamily,
    fontSizeScale: fontSizeScales.includes(Number(source.fontSizeScale))
      ? Number(source.fontSizeScale)
      : defaultTemplateSettings.fontSizeScale,
    styleVariant: styleVariants.includes(source.styleVariant)
      ? source.styleVariant
      : defaultTemplateSettings.styleVariant,
    borderStyle: borderStyles.includes(source.borderStyle)
      ? source.borderStyle
      : defaultTemplateSettings.borderStyle,
    photoStyle: photoStyles.includes(source.photoStyle)
      ? source.photoStyle
      : defaultTemplateSettings.photoStyle,
  };
};

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
    body.itSkills ||
    body.experiences ||
    body.education ||
    body.certifications ||
    body.languages ||
    body.achievements ||
    body.references ||
    body.strengths ||
    body.interests;

  if (!legacyHasCvContent) {
    return versions;
  }

  return {
    en: normalizeVersion(
      {
        jobTitle: body.jobTitle,
        profile: body.profile,
        skills: body.skills,
        itSkills: body.itSkills,
        experiences: body.experiences,
        education: body.education,
        certifications: body.certifications,
        languages: body.languages,
        achievements: body.achievements,
        references: body.references,
        strengths: body.strengths,
        interests: body.interests,
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
    template: normalizeTemplate(body.template),
    templateSettings: normalizeTemplateSettings(body.templateSettings),
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

  ["skills", "itSkills"].forEach((field) => {
    if (!Array.isArray(version[field])) {
      return;
    }

    version[field].forEach((skill, index) => {
      if (typeof skill === "string" || skill?.level === undefined) {
        return;
      }

      const level = Number(skill.level);

      if (!Number.isFinite(level) || level < 0 || level > 100) {
        errors.push(`${field}.${index}.level must be between 0 and 100.`);
      }
    });
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

  client.template = normalizeTemplate(client.template);
  client.templateSettings = normalizeTemplateSettings(client.templateSettings);
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
