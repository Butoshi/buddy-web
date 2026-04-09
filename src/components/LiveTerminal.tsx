"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const trades = [
  { pair: "BTC/USDT", action: "BUY", amount: "0.05", price: "67,234.50", profit: "+2.3%" },
  { pair: "ETH/USDT", action: "SELL", amount: "1.2", price: "3,456.78", profit: "+1.8%" },
  { pair: "SOL/USDT", action: "BUY", amount: "15", price: "178.45", profit: "+4.2%" },
  { pair: "BNB/USDT", action: "SELL", amount: "3.5", price: "567.89", profit: "+0.9%" },
  { pair: "XRP/USDT", action: "BUY", amount: "500", price: "0.6234", profit: "+3.1%" },
  { pair: "DOGE/USDT", action: "BUY", amount: "1000", price: "0.1567", profit: "+5.7%" },
  { pair: "ADA/USDT", action: "SELL", amount: "200", price: "0.4523", profit: "+2.1%" },
];

export default function LiveTerminal() {
  const [logs, setLogs] = useState<string[]>([
    "$ buddy init --config=auto",
    "[OK] Configuration loaded",
    "[OK] Connected to Binance API",
    "[OK] AI Model initialized",
    "$ buddy start --strategy=momentum",
    "[LIVE] Scanning markets...",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const trade = trades[Math.floor(Math.random() * trades.length)];
      const timestamp = new Date().toLocaleTimeString();
      const newLog = `[${timestamp}] ${trade.action} ${trade.amount} ${trade.pair.split("/")[0]} @ $${trade.price} | ${trade.profit}`;

      setLogs((prev) => [...prev.slice(-8), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Terminal window */}
      <div className="bg-[#0c0c0c] rounded-2xl border border-card-border overflow-hidden shadow-2xl shadow-accent/10">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-card-border">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted font-mono">buddy@trading ~ </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
            <span className="text-xs text-accent font-mono">LIVE</span>
          </div>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-sm h-64 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {logs.map((log, index) => (
              <motion.div
                key={`${log}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`py-1 ${
                  log.includes("BUY")
                    ? "text-green-400"
                    : log.includes("SELL")
                    ? "text-cyan-400"
                    : log.includes("[OK]")
                    ? "text-accent"
                    : log.includes("$")
                    ? "text-yellow-400"
                    : "text-muted"
                }`}
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
          <span className="inline-block w-2 h-4 bg-accent/80 animate-pulse ml-1"></span>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl -z-10"></div>
    </div>
  );
}
