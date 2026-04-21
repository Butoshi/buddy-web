"use client";

import Link from "next/link";
import BuddyLogo from "@/components/BuddyLogo";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="flex items-center gap-3">
            <BuddyLogo size={48} trackMouse={false} breathe={false} />
            <span className="text-xl font-black">Buddy</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
        <p className="text-muted mb-12">Last updated: January 2024</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted leading-relaxed">
              By accessing and using Buddy (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service. We reserve the right to modify
              these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted leading-relaxed">
              Buddy is an AI-powered trading agent that operates on the Solana blockchain, specifically for
              trading memecoins on PumpFun. The Service provides automated trading capabilities based on
              user-defined parameters and AI analysis. The Service is provided &quot;as is&quot; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Risk Disclosure</h2>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <p className="text-red-400 font-semibold">Important Risk Warning</p>
            </div>
            <p className="text-muted leading-relaxed mb-4">
              Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors.
              You should carefully consider whether trading is appropriate for you in light of your financial
              condition. The high degree of leverage can work against you as well as for you.
            </p>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li>Past performance is not indicative of future results</li>
              <li>You may lose all or more than your initial investment</li>
              <li>Memecoin trading is highly speculative and volatile</li>
              <li>AI trading systems can make errors and experience failures</li>
              <li>Market conditions can change rapidly and unexpectedly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. User Responsibilities</h2>
            <p className="text-muted leading-relaxed mb-4">As a user of Buddy, you agree to:</p>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to reverse engineer or exploit the Service</li>
              <li>Comply with all applicable laws and regulations in your jurisdiction</li>
              <li>Take full responsibility for your trading decisions and outcomes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Security and Private Keys</h2>
            <p className="text-muted leading-relaxed">
              Buddy operates locally on your machine. Your private keys are encrypted and stored locally -
              they are never transmitted to our servers. You are solely responsible for the security of your
              private keys and wallet. We cannot recover lost keys or reverse unauthorized transactions.
              Always ensure you have proper backups of your wallet credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Subscription and Payments</h2>
            <p className="text-muted leading-relaxed mb-4">
              Buddy offers subscription-based access to the Service:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li>Monthly subscription: $49/month, billed monthly</li>
              <li>Lifetime access: One-time payment of $299</li>
              <li>Payments are processed through secure third-party providers</li>
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Refunds are available within 7 days of purchase if the Service has not been used</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted leading-relaxed">
              To the maximum extent permitted by law, Buddy and its affiliates shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, including but not limited to
              loss of profits, data, or other intangible losses, resulting from your use of or inability to
              use the Service, any trading losses, or any unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
            <p className="text-muted leading-relaxed">
              All content, features, and functionality of the Service, including but not limited to software,
              algorithms, text, graphics, and logos, are the exclusive property of Buddy and are protected by
              international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
            <p className="text-muted leading-relaxed">
              We reserve the right to terminate or suspend your account at any time for any reason, including
              but not limited to violation of these Terms. Upon termination, your right to use the Service
              will immediately cease. You may cancel your subscription at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
            <p className="text-muted leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
              in which Buddy operates, without regard to its conflict of law provisions. Any disputes arising
              from these Terms shall be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-primary mt-2">support@buddy.ai</p>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <Link href="/" className="text-primary hover:text-accent transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
