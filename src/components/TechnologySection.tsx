"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const technologies = [
  {
    name: "Rust",
    description: "Built with Rust for maximum performance and memory safety. Blazing fast execution.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 106 106" fill="currentColor">
        <path d="M53 0C23.7 0 0 23.7 0 53s23.7 53 53 53 53-23.7 53-53S82.3 0 53 0zm29.5 61.4c-.2 1.2-1.3 2-2.5 1.9l-4.2-.4c-.8 1.7-1.8 3.3-2.9 4.8l2.6 3.3c.7.9.6 2.2-.2 3-.8.8-2.1.9-3 .2l-3.3-2.6c-1.5 1.1-3.1 2.1-4.8 2.9l.4 4.2c.1 1.2-.7 2.3-1.9 2.5-1.2.2-2.4-.5-2.7-1.7l-1-4.1c-1.8.4-3.7.6-5.6.6s-3.8-.2-5.6-.6l-1 4.1c-.3 1.2-1.5 1.9-2.7 1.7-1.2-.2-2-1.3-1.9-2.5l.4-4.2c-1.7-.8-3.3-1.8-4.8-2.9l-3.3 2.6c-.9.7-2.2.6-3-.2-.8-.8-.9-2.1-.2-3l2.6-3.3c-1.1-1.5-2.1-3.1-2.9-4.8l-4.2.4c-1.2.1-2.3-.7-2.5-1.9-.2-1.2.5-2.4 1.7-2.7l4.1-1c-.4-1.8-.6-3.7-.6-5.6s.2-3.8.6-5.6l-4.1-1c-1.2-.3-1.9-1.5-1.7-2.7.2-1.2 1.3-2 2.5-1.9l4.2.4c.8-1.7 1.8-3.3 2.9-4.8l-2.6-3.3c-.7-.9-.6-2.2.2-3 .8-.8 2.1-.9 3-.2l3.3 2.6c1.5-1.1 3.1-2.1 4.8-2.9l-.4-4.2c-.1-1.2.7-2.3 1.9-2.5 1.2-.2 2.4.5 2.7 1.7l1 4.1c1.8-.4 3.7-.6 5.6-.6s3.8.2 5.6.6l1-4.1c.3-1.2 1.5-1.9 2.7-1.7 1.2.2 2 1.3 1.9 2.5l-.4 4.2c1.7.8 3.3 1.8 4.8 2.9l3.3-2.6c.9-.7 2.2-.6 3 .2.8.8.9 2.1.2 3l-2.6 3.3c1.1 1.5 2.1 3.1 2.9 4.8l4.2-.4c1.2-.1 2.3.7 2.5 1.9.2 1.2-.5 2.4-1.7 2.7l-4.1 1c.4 1.8.6 3.7.6 5.6s-.2 3.8-.6 5.6l4.1 1c1.2.3 1.9 1.5 1.7 2.7zM53 35c-9.9 0-18 8.1-18 18s8.1 18 18 18 18-8.1 18-18-8.1-18-18-18z"/>
      </svg>
    ),
    color: "from-orange-500 to-red-500",
  },
  {
    name: "AES-256 Encryption",
    description: "Military-grade encryption for your private keys. Your wallet data is encrypted at rest.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Local Execution",
    description: "Buddy runs 100% on your machine. Your keys never leave your computer - zero cloud dependency.",
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Solana RPC",
    description: "Direct connection to Solana blockchain via premium RPC nodes for fastest execution.",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 397 311" fill="currentColor">
        <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
        <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
        <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" />
      </svg>
    ),
    color: "from-purple-500 to-violet-500",
  },
];

const securityFeatures = [
  { label: "Zero Data Collection", icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" },
  { label: "Open Source Auditable", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "No Cloud Required", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Self-Custody", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
];

export default function TechnologySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[200px]" />
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
            <span className="text-sm font-medium text-green-400">Security & Technology</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            Built for{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Security
            </span>{" "}
            & Speed
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            Enterprise-grade technology stack with security at its core
          </motion.p>
        </div>

        {/* Technology cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="group relative"
            >
              <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 rounded-3xl bg-card/50 border border-white/5 hover:border-white/10 transition-all h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tech.color} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center text-white">
                    {tech.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                <p className="text-sm text-muted">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 rounded-3xl blur-xl" />
          <div className="relative p-8 rounded-3xl bg-card/30 border border-green-500/20 backdrop-blur">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Security Guarantees</h3>
              <p className="text-muted">Your security is our top priority</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
