function priorityForStatus(status) {
  if (["Pending", "Under Review"].includes(status)) return "High";
  if (status === "On Hold") return "Medium";
  return "Low";
}

export default function ApplicationQueueCard({ applications = [], loading = false }) {
  const openApplications = applications.filter((item) => ["Pending", "Under Review", "On Hold"].includes(item.status));
  const rows = openApplications.slice(0, 4);

  return (
    <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-ink">Application Review Queue</h2>
          <p className="text-sm text-muted">Admissions items that need attention</p>
        </div>
        <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-xs font-black text-[#a55413]">{openApplications.length} open</span>
      </div>
      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="rounded-[8px] bg-cloud p-4 text-sm font-bold text-muted">Loading applications...</p>
        ) : rows.length === 0 ? (
          <p className="rounded-[8px] bg-cloud p-4 text-sm font-bold text-muted">No open applications in review.</p>
        ) : rows.map((item) => (
          <div key={item._id || item.studentName} className="rounded-[8px] border border-line bg-cloud p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-ink">{item.studentName}</p>
                <p className="mt-1 text-xs font-semibold text-muted">{item.course}</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-pine">{priorityForStatus(item.status)}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{item.remarks || item.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
