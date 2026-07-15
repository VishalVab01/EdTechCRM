import { useEffect, useMemo, useState } from "react";
import ApplicationQueueCard from "../../components/dashboard/ApplicationQueueCard.jsx";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline.jsx";
import FollowUpRemindersCard from "../../components/dashboard/FollowUpRemindersCard.jsx";
import RecentLeadsTable from "../../components/dashboard/RecentLeadsTable.jsx";
import RevenueOverviewCard from "../../components/dashboard/RevenueOverviewCard.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import { getApplications } from "../../services/applicationService.js";
import { getCandidates } from "../../services/candidateService.js";
import { getInvoices, getInvoiceSummary } from "../../services/invoiceService.js";
import { getLeads } from "../../services/leadService.js";

export default function DashboardHome() {
  const [leads, setLeads] = useState([]);
  const [applications, setApplications] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [leadStats, setLeadStats] = useState(null);
  const [applicationStats, setApplicationStats] = useState(null);
  const [candidateStats, setCandidateStats] = useState(null);
  const [invoiceStats, setInvoiceStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    const loadLeads = getLeads()
      .then((data) => {
        if (!isMounted) return;
        const leadRows = data.leads || [];
        const count = (status) => leadRows.filter((lead) => lead.status === status).length;
        const followUps = leadRows.filter((lead) => lead.followUpDate).length;

        setLeads(leadRows);
        setLeadStats({
          total: leadRows.length,
          converted: count("Converted"),
          followUps,
          newLeads: count("New"),
        });
      })
      .catch(() => {
        if (isMounted) setLeadStats(null);
      });

    const loadApplications = getApplications()
      .then((data) => {
        if (!isMounted) return;
        const applicationRows = data.applications || [];
        const count = (status) => applicationRows.filter((application) => application.status === status).length;

        setApplications(applicationRows);
        setApplicationStats({
          total: applicationRows.length,
          pending: count("Pending"),
          approved: count("Approved"),
          underReview: count("Under Review"),
        });
      })
      .catch(() => {
        if (isMounted) setApplicationStats(null);
      });

    const loadCandidates = getCandidates()
      .then((data) => {
        if (!isMounted) return;
        const candidates = data.candidates || [];
        const count = (status) => candidates.filter((candidate) => candidate.status === status).length;

        setCandidateStats({
          total: candidates.length,
          shortlisted: count("Shortlisted"),
          interviewScheduled: count("Interview Scheduled"),
          selected: count("Selected"),
        });
      })
      .catch(() => {
        if (isMounted) setCandidateStats(null);
      });

    const loadInvoices = Promise.all([getInvoices(), getInvoiceSummary()])
      .then(([invoiceData, summaryData]) => {
        if (!isMounted) return;
        setInvoices(invoiceData.invoices || []);
        setInvoiceStats(summaryData.summary || null);
      })
      .catch(() => {
        if (isMounted) setInvoiceStats(null);
      });

    Promise.allSettled([loadLeads, loadApplications, loadCandidates, loadInvoices]).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleStats = useMemo(() => {
    return [
      { label: "Total Leads", value: String(leadStats?.total ?? 0), change: "Live", tone: "green", helper: "From Sales Lead Management" },
      { label: "Converted Students", value: String(leadStats?.converted ?? 0), change: "Live", tone: "green", helper: "Converted from active leads" },
      { label: "Follow-ups", value: String(leadStats?.followUps ?? 0), change: "Due", tone: "orange", helper: "Scheduled lead callbacks" },
      { label: "Collected Revenue", value: `Rs ${Math.round(invoiceStats?.collectedAmount || 0).toLocaleString("en-IN")}`, change: "Live", tone: "green", helper: `${applicationStats?.pending ?? 0} applications pending review` },
    ];
  }, [applicationStats, candidateStats, invoiceStats, leadStats]);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Protected CRM workspace</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-muted">A live operating view for sales, applications, HR, billing, and reports.</p>
        </div>
        <div className="rounded-full border border-line bg-white px-4 py-2 text-sm font-black text-pine shadow-card">
          Role: Super Admin
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {visibleStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <RecentLeadsTable leads={leads} loading={loading} />
        <ApplicationQueueCard applications={applications} loading={loading} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.82fr_0.82fr]">
        <RevenueOverviewCard summary={invoiceStats} invoices={invoices} />
        <FollowUpRemindersCard leads={leads} loading={loading} />
        <ActivityTimeline leads={leads} applications={applications} invoices={invoices} />
      </div>
    </main>
  );
}
