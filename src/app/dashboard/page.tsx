"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import BuddyLogo from "@/components/BuddyLogo";

// Agent API URL
const AGENT_API_URL = "http://localhost:3001/api/data";

// Types from the Rust agent
interface TokenEvent {
  timestamp: string;
  symbol: string;
  mint: string;
  mc_usd: number;
  age: number;
  event_type: string; // "NEW", "BUY", "SELL", "SKIP"
  reason: string;
  urgency: number;
  confidence: number;
}

interface RunnerInfo {
  symbol: string;
  mint: string;
  multiplier: number;
  caught: boolean;
  timestamp: string;
}

interface AgentData {
  tokens_tracked: number;
  total_decisions: number;
  total_buys: number;
  total_sells: number;
  total_skips: number;
  total_pnl: number;
  positions_open: number;
  market_mode: string;
  market_cycle: string;
  exit_efficiency: number;
  win_rate: number;
  migrations_total: number;
  migrations_caught: number;
  migrations_missed: number;
  recent_tokens: TokenEvent[];
  recent_buys: TokenEvent[];
  recent_sells: TokenEvent[];
  recent_skips: TokenEvent[];
  runners_detected: RunnerInfo[];
}

// Local display types
interface Trade {
  id: number;
  token: string;
  mint: string;
  type: "BUY" | "SELL";
  entry: number;
  current: number;
  pnl: number;
  amount: string;
  time: string;
  status: "active" | "closed";
  confidence: number;
}

interface Activity {
  type: "buy" | "sell" | "skip" | "new" | "runner";
  token: string;
  reason?: string;
  mc_usd?: number;
  multiplier?: number;
  pnl?: number;
  time: string;
}

// PNL history point
interface PnlPoint {
  time: string;
  pnl: number;
}

export default function DashboardPage() {
  const [agentConnected, setAgentConnected] = useState(false);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<"feed" | "active" | "sells" | "history" | "tokens" | "runners">("feed");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [pnlHistory, setPnlHistory] = useState<PnlPoint[]>([]);
  const lastBuysRef = useRef<string[]>([]);

  // Fetch data from agent API
  const fetchAgentData = useCallback(async () => {
    try {
      const response = await fetch(AGENT_API_URL, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: AgentData = await response.json();
      setAgentData(data);
      setAgentConnected(true);
      setConnectionError(null);

      // Track PNL history (add point every fetch)
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setPnlHistory(prev => {
        const newHistory = [...prev, { time: timeStr, pnl: data.total_pnl }];
        // Keep last 60 points (2 minutes of data at 2s intervals)
        if (newHistory.length > 60) {
          return newHistory.slice(-60);
        }
        return newHistory;
      });

      // Convert agent buys to trades format
      const newTrades: Trade[] = data.recent_buys.map((buy, index) => ({
        id: index,
        token: buy.symbol,
        mint: buy.mint,
        type: "BUY" as const,
        entry: buy.mc_usd,
        current: buy.mc_usd,
        pnl: 0,
        amount: `${buy.confidence.toFixed(0)}%`,
        time: buy.timestamp,
        status: "active" as const,
        confidence: buy.confidence,
      }));
      setTrades(newTrades);

      // Build activity feed from recent tokens
      const newActivity: Activity[] = [];

      // Add new buys (check for new ones)
      const currentBuyMints = data.recent_buys.map(b => b.mint);
      const newBuyMints = currentBuyMints.filter(m => !lastBuysRef.current.includes(m));
      lastBuysRef.current = currentBuyMints;

      data.recent_buys.slice(0, 5).forEach(buy => {
        newActivity.push({
          type: "buy",
          token: buy.symbol,
          reason: buy.reason,
          mc_usd: buy.mc_usd,
          time: buy.timestamp,
        });
      });

      // Add recent sells
      data.recent_sells?.slice(0, 5).forEach(sell => {
        newActivity.push({
          type: "sell",
          token: sell.symbol,
          reason: sell.reason,
          mc_usd: sell.mc_usd,
          pnl: sell.confidence, // PNL is stored in confidence field
          time: sell.timestamp,
        });
      });

      // Add recent skips
      data.recent_skips.slice(0, 3).forEach(skip => {
        newActivity.push({
          type: "skip",
          token: skip.symbol,
          reason: skip.reason,
          mc_usd: skip.mc_usd,
          time: skip.timestamp,
        });
      });

      // Add new tokens
      data.recent_tokens.slice(0, 5).forEach(token => {
        newActivity.push({
          type: "new",
          token: token.symbol,
          mc_usd: token.mc_usd,
          time: token.timestamp,
        });
      });

      // Add runners
      data.runners_detected.slice(0, 3).forEach(runner => {
        newActivity.push({
          type: "runner",
          token: runner.symbol,
          multiplier: runner.multiplier,
          time: runner.timestamp,
        });
      });

      // Sort by time (most recent first) - simple sort since timestamps are strings
      newActivity.sort((a, b) => b.time.localeCompare(a.time));
      setActivity(newActivity.slice(0, 15));

    } catch (error) {
      setAgentConnected(false);
      setConnectionError(error instanceof Error ? error.message : "Connection failed");
    }
  }, []);

  // Poll agent API every 2 seconds
  useEffect(() => {
    fetchAgentData(); // Initial fetch

    const interval = setInterval(fetchAgentData, 2000);
    return () => clearInterval(interval);
  }, [fetchAgentData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main content */}
      <main className="min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-white/5 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo + Mobile menu */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <BuddyLogo size={48} trackMouse={true} breathe={false} />
                <span className="text-xl font-black hidden sm:block">Buddy</span>
              </Link>

              {/* Mobile nav dropdown */}
              <div className="md:hidden relative group">
                <button className="p-2 rounded-lg hover:bg-white/5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 w-48 py-2 rounded-xl bg-card border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {[
                    { label: "Dashboard", active: true },
                    { label: "Analytics", active: false },
                    { label: "Settings", active: false },
                    { label: "Help", active: false },
                  ].map((item) => (
                    <button
                      key={item.label}
                      className={`w-full px-4 py-2 text-left text-sm ${
                        item.active ? "text-primary bg-primary/10" : "text-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted hover:bg-white/5 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted hover:bg-white/5 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/20 text-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </span>
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* Agent connection status */}
              <div className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                agentConnected
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>
                <div className={`w-2 h-2 rounded-full ${agentConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                {agentConnected ? "Agent Connected" : "Agent Offline"}
              </div>

              {/* Market Mode */}
              {agentData && (
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  <span>{agentData.market_mode}</span>
                  <span className="text-muted">|</span>
                  <span>{agentData.market_cycle}</span>
                </div>
              )}

              {/* Positions open */}
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-muted">Positions</div>
                <div className="font-bold text-sm">{agentData?.positions_open ?? 0}</div>
              </div>

              {/* Profile */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <span className="font-bold text-white text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted">Welcome back! Here&apos;s your trading overview.</p>
          </div>


          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              {
                label: "Tokens",
                value: agentData?.tokens_tracked.toLocaleString() ?? "0",
                color: "text-primary",
                bg: "from-primary/20 to-primary/5"
              },
              {
                label: "Buys",
                value: agentData?.total_buys.toString() ?? "0",
                color: "text-green-400",
                bg: "from-green-500/20 to-green-500/5"
              },
              {
                label: "Sells",
                value: agentData?.total_sells?.toString() ?? "0",
                color: "text-orange-400",
                bg: "from-orange-500/20 to-orange-500/5"
              },
              {
                label: "PNL (SOL)",
                value: `${(agentData?.total_pnl ?? 0) >= 0 ? "+" : ""}${(agentData?.total_pnl ?? 0).toFixed(3)}`,
                color: (agentData?.total_pnl ?? 0) >= 0 ? "text-green-400" : "text-red-400",
                bg: (agentData?.total_pnl ?? 0) >= 0 ? "from-green-500/20 to-green-500/5" : "from-red-500/20 to-red-500/5"
              },
              {
                label: "Win Rate",
                value: `${((agentData?.win_rate ?? 0) * 100).toFixed(1)}%`,
                color: (agentData?.win_rate ?? 0) >= 0.5 ? "text-green-400" : "text-yellow-400",
                bg: (agentData?.win_rate ?? 0) >= 0.5 ? "from-green-500/20 to-green-500/5" : "from-yellow-500/20 to-yellow-500/5"
              },
              {
                label: "Migrations",
                value: `${agentData?.migrations_caught ?? 0}/${agentData?.migrations_total ?? 0}`,
                color: "text-purple-400",
                bg: "from-purple-500/20 to-purple-500/5"
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} border border-white/5`}
              >
                <div className="text-[10px] text-muted mb-0.5">{stat.label}</div>
                <div className={`text-lg sm:text-xl font-black ${stat.color}`}>{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main trading panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chart placeholder */}
              <div className="p-6 rounded-2xl bg-card/50 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Portfolio Performance</h2>
                  <div className="flex gap-2">
                    {["1H", "24H", "7D", "30D"].map((period, i) => (
                      <button
                        key={period}
                        className={`px-3 py-1 rounded-lg text-sm ${i === 1 ? "bg-primary/20 text-primary" : "text-muted hover:text-white"}`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-48">
                  {pnlHistory.length > 1 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={pnlHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 10, fill: '#888' }}
                          tickLine={false}
                          axisLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: '#888' }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value >= 0 ? '+' : ''}${value.toFixed(3)}`}
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                          formatter={(value) => {
                            const num = Number(value) || 0;
                            return [`${num >= 0 ? '+' : ''}${num.toFixed(4)} SOL`, 'PNL'];
                          }}
                          labelStyle={{ color: '#888' }}
                        />
                        <ReferenceLine y={0} stroke="#444" strokeDasharray="3 3" />
                        <Line
                          type="monotone"
                          dataKey="pnl"
                          stroke={pnlHistory[pnlHistory.length - 1]?.pnl >= 0 ? "#22c55e" : "#ef4444"}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: pnlHistory[pnlHistory.length - 1]?.pnl >= 0 ? "#22c55e" : "#ef4444" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                      <div className="text-center text-muted">
                        <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="text-sm">Waiting for PNL data...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Data table */}
              <div className="p-4 sm:p-6 rounded-2xl bg-card/50 border border-white/5 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="font-bold text-lg">Live Data</h2>
                  <div className="flex gap-1 sm:gap-2 flex-wrap text-xs sm:text-sm">
                    <button
                      onClick={() => setActiveTab("feed")}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${activeTab === "feed" ? "bg-blue-500/20 text-blue-400" : "text-muted hover:text-white"}`}
                    >
                      Feed
                    </button>
                    <button
                      onClick={() => setActiveTab("active")}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${activeTab === "active" ? "bg-green-500/20 text-green-400" : "text-muted hover:text-white"}`}
                    >
                      Hold ({agentData?.positions_open ?? 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("sells")}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${activeTab === "sells" ? "bg-orange-500/20 text-orange-400" : "text-muted hover:text-white"}`}
                    >
                      Sells ({agentData?.recent_sells?.length ?? 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("tokens")}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${activeTab === "tokens" ? "bg-primary/20 text-primary" : "text-muted hover:text-white"}`}
                    >
                      Tokens ({agentData?.recent_tokens.length ?? 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("history")}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${activeTab === "history" ? "bg-yellow-500/20 text-yellow-400" : "text-muted hover:text-white"}`}
                    >
                      Skips ({agentData?.recent_skips.length ?? 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("runners")}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${activeTab === "runners" ? "bg-purple-500/20 text-purple-400" : "text-muted hover:text-white"}`}
                    >
                      Runners ({agentData?.runners_detected.length ?? 0})
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {/* Live Feed */}
                  {activeTab === "feed" && (
                    <div className="space-y-2">
                      {activity.length > 0 ? activity.map((act, i) => (
                        <motion.div
                          key={`${act.token}-${act.time}-${i}`}
                          initial={i === 0 ? { opacity: 0, y: -10 } : {}}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            act.type === "buy" ? "bg-green-500/20 text-green-400" :
                            act.type === "sell" ? "bg-orange-500/20 text-orange-400" :
                            act.type === "skip" ? "bg-yellow-500/20 text-yellow-400" :
                            act.type === "runner" ? "bg-purple-500/20 text-purple-400" :
                            "bg-primary/20 text-primary"
                          }`}>
                            {act.type === "buy" ? "B" : act.type === "sell" ? "$" : act.type === "skip" ? "S" : act.type === "runner" ? "R" : "N"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{act.token}</div>
                            <div className="text-xs text-muted">
                              {act.type === "buy" && "Bought"}
                              {act.type === "sell" && <span className={act.pnl && act.pnl >= 0 ? "text-green-400" : "text-red-400"}>Sold {act.pnl !== undefined ? `${act.pnl >= 0 ? "+" : ""}${act.pnl.toFixed(1)}%` : ""}</span>}
                              {act.type === "skip" && "Skipped"}
                              {act.type === "runner" && <span className="text-purple-400">{act.multiplier?.toFixed(1)}x Runner</span>}
                              {act.type === "new" && "New Token"}
                            </div>
                          </div>
                          {act.mc_usd && (
                            <span className="text-xs text-muted shrink-0">
                              ${act.mc_usd >= 1000 ? `${(act.mc_usd / 1000).toFixed(1)}k` : act.mc_usd.toFixed(0)}
                            </span>
                          )}
                          <span className="text-xs text-muted shrink-0">{act.time}</span>
                        </motion.div>
                      )) : (
                        <div className="text-center text-muted py-8">
                          <p className="text-sm">Waiting for activity...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hold Table */}
                  {activeTab === "active" && (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted border-b border-white/5">
                          <th className="pb-2 font-medium">Token</th>
                          <th className="pb-2 font-medium">MC</th>
                          <th className="pb-2 font-medium">Conf</th>
                          <th className="pb-2 font-medium hidden sm:table-cell">Reason</th>
                          <th className="pb-2 font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agentData?.recent_buys.map((buy, i) => (
                          <tr key={`${buy.mint}-${i}`} className="hover:bg-white/5">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500/30 to-accent/30 flex items-center justify-center text-xs font-bold">
                                  {buy.symbol.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-sm">{buy.symbol}</span>
                                  <div className="text-[10px] text-muted font-mono">{buy.mint.slice(0, 6)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-mono text-xs">${buy.mc_usd >= 1000 ? `${(buy.mc_usd / 1000).toFixed(1)}k` : buy.mc_usd.toFixed(0)}</td>
                            <td className="py-3">
                              <span className="text-xs text-green-400">{buy.confidence.toFixed(0)}%</span>
                            </td>
                            <td className="py-3 text-xs text-muted max-w-[120px] truncate hidden sm:table-cell" title={buy.reason}>{buy.reason}</td>
                            <td className="py-3 text-xs text-muted">{buy.timestamp}</td>
                          </tr>
                        ))}
                        {(!agentData?.recent_buys || agentData.recent_buys.length === 0) && (
                          <tr><td colSpan={5} className="py-8 text-center text-muted text-sm">No buys yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Sells Table */}
                  {activeTab === "sells" && (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted border-b border-white/5">
                          <th className="pb-2 font-medium">Token</th>
                          <th className="pb-2 font-medium">Exit MC</th>
                          <th className="pb-2 font-medium">PNL</th>
                          <th className="pb-2 font-medium">Reason</th>
                          <th className="pb-2 font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agentData?.recent_sells?.map((sell, i) => (
                          <tr key={`${sell.mint}-${i}`} className="hover:bg-white/5">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center text-xs font-bold">
                                  {sell.symbol.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-sm">{sell.symbol}</span>
                                  <div className="text-[10px] text-muted font-mono">{sell.mint.slice(0, 6)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-mono text-xs">${sell.mc_usd.toLocaleString()}</td>
                            <td className="py-3">
                              <span className={`text-xs font-bold ${sell.confidence >= 0 ? "text-green-400" : "text-red-400"}`}>
                                {sell.confidence >= 0 ? "+" : ""}{sell.confidence.toFixed(1)}%
                              </span>
                            </td>
                            <td className="py-3 text-xs text-muted max-w-[150px] truncate" title={sell.reason}>{sell.reason}</td>
                            <td className="py-3 text-xs text-muted">{sell.timestamp}</td>
                          </tr>
                        ))}
                        {(!agentData?.recent_sells || agentData.recent_sells.length === 0) && (
                          <tr><td colSpan={5} className="py-8 text-center text-muted text-sm">No sells yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Tokens Table */}
                  {activeTab === "tokens" && (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted border-b border-white/5">
                          <th className="pb-2 font-medium">Token</th>
                          <th className="pb-2 font-medium">MC</th>
                          <th className="pb-2 font-medium">Age</th>
                          <th className="pb-2 font-medium">Type</th>
                          <th className="pb-2 font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agentData?.recent_tokens.map((token, i) => (
                          <tr key={`${token.mint}-${i}`} className="hover:bg-white/5">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  token.event_type === "BUY" ? "bg-gradient-to-br from-green-500/30 to-accent/30" :
                                  token.event_type === "SELL" ? "bg-gradient-to-br from-orange-500/30 to-red-500/30" :
                                  "bg-gradient-to-br from-primary/30 to-accent/30"
                                }`}>
                                  {token.symbol.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-sm">{token.symbol}</span>
                                  <div className="text-[10px] text-muted font-mono">{token.mint.slice(0, 6)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-mono text-xs">${token.mc_usd >= 1000 ? `${(token.mc_usd / 1000).toFixed(1)}k` : token.mc_usd.toFixed(0)}</td>
                            <td className="py-3 text-xs">{token.age.toFixed(0)}s</td>
                            <td className="py-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                token.event_type === "BUY" ? "bg-green-500/20 text-green-400" :
                                token.event_type === "SELL" ? "bg-orange-500/20 text-orange-400" :
                                token.event_type === "SKIP" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-primary/20 text-primary"
                              }`}>
                                {token.event_type}
                              </span>
                            </td>
                            <td className="py-3 text-xs text-muted">{token.timestamp}</td>
                          </tr>
                        ))}
                        {(!agentData?.recent_tokens || agentData.recent_tokens.length === 0) && (
                          <tr><td colSpan={5} className="py-8 text-center text-muted text-sm">No tokens yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Skips Table */}
                  {activeTab === "history" && (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted border-b border-white/5">
                          <th className="pb-2 font-medium">Token</th>
                          <th className="pb-2 font-medium">MC</th>
                          <th className="pb-2 font-medium">Reason</th>
                          <th className="pb-2 font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agentData?.recent_skips.map((skip, i) => (
                          <tr key={`${skip.mint}-${i}`} className="hover:bg-white/5">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center text-xs font-bold">
                                  {skip.symbol.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-sm">{skip.symbol}</span>
                                  <div className="text-[10px] text-muted font-mono">{skip.mint.slice(0, 6)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-mono text-xs">${skip.mc_usd >= 1000 ? `${(skip.mc_usd / 1000).toFixed(1)}k` : skip.mc_usd.toFixed(0)}</td>
                            <td className="py-3 text-xs text-yellow-400 max-w-[200px] truncate" title={skip.reason}>{skip.reason}</td>
                            <td className="py-3 text-xs text-muted">{skip.timestamp}</td>
                          </tr>
                        ))}
                        {(!agentData?.recent_skips || agentData.recent_skips.length === 0) && (
                          <tr><td colSpan={4} className="py-8 text-center text-muted text-sm">No skips yet (Learning mode buys everything)</td></tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Runners Table */}
                  {activeTab === "runners" && (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-muted border-b border-white/5">
                          <th className="pb-2 font-medium">Token</th>
                          <th className="pb-2 font-medium">Multiplier</th>
                          <th className="pb-2 font-medium">Caught?</th>
                          <th className="pb-2 font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {agentData?.runners_detected.map((runner, i) => (
                          <tr key={`${runner.mint}-${i}`} className="hover:bg-white/5">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-xs font-bold">
                                  {runner.symbol.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-medium text-sm">{runner.symbol}</span>
                                  <div className="text-[10px] text-muted font-mono">{runner.mint.slice(0, 6)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="text-purple-400 font-bold text-sm">{runner.multiplier.toFixed(1)}x</span>
                            </td>
                            <td className="py-3">
                              {runner.caught ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/20 text-green-400">YES</span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400">MISSED</span>
                              )}
                            </td>
                            <td className="py-3 text-xs text-muted">{runner.timestamp}</td>
                          </tr>
                        ))}
                        {(!agentData?.runners_detected || agentData.runners_detected.length === 0) && (
                          <tr><td colSpan={4} className="py-8 text-center text-muted text-sm">No runners detected yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* AI Status */}
              <div className="p-6 rounded-2xl bg-card/50 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold">Agent Status</h2>
                  <div className={`w-3 h-3 rounded-full ${agentConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Connection</span>
                    <span className={agentConnected ? "text-green-400" : "text-red-400"}>
                      {agentConnected ? "Connected" : "Offline"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Market Mode</span>
                    <span className="text-primary">{agentData?.market_mode ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Win Rate</span>
                    <span className={(agentData?.win_rate ?? 0) >= 0.5 ? "text-green-400" : "text-yellow-400"}>
                      {((agentData?.win_rate ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Positions Open</span>
                    <span className="text-accent">{agentData?.positions_open ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Buys / Sells</span>
                    <span>{agentData?.total_buys ?? 0} / {agentData?.total_sells ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Migrations</span>
                    <span className="text-purple-400">
                      {agentData?.migrations_caught ?? 0}/{agentData?.migrations_total ?? 0}
                    </span>
                  </div>
                </div>
                {/* API endpoint info */}
                <div className="mt-4 p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary text-center font-mono">
                    API: localhost:3001
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="p-6 rounded-2xl bg-card/50 border border-white/5">
                <h2 className="font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                    <svg className="w-6 h-6 mx-auto mb-1 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span className="text-xs">Filters</span>
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                    <svg className="w-6 h-6 mx-auto mb-1 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-xs">Export</span>
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                    <svg className="w-6 h-6 mx-auto mb-1 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs">Deposit</span>
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                    <svg className="w-6 h-6 mx-auto mb-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-xs">Logs</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
