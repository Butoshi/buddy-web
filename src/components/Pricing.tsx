"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for beginners",
    features: [
      "1 exchange connection",
      "Basic trading strategies",
      "Email support",
      "Dashboard access",
      "Daily performance reports",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "79",
    description: "For serious traders",
    features: [
      "5 exchange connections",
      "Advanced AI strategies",
      "Priority support",
      "Real-time analytics",
      "Custom strategy builder",
      "API access",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "199",
    description: "For professional traders",
    features: [
      "Unlimited exchanges",
      "All Pro features",
      "Dedicated support",
      "Custom integrations",
      "White-label options",
      "SLA guarantee",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-medium mb-3"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            Choose the plan that fits your trading needs. Cancel anytime.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className={`relative rounded-3xl p-8 transition-all ${
                plan.popular
                  ? "border-gradient scale-105"
                  : "glass-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-primary/30">
                  Most Popular
                </div>
              )}

              <div className={`${plan.popular ? "pt-4" : ""}`}>
                <div className="text-lg font-medium mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted">/month</span>
                </div>
                <p className="text-muted text-sm mb-8">{plan.description}</p>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? "bg-primary/20" : "bg-card-border"}`}>
                        <svg
                          className={`w-3 h-3 ${plan.popular ? "text-primary" : "text-muted"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block w-full text-center py-4 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "btn-glow text-white"
                      : "bg-card-border hover:bg-primary/10 text-foreground border border-transparent hover:border-primary/30"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted text-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            7-day free trial on all plans. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
