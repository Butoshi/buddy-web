"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";


const stats = [
  { value: "30ms", label: "Execution Speed", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { value: "94%", label: "Rug Detection", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { value: "6", label: "AI Features", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { value: "100%", label: "Local & Secure", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
];

function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState("0");
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * numericValue);
      setDisplayValue(current.toLocaleString() + suffix);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [numericValue, suffix, duration]);

  return <span>{displayValue}</span>;
}

export default function HeroRevamped() {
  return (
    <section className="relative pt-8 pb-0 overflow-hidden">
      {/* Layered background effects */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />

        {/* Animated aurora */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 60% at 30% 25%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 60% at 70% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(ellipse 80% 60% at 50% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Grid with perspective */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "top",
            maskImage: "linear-gradient(to bottom, white 20%, transparent 80%)",
          }}
        />

        {/* Floating particles - fixed positions to avoid hydration mismatch */}
        {[
          { left: 5, top: 10, dur: 3.5, del: 0.2 },
          { left: 15, top: 30, dur: 4.2, del: 1.1 },
          { left: 25, top: 20, dur: 3.8, del: 0.5 },
          { left: 35, top: 45, dur: 4.5, del: 1.8 },
          { left: 45, top: 15, dur: 3.2, del: 0.8 },
          { left: 55, top: 35, dur: 4.0, del: 1.5 },
          { left: 65, top: 25, dur: 3.6, del: 0.3 },
          { left: 75, top: 50, dur: 4.3, del: 1.2 },
          { left: 85, top: 18, dur: 3.9, del: 0.7 },
          { left: 95, top: 40, dur: 4.1, del: 1.9 },
          { left: 10, top: 60, dur: 3.4, del: 0.4 },
          { left: 20, top: 75, dur: 4.4, del: 1.6 },
          { left: 30, top: 65, dur: 3.7, del: 0.9 },
          { left: 40, top: 80, dur: 4.2, del: 1.3 },
          { left: 50, top: 70, dur: 3.3, del: 0.6 },
          { left: 60, top: 85, dur: 4.0, del: 1.7 },
          { left: 70, top: 72, dur: 3.8, del: 0.1 },
          { left: 80, top: 90, dur: 4.5, del: 1.4 },
          { left: 90, top: 78, dur: 3.5, del: 1.0 },
          { left: 98, top: 68, dur: 4.1, del: 0.0 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.del,
            }}
          />
        ))}

        {/* Glowing orbs */}
        <motion.div
          className="absolute top-20 left-[15%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 right-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main content */}
          <div className="text-center pt-8 lg:pt-12 pb-12">
            {/* Announcement badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-30 group-hover:opacity-50 transition" />
                <div className="relative flex items-center gap-3 px-5 py-2.5 rounded-full bg-background/80 border border-primary/30 backdrop-blur-xl">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                  </span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    AI Agent for PumpFun
                  </span>
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Main headline with 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-2">
                <span className="text-foreground/80">Meet</span>
              </h1>
              <div className="relative inline-block">
                {/* Glow behind text */}
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary/30 to-accent/30 scale-150" />
                <h1 className="relative text-7xl sm:text-8xl lg:text-[10rem] font-black tracking-tighter">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-[gradient-shift_4s_ease_infinite]">
                    Buddy
                  </span>
                </h1>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl lg:text-3xl text-muted max-w-3xl mx-auto mb-4 mt-4"
            >
              Your{" "}
              <span className="text-foreground font-semibold">AI Trading Agent</span>{" "}
              for{" "}
              <span className="text-accent font-semibold">PumpFun</span>{" "}
              Memecoins
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted/80 max-w-2xl mx-auto mb-10"
            >
              Buddy analyzes tokens and buys at optimal market caps based on AI training.
              Smart decisions, 24/7 monitoring, automated trading.{" "}
              <span className="text-accent font-medium">Your keys. Your gains.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Link href="#pricing" className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300" />
                <div className="relative btn-glow text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3">
                  Use Buddy
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>
                </div>
              </Link>

              <Link
                href="#demo"
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                Watch Demo
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative p-4 lg:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                    <div className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-xs lg:text-sm text-muted mt-1">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
