import express from "express";
import {
  applicationOptions,
  bulkUpdateApplicationStatus,
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  updateApplication,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/options", applicationOptions);

router.use(requireDatabase, requireAuth);

router.route("/").post(createApplication).get(getApplications);
router.patch("/bulk/status", bulkUpdateApplicationStatus);
router.route("/:id").get(getApplicationById).put(updateApplication).delete(requireRole(["Super Admin", "Reviewer"]), deleteApplication);
router.patch("/:id/status", updateApplicationStatus);

export default router;
