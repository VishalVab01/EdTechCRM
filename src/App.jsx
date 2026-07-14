import { useState } from "react";
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
import { getStoredToken } from "./services/apiClient.js";
import { login } from "./services/authService.js";

function LoginPlaceholder() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@edtechcrm.local", password: "Admin123!" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-6 text-center">
      <form onSubmit={submit} className="w-full max-w-md rounded-[8px] border border-line bg-white p-8 text-left shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">CRM access</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">EdTech CRM Login</h1>
        <p className="mt-3 text-muted">Sign in with your CRM account to enter the protected workspace.</p>
        {error && <p className="mt-4 rounded-[8px] bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}
        <label className="mt-5 block text-sm font-bold text-ink">
          Email
          <input type="email" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
        </label>
        <label className="mt-4 block text-sm font-bold text-ink">
          Password
          <input type="password" className="mt-2 w-full rounded-[8px] border border-line bg-cloud px-4 py-3 outline-none focus:border-pine" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
        </label>
        <button disabled={loading} className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-pine disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in to Dashboard"}
        </button>
        <p className="mt-4 text-center text-xs text-muted">Default first-run admin: admin@edtechcrm.local / Admin123!</p>
      </form>
    </main>
  );
}

function ProtectedDashboardRoute() {
  const isAuthed = Boolean(getStoredToken());
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
