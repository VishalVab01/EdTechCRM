import mongoose from "mongoose";

export const APPLICATION_STATUSES = ["Pending", "Under Review", "Approved", "Rejected", "On Hold"];
export const APPLICATION_SOURCES = ["Website", "Counselor", "Referral", "Walk-in", "Campaign", "Other"];

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
    type: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
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
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    applicationSource: {
      type: String,
      enum: APPLICATION_SOURCES,
      default: "Website",
    },
    documents: {
      type: [documentSchema],
      default: [],
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "Pending",
    },
    assignedReviewer: {
      type: String,
      trim: true,
      default: "",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ studentName: "text", email: "text", phone: "text", course: "text", city: "text" });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
