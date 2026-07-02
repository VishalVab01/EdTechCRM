import { Route, Routes } from "react-router-dom";
import Home from "./pages/landing/Home.jsx";
import About from "./pages/landing/About.jsx";
import Blog from "./pages/landing/Blog.jsx";
import BlogDetail from "./pages/landing/BlogDetail.jsx";
import Careers from "./pages/landing/Careers.jsx";
import Contact from "./pages/landing/Contact.jsx";
import Privacy from "./pages/landing/Privacy.jsx";
import Terms from "./pages/landing/Terms.jsx";
import NotFound from "./pages/landing/NotFound.jsx";

function LoginPlaceholder() {
  return (
    <main className="grid min-h-screen place-items-center bg-cloud px-6 text-center">
      <div className="max-w-md rounded-[8px] border border-line bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Auth route</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Login remains separate</h1>
        <p className="mt-3 text-muted">
          The public landing routes are isolated from the protected CRM workspace.
        </p>
      </div>
    </main>
  );
}

function DashboardPlaceholder() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef2f0] px-6 text-center">
      <div className="max-w-md rounded-[8px] border border-line bg-white p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Protected route</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">CRM dashboard area</h1>
        <p className="mt-3 text-muted">
          No dashboard modules or backend APIs were added to the marketing site.
        </p>
      </div>
    </main>
  );
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
      <Route path="/dashboard/*" element={<DashboardPlaceholder />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
