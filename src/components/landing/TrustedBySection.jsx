import { trustedLogos } from "./landingData.js";

export default function TrustedBySection() {
  return (
    <section className="border-y border-line bg-white/72 py-8">
      <div className="landing-shell">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted">Trusted by modern EdTech teams</p>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {trustedLogos.map((logo) => (
            <div key={logo} className="rounded-[8px] border border-line bg-cloud px-4 py-4 text-center text-sm font-black text-ink">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
