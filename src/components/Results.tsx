"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const results = [
  { token: "PEPE2.0", entry: "$120", exit: "$1,890", gain: "+1,475%", time: "2h 34m" },
  { token: "BONK", entry: "$450", exit: "$3,200", gain: "+611%", time: "4h 12m" },
  { token: "WIF", entry: "$89", exit: "$2,400", gain: "+2,596%", time: "1d 2h" },
  { token: "MYRO", entry: "$230", exit: "$1,100", gain: "+378%", time: "45m" },
  { token: "SLERF", entry: "$180", exit: "$890", gain: "+394%", time: "3h 18m" },
  { token: "BOME", entry: "$320", exit: "$2,100", gain: "+556%", time: "6h 45m" },
];

function AnimatedNumber({ value, duration = 2 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{displayValue.toLocaleString()}</>;
}

export default function Results() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="results" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />
      </div>

      <div ref={containerRef} className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-400">Real Results</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            Buddy&apos;s{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Track Record
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Sample trades from our AI agent. Past performance doesn&apos;t guarantee future results.
          </motion.p>
        </div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Total Profit", value: 847000, prefix: "$", suffix: "+", color: "text-green-400" },
            { label: "Winning Trades", value: 73, prefix: "", suffix: "%", color: "text-primary" },
            { label: "Best Trade", value: 2596, prefix: "+", suffix: "%", color: "text-accent" },
            { label: "Avg Hold Time", value: 4, prefix: "", suffix: "h", color: "text-purple-400" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="p-6 rounded-2xl bg-card/50 border border-white/5 text-center"
            >
              <div className={`text-3xl lg:text-4xl font-black ${stat.color} mb-1`}>
                {stat.prefix}
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Trades table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-white/10 overflow-hidden bg-card/30 backdrop-blur"
        >
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-white/5 text-sm font-medium text-muted border-b border-white/5">
            <div>Token</div>
            <div>Entry</div>
            <div>Exit</div>
            <div>Gain</div>
            <div>Hold Time</div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-white/5">
            {results.map((trade, index) => (
              <motion.div
                key={trade.token}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold">
                    {trade.token.charAt(0)}
                  </div>
                  {trade.token}
                </div>
                <div className="text-muted">{trade.entry}</div>
                <div className="text-foreground">{trade.exit}</div>
                <div className="text-green-400 font-semibold">{trade.gain}</div>
                <div className="text-muted">{trade.time}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-sm text-muted/60 mt-6"
        >
          * These are sample trades for demonstration purposes. Cryptocurrency trading involves substantial risk.
        </motion.p>
      </div>
    </section>
  );
}
