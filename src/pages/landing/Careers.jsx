import CareerCard from "../../components/landing/CareerCard.jsx";
import SectionHeader from "../../components/landing/SectionHeader.jsx";
import { careers } from "../../components/landing/landingData.js";
import LandingLayout from "./LandingLayout.jsx";

export default function Careers() {
  return (
    <LandingLayout>
      <main className="section-pad">
        <div className="landing-shell">
          <SectionHeader
            eyebrow="Careers"
            title="Help build the CRM education teams actually want to use"
            text="A few placeholder openings for the MVP site, styled to match the public marketing experience."
          />
          <div className="mx-auto mt-12 max-w-4xl space-y-4">
            {careers.map((job) => (
              <CareerCard key={job.title} job={job} />
            ))}
          </div>
        </div>
      </main>
    </LandingLayout>
  );
}
