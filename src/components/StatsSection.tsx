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
          <AnimatedCounter end={2847563} prefix="$" label="Total Volume Traded" />
          <AnimatedCounter end={12847} label="Trades Executed" />
          <AnimatedCounter end={3250} suffix="+" label="Active Traders" />
          <AnimatedCounter end={99} suffix="%" label="Uptime" />
        </motion.div>
      </div>
    </section>
  );
}
