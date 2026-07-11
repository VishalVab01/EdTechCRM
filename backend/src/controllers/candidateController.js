import mongoose from "mongoose";
import Candidate, { CANDIDATE_SOURCES, CANDIDATE_STATUSES, INTERVIEW_MODES } from "../models/Candidate.js";

function normalizeCandidatePayload(body) {
  return {
    name: body.name,
    email: body.email || "",
    phone: body.phone,
    roleApplied: body.roleApplied,
    department: body.department || "",
    experience: body.experience || "",
    resumeUrl: body.resumeUrl || "",
    source: body.source || "Website",
    status: body.status || "Applied",
    interviewDate: body.interviewDate || null,
    interviewMode: body.interviewMode || "",
    assignedHR: body.assignedHR || "",
    remarks: body.remarks || "",
  };
}

function getReviewer(req) {
  return req.user?._id || req.user?.id || req.headers["x-demo-user"] || null;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function reviewPatch(req, status, remarks) {
  const patch = { status };

  if (remarks !== undefined) patch.remarks = remarks || "";
  if (["Shortlisted", "Interview Scheduled", "Selected", "Rejected", "On Hold"].includes(status)) {
    patch.reviewedBy = getReviewer(req);
    patch.reviewedAt = new Date();
  }

  return patch;
}

export async function createCandidate(req, res, next) {
  try {
    const candidate = await Candidate.create(normalizeCandidatePayload(req.body));
    res.status(201).json({ candidate });
  } catch (error) {
    next(error);
  }
}

export async function getCandidates(req, res, next) {
  try {
    const { status, roleApplied, department, source, assignedHR, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (roleApplied) query.roleApplied = roleApplied;
    if (department) query.department = department;
    if (source) query.source = source;
    if (assignedHR) query.assignedHR = assignedHR;
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }, { roleApplied: regex }, { department: regex }];
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json({ candidates });
  } catch (error) {
    next(error);
  }
}

export async function getCandidateById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid candidate id" });

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.json({ candidate });
  } catch (error) {
    next(error);
  }
}

export async function updateCandidate(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid candidate id" });

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, normalizeCandidatePayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.json({ candidate });
  } catch (error) {
    next(error);
  }
}

export async function deleteCandidate(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid candidate id" });

    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.json({ message: "Candidate deleted" });
  } catch (error) {
    next(error);
  }
}

export async function updateCandidateStatus(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid candidate id" });

    const { status, remarks } = req.body;
    if (!CANDIDATE_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${CANDIDATE_STATUSES.join(", ")}` });
    }

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, reviewPatch(req, status, remarks), {
      new: true,
      runValidators: true,
    });

    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.json({ candidate });
  } catch (error) {
    next(error);
  }
}

export async function updateCandidateInterview(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid candidate id" });

    const { interviewDate, interviewMode, remarks } = req.body;
    if (interviewDate && !INTERVIEW_MODES.includes(interviewMode)) {
      return res.status(400).json({ message: `Interview mode must be one of: ${INTERVIEW_MODES.join(", ")}` });
    }

    const patch = {
      interviewDate: interviewDate || null,
      interviewMode: interviewDate ? interviewMode : "",
      remarks: remarks || "",
      reviewedBy: getReviewer(req),
      reviewedAt: new Date(),
    };

    if (interviewDate) patch.status = "Interview Scheduled";

    const candidate = await Candidate.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });

    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    res.json({ candidate });
  } catch (error) {
    next(error);
  }
}

export async function bulkUpdateCandidateStatus(req, res, next) {
  try {
    const { candidateIds, status, remarks } = req.body;

    if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ message: "candidateIds must be a non-empty array" });
    }

    if (!candidateIds.every(isValidObjectId)) {
      return res.status(400).json({ message: "All candidate ids must be valid" });
    }

    if (!CANDIDATE_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${CANDIDATE_STATUSES.join(", ")}` });
    }

    const result = await Candidate.updateMany(
      { _id: { $in: candidateIds } },
      { $set: reviewPatch(req, status, remarks) },
      { runValidators: true }
    );

    res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, status });
  } catch (error) {
    next(error);
  }
}

export function candidateOptions(req, res) {
  res.json({ statuses: CANDIDATE_STATUSES, sources: CANDIDATE_SOURCES, interviewModes: INTERVIEW_MODES });
}
