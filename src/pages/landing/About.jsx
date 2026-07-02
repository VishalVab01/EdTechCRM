import SectionHeader from "../../components/landing/SectionHeader.jsx";
import { team } from "../../components/landing/landingData.js";
import LandingLayout from "./LandingLayout.jsx";

export default function About() {
  return (
    <LandingLayout>
      <main>
        <section className="section-pad">
          <div className="landing-shell">
            <SectionHeader
              eyebrow="About"
              title="We are building cleaner operations for education teams"
              text="EdTech CRM exists for institutes that need sales, admissions, HR, accounts, and leadership to work from one reliable system."
            />
          </div>
        </section>
        <section className="pb-20">
          <div className="landing-shell grid gap-5 lg:grid-cols-2">
            <div className="rounded-[8px] border border-line bg-white p-8 shadow-card">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">Mission</p>
              <h2 className="mt-4 text-3xl font-bold text-ink">Replace operational clutter with one focused CRM.</h2>
              <p className="mt-4 leading-7 text-muted">
                Education businesses move quickly, but their tools often split the work across forms, sheets, inboxes, and accounting apps. Our mission is to make the daily operating rhythm visible and manageable.
              </p>
            </div>
            <div className="rounded-[8px] border border-line bg-ink p-8 text-white shadow-card">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">Story</p>
              <h2 className="mt-4 text-3xl font-bold">Designed around enrollment, not generic sales.</h2>
              <p className="mt-4 leading-7 text-white/72">
                We shaped the product around counselling calls, application checks, payment follow-ups, hiring needs, and student status updates, because EdTech growth depends on all of them.
              </p>
            </div>
          </div>
        </section>
        <section className="bg-white py-20">
          <div className="landing-shell">
            <SectionHeader eyebrow="Team" title="Placeholder team, real operating focus" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div key={member.name} className="rounded-[8px] border border-line bg-cloud p-6 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-xl font-black text-pine">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="mt-4 font-bold text-ink">{member.name}</h3>
                  <p className="mt-1 text-sm text-muted">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </LandingLayout>
  );
}
