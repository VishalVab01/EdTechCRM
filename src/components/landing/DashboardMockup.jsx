import { ArrowUpRight, CalendarCheck, CircleDollarSign, UsersRound } from "lucide-react";

const metrics = [
  ["Total Leads", "1,284", "+18%"],
  ["Pending Applications", "326", "+42"],
  ["Converted Students", "642", "+12%"],
  ["HR Candidates", "74", "+9"],
  ["Monthly Revenue", "₹18.4L", "+24%"],
  ["Follow-ups", "91", "Today"],
];

const queue = ["Anika Sharma", "Rahul Verma", "Fatima Khan", "Vikram Singh"];
const pipeline = [
  { label: "New Leads", value: "76%" },
  { label: "Demo Booked", value: "52%" },
  { label: "Application", value: "38%" },
  { label: "Converted", value: "29%" },
];

export default function DashboardMockup({ compact = false }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-line bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-line bg-[#fbfbf8] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-coral" />
          <span className="h-3 w-3 rounded-full bg-[#f2c94c]" />
          <span className="h-3 w-3 rounded-full bg-[#70c17b]" />
        </div>
        <div className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted">
          EdTech CRM Dashboard
        </div>
      </div>
      <div className={`grid gap-4 p-4 ${compact ? "" : "md:grid-cols-[1fr_0.82fr]"}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {metrics.map(([label, value, trend]) => (
              <div key={label} className="rounded-[8px] border border-line bg-cloud p-3">
                <p className="text-xs font-medium text-muted">{label}</p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <strong className="text-xl font-bold text-ink">{value}</strong>
                  <span className="rounded-full bg-mint px-2 py-1 text-[10px] font-bold text-pine">{trend}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-[8px] border border-line p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-ink">Sales Pipeline</p>
                <p className="text-xs text-muted">Lead to enrollment progress</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-coral" />
            </div>
            <div className="space-y-3">
              {pipeline.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs font-medium text-muted">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#eef0eb]">
                    <div className="mini-bar h-2 rounded-full" style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-[8px] border border-line p-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-pine" />
              <p className="text-sm font-bold text-ink">Application Review Queue</p>
            </div>
            <div className="mt-4 space-y-2">
              {queue.map((name, index) => (
                <div key={name} className="flex items-center justify-between rounded-[8px] bg-cloud px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">{name}</p>
                    <p className="text-xs text-muted">{index % 2 ? "Docs pending" : "Ready for review"}</p>
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-pine">
                    {index % 2 ? "Hold" : "Review"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[8px] border border-line p-4">
              <UsersRound className="h-5 w-5 text-coral" />
              <p className="mt-3 text-2xl font-bold text-ink">18</p>
              <p className="text-xs text-muted">Team members active</p>
            </div>
            <div className="rounded-[8px] border border-line p-4">
              <CircleDollarSign className="h-5 w-5 text-pine" />
              <p className="mt-3 text-2xl font-bold text-ink">96%</p>
              <p className="text-xs text-muted">Invoice visibility</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
