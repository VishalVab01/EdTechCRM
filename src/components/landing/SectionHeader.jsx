import { motion } from "framer-motion";

export default function SectionHeader({ eyebrow, title, text, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}
    >
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-[0.18em] text-coral">{eyebrow}</p>}
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-muted sm:text-lg">{text}</p>}
    </motion.div>
  );
}
