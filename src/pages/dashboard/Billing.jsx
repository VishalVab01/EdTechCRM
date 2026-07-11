import { useEffect, useMemo, useState } from "react";
import { CreditCard, Edit3, Eye, Plus, Printer, ReceiptText, RefreshCcw, Search, Trash2, X } from "lucide-react";
import {
  createInvoice,
  deleteInvoice,
  getInvoices,
  getInvoiceSummary,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  updateInvoice,
  updateInvoicePayment,
} from "../../services/invoiceService.js";

const emptyForm = {
  studentName: "",
  email: "",
  phone: "",
  course: "",
  amount: "",
  discount: "0",
  tax: "0",
  paidAmount: "0",
  paymentMethod: "",
  dueDate: "",
  notes: "",
};

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  "Partially Paid": "bg-blue-50 text-blue-700 border-blue-100",
  Paid: "bg-mint text-pine border-mint",
  Overdue: "bg-rose-50 text-rose-700 border-rose-100",
  Cancelled: "bg-slate-100 text-slate-700 border-slate-200",
};

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function calcTotals(form) {
  const amount = Number(form.amount || 0);
  const discount = Number(form.discount || 0);
  const tax = Number(form.tax || 0);
  const paidAmount = Number(form.paidAmount || 0);
  const totalAmount = Math.max(amount + tax - discount, 0);
  const dueAmount = Math.max(totalAmount - paidAmount, 0);
  return { amount, discount, tax, paidAmount, totalAmount, dueAmount };
}

function ModalShell({ eyebrow, title, onClose, children, maxWidth = "max-w-3xl" }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/35 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className={`max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-[8px] border border-line bg-white shadow-soft`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">{title}</h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-cloud text-muted hover:text-ink" aria-label="Close modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function InvoiceModal({ mode, invoice, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const isView = mode === "view";

  useEffect(() => {
    setForm(
      invoice
        ? {
            studentName: invoice.studentName || "",
            email: invoice.email || "",
            phone: invoice.phone || "",
            course: invoice.course || "",
            amount: String(invoice.amount || ""),
            discount: String(invoice.discount || 0),
            tax: String(invoice.tax || 0),
            paidAmount: String(invoice.paidAmount || 0),
            paymentMethod: invoice.paymentMethod || "",
            dueDate: toDateInput(invoice.dueDate),
            notes: invoice.notes || "",
          }
        : emptyForm
    );
    setError("");
  }, [invoice]);

  const totals = useMemo(() => calcTotals(form), [form]);
  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!form.studentName.trim() || !form.phone.trim() || !form.course.trim() || !form.amount || !form.dueDate) return setError("Student name, phone, course, amount, and due date are required.");
    if (form.email && !emailPattern.test(form.email)) return setError("Enter a valid email address or leave it blank.");
    if (totals.amount <= 0) return setError("Amount must be greater than 0.");
    if (totals.discount < 0 || totals.tax < 0 || totals.paidAmount < 0) return setError("Discount, tax, and paid amount cannot be negative.");
    if (totals.paidAmount > totals.totalAmount) return setError("Paid amount cannot be greater than total amount.");

    onSave({
      studentName: form.studentName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      course: form.course.trim(),
      amount: totals.amount,
      discount: totals.discount,
      tax: totals.tax,
      paidAmount: totals.paidAmount,
      paymentMethod: form.paymentMethod,
      dueDate: form.dueDate,
      notes: form.notes.trim(),
    });
  };

  if (isView) {
    return (
      <ModalShell eyebrow="Invoice details" title={invoice?.invoiceNumber} onClose={onClose}>
        <div className="p-5">
          <div className="print:block rounded-[8px] border border-line bg-cloud p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-2xl font-black text-ink">EdTech CRM Invoice</h3>
                <p className="mt-1 text-sm text-muted">{invoice?.invoiceNumber}</p>
              </div>
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-pine">
                <Printer className="h-4 w-4" /> Print
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["Student", invoice?.studentName],
                ["Email", invoice?.email || "Not provided"],
                ["Phone", invoice?.phone],
                ["Course", invoice?.course],
                ["Amount", money(invoice?.amount)],
                ["Discount", money(invoice?.discount)],
                ["Tax", money(invoice?.tax)],
                ["Total Amount", money(invoice?.totalAmount)],
                ["Paid Amount", money(invoice?.paidAmount)],
                ["Due Amount", money(invoice?.dueAmount)],
                ["Payment Status", invoice?.paymentStatus],
                ["Payment Method", invoice?.paymentMethod || "Not set"],
                ["Due Date", formatDate(invoice?.dueDate)],
                ["Paid Date", formatDate(invoice?.paidDate)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[8px] border border-line bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
                  <p className="mt-2 font-bold text-ink">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[8px] border border-line bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Notes</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink">{invoice?.notes || "No notes yet."}</p>
            </div>
          </div>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell eyebrow={mode === "edit" ? "Edit invoice" : "Create invoice"} title="Billing invoice" onClose={onClose}>
      <form onSubmit={submit} className="p-5">
        {error && <p className="mb-4 rounded-[8px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-ink">Student Name *<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.studentName} onChange={(event) => updateField("studentName", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Email<input type="email" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.email} onChange={(event) => updateField("email", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Phone *<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Course *<input className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.course} onChange={(event) => updateField("course", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Amount *<input type="number" min="0" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Discount<input type="number" min="0" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.discount} onChange={(event) => updateField("discount", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Tax<input type="number" min="0" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.tax} onChange={(event) => updateField("tax", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Paid Amount<input type="number" min="0" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.paidAmount} onChange={(event) => updateField("paidAmount", event.target.value)} /></label>
          <label className="text-sm font-bold text-ink">Payment Method<select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.paymentMethod} onChange={(event) => updateField("paymentMethod", event.target.value)}><option value="">No method</option>{PAYMENT_METHODS.map((method) => <option key={method}>{method}</option>)}</select></label>
          <label className="text-sm font-bold text-ink">Due Date *<input type="date" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} /></label>
          <label className="sm:col-span-2 text-sm font-bold text-ink">Notes<textarea rows="4" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
        </div>
        <div className="mt-5 grid gap-3 rounded-[8px] border border-line bg-cloud p-4 sm:grid-cols-2">
          <p className="text-sm font-bold text-ink">Total Amount: {money(totals.totalAmount)}</p>
          <p className="text-sm font-bold text-ink">Due Amount: {money(totals.dueAmount)}</p>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink hover:bg-cloud">Cancel</button>
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">{mode === "edit" ? "Save changes" : "Create invoice"}</button>
        </div>
      </form>
    </ModalShell>
  );
}

function PaymentModal({ invoice, onClose, onSave }) {
  const [form, setForm] = useState({ paidAmount: "", paymentMethod: invoice?.paymentMethod || "UPI", paidDate: toDateInput(new Date()), notes: invoice?.notes || "" });
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const amount = Number(form.paidAmount || 0);
    if (amount <= 0) return setError("Payment amount must be greater than 0.");
    if (amount > Number(invoice?.dueAmount || 0)) return setError("Payment cannot exceed due amount.");
    onSave({ ...form, paidAmount: amount });
  };

  return (
    <ModalShell eyebrow="Record payment" title={invoice?.invoiceNumber} onClose={onClose} maxWidth="max-w-xl">
      <form onSubmit={submit} className="p-5">
        {error && <p className="mb-4 rounded-[8px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
        <p className="mb-4 rounded-[8px] bg-cloud px-4 py-3 text-sm font-bold text-ink">Due amount: {money(invoice?.dueAmount)}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-ink">New paid amount<input type="number" min="0" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.paidAmount} onChange={(event) => setForm((current) => ({ ...current, paidAmount: event.target.value }))} /></label>
          <label className="text-sm font-bold text-ink">Payment Method<select className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}>{PAYMENT_METHODS.map((method) => <option key={method}>{method}</option>)}</select></label>
          <label className="text-sm font-bold text-ink">Paid Date<input type="date" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.paidDate} onChange={(event) => setForm((current) => ({ ...current, paidDate: event.target.value }))} /></label>
          <label className="sm:col-span-2 text-sm font-bold text-ink">Notes<textarea rows="4" className="mt-2 w-full resize-none rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} /></label>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-5 py-3 text-sm font-bold text-ink hover:bg-cloud">Cancel</button>
          <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">Record payment</button>
        </div>
      </form>
    </ModalShell>
  );
}

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filters, setFilters] = useState({ search: "", paymentStatus: "", paymentMethod: "", course: "", fromDate: "", toDate: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState({ mode: null, invoice: null });
  const [paymentInvoice, setPaymentInvoice] = useState(null);

  const courseOptions = useMemo(() => Array.from(new Set(invoices.map((invoice) => invoice.course).filter(Boolean))).sort(), [invoices]);
  const statCards = summary
    ? [
        ["Total Revenue", money(summary.totalRevenue)],
        ["Collected Amount", money(summary.collectedAmount)],
        ["Pending Amount", money(summary.pendingAmount)],
        ["Overdue Amount", money(summary.overdueAmount)],
        ["Total Invoices", summary.totalInvoices],
        ["Paid Invoices", summary.paidInvoices],
      ]
    : [["Total Revenue", money(0)], ["Collected Amount", money(0)], ["Pending Amount", money(0)], ["Overdue Amount", money(0)], ["Total Invoices", 0], ["Paid Invoices", 0]];

  const loadBilling = async () => {
    setLoading(true);
    setError("");
    try {
      const [invoiceData, summaryData] = await Promise.all([getInvoices(filters), getInvoiceSummary()]);
      setInvoices(invoiceData.invoices || []);
      setSummary(summaryData.summary || null);
    } catch (apiError) {
      setInvoices([]);
      setSummary(null);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handle = setTimeout(loadBilling, 250);
    return () => clearTimeout(handle);
  }, [filters.search, filters.paymentStatus, filters.paymentMethod, filters.course, filters.fromDate, filters.toDate]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const saveInvoice = async (payload) => {
    try {
      if (modal.mode === "edit") {
        await updateInvoice(modal.invoice._id, payload);
        showToast("Invoice updated successfully.");
      } else {
        await createInvoice(payload);
        showToast("Invoice created successfully.");
      }
      setModal({ mode: null, invoice: null });
      await loadBilling();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const removeInvoice = async (invoice) => {
    if (!window.confirm(`Delete invoice ${invoice.invoiceNumber}?`)) return;
    try {
      await deleteInvoice(invoice._id);
      showToast("Invoice deleted.");
      await loadBilling();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const recordPayment = async (payload) => {
    try {
      await updateInvoicePayment(paymentInvoice._id, payload);
      showToast("Payment recorded.");
      setPaymentInvoice(null);
      await loadBilling();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  const markAsPaid = async (invoice) => {
    if (Number(invoice.dueAmount || 0) <= 0) return showToast("Invoice is already paid.");
    try {
      await updateInvoicePayment(invoice._id, { paidAmount: invoice.dueAmount, paymentMethod: invoice.paymentMethod || "UPI", paidDate: toDateInput(new Date()), notes: invoice.notes || "Marked as paid" });
      showToast("Invoice marked as paid.");
      await loadBilling();
    } catch (apiError) {
      showToast(apiError.message);
    }
  };

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Finance module</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Billing & Invoices</h1>
          <p className="mt-2 text-muted">Create invoices, track payments, and manage student dues</p>
        </div>
        <button onClick={() => setModal({ mode: "add", invoice: null })} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-pine"><Plus className="h-4 w-4" /> Create Invoice</button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {statCards.map(([label, value]) => <div key={label} className="rounded-[8px] border border-line bg-white p-5 shadow-card"><p className="text-sm font-semibold text-muted">{label}</p><p className="mt-3 text-2xl font-extrabold text-ink">{value}</p></div>)}
      </div>

      <section className="mt-6 rounded-[8px] border border-line bg-white p-4 shadow-card">
        <div className="grid gap-3 xl:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.7fr_0.7fr_auto]">
          <label className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input className="h-12 w-full rounded-[8px] border border-line bg-cloud pl-11 pr-4 text-sm outline-none focus:border-pine" placeholder="Search invoice, student, email, phone, or course" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} /></label>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.paymentStatus} onChange={(event) => setFilters((current) => ({ ...current, paymentStatus: event.target.value }))}><option value="">All statuses</option>{PAYMENT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.paymentMethod} onChange={(event) => setFilters((current) => ({ ...current, paymentMethod: event.target.value }))}><option value="">All methods</option>{PAYMENT_METHODS.map((method) => <option key={method}>{method}</option>)}</select>
          <select className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.course} onChange={(event) => setFilters((current) => ({ ...current, course: event.target.value }))}><option value="">All courses</option>{courseOptions.map((course) => <option key={course}>{course}</option>)}</select>
          <input type="date" className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.fromDate} onChange={(event) => setFilters((current) => ({ ...current, fromDate: event.target.value }))} />
          <input type="date" className="h-12 rounded-[8px] border border-line bg-cloud px-4 text-sm font-semibold outline-none focus:border-pine" value={filters.toDate} onChange={(event) => setFilters((current) => ({ ...current, toDate: event.target.value }))} />
          <button onClick={loadBilling} className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-line bg-cloud px-4 text-sm font-bold text-ink hover:border-pine"><RefreshCcw className="h-4 w-4" /> Refresh</button>
        </div>
      </section>

      {toast && <p className="mt-4 rounded-[8px] border border-line bg-mint px-4 py-3 text-sm font-bold text-pine shadow-card">{toast}</p>}
      {error && <p className="mt-4 rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

      <section className="mt-6 overflow-hidden rounded-[8px] border border-line bg-white shadow-card">
        {loading ? <div className="grid min-h-72 place-items-center p-8 text-center"><div><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-line border-t-pine" /><p className="mt-4 font-bold text-muted">Loading invoices...</p></div></div> : invoices.length === 0 ? <div className="grid min-h-72 place-items-center p-8 text-center"><div><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint text-pine"><ReceiptText className="h-6 w-6" /></div><h2 className="mt-4 text-2xl font-black text-ink">No invoices created yet</h2><p className="mt-2 text-muted">Create your first invoice</p><button onClick={() => setModal({ mode: "add", invoice: null })} className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">Create Invoice</button></div></div> : (
          <div className="overflow-x-auto">
            <table className="min-w-[1260px] w-full text-left">
              <thead className="bg-cloud text-xs font-black uppercase tracking-[0.14em] text-muted"><tr>{["Invoice Number", "Student Name", "Phone", "Course", "Total Amount", "Paid Amount", "Due Amount", "Payment Status", "Due Date", "Payment Method", "Actions"].map((header) => <th key={header} className="px-5 py-3">{header}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-cloud/70">
                    <td className="px-5 py-4 font-bold text-ink">{invoice.invoiceNumber}</td>
                    <td className="px-5 py-4 font-bold text-ink">{invoice.studentName}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-ink">{invoice.phone}</td>
                    <td className="px-5 py-4 text-sm text-muted">{invoice.course}</td>
                    <td className="px-5 py-4 text-sm font-bold text-ink">{money(invoice.totalAmount)}</td>
                    <td className="px-5 py-4 text-sm text-muted">{money(invoice.paidAmount)}</td>
                    <td className="px-5 py-4 text-sm font-bold text-ink">{money(invoice.dueAmount)}</td>
                    <td className="px-5 py-4"><span className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyles[invoice.paymentStatus] || "border-line bg-cloud text-muted"}`}>{invoice.paymentStatus}</span></td>
                    <td className="px-5 py-4 text-sm text-muted">{formatDate(invoice.dueDate)}</td>
                    <td className="px-5 py-4 text-sm text-muted">{invoice.paymentMethod || "Not set"}</td>
                    <td className="px-5 py-4"><div className="flex items-center gap-2"><button onClick={() => setModal({ mode: "view", invoice })} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="View invoice"><Eye className="h-4 w-4" /></button><button onClick={() => setModal({ mode: "edit", invoice })} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="Edit invoice"><Edit3 className="h-4 w-4" /></button><button onClick={() => setPaymentInvoice(invoice)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-line bg-white text-muted hover:text-ink" aria-label="Record payment"><CreditCard className="h-4 w-4" /></button><button onClick={() => markAsPaid(invoice)} className="rounded-[8px] border border-line bg-white px-3 py-2 text-xs font-bold text-muted hover:text-ink">Paid</button><button onClick={() => removeInvoice(invoice)} className="grid h-9 w-9 place-items-center rounded-[8px] border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100" aria-label="Delete invoice"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modal.mode && <InvoiceModal mode={modal.mode} invoice={modal.invoice} onClose={() => setModal({ mode: null, invoice: null })} onSave={saveInvoice} />}
      {paymentInvoice && <PaymentModal invoice={paymentInvoice} onClose={() => setPaymentInvoice(null)} onSave={recordPayment} />}
    </main>
  );
}
