"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Simulated live data
const initialTrades = [
  { id: 1, token: "PEPE2.0", type: "BUY", entry: 0.00000012, current: 0.00000018, pnl: 50, amount: "0.5 SOL", time: "2m ago", status: "active" },
  { id: 2, token: "BONK", type: "BUY", entry: 0.00000089, current: 0.00000142, pnl: 59.5, amount: "0.8 SOL", time: "5m ago", status: "active" },
  { id: 3, token: "WIF", type: "BUY", entry: 0.0234, current: 0.0312, pnl: 33.3, amount: "1.2 SOL", time: "12m ago", status: "active" },
  { id: 4, token: "MYRO", type: "SELL", entry: 0.00045, current: 0.00067, pnl: 48.9, amount: "0.3 SOL", time: "18m ago", status: "closed" },
];

const portfolioData = [
  { time: "00:00", value: 10 },
  { time: "04:00", value: 12.5 },
  { time: "08:00", value: 11.8 },
  { time: "12:00", value: 15.2 },
  { time: "16:00", value: 18.7 },
  { time: "20:00", value: 22.4 },
  { time: "Now", value: 28.6 },
];

const recentActivity = [
  { action: "BUY", token: "SLERF", amount: "0.4 SOL", time: "Just now" },
  { action: "TP HIT", token: "POPCAT", amount: "+1.2 SOL", time: "1m ago" },
  { action: "ANALYZING", token: "New token detected...", amount: "", time: "2m ago" },
  { action: "BUY", token: "BOME", amount: "0.6 SOL", time: "4m ago" },
];

export default function DashboardShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [currentPnl, setCurrentPnl] = useState(186.4);
  const [trades, setTrades] = useState(initialTrades);

  // Simulate live PNL updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPnl(prev => {
        const change = (Math.random() - 0.3) * 5;
        return Math.max(0, prev + change);
      });

      setTrades(prev => prev.map(trade => ({
        ...trade,
        pnl: trade.status === "active" ? Math.max(-20, trade.pnl + (Math.random() - 0.4) * 3) : trade.pnl
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1000px] bg-primary/5 rounded-full blur-[250px]" />
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">Live Dashboard Preview</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            Your{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Trading Command Center
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Monitor your AI agent in real-time with professional-grade analytics
          </motion.p>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[40px] blur-2xl opacity-60" />

          {/* Main dashboard container */}
          <div className="relative rounded-3xl border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-sm font-medium text-muted">Buddy Dashboard</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-400">AI Active</span>
                </div>
                <div className="text-xs text-muted">Last update: Just now</div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6">
              {/* Top stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total PNL", value: `+${currentPnl.toFixed(1)}%`, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                  { label: "Today's Trades", value: "47", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
                  { label: "Win Rate", value: "73.2%", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
                  { label: "Portfolio", value: "28.6 SOL", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className={`p-4 rounded-2xl ${stat.bg} border ${stat.border}`}
                  >
                    <div className="text-xs text-muted mb-1">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Main content grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Portfolio Chart */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Portfolio Performance</h3>
                    <div className="flex items-center gap-2">
                      {["24H", "7D", "30D", "ALL"].map((period, i) => (
                        <button
                          key={period}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            i === 0 ? "bg-primary/20 text-primary" : "text-muted hover:text-white"
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart visualization */}
                  <div className="relative h-48">
                    <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={i * 50}
                          x2="700"
                          y2={i * 50}
                          stroke="rgba(255,255,255,0.05)"
                          strokeDasharray="4 4"
                        />
                      ))}

                      {/* Gradient fill */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Area fill */}
                      <motion.path
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 1, delay: 0.5 }}
                        d="M0,180 L100,150 L200,160 L300,120 L400,80 L500,50 L600,20 L700,20 L700,200 L0,200 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Line */}
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        d="M0,180 L100,150 L200,160 L300,120 L400,80 L500,50 L600,20 L700,20"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Current point */}
                      <motion.circle
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 2 }}
                        cx="700"
                        cy="20"
                        r="6"
                        fill="#3b82f6"
                      />
                      <motion.circle
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        cx="700"
                        cy="20"
                        r="10"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted py-2">
                      <span>30 SOL</span>
                      <span>20 SOL</span>
                      <span>10 SOL</span>
                    </div>
                  </div>

                  {/* X-axis labels */}
                  <div className="flex justify-between text-xs text-muted mt-2 pl-12">
                    {portfolioData.map((d) => (
                      <span key={d.time}>{d.time}</span>
                    ))}
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <h3 className="font-semibold mb-4">Live Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          activity.action === "BUY" ? "bg-green-500/20 text-green-400" :
                          activity.action === "TP HIT" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-primary/20 text-primary"
                        }`}>
                          {activity.action === "BUY" ? "B" : activity.action === "TP HIT" ? "$" : "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{activity.token}</div>
                          <div className="text-xs text-muted">{activity.time}</div>
                        </div>
                        {activity.amount && (
                          <div className={`text-sm font-medium ${
                            activity.amount.startsWith("+") ? "text-green-400" : "text-white"
                          }`}>
                            {activity.amount}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Trades Table */}
              <div className="mt-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Active Positions</h3>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live updating
                  </div>
                </div>

                {/* Table header */}
                <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs font-medium text-muted border-b border-white/5">
                  <div>Token</div>
                  <div>Type</div>
                  <div>Entry</div>
                  <div>Current</div>
                  <div>PNL</div>
                  <div>Size</div>
                  <div>Time</div>
                </div>

                {/* Table rows */}
                <div className="divide-y divide-white/5">
                  {trades.map((trade, index) => (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      className="grid grid-cols-7 gap-4 px-4 py-3 text-sm hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="font-medium flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs">
                          {trade.token.charAt(0)}
                        </span>
                        {trade.token}
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          trade.type === "BUY" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}>
                          {trade.type}
                        </span>
                      </div>
                      <div className="text-muted font-mono text-xs">{trade.entry.toFixed(8)}</div>
                      <div className="font-mono text-xs">{trade.current.toFixed(8)}</div>
                      <div className={`font-semibold ${trade.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {trade.pnl >= 0 ? "+" : ""}{trade.pnl.toFixed(1)}%
                      </div>
                      <div className="text-muted">{trade.amount}</div>
                      <div className="text-muted text-xs">{trade.time}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust badges below dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 lg:gap-8"
        >
          {[
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Runs 100% locally" },
            { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", text: "Your keys never leave" },
            { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", text: "AI-powered decisions" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/30 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* What is Buddy explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">What is Buddy?</span>
            </div>
          </div>

          <div className="relative rounded-3xl bg-gradient-to-br from-card/90 to-card/50 border border-white/10 overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative p-8 sm:p-12">
              {/* Main title */}
              <h3 className="text-3xl sm:text-4xl font-black mb-6 text-center">
                A True{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Trading Agent
                </span>
              </h3>

              {/* 4 Pillars */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">Autonomous</span>
                <span className="px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-semibold text-accent">Adaptive</span>
                <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-semibold text-purple-400">Evolutive</span>
                <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm font-semibold text-green-400">24/7</span>
              </div>

              {/* Main description */}
              <div className="max-w-3xl mx-auto text-center mb-8">
                <p className="text-lg text-muted leading-relaxed mb-4">
                  Buddy isn&apos;t a bot with fixed rules — it&apos;s a <span className="text-foreground font-semibold">self-evolving AI agent</span> that
                  learns and adapts to market conditions. Its filters and strategies continuously optimize based on what&apos;s actually working.
                </p>
                <p className="text-lg text-muted leading-relaxed">
                  When the market shifts, Buddy shifts with it. <span className="text-accent font-semibold">Winning patterns get reinforced.
                  Losing ones get abandoned.</span> This is what separates a true AI agent from simple automation.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-2xl font-black text-primary">&lt;30ms</div>
                  <div className="text-xs text-muted">Execution Speed</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-2xl font-black text-accent">94%</div>
                  <div className="text-xs text-muted">Rug Detection</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="text-2xl font-black text-green-400">10x</div>
                  <div className="text-xs text-muted">Faster than Python</div>
                </div>
              </div>

              {/* Bottom section */}
              <div className="pt-6 border-t border-white/5 flex justify-center">
                <a
                  href="/features"
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
                >
                  <span className="font-semibold text-primary">Deep dive into Buddy Engine</span>
                  <svg className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
