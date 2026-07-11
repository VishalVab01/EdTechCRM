import { Clock } from "lucide-react";
import { reminders } from "./dashboardData.js";

export default function FollowUpRemindersCard() {
  return (
    <section className="rounded-[8px] border border-line bg-white p-5 shadow-card">
      <h2 className="text-lg font-black text-ink">Follow-up Reminders</h2>
      <p className="text-sm text-muted">Keep hot leads and open tasks moving</p>
      <div className="mt-5 space-y-3">
        {reminders.map((item) => (
          <div key={item.title} className="flex gap-3 rounded-[8px] bg-cloud p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-white text-coral">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="font-bold text-ink">{item.title}</p>
              <p className="mt-1 text-xs font-semibold text-muted">{item.time} · {item.type}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
