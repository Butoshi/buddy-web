"use client";

import Link from "next/link";
import BuddyLogo from "@/components/BuddyLogo";

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
        <p className="text-muted mb-12">Last updated: January 2024</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted leading-relaxed">
              At Buddy, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our AI trading agent service. Please read
              this privacy policy carefully. By using Buddy, you consent to the data practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li>Account registration information (name, email address)</li>
              <li>Payment information (processed by third-party providers)</li>
              <li>Trading preferences and filter settings</li>
              <li>Support communications</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage analytics and performance data</li>
              <li>Log data and error reports</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Information We Do NOT Collect</h3>
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 font-semibold mb-2">Your Security is Our Priority</p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li><strong>Private Keys:</strong> Your wallet private keys are NEVER sent to our servers</li>
                <li><strong>Seed Phrases:</strong> We never have access to your recovery phrases</li>
                <li><strong>Wallet Passwords:</strong> All encryption happens locally on your device</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, updates, and security alerts</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-muted leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your data:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li>AES-256 encryption for sensitive data at rest</li>
              <li>TLS 1.3 encryption for data in transit</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure development practices</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Local Processing</h2>
            <p className="text-muted leading-relaxed">
              Buddy is designed with a privacy-first architecture. The trading agent runs locally on your
              computer, which means:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2 mt-4">
              <li>Your private keys never leave your device</li>
              <li>Trading decisions are made locally</li>
              <li>Wallet interactions happen directly from your machine</li>
              <li>No cloud dependency for core trading functions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Information Sharing</h2>
            <p className="text-muted leading-relaxed mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li><strong>Service Providers:</strong> With third parties who perform services on our behalf (payment processing, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to respond to legal process</li>
              <li><strong>Protection:</strong> To protect the rights, property, or safety of Buddy, our users, or others</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
            <p className="text-muted leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-muted space-y-2">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications</li>
            </ul>
            <p className="text-muted leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@buddy.ai
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking</h2>
            <p className="text-muted leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our Service and hold
              certain information. You can instruct your browser to refuse all cookies or to indicate when
              a cookie is being sent. However, if you do not accept cookies, you may not be able to use
              some portions of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Third-Party Services</h2>
            <p className="text-muted leading-relaxed">
              Our Service may contain links to third-party websites or services. We are not responsible for
              the privacy practices of these third parties. We encourage you to read the privacy policies
              of any third-party services you access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-muted leading-relaxed">
              Our Service is not intended for individuals under the age of 18. We do not knowingly collect
              personal information from children. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
            <p className="text-muted leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage
              you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
            <p className="text-muted leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-muted">Email: <span className="text-primary">privacy@buddy.ai</span></p>
              <p className="text-muted">Support: <span className="text-primary">support@buddy.ai</span></p>
            </div>
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
