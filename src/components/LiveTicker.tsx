"use client";

import { motion } from "framer-motion";

const trades = [
  { token: "PEPE2.0", action: "BUY", amount: "0.5 SOL", gain: "+127%", time: "2s ago" },
  { token: "BONK", action: "SELL", amount: "1.2 SOL", gain: "+89%", time: "15s ago" },
  { token: "WIF", action: "BUY", amount: "0.8 SOL", gain: "+234%", time: "32s ago" },
  { token: "MYRO", action: "SELL", amount: "2.1 SOL", gain: "+156%", time: "1m ago" },
  { token: "POPCAT", action: "BUY", amount: "0.3 SOL", gain: "+67%", time: "2m ago" },
  { token: "SLERF", action: "SELL", amount: "1.5 SOL", gain: "+312%", time: "3m ago" },
  { token: "BOME", action: "BUY", amount: "0.7 SOL", gain: "+98%", time: "4m ago" },
  { token: "MEW", action: "SELL", amount: "1.8 SOL", gain: "+445%", time: "5m ago" },
];

export default function LiveTicker() {
  const duplicatedTrades = [...trades, ...trades, ...trades];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="relative overflow-hidden py-2">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: [0, -1920] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedTrades.map((trade, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-1 rounded-full bg-white/5 border border-white/10"
            >
              <span className="font-mono font-bold text-sm">{trade.token}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  trade.action === "BUY"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {trade.action}
              </span>
              <span className="text-xs text-muted">{trade.amount}</span>
              <span className="text-xs font-semibold text-green-400">{trade.gain}</span>
              <span className="text-xs text-muted/50">{trade.time}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
