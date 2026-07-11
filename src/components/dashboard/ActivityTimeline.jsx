import { activity } from "./dashboardData.js";

export default function ActivityTimeline() {
  return (
    <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
      <h2 className="text-lg font-black text-ink">Recent Activity</h2>
      <p className="text-sm text-muted">Live operational updates across teams</p>
      <div className="mt-5 space-y-4">
        {activity.map((item, index) => (
          <div key={item.title} className="relative flex gap-3">
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
