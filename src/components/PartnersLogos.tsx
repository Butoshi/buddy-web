"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const partners = [
  {
    name: "Solana",
    logo: (
      <svg className="h-8" viewBox="0 0 397 311" fill="currentColor">
        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
        <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
      </svg>
    ),
  },
  {
    name: "PumpFun",
    logo: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
          <span className="text-lg">🎰</span>
        </div>
        <span className="text-xl font-bold">pump.fun</span>
      </div>
    ),
  },
  {
    name: "Phantom",
    logo: (
      <div className="flex items-center gap-2">
        <svg className="h-8 w-8" viewBox="0 0 128 128" fill="none">
          <rect width="128" height="128" rx="26.8" fill="url(#phantom-gradient)" />
          <path d="M110.5 64.6c0-1.5-.1-3-.2-4.5-.1-1.5-.3-3-.5-4.4-.2-1.5-.5-2.9-.9-4.3-.4-1.4-.8-2.8-1.3-4.1-.5-1.3-1.1-2.6-1.7-3.9-.6-1.2-1.3-2.4-2.1-3.6-.8-1.1-1.6-2.2-2.5-3.3-.9-1-1.8-2-2.8-3-.5-.5-1.1-1-1.6-1.5-.6-.5-1.1-.9-1.7-1.4-.6-.4-1.2-.9-1.8-1.3-.6-.4-1.2-.8-1.9-1.2-.6-.4-1.3-.7-2-1.1-.7-.3-1.4-.7-2.1-1-.7-.3-1.4-.6-2.2-.8-.7-.3-1.5-.5-2.2-.7-.8-.2-1.5-.4-2.3-.5-.8-.2-1.6-.3-2.4-.4-.8-.1-1.6-.2-2.4-.2-.8-.1-1.6-.1-2.5-.1H58.7c-.8 0-1.7 0-2.5.1-.8 0-1.6.1-2.4.2-.8.1-1.6.2-2.4.4-.8.1-1.5.3-2.3.5-.8.2-1.5.4-2.2.7-.7.2-1.5.5-2.2.8-.7.3-1.4.6-2.1 1-.7.3-1.3.7-2 1.1-.6.4-1.3.8-1.9 1.2-.6.4-1.2.8-1.8 1.3-.6.4-1.2.9-1.7 1.4-.6.5-1.1 1-1.6 1.5-1 1-1.9 2-2.8 3-.9 1-1.7 2.1-2.5 3.3-.8 1.2-1.5 2.4-2.1 3.6-.6 1.3-1.2 2.6-1.7 3.9-.5 1.4-.9 2.8-1.3 4.1-.4 1.4-.7 2.9-.9 4.3-.2 1.5-.4 3-.5 4.4-.1 1.5-.2 3-.2 4.5 0 1.5 0 3 .1 4.5.1 1.5.2 3 .4 4.4.2 1.5.5 2.9.8 4.3.3 1.4.8 2.8 1.2 4.2.5 1.3 1 2.6 1.6 3.9.6 1.2 1.3 2.5 2 3.6.7 1.2 1.5 2.3 2.4 3.3.9 1.1 1.8 2.1 2.7 3 .5.5 1 1 1.5 1.5.5.5 1.1.9 1.6 1.4.6.4 1.1.9 1.7 1.3.6.4 1.2.8 1.8 1.2.6.4 1.3.7 1.9 1.1.7.3 1.3.7 2 1 .7.3 1.4.6 2.1.8.7.3 1.4.5 2.2.7.7.2 1.5.4 2.2.5.8.2 1.5.3 2.3.4.8.1 1.6.2 2.4.2.8.1 1.6.1 2.4.1h13.7c3.4 0 6.8-.3 10-.9 3.3-.6 6.4-1.5 9.4-2.7 3-1.2 5.8-2.7 8.4-4.5 2.6-1.8 5-3.9 7.1-6.2 2.1-2.3 3.9-4.9 5.4-7.6 1.5-2.7 2.7-5.6 3.6-8.6.9-3 1.5-6.1 1.8-9.3.3-3.2.3-6.4 0-9.6z" fill="#fff" />
          <defs>
            <linearGradient id="phantom-gradient" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
              <stop stopColor="#534BB1" />
              <stop offset="1" stopColor="#551BF9" />
            </linearGradient>
          </defs>
        </svg>
        <span className="text-xl font-bold">Phantom</span>
      </div>
    ),
  },
  {
    name: "Raydium",
    logo: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2bfef6] to-[#6049f4] flex items-center justify-center">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <span className="text-xl font-bold">Raydium</span>
      </div>
    ),
  },
  {
    name: "Jupiter",
    logo: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c7f284] to-[#00bef0] flex items-center justify-center">
          <span className="text-black font-bold text-sm">J</span>
        </div>
        <span className="text-xl font-bold">Jupiter</span>
      </div>
    ),
  },
];

export default function PartnersLogos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  return (
    <section ref={containerRef} className="py-16 px-4 sm:px-6 lg:px-8 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm text-muted mb-8"
        >
          Integrated with the best in Solana ecosystem
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-muted/60 hover:text-foreground transition-colors duration-300"
            >
              {partner.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
