import { applicationQueue } from "./dashboardData.js";

export default function ApplicationQueueCard() {
  return (
    <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-ink">Application Review Queue</h2>
          <p className="text-sm text-muted">Admissions items that need attention</p>
        </div>
        <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-xs font-black text-[#a55413]">326 open</span>
      </div>
      <div className="mt-5 space-y-3">
        {applicationQueue.map((item) => (
          <div key={item.student} className="rounded-[8px] border border-line bg-cloud p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-ink">{item.student}</p>
                <p className="mt-1 text-xs font-semibold text-muted">{item.program}</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-pine">{item.priority}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{item.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
