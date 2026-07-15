function timeAgo(value) {
  if (!value) return "Recently";
  const diff = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.round(diff / 60)} hr ago`;
  return `${Math.round(diff / 1440)} day ago`;
}

export default function ActivityTimeline({ leads = [], applications = [], invoices = [] }) {
  const activity = [
    ...leads.slice(0, 2).map((lead) => ({ title: `${lead.name} moved to ${lead.status}`, meta: `Sales - ${timeAgo(lead.updatedAt || lead.createdAt)}` })),
    ...applications.slice(0, 2).map((application) => ({ title: `${application.studentName} application is ${application.status}`, meta: `Admissions - ${timeAgo(application.updatedAt || application.createdAt)}` })),
    ...invoices.slice(0, 1).map((invoice) => ({ title: `${invoice.invoiceNumber} is ${invoice.paymentStatus}`, meta: `Accounts - ${timeAgo(invoice.updatedAt || invoice.createdAt)}` })),
  ].slice(0, 5);

  return (
    <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
      <h2 className="text-lg font-black text-ink">Recent Activity</h2>
      <p className="text-sm text-muted">Live operational updates across teams</p>
      <div className="mt-5 space-y-4">
        {activity.length === 0 ? (
          <p className="rounded-[8px] bg-cloud p-4 text-sm font-bold text-muted">No recent activity yet.</p>
        ) : activity.map((item, index) => (
          <div key={`${item.title}-${index}`} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <span className="mt-1 h-3 w-3 rounded-full bg-pine" />
              {index < activity.length - 1 && <span className="mt-2 h-full min-h-8 w-px bg-line" />}
            </div>
            <div className="pb-2">
              <p className="font-bold text-ink">{item.title}</p>
              <p className="mt-1 text-xs font-semibold text-muted">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
