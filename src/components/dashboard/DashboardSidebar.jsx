import { NavLink, useNavigate } from "react-router-dom";
import { sidebarItems } from "./dashboardData.js";
import { logout } from "../../services/authService.js";

export default function DashboardSidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleItem = (item) => {
    if (item.action === "logout") {
      logout();
      navigate("/login");
    }
    onClose?.();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-white px-4 py-5 shadow-soft transition-transform lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-pine text-lg font-black text-white">E</span>
          <div>
            <p className="font-black text-ink">EdTech CRM</p>
            <p className="text-xs font-semibold text-muted">Workspace</p>
          </div>
        </div>
        <button className="rounded-[8px] px-3 py-2 text-sm font-bold text-muted lg:hidden" onClick={onClose}>
          Close
        </button>
      </div>
      <nav className="mt-8 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.href === "/dashboard"}
              onClick={() => handleItem(item)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[8px] px-3 py-3 text-sm font-bold transition ${
                  isActive && !item.action ? "bg-ink text-white shadow-card" : "text-muted hover:bg-cloud hover:text-ink"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-8 rounded-[8px] border border-line bg-cloud p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-coral">Today</p>
        <p className="mt-2 text-sm font-bold text-ink">91 follow-ups due</p>
        <p className="mt-1 text-xs leading-5 text-muted">Counsellors have 36 high-intent students waiting for a next step.</p>
      </div>
    </aside>
  );
}
