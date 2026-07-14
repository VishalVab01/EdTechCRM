import mongoose from "mongoose";
import Application, { APPLICATION_SOURCES, APPLICATION_STATUSES } from "../models/Application.js";

function normalizeApplicationPayload(body) {
  return {
    studentName: body.studentName,
    email: body.email || "",
    phone: body.phone,
    course: body.course,
    qualification: body.qualification || "",
    city: body.city || "",
    applicationSource: body.applicationSource || "Website",
    documents: Array.isArray(body.documents) ? body.documents : [],
    status: body.status || "Pending",
    assignedReviewer: body.assignedReviewer || "",
    remarks: body.remarks || "",
  };
}

function getReviewer(req) {
  return req.user?._id || req.user?.id || null;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function reviewPatch(req, status, remarks) {
  const patch = { status };

  if (remarks !== undefined) patch.remarks = remarks || "";
  if (["Approved", "Rejected", "On Hold", "Under Review"].includes(status)) {
    patch.reviewedBy = getReviewer(req);
    patch.reviewedAt = new Date();
  }

  return patch;
}

export async function createApplication(req, res, next) {
  try {
    const application = await Application.create(normalizeApplicationPayload(req.body));
    res.status(201).json({ application });
  } catch (error) {
    next(error);
  }
}

export async function getApplications(req, res, next) {
  try {
    const { status, course, search, assignedReviewer, applicationSource } = req.query;
    const query = {};

    if (status) query.status = status;
    if (course) query.course = course;
    if (assignedReviewer) query.assignedReviewer = assignedReviewer;
    if (applicationSource) query.applicationSource = applicationSource;
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ studentName: regex }, { email: regex }, { phone: regex }, { course: regex }, { city: regex }];
    }

    const applications = await Application.find(query).sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    next(error);
  }
}

export async function getApplicationById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json({ application });
  } catch (error) {
    next(error);
  }
}

export async function updateApplication(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const application = await Application.findByIdAndUpdate(req.params.id, normalizeApplicationPayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json({ application });
  } catch (error) {
    next(error);
  }
}

export async function deleteApplication(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application deleted" });
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const { status, remarks } = req.body;
    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}` });
    }

    const application = await Application.findByIdAndUpdate(req.params.id, reviewPatch(req, status, remarks), {
      new: true,
      runValidators: true,
    });

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.json({ application });
  } catch (error) {
    next(error);
  }
}

export async function bulkUpdateApplicationStatus(req, res, next) {
  try {
    const { applicationIds, status, remarks } = req.body;

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: "applicationIds must be a non-empty array" });
    }

    if (!applicationIds.every(isValidObjectId)) {
      return res.status(400).json({ message: "All application ids must be valid" });
    }

    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}` });
    }

    const result = await Application.updateMany(
      { _id: { $in: applicationIds } },
      { $set: reviewPatch(req, status, remarks) },
      { runValidators: true }
    );

    res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount, status });
  } catch (error) {
    next(error);
  }
}

export function applicationOptions(req, res) {
  res.json({ statuses: APPLICATION_STATUSES, sources: APPLICATION_SOURCES });
}
