"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "DegenerateApe",
    role: "Full-time Degen",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "Buddy caught a 50x on a random frog coin while I was sleeping. Woke up to $5K in my wallet. This thing is insane.",
    profit: "+4,800%",
    period: "1 week",
  },
  {
    name: "SolanaMaxi",
    role: "PumpFun Veteran",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "I was manually sniping and always getting rugged. Buddy's filters helped me avoid 90% of rugs. Game changer.",
    profit: "+320%",
    period: "2 weeks",
  },
  {
    name: "CryptoChad",
    role: "Memecoin Hunter",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    content: "The speed is unreal. By the time I see a new token on PumpFun, Buddy already bought it 3 seconds ago. No more missing early entries.",
    profit: "+890%",
    period: "1 month",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-medium mb-3"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Loved by degens worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            Join thousands of traders sniping memecoins with Buddy.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <div className="glass-card card-shine rounded-3xl p-8 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-primary/30"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{testimonial.profit}</div>
                    <div className="text-xs text-muted">{testimonial.period}</div>
                  </div>
                </div>

                <p className="text-muted leading-relaxed flex-1">"{testimonial.content}"</p>

                <div className="flex gap-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
