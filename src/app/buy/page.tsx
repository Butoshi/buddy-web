"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_WALLET_ADDRESS || "8UJLeuDZpQSDdJTQry2JrRN3B1hSjrmp7p1K1N7zHyDD";
const PRICE_SOL = 6;

export default function BuyPage() {
  const [step, setStep] = useState<"pay" | "verify" | "success">("pay");
  const [signature, setSignature] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [licenseCode, setLicenseCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const { user } = useAuth();

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
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signature: signature.trim(),
          userId: user?.id || null,
        }),
      });

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
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-2xl font-black text-white">B</span>
          </div>
          <span className="text-3xl font-black">Buddy</span>
        </Link>

        {/* Progress Steps */}
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
          Need help? <a href="https://discord.gg" className="text-primary hover:text-accent">Join our Discord</a>
        </p>
      </div>
    </div>
  );
}
