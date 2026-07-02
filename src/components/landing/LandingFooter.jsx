import { Link } from "react-router-dom";
import { footerColumns } from "./landingData.js";

const linkFor = (label) => {
  const map = {
    Features: "/#features",
    Pricing: "/#pricing",
    Dashboard: "/login",
    Reports: "/#features",
    About: "/about",
    Careers: "/careers",
    Contact: "/contact",
    Blog: "/blog",
    "Help Center": "/contact",
    Documentation: "/blog",
    "Privacy Policy": "/privacy",
    "Terms of Service": "/terms",
  };
  return map[label] || "/";
};

export default function LandingFooter() {
  return (
    <footer className="border-t border-line bg-white py-12">
      <div className="landing-shell grid gap-10 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-pine text-lg font-black text-white">E</span>
            <span className="text-lg font-bold text-ink">EdTech CRM</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            A public marketing website for a CRM built around the real workflows of education teams.
          </p>
          <p className="mt-6 text-xs font-semibold text-muted">© 2026 EdTech CRM. All rights reserved.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-ink">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link to={linkFor(link)} className="text-sm font-medium text-muted hover:text-ink">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
