import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { requireDatabase } from "../middleware/requireDatabase.js";

const router = express.Router();

router.use(requireDatabase, requireAuth);
router.get("/", getSettings);
router.put("/", requireRole(["Super Admin"]), updateSettings);

export default router;
