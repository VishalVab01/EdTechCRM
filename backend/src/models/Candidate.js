import mongoose from "mongoose";

export const CANDIDATE_STATUSES = ["Applied", "Shortlisted", "Interview Scheduled", "Selected", "Rejected", "On Hold"];
export const CANDIDATE_SOURCES = ["Website", "LinkedIn", "Referral", "Job Portal", "Walk-in", "Other"];
export const INTERVIEW_MODES = ["Online", "Offline", "Phone Call"];

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Candidate name is required"],
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
    roleApplied: {
      type: String,
      required: [true, "Role applied is required"],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: String,
      trim: true,
      default: "",
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      enum: CANDIDATE_SOURCES,
      default: "Website",
    },
    status: {
      type: String,
      enum: CANDIDATE_STATUSES,
      default: "Applied",
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    interviewMode: {
      type: String,
      enum: [...INTERVIEW_MODES, ""],
      default: "",
    },
    assignedHR: {
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

candidateSchema.index({ name: "text", email: "text", phone: "text", roleApplied: "text", department: "text" });

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
