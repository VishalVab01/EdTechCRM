import { Check } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";
import { pricing } from "./landingData.js";

export default function PricingSection() {
  return (
    <section id="pricing" className="section-pad bg-white">
      <div className="landing-shell">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans for every stage of your team"
          text="Start lean, add deeper workflows as your admissions and operations teams grow."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricing.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className={`rounded-[8px] border p-7 shadow-card ${tier.featured ? "border-pine bg-ink text-white" : "border-line bg-cloud text-ink"}`}
            >
              {tier.featured && <p className="mb-5 inline-flex rounded-full bg-coral px-3 py-1 text-xs font-black text-white">Most popular</p>}
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className={`mt-2 text-sm ${tier.featured ? "text-white/68" : "text-muted"}`}>{tier.description}</p>
              <div className="mt-7 flex items-end gap-1">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                <span className={`pb-1 text-sm ${tier.featured ? "text-white/68" : "text-muted"}`}>{tier.note}</span>
              </div>
              <button className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-bold ${tier.featured ? "bg-white text-ink hover:bg-mint" : "bg-ink text-white hover:bg-pine"}`}>
                {tier.name === "Scale" ? "Contact sales" : "Start Free"}
              </button>
              <ul className="mt-7 space-y-3">
                {tier.features.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className={`h-4 w-4 ${tier.featured ? "text-mint" : "text-pine"}`} />
                    <span className={tier.featured ? "text-white/82" : "text-muted"}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
