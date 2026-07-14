import mongoose from "mongoose";
import Invoice, { PAYMENT_METHODS, PAYMENT_STATUSES } from "../models/Invoice.js";

function getCreatedBy(req) {
  return req.user?._id || req.user?.id || null;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function normalizeInvoicePayload(body) {
  return {
    studentName: body.studentName,
    email: body.email || "",
    phone: body.phone,
    course: body.course,
    amount: Number(body.amount || 0),
    paidAmount: Number(body.paidAmount || 0),
    discount: Number(body.discount || 0),
    tax: Number(body.tax || 0),
    paymentMethod: body.paymentMethod || "",
    dueDate: body.dueDate,
    paidDate: body.paidDate || null,
    notes: body.notes || "",
  };
}

function validateInvoiceAmounts(payload) {
  const totalAmount = Math.max(Number(payload.amount || 0) + Number(payload.tax || 0) - Number(payload.discount || 0), 0);

  if (payload.amount <= 0) return "Amount must be greater than 0";
  if (payload.discount < 0) return "Discount cannot be negative";
  if (payload.tax < 0) return "Tax cannot be negative";
  if (payload.paidAmount < 0) return "Paid amount cannot be negative";
  if (payload.paidAmount > totalAmount) return "Paid amount cannot be greater than total amount";
  return "";
}

async function saveWithCalculations(invoice) {
  await invoice.validate();
  await invoice.save();
  return invoice;
}

export async function createInvoice(req, res, next) {
  try {
    const payload = normalizeInvoicePayload(req.body);
    const validationMessage = validateInvoiceAmounts(payload);
    if (validationMessage) return res.status(400).json({ message: validationMessage });

    const invoice = new Invoice({ ...payload, createdBy: getCreatedBy(req) });
    await saveWithCalculations(invoice);
    res.status(201).json({ invoice });
  } catch (error) {
    next(error);
  }
}

export async function getInvoices(req, res, next) {
  try {
    const { paymentStatus, paymentMethod, course, search, fromDate, toDate } = req.query;
    const query = {};

    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (course) query.course = course;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ invoiceNumber: regex }, { studentName: regex }, { email: regex }, { phone: regex }, { course: regex }];
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json({ invoices });
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceById(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid invoice id" });

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json({ invoice });
  } catch (error) {
    next(error);
  }
}

export async function updateInvoice(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid invoice id" });

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const payload = normalizeInvoicePayload(req.body);
    const validationMessage = validateInvoiceAmounts(payload);
    if (validationMessage) return res.status(400).json({ message: validationMessage });

    Object.assign(invoice, payload);
    await saveWithCalculations(invoice);
    res.json({ invoice });
  } catch (error) {
    next(error);
  }
}

export async function deleteInvoice(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid invoice id" });

    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json({ message: "Invoice deleted" });
  } catch (error) {
    next(error);
  }
}

export async function updateInvoicePayment(req, res, next) {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid invoice id" });

    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const addedPayment = Number(req.body.paidAmount || 0);
    if (addedPayment < 0) return res.status(400).json({ message: "Paid amount cannot be negative" });
    if (addedPayment > invoice.dueAmount) return res.status(400).json({ message: "Payment cannot exceed due amount" });

    invoice.paidAmount = Number(invoice.paidAmount || 0) + addedPayment;
    invoice.paymentMethod = req.body.paymentMethod || invoice.paymentMethod || "";
    invoice.paidDate = req.body.paidDate || invoice.paidDate || null;
    invoice.notes = req.body.notes || invoice.notes || "";

    await saveWithCalculations(invoice);
    res.json({ invoice });
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceSummary(req, res, next) {
  try {
    const invoices = await Invoice.find();
    const summary = invoices.reduce(
      (acc, invoice) => {
        acc.totalRevenue += invoice.totalAmount || 0;
        acc.collectedAmount += invoice.paidAmount || 0;
        acc.pendingAmount += invoice.dueAmount || 0;
        if (invoice.paymentStatus === "Overdue") acc.overdueAmount += invoice.dueAmount || 0;
        acc.totalInvoices += 1;
        if (invoice.paymentStatus === "Paid") acc.paidInvoices += 1;
        if (["Pending", "Partially Paid"].includes(invoice.paymentStatus)) acc.pendingInvoices += 1;
        if (invoice.paymentStatus === "Overdue") acc.overdueInvoices += 1;
        return acc;
      },
      {
        totalRevenue: 0,
        collectedAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
      }
    );

    res.json({ summary });
  } catch (error) {
    next(error);
  }
}

export function invoiceOptions(req, res) {
  res.json({ statuses: PAYMENT_STATUSES, methods: PAYMENT_METHODS });
}
