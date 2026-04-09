"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const testimonials = [
  {
    name: "CryptoChad",
    handle: "@cryptochad_sol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chad&backgroundColor=0d1117",
    content: "Buddy caught a 50x on $BONK2 while I was at the gym. Woke up to 4 SOL in my wallet from a 0.1 SOL trade. This AI is absolutely insane.",
    profit: "+4,900%",
    verified: true,
  },
  {
    name: "SolanaMaxi",
    handle: "@solanamaxidev",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maxi&backgroundColor=0d1117",
    content: "Was losing money manual trading on PumpFun. The rug detection alone saved me from at least 10 rugs this week. Finally trading in profit.",
    profit: "+320%",
    verified: true,
  },
  {
    name: "DegenApe",
    handle: "@degenape_nft",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ape&backgroundColor=0d1117",
    content: "The speed is unreal. By the time I see a new token on PumpFun, Buddy already bought and I'm up 3x. No more missing early entries.",
    profit: "+890%",
    verified: true,
  },
  {
    name: "MemeKing",
    handle: "@memekingsolana",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=king&backgroundColor=0d1117",
    content: "Turned 5 SOL into 45 SOL in 2 weeks. The AI filters actually work - it avoids most rugs and catches the mooners. Worth every penny.",
    profit: "+800%",
    verified: true,
  },
];

const liveStats = [
  { label: "Total Volume Traded", value: "$12.4M", prefix: "" },
  { label: "Tokens Analyzed", value: "2.1M", prefix: "" },
  { label: "Successful Trades", value: "847K", prefix: "" },
  { label: "Avg. ROI", value: "340%", prefix: "+" },
];

function AnimatedNumber({ value, prefix = "" }: { value: string; prefix?: string }) {
  const [display, setDisplay] = useState("0");
  const numMatch = value.match(/[\d.]+/);
  const suffix = value.replace(/[\d.]+/, "");
  const numValue = numMatch ? parseFloat(numMatch[0]) : 0;

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numValue;

      if (numValue >= 100) {
        setDisplay(Math.floor(current).toLocaleString());
      } else {
        setDisplay(current.toFixed(1));
      }

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [numValue]);

  return (
    <span>
      {prefix}{display}{suffix}
    </span>
  );
}

export default function SocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-400">Social Proof</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            Trusted by{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              10,000+
            </span>{" "}
            Degens
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Join the community of traders catching gems on PumpFun every day.
          </motion.p>
        </div>

        {/* Live stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {liveStats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative p-6 rounded-2xl bg-card/30 backdrop-blur border border-white/5 text-center">
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                  {isInView && <AnimatedNumber value={stat.value} prefix={stat.prefix} />}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.handle}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative p-6 lg:p-8 rounded-3xl bg-card/30 backdrop-blur border border-white/5 hover:border-green-500/30 transition-colors duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full bg-card"
                      />
                      {testimonial.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted">{testimonial.handle}</div>
                    </div>
                  </div>

                  {/* Profit badge */}
                  <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="text-sm font-bold text-green-400">{testimonial.profit}</span>
                  </div>
                </div>

                {/* Content */}
                <p className="text-muted leading-relaxed">{testimonial.content}</p>

                {/* Footer */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1 text-muted text-sm">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>234</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>42</span>
                  </div>
                  <div className="flex-1" />
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted mb-6">Featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {["Solana", "DeFi", "CoinDesk", "Decrypt"].map((name) => (
              <div key={name} className="text-xl font-bold text-muted">
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
