import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "../../components/landing/ContactForm.jsx";
import SectionHeader from "../../components/landing/SectionHeader.jsx";
import LandingLayout from "./LandingLayout.jsx";

export default function Contact() {
  return (
    <LandingLayout>
      <main className="section-pad">
        <div className="landing-shell">
          <SectionHeader
            eyebrow="Contact"
            title="Request a walkthrough of EdTech CRM"
            text="Tell us about your institute and the operations you want to simplify."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <aside className="rounded-[8px] border border-line bg-ink p-8 text-white shadow-card">
              <h2 className="text-2xl font-bold">Demo and enquiries</h2>
              <p className="mt-4 text-white/70">
                Share your current process and we will map how leads, applications, HR, billing, and reports can fit into one CRM.
              </p>
              <div className="mt-8 space-y-4 text-sm text-white/78">
                <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-coral" /> hello@edtechcrm.example</p>
                <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-coral" /> +91 98765 43210</p>
                <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-coral" /> Bengaluru, India</p>
              </div>
            </aside>
            <ContactForm />
          </div>
        </div>
      </main>
    </LandingLayout>
  );
}
