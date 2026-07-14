import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import DashboardHome from "./pages/dashboard/DashboardHome.jsx";
import DashboardModule from "./pages/dashboard/DashboardModule.jsx";
import Accounting from "./pages/dashboard/Accounting.jsx";
import Applications from "./pages/dashboard/Applications.jsx";
import Billing from "./pages/dashboard/Billing.jsx";
import BulkReview from "./pages/dashboard/BulkReview.jsx";
import HR from "./pages/dashboard/HR.jsx";
import Logout from "./pages/dashboard/Logout.jsx";
import Reports from "./pages/dashboard/Reports.jsx";
import SalesLeads from "./pages/dashboard/SalesLeads.jsx";
import Settings from "./pages/dashboard/Settings.jsx";

function LoginPlaceholder() {
  const navigate = useNavigate();

  const enterDemo = () => {
    localStorage.setItem("edtech_crm_demo_auth", "true");
    navigate("/dashboard");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-6 text-center">
      <div className="max-w-md rounded-[8px] border border-line bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">CRM access</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">EdTech CRM Login</h1>
        <p className="mt-3 text-muted">
          Demo auth is local only for now. Continue to enter the protected CRM workspace.
        </p>
        <button onClick={enterDemo} className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine">
          Continue to Dashboard
        </button>
      </div>
    </main>
  );
}

function ProtectedDashboardRoute() {
  const isAuthed = localStorage.getItem("edtech_crm_demo_auth") === "true";
  return isAuthed ? <DashboardLayout /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPlaceholder />} />
      <Route path="/dashboard" element={<ProtectedDashboardRoute />}>
        <Route index element={<DashboardHome />} />
        <Route path="sales-leads" element={<SalesLeads />} />
        <Route path="applications" element={<Applications />} />
        <Route path="bulk-review" element={<BulkReview />} />
        <Route path="hr" element={<HR />} />
        <Route path="billing" element={<Billing />} />
        <Route path="accounting" element={<Accounting />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="logout" element={<Logout />} />
        <Route path=":module" element={<DashboardModule />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
