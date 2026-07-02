import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";
import { features } from "./landingData.js";

function MiniUi({ type }) {
  if (type === "pipeline") {
    return (
      <div className="grid grid-cols-4 gap-2">
        {["New", "Demo", "Apply", "Enroll"].map((label, index) => (
          <div key={label} className="rounded-[8px] bg-cloud p-2">
            <p className="text-[10px] font-bold text-muted">{label}</p>
            <div className="mt-3 space-y-2">
              {Array.from({ length: 3 - (index % 2) }).map((_, itemIndex) => (
                <span key={itemIndex} className="block h-8 rounded-[6px] bg-white shadow-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "reports") {
    return (
      <div className="flex h-32 items-end gap-2 rounded-[8px] bg-cloud p-4">
        {[42, 72, 54, 86, 68, 92, 78].map((height, index) => (
          <span key={index} className="flex-1 rounded-t-[6px] bg-pine/80" style={{ height: `${height}%` }} />
        ))}
      </div>
    );
  }

  const rows = type === "bulk" ? ["Selected 86", "Approved 41", "Needs docs 18"] : type === "billing" ? ["Paid", "Overdue", "Draft"] : type === "hiring" ? ["Screen", "Interview", "Offer"] : ["Ready", "Pending", "Escalated"];
  return (
    <div className="space-y-2 rounded-[8px] bg-cloud p-3">
      {rows.map((row, index) => (
        <div key={row} className="flex items-center justify-between rounded-[6px] bg-white px-3 py-2 shadow-sm">
          <span className="text-xs font-bold text-ink">{row}</span>
          <span className={`h-2 w-16 rounded-full ${index === 1 ? "bg-coral/70" : "bg-pine/70"}`} />
        </div>
      ))}
    </div>
  );
}

export default function BentoFeaturesSection() {
  return (
    <section id="features" className="section-pad">
      <div className="landing-shell">
        <SectionHeader
          eyebrow="Features"
          title="Built around the daily flow of education businesses"
          text="Each module keeps its own workflow, while leadership gets one operating picture."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className={`${feature.span || ""} rounded-[8px] border border-line bg-white p-5 shadow-card hover:-translate-y-1 hover:shadow-soft`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-[8px] bg-mint text-pine">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-ink">{feature.title}</h3>
                </div>
                <MiniUi type={feature.type} />
                <p className="mt-5 text-sm leading-6 text-muted">{feature.text}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
