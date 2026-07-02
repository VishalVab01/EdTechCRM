import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardMockup from "./DashboardMockup.jsx";

export default function HeroSection() {
  return (
    <section className="overflow-hidden pb-16 pt-14 sm:pt-20 lg:pb-24">
      <div className="landing-shell">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-pine shadow-card"
          >
            One CRM for admissions, operations, HR, billing, and reporting
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-7 text-4xl font-extrabold tracking-tight text-ink sm:text-6xl lg:text-7xl"
          >
            Run Your Entire EdTech Business From One CRM
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted"
          >
            Manage leads, student applications, bulk reviews, HR hiring, billing, accounting, and reports from one clean dashboard.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/login" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white shadow-soft hover:bg-pine sm:w-auto">
              Get Started <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link to="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-bold text-ink shadow-card hover:border-pine sm:w-auto">
              <PlayCircle className="h-4 w-4 text-coral" /> Book a Demo
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.34, duration: 0.65 }}
          className="mx-auto mt-14 max-w-6xl rounded-[8px] border border-white bg-white/50 p-2 shadow-soft"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
