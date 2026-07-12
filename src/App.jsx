import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/landing/Home.jsx";
import About from "./pages/landing/About.jsx";
import Blog from "./pages/landing/Blog.jsx";
import BlogDetail from "./pages/landing/BlogDetail.jsx";
import Careers from "./pages/landing/Careers.jsx";
import Contact from "./pages/landing/Contact.jsx";
import Privacy from "./pages/landing/Privacy.jsx";
import Terms from "./pages/landing/Terms.jsx";
import NotFound from "./pages/landing/NotFound.jsx";
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
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Auth route</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Login remains separate</h1>
        <p className="mt-3 text-muted">
          Demo auth is local only for now. Backend authentication can plug into this route later.
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
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
