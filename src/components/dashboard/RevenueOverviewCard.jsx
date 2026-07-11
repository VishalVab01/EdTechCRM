import { revenueBars } from "./dashboardData.js";

export default function RevenueOverviewCard() {
  return (
    <section className="rounded-[8px] border border-line bg-ink p-5 text-white shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black">Revenue Overview</h2>
          <p className="text-sm text-white/60">Collections, invoices, and forecast</p>
        </div>
        <span className="rounded-full bg-coral px-3 py-1 text-xs font-black">+24.1%</span>
      </div>
      <div className="mt-6">
        <p className="text-4xl font-extrabold">₹18.4L</p>
        <p className="mt-1 text-sm text-white/60">₹4.8L pending across 73 invoices</p>
      </div>
      <div className="mt-7 flex h-36 items-end gap-2 rounded-[8px] bg-white/10 p-4">
        {revenueBars.map((height, index) => (
          <span key={index} className="flex-1 rounded-t-[6px] bg-mint" style={{ height: `${height}%`, opacity: 0.55 + index * 0.05 }} />
        ))}
      </div>
    </section>
  );
}
