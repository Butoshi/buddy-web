"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const aiSteps = [
  {
    step: 1,
    title: "Elite Wallet Detection",
    description: "Buddy tracks elite wallets with proven track records. When a top performer buys, it triggers a high-priority signal that can bypass normal filters - following the smart money.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "from-yellow-500 to-amber-500",
  },
  {
    step: 2,
    title: "Coordinated Buying",
    description: "AI detects when multiple related wallets buy together - a strong bullish signal. Buddy identifies these patterns in real-time and acts before the price pumps.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    color: "from-purple-500 to-pink-500",
  },
  {
    step: 3,
    title: "Consecutive Whales",
    description: "When multiple whale transactions happen in sequence, it signals strong accumulation. Buddy detects these patterns and enters positions early in the momentum.",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    color: "from-blue-500 to-cyan-500",
  },
  {
    step: 4,
    title: "Adaptive AI Filters",
    description: "6 AI features (transactions, traders, buy ratio, market cap, velocity, whale count) combined with self-adjusting filters that adapt to market conditions automatically.",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    color: "from-green-500 to-emerald-500",
  },
];

const aiFeatures = [
  { label: "AI Features Analyzed", value: "6" },
  { label: "Rug Detection Rate", value: "94%" },
  { label: "Execution Speed", value: "<30ms" },
  { label: "Market Adaptation", value: "Real-time" },
];

// Pre-calculated node positions to avoid hydration mismatch from floating-point differences
// Positions are calculated as: top = 50 + 40 * sin(i * π * 2 / 6), left = 50 + 40 * cos(i * π * 2 / 6)
const nodePositions = [
  { top: "50%", left: "90%" },      // i=0: angle=0°
  { top: "84.64%", left: "70%" },   // i=1: angle=60°
  { top: "84.64%", left: "30%" },   // i=2: angle=120°
  { top: "50%", left: "10%" },      // i=3: angle=180°
  { top: "15.36%", left: "30%" },   // i=4: angle=240°
  { top: "15.36%", left: "70%" },   // i=5: angle=300°
];

const lineEndpoints = [
  { x2: "90%", y2: "50%" },         // i=0
  { x2: "70%", y2: "84.64%" },      // i=1
  { x2: "30%", y2: "84.64%" },      // i=2
  { x2: "10%", y2: "50%" },         // i=3
  { x2: "30%", y2: "15.36%" },      // i=4
  { x2: "70%", y2: "15.36%" },      // i=5
];

export default function HowAIWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-purple-400">AI Technology</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            The{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Buddy Engine
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Buddy Engine: A hierarchical decision system that prioritizes signals and adapts to market conditions
          </motion.p>
        </div>

        {/* AI Steps */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {aiSteps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-[1px] bg-gradient-to-r from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8 rounded-3xl bg-card/50 border border-white/5 hover:border-white/10 transition-all h-full">
                <div className="flex items-start gap-6">
                  {/* Step number & icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} p-0.5`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <span className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                        Step {item.step}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-primary/10 rounded-3xl blur-xl" />
          <div className="relative p-8 rounded-3xl bg-card/30 border border-purple-500/20 backdrop-blur">
            {/* Neural network visualization */}
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left side - stats */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                {aiFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-center"
                  >
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                      {feature.value}
                    </div>
                    <div className="text-sm text-muted">{feature.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Right side - diagram */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Central brain */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </motion.div>

                  {/* Orbiting nodes */}
                  {nodePositions.map((pos, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 border border-white/20"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}

                  {/* Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    {lineEndpoints.map((endpoint, i) => (
                      <motion.line
                        key={i}
                        x1="50%"
                        y1="50%"
                        x2={endpoint.x2}
                        y2={endpoint.y2}
                        stroke="url(#gradient)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    ))}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom text */}
            <div className="mt-8 text-center">
              <p className="text-muted">
                Buddy&apos;s filters auto-adjust based on wins and losses. The AI evolves with the market - when conditions change, Buddy adapts autonomously.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
