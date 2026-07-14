import Application from "../models/Application.js";
import Candidate from "../models/Candidate.js";
import Invoice from "../models/Invoice.js";
import Lead from "../models/Lead.js";

function regexFromSearch(search) {
  return new RegExp(String(search || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

export async function globalSearch(req, res, next) {
  try {
    const search = String(req.query.search || "").trim();
    if (search.length < 2) return res.json({ results: [] });

    const regex = regexFromSearch(search);
    const [leads, applications, candidates, invoices] = await Promise.all([
      Lead.find({ $or: [{ name: regex }, { email: regex }, { phone: regex }, { courseInterested: regex }] }).limit(5),
      Application.find({ $or: [{ studentName: regex }, { email: regex }, { phone: regex }, { course: regex }, { city: regex }] }).limit(5),
      Candidate.find({ $or: [{ name: regex }, { email: regex }, { phone: regex }, { roleApplied: regex }, { department: regex }] }).limit(5),
      Invoice.find({ $or: [{ invoiceNumber: regex }, { studentName: regex }, { email: regex }, { phone: regex }, { course: regex }] }).limit(5),
    ]);

    const results = [
      ...leads.map((item) => ({ id: item._id, type: "Lead", title: item.name, subtitle: `${item.courseInterested} - ${item.status}`, href: "/dashboard/sales-leads" })),
      ...applications.map((item) => ({ id: item._id, type: "Application", title: item.studentName, subtitle: `${item.course} - ${item.status}`, href: "/dashboard/applications" })),
      ...candidates.map((item) => ({ id: item._id, type: "Candidate", title: item.name, subtitle: `${item.roleApplied} - ${item.status}`, href: "/dashboard/hr" })),
      ...invoices.map((item) => ({ id: item._id, type: "Invoice", title: item.invoiceNumber, subtitle: `${item.studentName} - ${item.paymentStatus}`, href: "/dashboard/billing" })),
    ];

    res.json({ results });
  } catch (error) {
    next(error);
  }
}
