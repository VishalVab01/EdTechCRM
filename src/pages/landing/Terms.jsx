import SectionHeader from "../../components/landing/SectionHeader.jsx";
import LandingLayout from "./LandingLayout.jsx";

export default function Terms() {
  return (
    <LandingLayout>
      <main className="section-pad">
        <div className="landing-shell max-w-3xl">
          <SectionHeader eyebrow="Legal" title="Terms of Service" text="Placeholder terms for the public EdTech CRM MVP marketing website." />
          <div className="mt-10 space-y-6 rounded-[8px] border border-line bg-white p-8 leading-7 text-muted shadow-card">
            <p>This website is provided for product information, demo enquiries, and MVP validation. It does not create a paid service agreement by itself.</p>
            <p>Product details, pricing, and availability may change as the CRM evolves. Formal contracts and service terms should be added before production launch.</p>
            <p>By using this website, visitors agree not to misuse forms, content, or product previews.</p>
          </div>
        </div>
      </main>
    </LandingLayout>
  );
}
