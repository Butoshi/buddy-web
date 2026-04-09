"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "Is my wallet safe?",
    answer: "Yes. Buddy runs 100% on your computer. Your private keys never leave your machine and are never sent to any server.",
  },
  {
    question: "How does payment work?",
    answer: "You pay once in SOL (Solana) and get lifetime access. No subscriptions, no hidden fees. After payment, you can download and use Buddy forever.",
  },
  {
    question: "What do I need to run Buddy?",
    answer: "A computer (Windows, Mac, or Linux), a Solana wallet with some SOL for trading, and an internet connection. That's it!",
  },
  {
    question: "Can I get a refund?",
    answer: "Due to the digital nature of the product, we don't offer refunds. However, you can try the dashboard demo before buying to see how it works.",
  },
];

export default function FAQShort() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={containerRef} className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Quick{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FAQ
            </span>
          </h2>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold pr-4">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-muted mt-3 pt-3 border-t border-white/10"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* More questions link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link
            href="/features#faq"
            className="text-primary hover:text-accent transition-colors"
          >
            More questions? See full FAQ →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
