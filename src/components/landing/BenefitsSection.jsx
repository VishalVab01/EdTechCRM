import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader.jsx";
import { benefits } from "./landingData.js";

export default function BenefitsSection() {
  return (
    <section className="section-pad">
      <div className="landing-shell">
        <SectionHeader
          eyebrow="Benefits"
          title="A calmer operating system for EdTech growth"
          text="Give every team the same live picture of leads, applications, students, invoices, and priorities."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[8px] border border-line bg-white p-6 shadow-card hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="grid h-11 w-11 place-items-center rounded-[8px] bg-mint text-pine">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-ink">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{benefit.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
