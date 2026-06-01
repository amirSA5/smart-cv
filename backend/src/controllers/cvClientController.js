import mongoose from "mongoose";
import CvClient from "../models/CvClient.js";

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const arrayFields = [
  "skills",
  "experiences",
  "education",
  "certifications",
  "languages",
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

const validatePayload = (body, { requireFullName = false } = {}) => {
  const errors = [];

  if (requireFullName && !body.fullName?.trim()) {
    errors.push("Full name is required.");
  }

  if (body.email && !emailRegex.test(body.email)) {
    errors.push("Email must be valid.");
  }

  arrayFields.forEach((field) => {
    if (field in body && !Array.isArray(body[field])) {
      errors.push(`${field} must be an array.`);
    }
  });

  return errors;
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
    const errors = validatePayload(request.body, { requireFullName: true });

    if (errors.length > 0) {
      return response.status(400).json({ message: "Validation failed.", errors });
    }

    const client = await CvClient.create(request.body);
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

    const errors = validatePayload(request.body);

    if (errors.length > 0) {
      return response.status(400).json({ message: "Validation failed.", errors });
    }

    const client = await CvClient.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

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
