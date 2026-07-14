import express from "express";
import {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  leadOptions,
  updateLead,
  updateLeadNotes,
  updateLeadStatus,
} from "../controllers/leadController.js";
import { requireDatabase } from "../middleware/requireDatabase.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/options", leadOptions);

router.use(requireDatabase, requireAuth);

router.route("/").post(createLead).get(getLeads);
router.route("/:id").get(getLeadById).put(updateLead).delete(requireRole(["Super Admin"]), deleteLead);
router.patch("/:id/status", updateLeadStatus);
router.patch("/:id/notes", updateLeadNotes);

export default router;
