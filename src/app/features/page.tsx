"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import FooterPro from "@/components/FooterPro";
import BuddyLogo from "@/components/BuddyLogo";

// Real Buddy decision hierarchy
const decisionHierarchy = [
  {
    level: "Priority Level 0",
    title: "Elite Wallet Detection",
    description: "Buddy tracks a curated list of wallets that consistently make profitable trades. When an elite wallet buys a token, Buddy automatically follows - bypassing all other filters.",
    confidence: "95%",
    color: "from-yellow-500 to-orange-500",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  {
    level: "Priority Level 1",
    title: "Coordinated Buying",
    description: "When 3+ whale wallets buy the same token within a 3-second window, it signals coordinated accumulation. Buddy detects this pattern and enters immediately.",
    confidence: "90%",
    color: "from-purple-500 to-pink-500",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    level: "Priority Level 2",
    title: "Consecutive Whale Buys",
    description: "Two or more whale transactions in a row indicate strong buying pressure. Buddy recognizes this momentum pattern and acts before retail catches on.",
    confidence: "85%",
    color: "from-blue-500 to-cyan-500",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  },
  {
    level: "Standard Analysis",
    title: "Strict Filters + AI",
    description: "For tokens without priority signals, Buddy applies strict filters (MC, transactions, traders, buy ratio, velocity) combined with AI prediction requiring 80%+ confidence.",
    confidence: "70-80%",
    color: "from-green-500 to-emerald-500",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
];

// Real AI features from the code
const aiFeatures = [
  {
    name: "txn",
    label: "Transaction Count",
    description: "Total number of transactions on the token. Higher = more activity and interest.",
  },
  {
    name: "traders",
    label: "Unique Traders",
    description: "Number of unique wallets that have traded. Filters out wash trading.",
  },
  {
    name: "buy_ratio",
    label: "Buy Ratio",
    description: "Percentage of transactions that are buys vs sells. Buddy requires 80%+ buy pressure.",
  },
  {
    name: "mc",
    label: "Market Cap",
    description: "Current market cap in SOL. Buddy targets specific MC ranges for optimal entry.",
  },
  {
    name: "velocity",
    label: "Velocity",
    description: "Rate of market cap growth per second. Measures momentum and hype.",
  },
  {
    name: "whale_count",
    label: "Whale Count",
    description: "Number of large transactions (5+ SOL). Whale activity often predicts pumps.",
  },
];

// Real filter thresholds from config
const strictFilters = [
  { filter: "Market Cap", condition: "< $15,000", reason: "Entry before mainstream attention" },
  { filter: "Transactions", condition: "> 30", reason: "Enough activity to validate interest" },
  { filter: "Unique Traders", condition: "> 20", reason: "Real distribution, not wash trading" },
  { filter: "Buy Ratio", condition: "> 80%", reason: "Strong buying pressure" },
  { filter: "Velocity", condition: "> 10 txn/min", reason: "Active momentum" },
];

// Real exit strategies from predator_engine.rs
const exitStrategies = [
  {
    type: "Stop Loss",
    trigger: "Price drops below entry - 15%",
    action: "Sell 100% immediately",
    urgency: "IMMEDIATE",
    color: "text-red-400",
  },
  {
    type: "Take Profit",
    trigger: "Price reaches 2x entry",
    action: "Sell 50% to lock gains",
    urgency: "HIGH",
    color: "text-green-400",
  },
  {
    type: "Trailing Stop",
    trigger: "30% drop from peak (after 1.5x)",
    action: "Sell 100% to protect profits",
    urgency: "HIGH",
    color: "text-yellow-400",
  },
  {
    type: "Timeout",
    trigger: "Position held > 15 minutes",
    action: "Sell 100% regardless of P/L",
    urgency: "NORMAL",
    color: "text-blue-400",
  },
];

// Performance comparison
const performanceComparison = [
  { metric: "WebSocket Latency", python: "50-100ms", buddy: "1-5ms" },
  { metric: "Transaction Send", python: "100-200ms", buddy: "10-30ms" },
  { metric: "Memory Usage", python: "~500MB", buddy: "~50MB" },
  { metric: "Total Latency", python: "~300ms", buddy: "~30ms" },
];

const faqs = [
  {
    q: "What are Elite Wallets?",
    a: "Elite wallets are addresses that Buddy has identified as consistently profitable traders. When these wallets buy a token, Buddy automatically follows because historically, these wallets have a high success rate. You can also add your own trusted wallets to track.",
  },
  {
    q: "How does the AI model work?",
    a: "Buddy uses XGBoost models trained on historical PumpFun data, then converted to ONNX format for fast inference. The model analyzes 6 key features (transactions, traders, buy ratio, market cap, velocity, whale count) to predict whether a token will pump.",
  },
  {
    q: "Why Rust instead of Python?",
    a: "Speed. Python bots have ~300ms latency. Buddy in Rust achieves ~30ms - that's 10x faster. In memecoin trading, milliseconds matter. Rust also uses less memory and never crashes from garbage collection pauses.",
  },
  {
    q: "What's the 80% AI confidence threshold?",
    a: "Buddy only executes AI-based trades when the model is 80%+ confident. This filters out marginal signals and ensures Buddy only acts on high-conviction opportunities. You can adjust this threshold in the config.",
  },
  {
    q: "How does Trailing Stop work?",
    a: "Once a position reaches 1.5x profit, Buddy activates trailing stop. If the price drops 30% from its peak, Buddy sells everything to protect your gains. This lets winners run while locking in profits.",
  },
  {
    q: "Can I customize the filters?",
    a: "Yes! All thresholds are configurable: min/max market cap, transaction count, trader count, buy ratio, velocity, AI confidence, stop loss %, take profit multiplier, and timeout duration.",
  },
  {
    q: "Is my private key safe?",
    a: "Your private key is stored in a local .env file on YOUR computer. Buddy runs 100% locally - no cloud servers, no data transmission. We never see your keys or trades.",
  },
  {
    q: "What's Simulation Mode?",
    a: "Buddy has a simulation mode where it connects to real PumpFun data and makes real decisions, but doesn't execute actual trades. Perfect for testing your configuration before going live.",
  },
];

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function FeaturesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
              <BuddyLogo width={34} height={30} />
            </div>
            <span className="text-xl font-black">Buddy</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted hover:text-white transition-colors">
              ← Back to Home
            </Link>
            <Link
              href="/#pricing"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold"
            >
              Use Buddy
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Technical Documentation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              How{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Buddy
              </span>
              {" "}Actually Works
            </h1>

            <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
              A deep dive into Buddy&apos;s decision engine, AI models, and the real code that powers
              autonomous memecoin trading on PumpFun.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-white/10 text-sm">
              <span className="text-muted">Built with</span>
              <span className="font-bold text-orange-400">Rust</span>
              <span className="text-muted">+</span>
              <span className="font-bold text-green-400">ONNX</span>
              <span className="text-muted">+</span>
              <span className="font-bold text-purple-400">XGBoost</span>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4">
        {/* Section 0: What is Buddy */}
        <Section className="py-16">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black mb-6 text-center">
                What is{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Buddy
                </span>
                ?
              </h2>

              <div className="max-w-3xl mx-auto space-y-6 text-lg">
                <p className="text-muted leading-relaxed">
                  <span className="text-foreground font-semibold">Buddy is a fully autonomous AI trading agent</span> designed
                  specifically for PumpFun memecoins. Unlike traditional bots that follow static rules, Buddy thinks, learns,
                  and adapts on its own.
                </p>

                <p className="text-muted leading-relaxed">
                  Once you start Buddy, it works <span className="text-foreground font-semibold">completely independently</span> —
                  monitoring new token launches 24/7, analyzing each opportunity in real-time, making buy/sell decisions,
                  and managing your positions. You don&apos;t need to watch charts or make decisions. Buddy does it all.
                </p>

                <p className="text-muted leading-relaxed">
                  The magic is in its <span className="text-accent font-semibold">adaptive intelligence</span>. Buddy&apos;s
                  filters and thresholds aren&apos;t static — they evolve with the market. When the market is hot, Buddy
                  adjusts its strategy. When it cools down, Buddy adapts. Winning patterns get reinforced, losing ones
                  get abandoned. This <span className="text-foreground font-semibold">self-evolving behavior</span> is what
                  makes Buddy a true AI agent — not a simple bot with fixed rules.
                </p>

                <div className="pt-6 grid sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-card/50 border border-white/5 text-center">
                    <div className="text-2xl font-black text-primary mb-1">Autonomous</div>
                    <div className="text-sm text-muted">Zero manual intervention</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-card/50 border border-white/5 text-center">
                    <div className="text-2xl font-black text-accent mb-1">Adaptive</div>
                    <div className="text-sm text-muted">Learns from every trade</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-card/50 border border-white/5 text-center">
                    <div className="text-2xl font-black text-purple-400 mb-1">Evolutive</div>
                    <div className="text-sm text-muted">Gets smarter over time</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-card/50 border border-white/5 text-center">
                    <div className="text-2xl font-black text-green-400 mb-1">24/7</div>
                    <div className="text-sm text-muted">Never sleeps, never misses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 1: Decision Hierarchy */}
        <Section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
              <span className="text-sm font-medium text-yellow-400">Buddy Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              The Buddy Engine
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Buddy Engine is the brain behind every decision. A priority-based system where
              higher signals bypass lower filters — because when an elite wallet buys, you don&apos;t wait.
            </p>
          </div>

          <div className="space-y-4">
            {decisionHierarchy.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${level.color}`} />
                <div className="ml-6 p-6 rounded-2xl bg-card/50 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={level.icon} />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-muted mb-1">{level.level}</div>
                        <h3 className="font-bold text-lg">{level.title}</h3>
                      </div>
                    </div>
                    <p className="text-muted text-sm flex-1">{level.description}</p>
                    <div className="flex-shrink-0 text-center">
                      <div className={`text-2xl font-black bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                        {level.confidence}
                      </div>
                      <div className="text-xs text-muted">confidence</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Section 2: AI Features */}
        <Section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <span className="text-sm font-medium text-purple-400">AI Model</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              The 6 Features Buddy Analyzes
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Every token is evaluated on these exact metrics. The XGBoost model was trained on
              millions of PumpFun trades to learn which combinations predict success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-5 rounded-2xl bg-card/50 border border-white/5 hover:border-purple-500/30 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <code className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-sm font-mono">
                    {feature.name}
                  </code>
                </div>
                <h3 className="font-semibold mb-2">{feature.label}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Model flow */}
          <div className="mt-12 p-6 rounded-2xl bg-card/30 border border-white/5">
            <h3 className="font-bold text-center mb-6">Model Pipeline</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                PumpFun Data
              </div>
              <span className="text-muted">→</span>
              <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                XGBoost Training
              </div>
              <span className="text-muted">→</span>
              <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                ONNX Export
              </div>
              <span className="text-muted">→</span>
              <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                Rust Inference
              </div>
            </div>
          </div>
        </Section>

        {/* Section 3: Strict Filters */}
        <Section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <span className="text-sm font-medium text-blue-400">Adaptive Filters</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Market-Adaptive Thresholds
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              These values adapt to market conditions in real-time. During high volatility, Buddy tightens filters.
              In calmer markets, it loosens them. The thresholds below are starting points —
              Buddy continuously optimizes based on what&apos;s actually working <span className="text-foreground font-medium">right now</span>.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-semibold">Filter</th>
                  <th className="text-left py-4 px-4 font-semibold">Condition</th>
                  <th className="text-left py-4 px-4 font-semibold text-muted">Why</th>
                </tr>
              </thead>
              <tbody>
                {strictFilters.map((row, i) => (
                  <tr key={row.filter} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                    <td className="py-4 px-4 font-medium">{row.filter}</td>
                    <td className="py-4 px-4">
                      <code className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm">
                        {row.condition}
                      </code>
                    </td>
                    <td className="py-4 px-4 text-muted text-sm">{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Adaptive note */}
          <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-muted">
              <span className="text-blue-400 font-medium">These values auto-adjust.</span> Buddy tracks the success rate of each filter combination.
              If market conditions change (bull run, bear market, PumpFun meta shifts), Buddy automatically recalibrates to stay profitable.
            </p>
          </div>
        </Section>

        {/* Section 4: Exit Strategies */}
        <Section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <span className="text-sm font-medium text-red-400">Risk Management</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Automatic Exit Strategies
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Buddy doesn&apos;t just buy — it knows when to sell. Four exit strategies protect your capital
              and lock in profits automatically.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {exitStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-card/50 border border-white/5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold text-lg ${strategy.color}`}>{strategy.type}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    strategy.urgency === "IMMEDIATE" ? "bg-red-500/20 text-red-400" :
                    strategy.urgency === "HIGH" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {strategy.urgency}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted">Trigger:</span>
                    <span>{strategy.trigger}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted">Action:</span>
                    <span className="font-medium">{strategy.action}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Section 5: Performance */}
        <Section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
              <span className="text-sm font-medium text-orange-400">Performance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Why Rust? 10x Faster.
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Speed matters in memecoin trading. Buddy&apos;s Rust implementation delivers
              sub-50ms execution while Python bots struggle at 300ms+.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/30 border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-semibold">Metric</th>
                  <th className="text-center py-4 px-4 font-semibold text-muted">Python Bots</th>
                  <th className="text-center py-4 px-4 font-semibold text-orange-400">Buddy (Rust)</th>
                </tr>
              </thead>
              <tbody>
                {performanceComparison.map((row, i) => (
                  <tr key={row.metric} className={i % 2 === 0 ? "bg-white/[0.02]" : ""}>
                    <td className="py-4 px-4">{row.metric}</td>
                    <td className="py-4 px-4 text-center text-muted">{row.python}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 font-semibold">
                        {row.buddy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card/50 border border-white/5 text-center">
              <div className="text-3xl font-black text-orange-400 mb-2">Tokio</div>
              <div className="text-sm text-muted">Async runtime for concurrent operations</div>
            </div>
            <div className="p-5 rounded-2xl bg-card/50 border border-white/5 text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">Jito</div>
              <div className="text-sm text-muted">MEV protection + faster transaction landing</div>
            </div>
            <div className="p-5 rounded-2xl bg-card/50 border border-white/5 text-center">
              <div className="text-3xl font-black text-green-400 mb-2">Zero GC</div>
              <div className="text-sm text-muted">No garbage collection pauses or crashes</div>
            </div>
          </div>
        </Section>

        {/* Section 6: Security */}
        <Section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <span className="text-sm font-medium text-green-400">Security</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              100% Local Execution
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Buddy runs entirely on your machine. No cloud servers, no data collection,
              no third-party access to your keys or trades.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Local Only", desc: "Runs on your PC" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Keys Stay Local", desc: "Stored in .env file" },
              { icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636", title: "No Telemetry", desc: "Zero data collection" },
              { icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0", title: "Offline Mode", desc: "Works without cloud" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-2xl bg-green-500/5 border border-green-500/10 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Section 7: FAQ */}
        <Section className="py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-medium text-primary">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Technical Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl bg-card/50 border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-muted transition-transform flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-muted">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Final CTA */}
        <Section className="py-16">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <div className="relative p-12 rounded-3xl bg-card border border-white/10 text-center">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Ready to Trade Smarter?
              </h2>
              <p className="text-muted mb-8 max-w-xl mx-auto">
                Get Buddy now and let AI handle your PumpFun trading. Early bird pricing won&apos;t last forever.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/#pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg"
                >
                  Use Buddy
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/"
                  className="text-muted hover:text-white transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <FooterPro />
    </div>
  );
}
