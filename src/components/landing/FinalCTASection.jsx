import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

export default function FinalCTASection() {
  return (
    <section className="section-pad">
      <div className="landing-shell grid gap-5 lg:grid-cols-2">
        <div className="rounded-[8px] border border-line bg-ink p-8 text-white shadow-soft lg:p-10">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to simplify your EdTech operations?</h2>
          <p className="mt-4 text-white/70">
            Bring sales, applications, HR, billing, and reports into one CRM built for education businesses.
          </p>
        </div>
        <div className="grid content-center gap-3 rounded-[8px] border border-line bg-white p-8 shadow-card sm:grid-cols-2 lg:p-10">
          <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white hover:bg-pine">
            Start Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-cloud px-6 py-3.5 text-sm font-bold text-ink hover:border-pine">
            <CalendarDays className="h-4 w-4 text-coral" /> Request Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
