"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";
import BuddyLogo from "@/components/BuddyLogo";

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_WALLET_ADDRESS || "BYj4j8om2BrZEKp1NuBC8mzod6bFrD4pLBqgmmnbXStj";
const PROMO_PRICE = 6; // SOL
const NORMAL_PRICE = 8; // SOL
// Date de fin de la promo (72h à partir du lancement)
const PROMO_END_DATE = new Date("2026-04-27T17:00:00Z");

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
  const [step, setStep] = useState<"wallet" | "pay" | "verify" | "success">("wallet");
  const [buyerWallet, setBuyerWallet] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [licenseCode, setLicenseCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [verifyAttempts, setVerifyAttempts] = useState(0);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPromoActive, setIsPromoActive] = useState(true);

  const { user, loading } = useAuth();

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = PROMO_END_DATE.getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsPromoActive(false);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsPromoActive(true);
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentPrice = isPromoActive ? PROMO_PRICE : NORMAL_PRICE;

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

  const validateWallet = () => {
    const wallet = buyerWallet.trim();
    if (!wallet) {
      setError("Please enter your wallet address");
      return;
    }
    // Basic Solana wallet validation (32-44 characters, base58)
    if (wallet.length < 32 || wallet.length > 44) {
      setError("Invalid Solana wallet address");
      return;
    }
    setError("");
    setStep("pay");
  };

  const verifyPayment = async () => {
    if (!buyerWallet.trim()) {
      setError("Wallet address missing");
      return;
    }

    setIsVerifying(true);
    setError("");
    setVerifyAttempts(prev => prev + 1);

    try {
      // Get referral code from state or localStorage
      const refCode = referralCode || localStorage.getItem("buddy_referral");

      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerWallet: buyerWallet.trim(),
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
        setError(data.error || "Payment not found. Make sure you sent the payment and try again.");
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
          <BuddyLogo size={56} trackMouse={true} breathe={false} />
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
        <div className="flex items-center justify-center gap-2 mb-12">
          {["Wallet", "Pay", "Verify", "Done"].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                (step === "wallet" && i === 0) ||
                (step === "pay" && i <= 1) ||
                (step === "verify" && i <= 2) ||
                (step === "success" && i <= 3)
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : "bg-white/10 text-muted"
              }`}>
                {i + 1}
              </div>
              <span className="ml-1 text-xs sm:text-sm hidden sm:inline">{label}</span>
              {i < 3 && <div className="w-4 sm:w-8 h-0.5 bg-white/10 mx-1 sm:mx-2" />}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8"
        >
          {/* Step 1: Enter Wallet */}
          {step === "wallet" && (
            <>
              <h1 className="text-3xl font-black text-center mb-2">Buy Buddy AI Agent</h1>
              <p className="text-muted text-center mb-8">Enter your Solana wallet address to get started</p>

              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                {/* Promo badge */}
                {isPromoActive && (
                  <div className="flex justify-center mb-4">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                      </svg>
                      LAUNCH PROMO
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted">Price</span>
                  <div className="text-right">
                    {isPromoActive && (
                      <span className="text-lg text-muted line-through mr-2">{NORMAL_PRICE} SOL</span>
                    )}
                    <span className="text-3xl font-black text-primary">{currentPrice} SOL</span>
                  </div>
                </div>

                {/* Countdown timer */}
                {isPromoActive && (
                  <div className="mb-4">
                    <p className="text-xs text-muted text-center mb-2">Promo ends in:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: timeLeft.days, label: "Days" },
                        { value: timeLeft.hours, label: "Hours" },
                        { value: timeLeft.minutes, label: "Min" },
                        { value: timeLeft.seconds, label: "Sec" },
                      ].map((item) => (
                        <div key={item.label} className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-lg font-bold text-primary">{item.value.toString().padStart(2, "0")}</div>
                          <div className="text-xs text-muted">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted">One-time payment • Lifetime access • All updates included</div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Solana Wallet Address</label>
                <input
                  type="text"
                  value={buyerWallet}
                  onChange={(e) => setBuyerWallet(e.target.value)}
                  placeholder="Enter your wallet address (e.g., 7xK2...)"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                />
                <p className="text-xs text-muted mt-2">
                  This is the wallet you will use to send the payment
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={validateWallet}
                className="w-full py-4 rounded-xl btn-glow text-white font-semibold"
              >
                Continue
              </button>
            </>
          )}

          {/* Step 2: Pay */}
          {step === "pay" && (
            <>
              <h1 className="text-3xl font-black text-center mb-2">Send Payment</h1>
              <p className="text-muted text-center mb-8">Send {currentPrice} SOL from your wallet</p>

              {/* Your wallet reminder */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
                <p className="text-purple-400 text-sm">
                  <strong>Your wallet:</strong> <span className="font-mono">{buyerWallet.slice(0, 6)}...{buyerWallet.slice(-4)}</span>
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-2xl">
                  <QRCodeSVG
                    value={`solana:${WALLET_ADDRESS}?amount=${currentPrice}`}
                    size={200}
                    level="H"
                  />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="mb-6">
                <label className="block text-sm text-muted mb-2">Send {currentPrice} SOL to:</label>
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
                  <strong>Important:</strong> Send exactly {currentPrice} SOL or more from the wallet you entered. After sending, click the button below.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep("wallet")}
                  className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("verify")}
                  className="flex-1 py-4 rounded-xl btn-glow text-white font-semibold"
                >
                  I&apos;ve Sent the Payment
                </button>
              </div>
            </>
          )}

          {/* Step 3: Verify */}
          {step === "verify" && (
            <>
              <h1 className="text-3xl font-black text-center mb-2">Verify Payment</h1>
              <p className="text-muted text-center mb-8">Click below to verify your payment on the blockchain</p>

              {/* Wallet info */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-muted">Your wallet</span>
                  <span className="font-mono text-sm">{buyerWallet.slice(0, 6)}...{buyerWallet.slice(-4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Amount</span>
                  <span className="font-bold text-primary">{currentPrice} SOL</span>
                </div>
              </div>

              {isVerifying && (
                <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-center gap-3">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Searching for your payment on the blockchain...
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                  {verifyAttempts > 0 && (
                    <p className="mt-2 text-xs">
                      Transaction may take a few seconds to confirm. Wait a moment and try again.
                    </p>
                  )}
                </div>
              )}

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  <strong>Note:</strong> If you just sent the payment, wait 10-30 seconds for it to confirm on the blockchain, then click verify.
                </p>
              </div>

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
                  {isVerifying ? "Verifying..." : "Verify My Payment"}
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
                href="https://github.com/Butoshi/Buddy-App-web3/releases/tag/AIAgent" target="_blank" rel="noopener noreferrer"
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
          Need help? <a href="https://t.me/ButoShi" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent">Contact us on Telegram</a>
        </p>
        </>
        )}
      </div>
    </div>
  );
}
