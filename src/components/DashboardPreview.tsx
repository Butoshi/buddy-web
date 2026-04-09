"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const memecoins = [
  { name: "PEPE420", emoji: "🐸" },
  { name: "WOJAK", emoji: "😢" },
  { name: "DOGE2.0", emoji: "🐕" },
  { name: "MOONCAT", emoji: "🐱" },
  { name: "RUGPULL", emoji: "🎰" },
  { name: "CHAD", emoji: "💪" },
];

const metrics = [
  { label: "Portfolio Value", value: "$12,847", change: "+127%" },
  { label: "Today's P&L", value: "+$2,341", change: "+18.2%" },
  { label: "Tokens Bought", value: "47", change: "" },
  { label: "Win Rate", value: "68%", change: "+5%" },
];

export default function DashboardPreview() {
  const [scanLine, setScanLine] = useState(0);
  const [activeTrades, setActiveTrades] = useState([
    { id: 1, name: "PEPE420", emoji: "🐸", action: "BUY", amount: "2.5 SOL", mc: "$45K", change: "+312%", time: "now" },
    { id: 2, name: "WOJAK", emoji: "😢", action: "SELL", amount: "1.2 SOL", mc: "$120K", change: "+89%", time: "2s ago" },
    { id: 3, name: "MOONCAT", emoji: "🐱", action: "BUY", amount: "0.8 SOL", mc: "$28K", change: "+156%", time: "5s ago" },
  ]);
  const [chartData, setChartData] = useState<number[]>([30, 35, 32, 45, 58, 52, 68, 85, 78, 95, 120, 115]);
  const [newTokens, setNewTokens] = useState([
    { name: "GIGA", mc: "$12K", holders: 45, age: "2m" },
    { name: "FROG", mc: "$8K", holders: 23, age: "30s" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => [...prev.slice(1), prev[prev.length - 1] + (Math.random() - 0.3) * 20]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const coin = memecoins[Math.floor(Math.random() * memecoins.length)];
      const newTrade = {
        id: Date.now(),
        name: coin.name,
        emoji: coin.emoji,
        action: Math.random() > 0.4 ? "BUY" : "SELL",
        amount: `${(Math.random() * 3 + 0.5).toFixed(1)} SOL`,
        mc: `$${Math.floor(Math.random() * 200 + 10)}K`,
        change: `+${Math.floor(Math.random() * 500 + 50)}%`,
        time: "now",
      };
      setActiveTrades(prev => [newTrade, ...prev.slice(0, 2)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ["MOON", "PUMP", "ROCKET", "DEGEN", "APE", "FOMO", "WAGMI", "NGMI"];
      const newToken = {
        name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
        mc: `$${Math.floor(Math.random() * 15 + 3)}K`,
        holders: Math.floor(Math.random() * 50 + 10),
        age: `${Math.floor(Math.random() * 60 + 5)}s`,
      };
      setNewTokens(prev => [newToken, prev[0]]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[2rem] blur-2xl opacity-60" />

      <div className="relative border-gradient rounded-3xl overflow-hidden">
        <div className="bg-[#0a0f1a] rounded-3xl overflow-hidden">
          {/* Browser header */}
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-xs font-medium text-accent">AI ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6 relative">
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none z-10"
              style={{ top: `${scanLine}%` }}
            />

            {/* Metrics row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card card-shine rounded-2xl p-4"
                >
                  <div className="text-xs text-muted mb-1">{metric.label}</div>
                  <div className="text-xl font-bold">{metric.value}</div>
                  {metric.change && (
                    <div className="text-xs text-green-400 mt-1">{metric.change}</div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Main grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Chart + New Tokens */}
              <div className="lg:col-span-2 space-y-6">
                {/* Portfolio Chart */}
                <div className="glass-card card-shine rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-lg">Portfolio Performance</h3>
                      <p className="text-xs text-muted">Last 24 hours</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">+127%</div>
                      <div className="text-xs text-muted">All time</div>
                    </div>
                  </div>

                  <div className="relative h-40">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="border-t border-white/5" />
                      ))}
                    </div>

                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                          <stop offset="100%" stopColor="rgb(6, 182, 212)" />
                        </linearGradient>
                      </defs>

                      <motion.path
                        d={`M 0 ${160 - chartData[0]} ${chartData.map((d, i) => `L ${(i / (chartData.length - 1)) * 100}% ${160 - d}`).join(" ")} L 100% 160 L 0 160 Z`}
                        fill="url(#chartGradient)"
                      />
                      <motion.path
                        d={`M 0 ${160 - chartData[0]} ${chartData.map((d, i) => `L ${(i / (chartData.length - 1)) * 100}% ${160 - d}`).join(" ")}`}
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <motion.circle
                        cx="100%"
                        cy={160 - chartData[chartData.length - 1]}
                        r="6"
                        fill="#06b6d4"
                        animate={{ r: [6, 8, 6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </svg>
                  </div>
                </div>

                {/* New Tokens Feed */}
                <div className="glass-card card-shine rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">New Tokens Detected</h3>
                    <div className="flex items-center gap-1 text-xs text-yellow-400">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                      SCANNING
                    </div>
                  </div>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {newTokens.map((token, index) => (
                        <motion.div
                          key={`${token.name}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
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
                            <button className="text-xs text-accent hover:underline">Buy →</button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Live trades */}
              <div className="glass-card card-shine rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Live Trades</h3>
                  <div className="flex items-center gap-1 text-xs text-accent">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                    LIVE
                  </div>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {activeTrades.map((trade) => (
                      <motion.div
                        key={trade.id}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                            trade.action === "BUY"
                              ? "bg-green-500/20"
                              : "bg-blue-500/20"
                          }`}>
                            {trade.emoji}
                          </div>
                          <div>
                            <div className="text-sm font-medium flex items-center gap-2">
                              {trade.name}
                              <span className={`text-xs px-1.5 py-0.5 rounded ${
                                trade.action === "BUY" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                              }`}>
                                {trade.action}
                              </span>
                            </div>
                            <div className="text-xs text-muted">{trade.amount} • MC: {trade.mc}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-green-400 font-medium">{trade.change}</div>
                          <div className="text-xs text-muted">{trade.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* AI Status */}
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="text-primary font-medium">Buddy AI:</span>
                    <motion.span
                      className="text-muted"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Analyzing tokens for optimal entry points...
                    </motion.span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-20 left-[5%] right-[5%] h-40 bg-gradient-to-b from-primary/5 to-transparent blur-2xl rounded-full" />
    </div>
  );
}
