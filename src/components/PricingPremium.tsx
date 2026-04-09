"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const plans = [
  {
    name: "Monthly",
    description: "Flexible monthly subscription",
    price: { monthly: 49, lifetime: null },
    features: [
      "Unlimited AI trades",
      "Advanced token filters",
      "Auto take-profit & stop-loss",
      "Real-time analytics",
      "Community Discord",
      "Email support",
    ],
    cta: "Subscribe Now",
    popular: false,
  },
  {
    name: "Lifetime",
    description: "One-time payment, forever access",
    price: { monthly: null, lifetime: 299 },
    features: [
      "Everything in Monthly",
      "Lifetime updates included",
      "Priority execution",
      "Private Discord channel",
      "Priority support",
      "No recurring fees",
    ],
    cta: "Buy Now",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and power users",
    price: { monthly: null, lifetime: 999 },
    features: [
      "Everything in Lifetime",
      "Multi-wallet support",
      "Custom filter strategies",
      "API access",
      "Dedicated account manager",
      "1-on-1 onboarding call",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPremium() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[200px]" />
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
          >
            Simple,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto mb-10"
          >
            Choose monthly flexibility or save big with lifetime access. No hidden fees.
          </motion.p>
        </div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className={`relative group ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold shadow-lg shadow-primary/30">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Glow effect for popular */}
              {plan.popular && (
                <div className="absolute -inset-[1px] bg-gradient-to-b from-primary to-accent rounded-3xl blur-sm opacity-50" />
              )}

              <div
                className={`relative h-full p-8 rounded-3xl border transition-all duration-300 ${
                  plan.popular
                    ? "bg-card border-transparent"
                    : "bg-card/30 backdrop-blur border-white/5 hover:border-primary/30"
                }`}
              >
                {/* Plan header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">
                      ${plan.price.lifetime || plan.price.monthly}
                    </span>
                    <span className="text-muted">
                      {plan.price.lifetime ? " one-time" : "/month"}
                    </span>
                  </div>
                  {plan.price.lifetime && (
                    <div className="text-sm text-green-400 mt-1">
                      Lifetime access - no recurring fees
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.popular ? "text-accent" : "text-primary"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "btn-glow text-white"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto text-center"
        >
          {[
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Secure payment" },
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Instant access" },
            { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", text: "Lifetime updates" },
          ].map((item) => (
            <div key={item.text} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <span className="text-muted">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
