import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { stats } from "./landingData.js";

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1400, bounce: 0 });
  const rounded = useTransform(spring, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function StatsSection() {
  return (
    <section className="pb-8">
      <div className="landing-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[8px] border border-line bg-white p-6 shadow-card">
            <p className="text-4xl font-extrabold text-ink">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-sm font-semibold text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
