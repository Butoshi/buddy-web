"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const roadmapItems = [
  {
    quarter: "Q1 2024",
    status: "completed",
    title: "Foundation",
    items: [
      "Core trading engine in Rust",
      "PumpFun integration",
      "Basic token filtering",
      "Local wallet encryption",
    ],
  },
  {
    quarter: "Q2 2024",
    status: "completed",
    title: "AI Integration",
    items: [
      "Machine learning models",
      "Pattern recognition",
      "Rug detection system",
      "Auto take-profit/stop-loss",
    ],
  },
  {
    quarter: "Q3 2024",
    status: "in-progress",
    title: "Advanced Features",
    items: [
      "Multi-wallet support",
      "Advanced analytics dashboard",
      "Custom strategy builder",
      "API for power users",
    ],
  },
  {
    quarter: "Q4 2024",
    status: "upcoming",
    title: "Expansion",
    items: [
      "Additional DEX support",
      "Mobile companion app",
      "Copy trading features",
      "Community strategies marketplace",
    ],
  },
  {
    quarter: "2025",
    status: "upcoming",
    title: "Future Vision",
    items: [
      "Cross-chain trading",
      "Advanced AI agents",
      "Institutional features",
      "And much more...",
    ],
  },
];

const statusColors = {
  completed: "bg-green-500",
  "in-progress": "bg-primary",
  upcoming: "bg-white/20",
};

const statusLabels = {
  completed: "Completed",
  "in-progress": "In Progress",
  upcoming: "Upcoming",
};

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="roadmap" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[200px]" />
      </div>

      <div ref={containerRef} className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Roadmap</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            Building the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Future
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Our vision for Buddy - always evolving, always improving
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-transparent hidden lg:block" />

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content card */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div
                    className={`inline-block p-6 rounded-3xl bg-card/50 border transition-all duration-300 hover:border-primary/30 ${
                      item.status === "in-progress"
                        ? "border-primary/30 shadow-lg shadow-primary/10"
                        : "border-white/5"
                    }`}
                  >
                    <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? "lg:justify-end" : ""}`}>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : item.status === "in-progress"
                            ? "bg-primary/20 text-primary"
                            : "bg-white/10 text-muted"
                        }`}
                      >
                        {statusLabels[item.status as keyof typeof statusLabels]}
                      </span>
                      <span className="font-bold text-lg">{item.quarter}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <ul className={`space-y-2 ${index % 2 === 0 ? "lg:text-right" : ""}`}>
                      {item.items.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-muted text-sm">
                          {index % 2 !== 0 && (
                            <svg
                              className={`w-4 h-4 flex-shrink-0 ${
                                item.status === "completed" ? "text-green-400" : "text-primary/50"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span>{feature}</span>
                          {index % 2 === 0 && (
                            <svg
                              className={`w-4 h-4 flex-shrink-0 ${
                                item.status === "completed" ? "text-green-400" : "text-primary/50"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Center dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full ${statusColors[item.status as keyof typeof statusColors]} ${
                      item.status === "in-progress" ? "animate-pulse" : ""
                    }`}
                  />
                  {item.status === "in-progress" && (
                    <div className="absolute inset-0 w-6 h-6 rounded-full bg-primary animate-ping opacity-50" />
                  )}
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
