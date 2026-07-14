import express from "express";
import { globalSearch } from "../controllers/searchController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireDatabase } from "../middleware/requireDatabase.js";

const router = express.Router();

router.use(requireDatabase, requireAuth);
router.get("/", globalSearch);

export default router;
