import WorkspaceSettings from "../models/WorkspaceSettings.js";

const allowedFields = ["instituteName", "defaultCounselor", "timezone", "currency", "leadAutoAssign", "emailNotifications", "dailyDigest", "applicationAlerts"];

export async function getSettings(req, res, next) {
  try {
    const settings = await WorkspaceSettings.findOneAndUpdate({ singletonKey: "default" }, { $setOnInsert: { singletonKey: "default" } }, { new: true, upsert: true });
    res.json({ settings });
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const updates = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) updates[field] = req.body[field];
    });
    updates.updatedBy = req.user._id;

    const settings = await WorkspaceSettings.findOneAndUpdate({ singletonKey: "default" }, updates, { new: true, upsert: true, runValidators: true });
    res.json({ settings });
  } catch (error) {
    next(error);
  }
}
