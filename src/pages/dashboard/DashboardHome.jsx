import { useEffect, useMemo, useState } from "react";
import ApplicationQueueCard from "../../components/dashboard/ApplicationQueueCard.jsx";
import ActivityTimeline from "../../components/dashboard/ActivityTimeline.jsx";
import FollowUpRemindersCard from "../../components/dashboard/FollowUpRemindersCard.jsx";
import RecentLeadsTable from "../../components/dashboard/RecentLeadsTable.jsx";
import RevenueOverviewCard from "../../components/dashboard/RevenueOverviewCard.jsx";
import StatCard from "../../components/dashboard/StatCard.jsx";
import { dashboardStats } from "../../components/dashboard/dashboardData.js";
import { getApplications } from "../../services/applicationService.js";
import { getCandidates } from "../../services/candidateService.js";
import { getInvoiceSummary } from "../../services/invoiceService.js";
import { getLeads } from "../../services/leadService.js";

export default function DashboardHome() {
  const [leadStats, setLeadStats] = useState(null);
  const [applicationStats, setApplicationStats] = useState(null);
  const [candidateStats, setCandidateStats] = useState(null);
  const [invoiceStats, setInvoiceStats] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getLeads()
      .then((data) => {
        if (!isMounted) return;
        const leads = data.leads || [];
        const count = (status) => leads.filter((lead) => lead.status === status).length;
        const followUps = leads.filter((lead) => lead.followUpDate).length;

        setLeadStats({
          total: leads.length,
          converted: count("Converted"),
          followUps,
          newLeads: count("New"),
        });
      })
      .catch(() => {
        if (isMounted) setLeadStats(null);
      });

    getApplications()
      .then((data) => {
        if (!isMounted) return;
        const applications = data.applications || [];
        const count = (status) => applications.filter((application) => application.status === status).length;

        setApplicationStats({
          total: applications.length,
          pending: count("Pending"),
          approved: count("Approved"),
          underReview: count("Under Review"),
        });
      })
      .catch(() => {
        if (isMounted) setApplicationStats(null);
      });

    getCandidates()
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

    getInvoiceSummary()
      .then((data) => {
        if (isMounted) setInvoiceStats(data.summary || null);
      })
      .catch(() => {
        if (isMounted) setInvoiceStats(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleStats = useMemo(() => {
    if (invoiceStats) {
      return [
        { label: "Monthly Revenue", value: `Rs ${Math.round(invoiceStats.collectedAmount || 0).toLocaleString("en-IN")}`, change: "Live", tone: "green", helper: "Collected invoice payments" },
        { label: "Pending Invoices", value: String(invoiceStats.pendingInvoices || 0), change: "Open", tone: "orange", helper: "Pending or partially paid" },
        { label: "Total Revenue", value: `Rs ${Math.round(invoiceStats.totalRevenue || 0).toLocaleString("en-IN")}`, change: "Live", tone: "green", helper: "Total invoice value" },
        { label: "Overdue Amount", value: `Rs ${Math.round(invoiceStats.overdueAmount || 0).toLocaleString("en-IN")}`, change: "Due", tone: "orange", helper: "Past due and unpaid" },
      ];
    }

    if (candidateStats) {
      return [
        { label: "Total Candidates", value: String(candidateStats.total), change: "Live", tone: "green", helper: "From HR Candidate Tracking" },
        { label: "Shortlisted Candidates", value: String(candidateStats.shortlisted), change: "Active", tone: "orange", helper: "Ready for hiring review" },
        { label: "Interview Scheduled", value: String(candidateStats.interviewScheduled), change: "Live", tone: "green", helper: "Interviews currently booked" },
        { label: "Selected Candidates", value: String(candidateStats.selected), change: "Live", tone: "green", helper: "Selected by HR team" },
      ];
    }

    if (applicationStats) {
      return [
        { label: "Total Applications", value: String(applicationStats.total), change: "Live", tone: "green", helper: "From Student Applications" },
        { label: "Pending Applications", value: String(applicationStats.pending), change: "Open", tone: "orange", helper: "Waiting for review" },
        { label: "Approved Applications", value: String(applicationStats.approved), change: "Live", tone: "green", helper: "Approved after review" },
        { label: "Under Review Applications", value: String(applicationStats.underReview), change: "Active", tone: "orange", helper: "Currently assigned to reviewers" },
      ];
    }

    if (!leadStats) return dashboardStats;

    return [
      { label: "Total Leads", value: String(leadStats.total), change: "Live", tone: "green", helper: "From Sales Lead Management" },
      { label: "New Leads", value: String(leadStats.newLeads), change: "Open", tone: "orange", helper: "Waiting for first contact" },
      { label: "Converted Students", value: String(leadStats.converted), change: "Live", tone: "green", helper: "Converted from sales leads" },
      { label: "Follow-ups", value: String(leadStats.followUps), change: "Due", tone: "orange", helper: "Leads with follow-up dates" },
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
        <RecentLeadsTable />
        <ApplicationQueueCard />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.82fr_0.82fr]">
        <RevenueOverviewCard />
        <FollowUpRemindersCard />
        <ActivityTimeline />
      </div>
    </main>
  );
}
