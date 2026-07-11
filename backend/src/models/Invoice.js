import mongoose from "mongoose";

export const PAYMENT_STATUSES = ["Pending", "Partially Paid", "Paid", "Overdue", "Cancelled"];
export const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque", "Other"];

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      default: "",
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    paidAmount: {
      type: Number,
      min: [0, "Paid amount cannot be negative"],
      default: 0,
    },
    dueAmount: {
      type: Number,
      min: [0, "Due amount cannot be negative"],
      default: 0,
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      default: 0,
    },
    tax: {
      type: Number,
      min: [0, "Tax cannot be negative"],
      default: 0,
    },
    totalAmount: {
      type: Number,
      min: [0, "Total amount cannot be negative"],
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: [...PAYMENT_METHODS, ""],
      default: "",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    paidDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: "text", studentName: "text", email: "text", phone: "text", course: "text" });

function deriveInvoiceAmounts(invoice) {
  const amount = Number(invoice.amount || 0);
  const tax = Number(invoice.tax || 0);
  const discount = Number(invoice.discount || 0);
  const totalAmount = Math.max(amount + tax - discount, 0);
  const paidAmount = Math.min(Number(invoice.paidAmount || 0), totalAmount);
  const dueAmount = Math.max(totalAmount - paidAmount, 0);

  invoice.totalAmount = totalAmount;
  invoice.paidAmount = paidAmount;
  invoice.dueAmount = dueAmount;

  if (invoice.paymentStatus !== "Cancelled") {
    const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
    const isOverdue = dueDate && dueDate < new Date() && dueAmount > 0;

    if (paidAmount <= 0) invoice.paymentStatus = isOverdue ? "Overdue" : "Pending";
    if (paidAmount > 0 && paidAmount < totalAmount) invoice.paymentStatus = isOverdue ? "Overdue" : "Partially Paid";
    if (paidAmount >= totalAmount) invoice.paymentStatus = "Paid";
  }
}

invoiceSchema.pre("validate", async function setInvoiceNumber(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Invoice").countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;
  }

  deriveInvoiceAmounts(this);
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
