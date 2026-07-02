import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "./landingData.js";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-[#fbfbf8]/88 backdrop-blur-xl">
      <nav className="landing-shell flex h-[72px] items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-pine text-lg font-black text-white">E</span>
          <span className="text-lg font-bold tracking-tight text-ink">EdTech CRM</span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} to={link.href} className="text-sm font-semibold text-muted hover:text-ink">
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-bold text-ink hover:bg-white">
            Login
          </Link>
          <Link to="/contact" className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-card hover:bg-pine">
            Book a Demo
          </Link>
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <div className="landing-shell flex flex-col gap-2 py-4">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} onClick={() => setOpen(false)} className="rounded-[8px] px-3 py-3 text-sm font-bold text-ink">
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-[8px] px-3 py-3 text-sm font-bold text-ink">
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
