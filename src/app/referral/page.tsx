"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import NavbarPro from "@/components/NavbarPro";
import FooterPro from "@/components/FooterPro";

export default function ReferralPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReferrers: 0,
    totalPaid: 0,
    thisWeek: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch real-time stats
  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total referrers who earned
        const { count: referrersCount } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .gt('total_sales', 0);

        // Get total paid
        const { data: referralsData } = await supabase
          .from('referrals')
          .select('paid_earnings');

        const totalPaid = referralsData?.reduce((sum, r) => sum + (r.paid_earnings || 0), 0) || 0;

        // Get sales this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { count: weekCount } = await supabase
          .from('referral_sales')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());

        setStats({
          totalReferrers: referrersCount || 0,
          totalPaid: totalPaid,
          thisWeek: weekCount || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavbarPro />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[200px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Referral Program
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              Earn{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                1 SOL
              </span>
              {" "}For Every Sale
            </h1>

            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10">
              Share your unique referral link and earn 1 SOL every time someone purchases Buddy using your link. No limits, no caps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  href="/profile"
                  className="px-8 py-4 rounded-xl btn-glow text-white font-semibold text-lg"
                >
                  Get My Referral Link
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-8 py-4 rounded-xl btn-glow text-white font-semibold text-lg"
                  >
                    Create Account & Start Earning
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 font-semibold text-lg transition-colors"
                  >
                    I Already Have an Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Counter */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-muted">Live Stats</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <span className="text-lg">
                  <span className="font-black text-primary">{loading ? "..." : stats.thisWeek}</span>
                  {" "}people earned SOL this week
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span className="text-lg">
                  Total paid:{" "}
                  <span className="font-black text-accent">{loading ? "..." : stats.totalPaid.toFixed(0)} SOL</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-primary">1 SOL</div>
              <div className="text-sm text-muted mt-1">Per Referral</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-green-400">Unlimited</div>
              <div className="text-sm text-muted mt-1">Earnings</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-accent">Weekly</div>
              <div className="text-sm text-muted mt-1">Payouts</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Account",
                description: "Sign up and choose your unique username. This becomes your referral link.",
              },
              {
                step: "2",
                title: "Share Your Link",
                description: "Share your personalized link (buddy.com/yourname) on Twitter, Discord, Telegram, etc.",
              },
              {
                step: "3",
                title: "Earn SOL",
                description: "When someone buys Buddy using your link, you earn 1 SOL. Paid weekly to your wallet.",
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <span className="text-xl font-black text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-20 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-4">
            Your Personalized Link
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            When you sign up, you choose a username that becomes your unique referral link
          </p>

          <div className="bg-card/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
            <div className="text-sm text-muted mb-2">Your referral link looks like:</div>
            <div className="text-2xl sm:text-3xl font-mono font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              buddy.com/yourname
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {["cryptoking", "trader_pro", "solana_bull", "memecoin_degen"].map((name) => (
                <div key={name} className="px-4 py-2 rounded-full bg-white/5 text-sm text-muted">
                  buddy.com/{name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-4">
            Potential Earnings
          </h2>
          <p className="text-muted text-center mb-12">
            See how much you could earn with referrals
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { referrals: 5, sol: 5, usd: "~$400" },
              { referrals: 20, sol: 20, usd: "~$1,600" },
              { referrals: 100, sol: 100, usd: "~$8,000" },
            ].map((tier) => (
              <div
                key={tier.referrals}
                className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center hover:border-primary/40 transition-colors"
              >
                <div className="text-4xl font-black text-white mb-2">{tier.referrals}</div>
                <div className="text-sm text-muted mb-4">Referrals</div>
                <div className="text-2xl font-bold text-primary">{tier.sol} SOL</div>
                <div className="text-sm text-muted">{tier.usd}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted mt-6">
            *USD estimates based on SOL price. Actual earnings depend on market conditions.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white/[0.02]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "How do I get my referral link?",
                a: "Create an account and choose your username. Your referral link will be buddy.com/yourusername. You can find it anytime in your Profile page."
              },
              {
                q: "When do I get paid?",
                a: "Referral commissions are paid weekly. Make sure to add your Solana wallet address in your Profile to receive payments."
              },
              {
                q: "Is there a limit to how much I can earn?",
                a: "No limits! You can refer as many people as you want and earn 1 SOL for each sale. Top referrers earn 50+ SOL per month."
              },
              {
                q: "How do I track my referrals?",
                a: "Visit your Profile page to see your total referrals, earnings, and pending payments in real-time."
              },
              {
                q: "Do I need to buy Buddy to refer others?",
                a: "No! You can create an account and start referring immediately. You don't need to purchase Buddy to earn referral commissions."
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card/50 border border-white/10">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-muted text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-muted mb-8">
            Create your account now and get your personalized referral link in seconds.
          </p>

          {user ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-glow text-white font-semibold text-lg"
            >
              View My Referral Dashboard
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-glow text-white font-semibold text-lg"
            >
              Create Account & Get My Link
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </section>

      <FooterPro />
    </div>
  );
}
