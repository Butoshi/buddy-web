"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Download & Connect",
    description: "Download Buddy and import your Solana wallet. Everything stays encrypted on your machine.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute w-32 h-32 rounded-full border-2 border-dashed border-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
    ),
  },
  {
    number: "02",
    title: "Configure Filters",
    description: "Set your criteria: market cap range, holder limits, dev wallet checks, and more.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="space-y-3">
          {["Market Cap", "Holders", "Liquidity"].map((label, i) => (
            <motion.div
              key={label}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: i * 0.2, duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-muted w-20">{label}</span>
              <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: `${60 + i * 15}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "AI-Powered Buying",
    description: "Buddy analyzes tokens 24/7. When a token reaches optimal market cap and matches your filters, it buys based on AI decisions.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <span className="text-2xl">🎯</span>
          </motion.div>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-full rounded-xl border border-green-500/30"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5, repeatDelay: 1 }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Auto Take-Profit",
    description: "Set your targets (2x, 5x, 10x). Buddy sells automatically when you hit your gains.",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="flex items-end gap-2">
          {[2, 5, 10].map((mult, i) => (
            <motion.div
              key={mult}
              className="flex flex-col items-center"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ delay: i * 0.3, duration: 0.5 }}
            >
              <motion.div
                className={`w-10 rounded-t-lg ${i === 2 ? "bg-gradient-to-t from-primary to-accent" : "bg-primary/30"}`}
                style={{ height: 20 + i * 25 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <span className="text-xs mt-2 text-accent font-medium">{mult}x</span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function HowItWorksAdvanced() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div ref={containerRef} className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">How It Works</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            Start Trading in{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Minutes
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Four simple steps to automate your memecoin trading on PumpFun.
          </motion.p>
        </div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-card-border hidden lg:block" />
          <motion.div
            className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-primary to-accent hidden lg:block"
            style={{ height: lineHeight }}
          />

          {/* Steps */}
          <div className="space-y-24 lg:space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Number badge - center on desktop */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-lg opacity-50" />
                    <div className="relative w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                      <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content side */}
                <div className={`flex-1 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                  <div className="lg:hidden flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{step.number}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted max-w-md">{step.description}</p>
                </div>

                {/* Visual side */}
                <div className="flex-1 w-full">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-xl" />
                    <div className="relative h-48 lg:h-64 rounded-3xl bg-card/50 backdrop-blur border border-white/5 overflow-hidden">
                      {step.visual}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-24"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 rounded-2xl bg-card/50 backdrop-blur border border-white/5">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-muted">Lifetime access available</span>
            </div>
            <a
              href="#pricing"
              className="btn-glow text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              View Pricing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
