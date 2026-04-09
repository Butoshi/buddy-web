"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const comparisons = [
  {
    feature: "Reaction Time",
    buddy: "< 50ms",
    manual: "2-5 seconds",
    buddyWins: true,
  },
  {
    feature: "24/7 Monitoring",
    buddy: "Always active",
    manual: "Limited hours",
    buddyWins: true,
  },
  {
    feature: "Emotion Control",
    buddy: "100% rational",
    manual: "FOMO & Fear",
    buddyWins: true,
  },
  {
    feature: "Token Analysis",
    buddy: "AI-powered",
    manual: "Manual research",
    buddyWins: true,
  },
  {
    feature: "Rug Detection",
    buddy: "Automatic",
    manual: "Often missed",
    buddyWins: true,
  },
  {
    feature: "Multi-token Trading",
    buddy: "Simultaneous",
    manual: "One at a time",
    buddyWins: true,
  },
  {
    feature: "Take Profit Execution",
    buddy: "Instant",
    manual: "Delayed",
    buddyWins: true,
  },
  {
    feature: "Learning & Adaptation",
    buddy: "Continuous AI training",
    manual: "Experience-based",
    buddyWins: true,
  },
];

export default function ComparisonTable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
      </div>

      <div ref={containerRef} className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Comparison</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            Buddy vs{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Manual Trading
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            See why traders are switching to AI-powered automation
          </motion.p>
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 rounded-3xl blur-xl" />

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/50 backdrop-blur">
            {/* Table header */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-white/5">
              <div className="text-muted font-medium">Feature</div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                  <span className="text-lg">🤖</span>
                  <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Buddy AI</span>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-lg">👤</span>
                  <span className="font-medium text-muted">Manual</span>
                </div>
              </div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-white/5">
              {comparisons.map((item, index) => (
                <motion.div
                  key={item.feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                  className="grid grid-cols-3 gap-4 p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="font-medium flex items-center">{item.feature}</div>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 font-medium text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item.buddy}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400/80 font-medium text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {item.manual}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-muted mb-6">Ready to trade smarter, not harder?</p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl btn-glow text-white font-semibold"
          >
            Start Trading with Buddy
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
