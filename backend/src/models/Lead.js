import mongoose from "mongoose";

export const LEAD_STATUSES = ["New", "Contacted", "Demo Scheduled", "Converted", "Lost"];
export const LEAD_SOURCES = ["Website", "Referral", "Instagram", "Facebook", "Google Ads", "Walk-in", "Other"];

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      default: "",
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    courseInterested: {
      type: String,
      required: [true, "Course interested is required"],
      trim: true,
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      default: "Website",
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New",
    },
    assignedCounselor: {
      type: String,
      trim: true,
      default: "",
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ name: "text", email: "text", phone: "text", courseInterested: "text" });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
