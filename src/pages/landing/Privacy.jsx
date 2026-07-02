import SectionHeader from "../../components/landing/SectionHeader.jsx";
import LandingLayout from "./LandingLayout.jsx";

export default function Privacy() {
  return (
    <LandingLayout>
      <main className="section-pad">
        <div className="landing-shell max-w-3xl">
          <SectionHeader eyebrow="Legal" title="Privacy Policy" text="A placeholder privacy page for the public MVP marketing website." />
          <div className="mt-10 space-y-6 rounded-[8px] border border-line bg-white p-8 leading-7 text-muted shadow-card">
            <p>EdTech CRM collects only the information submitted through public forms on this MVP website, such as name, email, institute, phone, and message.</p>
            <p>Form data is not connected to a backend in this version. Future production use should include clear retention, consent, security, and deletion practices.</p>
            <p>We do not sell personal information. Contact us for access, correction, or deletion requests once backend processing is enabled.</p>
          </div>
        </div>
      </main>
    </LandingLayout>
  );
}
