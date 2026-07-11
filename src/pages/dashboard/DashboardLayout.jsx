import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar.jsx";
import DashboardTopbar from "../../components/dashboard/DashboardTopbar.jsx";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cloud text-ink lg:grid lg:grid-cols-[288px_1fr]">
      {sidebarOpen && <button className="fixed inset-0 z-40 bg-ink/30 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar overlay" />}
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0">
        <DashboardTopbar onMenu={() => setSidebarOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
}
