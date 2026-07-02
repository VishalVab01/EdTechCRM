import DashboardMockup from "./DashboardMockup.jsx";
import SectionHeader from "./SectionHeader.jsx";

export default function ProductPreviewSection() {
  return (
    <section className="section-pad bg-white">
      <div className="landing-shell">
        <SectionHeader
          eyebrow="Product preview"
          title="Every department gets the same clean source of truth"
          text="Review applications, follow lead movement, watch revenue, and keep your team aligned without stitching together five tools."
        />
        <div className="mt-12 rounded-[8px] border border-line bg-cloud p-3 shadow-soft">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
