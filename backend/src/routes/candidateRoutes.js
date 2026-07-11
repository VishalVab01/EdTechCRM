import express from "express";
import {
  bulkUpdateCandidateStatus,
  candidateOptions,
  createCandidate,
  deleteCandidate,
  getCandidateById,
  getCandidates,
  updateCandidate,
  updateCandidateInterview,
  updateCandidateStatus,
} from "../controllers/candidateController.js";
import { requireDatabase } from "../middleware/requireDatabase.js";

const router = express.Router();

router.get("/options", candidateOptions);

router.use(requireDatabase);

router.route("/").post(createCandidate).get(getCandidates);
router.patch("/bulk/status", bulkUpdateCandidateStatus);
router.route("/:id").get(getCandidateById).put(updateCandidate).delete(deleteCandidate);
router.patch("/:id/status", updateCandidateStatus);
router.patch("/:id/interview", updateCandidateInterview);

export default router;
