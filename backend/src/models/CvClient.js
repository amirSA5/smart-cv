import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const experienceSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, default: "" },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    current: { type: Boolean, default: false },
    descriptions: { type: [String], default: [] },
  },
  { _id: false },
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    level: { type: Number, default: 80, min: 0, max: 100 },
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, default: "" },
    school: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    issuer: { type: String, default: "" },
    reference: { type: String, default: "" },
    issueDate: { type: String, default: "" },
    expiryDate: { type: String, default: "" },
    description: { type: String, default: "" },
    bullets: { type: [String], default: [] },
  },
  { _id: false },
);

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    level: { type: String, default: "" },
  },
  { _id: false },
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const referenceSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    position: { type: String, default: "" },
    company: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { _id: false },
);

const strengthSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const interestSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
  },
  { _id: false },
);

const templateSettingsSchema = new mongoose.Schema(
  {
    accentColor: { type: String, default: "#000000" },
    secondaryColor: { type: String, default: "#6C63FF" },
    fontFamily: { type: String, default: "Montserrat" },
    fontSizeScale: {
      type: Number,
      enum: [0.9, 1, 1.1, 1.2],
      default: 1,
    },
    styleVariant: {
      type: String,
      enum: ["classic", "modern", "minimal", "elegant"],
      default: "classic",
    },
    borderStyle: {
      type: String,
      enum: ["none", "thin", "colored", "rounded"],
      default: "thin",
    },
    photoStyle: {
      type: String,
      enum: ["rectangle", "rounded", "circle"],
      default: "rectangle",
    },
  },
  { _id: false },
);

const cvVersionSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      enum: ["en", "fr"],
      required: true,
    },
    jobTitle: { type: String, default: "" },
    profile: { type: String, default: "" },
    skills: { type: [mongoose.Schema.Types.Mixed], default: [] },
    itSkills: { type: [skillSchema], default: [] },
    experiences: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    languages: { type: [languageSchema], default: [] },
    achievements: { type: [achievementSchema], default: [] },
    references: { type: [referenceSchema], default: [] },
    strengths: { type: [strengthSchema], default: [] },
    interests: { type: [interestSchema], default: [] },
  },
  { _id: false },
);

const cvClientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
    },
    mainJobTitle: { type: String, default: "" },
    email: {
      type: String,
      default: "",
      trim: true,
      validate: {
        validator(value) {
          return !value || emailRegex.test(value);
        },
        message: "Email must be valid.",
      },
    },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    versions: {
      en: { type: cvVersionSchema, default: undefined },
      fr: { type: cvVersionSchema, default: undefined },
    },
    template: {
      id: {
        type: String,
        enum: [
          "modern-sidebar",
          "tech-professional",
          "yellow-professional-timeline",
          "photo-split-professional",
        ],
        default: "modern-sidebar",
      },
      name: { type: String, default: "Modern Sidebar" },
      color: { type: String, default: "#2f574d" },
    },
    templateSettings: { type: templateSettingsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

const CvClient = mongoose.model("CvClient", cvClientSchema);

export default CvClient;
