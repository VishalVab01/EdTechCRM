import { recentLeads } from "./dashboardData.js";

export default function RecentLeadsTable() {
  return (
    <section className="rounded-[8px] border border-line bg-white shadow-card">
      <div className="flex flex-col gap-2 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-ink">Recent Leads</h2>
          <p className="text-sm text-muted">Newest enquiries and high-value movement</p>
        </div>
        <button className="rounded-full border border-line bg-cloud px-4 py-2 text-sm font-bold text-ink hover:border-pine">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left">
          <thead className="bg-cloud text-xs font-black uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-5 py-3">Lead</th>
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Source</th>
              <th className="px-5 py-3">Owner</th>
              <th className="px-5 py-3 min-w-[140px]">Stage</th>
              <th className="px-5 py-3">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {recentLeads.map((lead) => (
              <tr key={lead.name} className="hover:bg-cloud/70">
                <td className="px-5 py-4">
                  <p className="font-bold text-ink">{lead.name}</p>
                  <p className="text-xs text-muted">Student enquiry</p>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-muted">{lead.course}</td>
                <td className="px-5 py-4 text-sm font-medium text-muted">{lead.source}</td>
                <td className="px-5 py-4 text-sm font-bold text-ink">{lead.owner}</td>
                <td className="px-5 py-4 min-w-[140px]">
                  <span className="inline-flex whitespace-nowrap rounded-full bg-mint px-3 py-1 text-xs font-black text-pine">{lead.stage}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-ink">{lead.score}</span>
                    <span className="h-2 w-16 rounded-full bg-line">
                      <span className="block h-2 rounded-full bg-pine" style={{ width: `${lead.score}%` }} />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
