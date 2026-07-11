import mongoose from "mongoose";
import Lead, { LEAD_SOURCES, LEAD_STATUSES } from "../models/Lead.js";

function normalizeLeadPayload(body) {
  return {
    name: body.name,
    email: body.email || "",
    phone: body.phone,
    courseInterested: body.courseInterested,
    source: body.source || "Website",
    status: body.status || "New",
    assignedCounselor: body.assignedCounselor || "",
    followUpDate: body.followUpDate || null,
    notes: body.notes || "",
  };
}

function getCreatedBy(req) {
  return req.user?._id || req.user?.id || req.headers["x-demo-user"] || null;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function createLead(req, res, next) {
  try {
    const lead = await Lead.create({
      ...normalizeLeadPayload(req.body),
      createdBy: getCreatedBy(req),
    });

    res.status(201).json({ lead });
  } catch (error) {
    next(error);
  }
}

export async function getLeads(req, res, next) {
  try {
    const { status, source, search, assignedCounselor } = req.query;
    const query = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (assignedCounselor) query.assignedCounselor = assignedCounselor;
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }, { courseInterested: regex }];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json({ leads });
  } catch (error) {
    next(error);
  }
}

export async function getLeadById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (error) {
    next(error);
  }
}

export async function updateLead(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, normalizeLeadPayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ message: "Lead deleted" });
  } catch (error) {
    next(error);
  }
}

export async function updateLeadStatus(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const { status } = req.body;
    if (!LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${LEAD_STATUSES.join(", ")}` });
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (error) {
    next(error);
  }
}

export async function updateLeadNotes(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid lead id" });
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, { notes: req.body.notes || "" }, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json({ lead });
  } catch (error) {
    next(error);
  }
}

export function leadOptions(req, res) {
  res.json({ statuses: LEAD_STATUSES, sources: LEAD_SOURCES });
}
