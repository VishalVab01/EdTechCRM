import { ArrowUpRight } from "lucide-react";

export default function StatCard({ stat }) {
  const badgeClass = stat.tone === "orange" ? "bg-[#fff4e8] text-[#a55413]" : "bg-mint text-pine";

  return (
    <div className="rounded-[8px] border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">{stat.label}</p>
          <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">{stat.value}</h3>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${badgeClass}`}>
          {stat.change} <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted">{stat.helper}</p>
    </div>
  );
}
