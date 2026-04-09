"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export default function DashboardPreviewReal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Real-Time{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Watch Buddy AI scan, analyze, and trade tokens automatically
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />

          {/* Dashboard container */}
          <div className="relative bg-[#0a0f1a] rounded-3xl overflow-hidden border border-white/10">
            {/* Window header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#0d1321] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="hidden sm:flex items-center gap-2 ml-4 px-4 py-1.5 bg-white/5 rounded-lg">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs text-muted">buddy.local</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <span className="text-xs font-medium text-purple-400">◎ PumpFun</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                  </span>
                  <span className="text-xs font-medium text-accent">AI ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Portfolio Value", value: "$12,847", change: "+127%" },
                  { label: "Today's P&L", value: "+$2,341", change: "+18.2%" },
                  { label: "Tokens Bought", value: "47", change: null },
                  { label: "Win Rate", value: "68%", change: "+5%" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                    className="glass-card rounded-2xl p-4"
                  >
                    <div className="text-xs text-muted mb-1">{stat.label}</div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    {stat.change && (
                      <div className="text-xs text-green-400 mt-1">{stat.change}</div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Two columns */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Live Trades */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Live Trades</h3>
                    <div className="flex items-center gap-1 text-xs text-accent">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                      LIVE
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { emoji: "🐱", name: "MOONCAT", action: "BUY", amount: "3.3 SOL", mc: "$204K", gain: "+145%" },
                      { emoji: "🎰", name: "LUCKY", action: "SELL", amount: "1.0 SOL", mc: "$59K", gain: "+349%" },
                      { emoji: "🐕", name: "DOGE2.0", action: "SELL", amount: "3.1 SOL", mc: "$41K", gain: "+50%" },
                    ].map((trade, i) => (
                      <motion.div
                        key={trade.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${trade.action === "BUY" ? "bg-green-500/20" : "bg-blue-500/20"}`}>
                            {trade.emoji}
                          </div>
                          <div>
                            <div className="text-sm font-medium flex items-center gap-2">
                              {trade.name}
                              <span className={`text-xs px-1.5 py-0.5 rounded ${trade.action === "BUY" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                                {trade.action}
                              </span>
                            </div>
                            <div className="text-xs text-muted">{trade.amount} • MC: {trade.mc}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-400 font-medium">{trade.gain}</div>
                          <div className="text-xs text-muted">now</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* New Tokens */}
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">New Tokens Detected</h3>
                    <div className="flex items-center gap-1 text-xs text-yellow-400">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                      SCANNING
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "WAGMI63", holders: 21, age: "39s", mc: "$3K" },
                      { name: "PUMP10", holders: 51, age: "33s", mc: "$15K" },
                      { name: "SOLRISE", holders: 89, age: "1m", mc: "$28K" },
                    ].map((token, i) => (
                      <motion.div
                        key={token.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold text-xs">
                            NEW
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-xs text-muted">{token.holders} holders • {token.age} old</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{token.mc}</div>
                          <button className="text-xs text-accent hover:underline">Analyze →</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-primary font-medium">Buddy AI: </span>
                    <span className="text-muted">Analyzing 127 new tokens... Found 3 potential entries.</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Link to real dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
          >
            <span>See Live Dashboard Demo</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
