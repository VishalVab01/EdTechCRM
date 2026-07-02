import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function TestimonialSection() {
  return (
    <section className="section-pad">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="landing-shell grid gap-8 rounded-[8px] border border-line bg-ink p-8 text-white shadow-soft lg:grid-cols-[0.8fr_1.2fr] lg:p-12"
      >
        <div>
          <Quote className="h-10 w-10 text-coral" />
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Featured customer</p>
          <h2 className="mt-4 text-3xl font-bold">Admissions, sales, and finance finally move together.</h2>
        </div>
        <div className="flex flex-col justify-between gap-8">
          <p className="text-xl leading-9 text-white/86">
            EdTech CRM helped our counsellors stop chasing spreadsheets. We review applications faster, follow up with better context, and see revenue without waiting for weekly reports.
          </p>
          <div>
            <p className="font-bold">Priya Menon</p>
            <p className="text-sm text-white/60">Operations Director, Campusly Learning</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
