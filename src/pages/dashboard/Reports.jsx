import { useEffect, useMemo, useState } from "react";
import { BarChart3, Download, RefreshCcw, TrendingUp } from "lucide-react";
import { getApplications } from "../../services/applicationService.js";
import { getCandidates } from "../../services/candidateService.js";
import { getInvoiceSummary } from "../../services/invoiceService.js";
import { getLeads } from "../../services/leadService.js";

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function percent(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

function countBy(items, field) {
  return items.reduce((acc, item) => {
    const key = item[field] || "Unassigned";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-[8px] border border-line bg-white p-5 shadow-card">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{helper}</p>
    </div>
  );
}

function DistributionCard({ title, rows }) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
      <h2 className="text-lg font-black text-ink">{title}</h2>
      <div className="mt-5 space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-[8px] bg-cloud p-4 text-sm font-semibold text-muted">No data available yet.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-ink">{row.label}</span>
                <span className="font-black text-muted">{row.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-cloud">
                <div className="h-full rounded-full bg-pine" style={{ width: `${Math.max(8, Math.round((row.value / max) * 100))}%` }} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function Reports() {
  const [data, setData] = useState({ leads: [], applications: [], candidates: [], invoiceSummary: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const [leadData, applicationData, candidateData, invoiceData] = await Promise.all([getLeads(), getApplications(), getCandidates(), getInvoiceSummary()]);
      setData({
        leads: leadData.leads || [],
        applications: applicationData.applications || [],
        candidates: candidateData.candidates || [],
        invoiceSummary: invoiceData.summary || null,
      });
    } catch (apiError) {
      setData({ leads: [], applications: [], candidates: [], invoiceSummary: null });
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const report = useMemo(() => {
    const converted = data.leads.filter((lead) => lead.status === "Converted").length;
    const approved = data.applications.filter((application) => application.status === "Approved").length;
    const selected = data.candidates.filter((candidate) => candidate.status === "Selected").length;
    const sourceRows = Object.entries(countBy(data.leads, "source"))
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
    const counselorRows = Object.entries(countBy(data.leads, "assignedCounselor"))
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
    const applicationRows = Object.entries(countBy(data.applications, "status"))
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);

    return {
      converted,
      approved,
      selected,
      sourceRows,
      counselorRows,
      applicationRows,
      conversionRate: percent(converted, data.leads.length),
      approvalRate: percent(approved, data.applications.length),
      hiringRate: percent(selected, data.candidates.length),
    };
  }, [data]);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Reports</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">CRM Reports</h1>
          <p className="mt-2 text-muted">Track enrollment performance, channel quality, finance health, and operating velocity.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={loadReports} className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm font-bold text-ink shadow-card hover:border-pine">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-card hover:bg-pine">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {error && <p className="mt-5 rounded-[8px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

      {loading ? (
        <section className="mt-6 grid min-h-96 place-items-center rounded-[8px] border border-line bg-white p-8 text-center shadow-card">
          <div>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-line border-t-pine" />
            <p className="mt-4 font-bold text-muted">Building reports...</p>
          </div>
        </section>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Lead Conversion" value={report.conversionRate} helper={`${report.converted} converted from ${data.leads.length} leads`} />
            <MetricCard label="Application Approval" value={report.approvalRate} helper={`${report.approved} approved applications`} />
            <MetricCard label="Hiring Selection" value={report.hiringRate} helper={`${report.selected} selected candidates`} />
            <MetricCard label="Collected Revenue" value={money(data.invoiceSummary?.collectedAmount)} helper="From paid invoice records" />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <DistributionCard title="Lead Sources" rows={report.sourceRows} />
            <DistributionCard title="Counsellor Load" rows={report.counselorRows} />
            <DistributionCard title="Application Status" rows={report.applicationRows} />
          </div>

          <section className="mt-6 rounded-[8px] border border-line bg-white p-5 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-ink">Executive Snapshot</h2>
                <p className="mt-1 text-sm text-muted">A compact operating summary across every connected CRM module.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-black text-pine">
                <TrendingUp className="h-4 w-4" /> Live data
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Leads", data.leads.length],
                ["Applications", data.applications.length],
                ["HR Candidates", data.candidates.length],
                ["Pending Invoice Amount", money(data.invoiceSummary?.pendingAmount)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[8px] border border-line bg-cloud p-4">
                  <BarChart3 className="h-5 w-5 text-coral" />
                  <p className="mt-3 text-sm font-bold text-muted">{label}</p>
                  <p className="mt-1 text-2xl font-black text-ink">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
