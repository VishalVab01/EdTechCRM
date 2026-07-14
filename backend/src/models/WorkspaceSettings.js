import mongoose from "mongoose";

const workspaceSettingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      unique: true,
      default: "default",
    },
    instituteName: {
      type: String,
      trim: true,
      default: "EdTech CRM Workspace",
    },
    defaultCounselor: {
      type: String,
      trim: true,
      default: "",
    },
    timezone: {
      type: String,
      trim: true,
      default: "Asia/Kolkata",
    },
    currency: {
      type: String,
      trim: true,
      default: "INR",
    },
    leadAutoAssign: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    dailyDigest: {
      type: Boolean,
      default: true,
    },
    applicationAlerts: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const WorkspaceSettings = mongoose.model("WorkspaceSettings", workspaceSettingsSchema);

export default WorkspaceSettings;
