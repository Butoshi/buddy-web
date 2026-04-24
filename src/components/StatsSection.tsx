"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

export default function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          <AnimatedCounter end={5000} suffix="+" label="New Tokens/Day on PumpFun" />
          <AnimatedCounter end={500} suffix="ms" label="Avg. Detection Time" />
          <AnimatedCounter end={85} suffix="%" label="AI Accuracy" />
          <AnimatedCounter end={99} suffix="%" label="Uptime" />
        </motion.div>
      </div>
    </section>
  );
}
