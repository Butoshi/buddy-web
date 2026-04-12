"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";
import BuddyLogo from "@/components/BuddyLogo";

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_WALLET_ADDRESS || "8UJLeuDZpQSDdJTQry2JrRN3B1hSjrmp7p1K1N7zHyDD";
const PRICE_SOL = 6;

// Component to capture referral code from URL
function ReferralCapture({ onCapture }: { onCapture: (code: string | null) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      localStorage.setItem("buddy_referral", refCode);
      onCapture(refCode);
    } else {
      const storedRef = localStorage.getItem("buddy_referral");
      if (storedRef) {
        onCapture(storedRef);
      }
    }
  }, [searchParams, onCapture]);

  return null;
}

export default function BuyPage() {
  const [step, setStep] = useState<"pay" | "verify" | "success">("pay");
  const [signature, setSignature] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [licenseCode, setLicenseCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const { user, loading } = useAuth();

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(licenseCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const verifyPayment = async () => {
    if (!signature.trim()) {
      setError("Please enter your transaction signature");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Get referral code from state or localStorage
      const refCode = referralCode || localStorage.getItem("buddy_referral");

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: signature.trim(),
          userId: user?.id || null,
          referralCode: refCode,
        }),
      });

      // Clear referral code after successful purchase
      if (response.ok) {
        localStorage.removeItem("buddy_referral");
      }

      const data = await response.json();

      if (data.success) {
        setLicenseCode(data.code);
        setStep("success");
      } else {
        setError(data.error || "Payment verification failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Capture referral code from URL */}
      <Suspense fallback={null}>
        <ReferralCapture onCapture={setReferralCode} />
      </Suspense>

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <BuddyLogo width={38} height={34} />
          </div>
          <span className="text-3xl font-black">Buddy</span>
        </Link>

        {/* Login Required Check */}
        {!loading && !user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black mb-2">Account Required</h1>
            <p className="text-muted mb-6">
              You need to be logged in to purchase Buddy. This allows us to save your license to your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-semibold text-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 py-4 rounded-xl btn-glow text-white font-semibold text-center"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {/* Progress Steps - Only show if logged in */}
        {!loading && user && (
        <>
        <div className="flex items-center justify-center gap-4 mb-12">
          {["Pay", "Verify", "Download"].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                (step === "pay" && i === 0) || (step === "verify" && i <= 1) || (step === "success" && i <= 2)
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : "bg-white/10 text-muted"
              }`}>
                {i + 1}
              </div>
              <span className="ml-2 text-sm hidden sm:inline">{label}</span>
              {i < 2 && <div className="w-8 sm:w-16 h-0.5 bg-white/10 mx-2" />}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
        >
          {/* Step 1: Pay */}
          {step === "pay" && (
            <>
              <h1 className="text-3xl font-black text-center mb-2">Buy Buddy AI Agent</h1>
              <p className="text-muted text-center mb-8">Send SOL to complete your purchase</p>

              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted">Price</span>
                  <span className="text-3xl font-black text-primary">{PRICE_SOL} SOL</span>
                </div>
                <div className="text-sm text-muted">One-time payment • Lifetime access • All updates included</div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl">
                  <QRCodeSVG
                    value={`solana:${WALLET_ADDRESS}?amount=${PRICE_SOL}`}
                    size={200}
                    level="H"
                  />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="mb-6">
                <label className="block text-sm text-muted mb-2">Send {PRICE_SOL} SOL to:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={WALLET_ADDRESS}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-mono"
                  />
                  <button
                    onClick={copyAddress}
                    className="px-4 py-3 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  <strong>Important:</strong> Send exactly {PRICE_SOL} SOL or more. After sending, click the button below and enter your transaction signature.
                </p>
              </div>

              <button
                onClick={() => setStep("verify")}
                className="w-full py-4 rounded-xl btn-glow text-white font-semibold"
              >
                I&apos;ve Sent the Payment
              </button>
            </>
          )}

          {/* Step 2: Verify */}
          {step === "verify" && (
            <>
              <h1 className="text-3xl font-black text-center mb-2">Verify Payment</h1>
              <p className="text-muted text-center mb-8">Enter your transaction signature to receive your license</p>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Transaction Signature</label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Paste your transaction signature here..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                />
                <p className="text-xs text-muted mt-2">
                  Find this in your wallet&apos;s transaction history or on Solscan/Solana Explorer
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("pay")}
                  className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={verifyPayment}
                  disabled={isVerifying}
                  className="flex-1 py-4 rounded-xl btn-glow text-white font-semibold disabled:opacity-50"
                >
                  {isVerifying ? "Verifying..." : "Verify Payment"}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-black mb-2">Payment Confirmed!</h1>
                <p className="text-muted">Thank you for purchasing Buddy AI Agent</p>
              </div>

              {/* License Code */}
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 mb-6">
                <label className="block text-sm text-muted mb-2">Your License Code</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={licenseCode}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 font-mono text-lg font-bold text-center"
                  />
                  <button
                    onClick={copyCode}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {copiedCode ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-muted mt-2 text-center">
                  Save this code! You&apos;ll need it to activate Buddy.
                </p>
              </div>

              {/* Download Button */}
              <a
                href="https://github.com/Butoshi/buddy-releases/releases/latest/download/buddy-windows.zip"
                className="w-full py-4 rounded-xl btn-glow text-white font-semibold flex items-center justify-center gap-2 mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Buddy for Windows
              </a>

              <div className="text-center">
                <Link href="/dashboard" className="text-primary hover:text-accent transition-colors">
                  Go to Dashboard →
                </Link>
              </div>
            </>
          )}
        </motion.div>

        {/* Help */}
        <p className="text-center text-muted mt-8">
          Need help? <a href="#" className="text-primary hover:text-accent">Follow us on Twitter</a>
        </p>
        </>
        )}
      </div>
    </div>
  );
}
