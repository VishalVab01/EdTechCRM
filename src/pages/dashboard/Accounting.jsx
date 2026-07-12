import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Banknote, CheckCircle2, Download, ReceiptText, RefreshCcw, WalletCards } from "lucide-react";
import { getInvoices, getInvoiceSummary } from "../../services/invoiceService.js";

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function statusClass(status) {
  const styles = {
    Paid: "border-mint bg-mint text-pine",
    Pending: "border-amber-100 bg-amber-50 text-amber-700",
    "Partially Paid": "border-blue-100 bg-blue-50 text-blue-700",
    Overdue: "border-rose-100 bg-rose-50 text-rose-700",
    Cancelled: "border-slate-200 bg-slate-100 text-slate-700",
  };
  return styles[status] || "border-line bg-cloud text-muted";
}

export default function Accounting() {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAccounting = async () => {
    setLoading(true);
    setError("");
    try {
      const [invoiceData, summaryData] = await Promise.all([getInvoices(), getInvoiceSummary()]);
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
    loadAccounting();
  }, []);

  const accountingStats = useMemo(() => {
    const paidInvoices = invoices.filter((invoice) => invoice.paymentStatus === "Paid");
    const openInvoices = invoices.filter((invoice) => ["Pending", "Partially Paid", "Overdue"].includes(invoice.paymentStatus));
    const reconciled = paidInvoices.reduce((sum, invoice) => sum + Number(invoice.paidAmount || 0), 0);
    const receivables = openInvoices.reduce((sum, invoice) => sum + Number(invoice.dueAmount || 0), 0);
    const discounts = invoices.reduce((sum, invoice) => sum + Number(invoice.discount || 0), 0);
    const tax = invoices.reduce((sum, invoice) => sum + Number(invoice.tax || 0), 0);

    return [
      { label: "Recognized Revenue", value: money(summary?.collectedAmount || reconciled), icon: Banknote, tone: "bg-mint text-pine" },
      { label: "Accounts Receivable", value: money(summary?.pendingAmount || receivables), icon: WalletCards, tone: "bg-amber-50 text-amber-700" },
      { label: "Discounts Given", value: money(discounts), icon: ReceiptText, tone: "bg-blue-50 text-blue-700" },
      { label: "Tax Recorded", value: money(tax), icon: CheckCircle2, tone: "bg-cloud text-ink" },
    ];
  }, [invoices, summary]);

  const ledgerRows = useMemo(
    () =>
      invoices
        .slice()
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 8),
    [invoices]
  );

  const receivableRows = useMemo(
    () =>
      invoices
        .filter((invoice) => Number(invoice.dueAmount || 0) > 0 && invoice.paymentStatus !== "Cancelled")
        .sort((a, b) => Number(b.dueAmount || 0) - Number(a.dueAmount || 0))
        .slice(0, 6),
    [invoices]
  );

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Accounting</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Accounting Workspace</h1>
          <p className="mt-2 text-muted">Reconcile collections, receivables, taxes, and billing ledger movement.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={loadAccounting} className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-bold text-ink shadow-card hover:border-pine">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-pine">
            <Download className="h-4 w-4" /> Export Ledger
          </button>
        </div>
      </div>

      {error && <p className="mt-5 rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {accountingStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-[8px] border border-line bg-white p-5 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-muted">{stat.label}</p>
                <span className={`grid h-10 w-10 place-items-center rounded-[8px] ${stat.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 text-2xl font-extrabold text-ink">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="overflow-hidden rounded-[8px] border border-line bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <h2 className="text-lg font-black text-ink">General Ledger</h2>
              <p className="text-sm text-muted">Recent invoice transactions from billing.</p>
            </div>
            <span className="rounded-full bg-cloud px-3 py-1 text-xs font-black text-muted">{ledgerRows.length} rows</span>
          </div>
          {loading ? (
            <div className="grid min-h-72 place-items-center p-8 text-center">
              <div>
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-line border-t-pine" />
                <p className="mt-4 font-bold text-muted">Loading ledger...</p>
              </div>
            </div>
          ) : ledgerRows.length === 0 ? (
            <div className="grid min-h-72 place-items-center p-8 text-center">
              <div>
                <ReceiptText className="mx-auto h-10 w-10 text-muted" />
                <h3 className="mt-4 text-xl font-black text-ink">No accounting entries yet</h3>
                <p className="mt-2 text-muted">Create invoices in Billing to populate the ledger.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead className="bg-cloud text-xs font-black uppercase tracking-[0.14em] text-muted">
                  <tr>
                    {["Date", "Reference", "Student", "Course", "Debit", "Credit", "Status"].map((header) => (
                      <th key={header} className="px-5 py-3">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ledgerRows.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-cloud/70">
                      <td className="px-5 py-4 text-sm text-muted">{formatDate(invoice.updatedAt || invoice.createdAt)}</td>
                      <td className="px-5 py-4 font-bold text-ink">{invoice.invoiceNumber}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-ink">{invoice.studentName}</td>
                      <td className="px-5 py-4 text-sm text-muted">{invoice.course}</td>
                      <td className="px-5 py-4 text-sm font-bold text-ink">{money(invoice.dueAmount)}</td>
                      <td className="px-5 py-4 text-sm font-bold text-pine">{money(invoice.paidAmount)}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusClass(invoice.paymentStatus)}`}>{invoice.paymentStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-ink">Receivables Queue</h2>
              <p className="mt-1 text-sm text-muted">Highest unpaid student balances.</p>
            </div>
            <AlertCircle className="h-5 w-5 text-coral" />
          </div>
          <div className="mt-5 space-y-3">
            {receivableRows.length === 0 ? (
              <p className="rounded-[8px] bg-cloud p-4 text-sm font-semibold text-muted">No pending receivables found.</p>
            ) : (
              receivableRows.map((invoice) => (
                <div key={invoice._id} className="rounded-[8px] border border-line bg-cloud p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-ink">{invoice.studentName}</p>
                      <p className="mt-1 text-sm text-muted">{invoice.invoiceNumber} - {formatDate(invoice.dueDate)}</p>
                    </div>
                    <p className="text-sm font-black text-coral">{money(invoice.dueAmount)}</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-pine" style={{ width: `${Math.min(100, Math.round((Number(invoice.paidAmount || 0) / Number(invoice.totalAmount || 1)) * 100))}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
