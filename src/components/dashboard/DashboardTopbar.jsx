import { Bell, Menu, Search } from "lucide-react";
import { dashboardUser } from "./dashboardData.js";

export default function DashboardTopbar({ onMenu }) {
  const UserIcon = dashboardUser.icon;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[#f6f7f4]/88 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-white lg:hidden" onClick={onMenu} aria-label="Open sidebar">
          <Menu className="h-5 w-5 text-ink" />
        </button>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="h-11 w-full rounded-full border border-line bg-white pl-11 pr-4 text-sm font-medium text-ink outline-none shadow-card placeholder:text-muted focus:border-pine"
            placeholder="Search leads, applications, invoices, reports..."
          />
        </div>
        <button className="hidden h-11 w-11 place-items-center rounded-full border border-line bg-white shadow-card sm:grid" aria-label="Notifications">
          <Bell className="h-4 w-4 text-muted" />
        </button>
        <div className="hidden items-center gap-3 rounded-full border border-line bg-white py-1.5 pl-2 pr-4 shadow-card md:flex">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-mint text-pine">
            <UserIcon className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-black text-ink">{dashboardUser.name}</p>
            <p className="text-[11px] font-bold text-coral">{dashboardUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
