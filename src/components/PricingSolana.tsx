"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Configuration
const SELLER_WALLET = "8UJLeuDZpQSDdJTQry2JrRN3B1hSjrmp7p1K1N7zHyDD";
const EARLY_BIRD_PRICE = 6; // SOL
const NORMAL_PRICE = 8; // SOL
const EARLY_BIRD_LIMIT = 20;

// Solana RPC endpoint (mainnet)
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";

// Features list
const features = [
  "Agent AI autonome pour PumpFun",
  "Détection automatique de tokens",
  "Décisions AI (Buy/Sell/Skip)",
  "Dashboard temps réel",
  "Take-profit & Stop-loss auto",
  "Fonctionne 100% localement",
  "Vos clés restent sur votre PC",
  "Mises à jour à vie",
  "Support Discord privé",
];

export default function PricingSolana() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const [soldCount, setSoldCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [buyerWallet, setBuyerWallet] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "watching" | "success" | "error">("idle");
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [checkCount, setCheckCount] = useState(0);

  // Load sold count from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("buddy_sold_count");
    if (saved) {
      setSoldCount(parseInt(saved, 10));
    }
  }, []);

  const isEarlyBird = soldCount < EARLY_BIRD_LIMIT;
  const currentPrice = isEarlyBird ? EARLY_BIRD_PRICE : NORMAL_PRICE;
  const spotsLeft = Math.max(0, EARLY_BIRD_LIMIT - soldCount);

  // Solana Pay URL for QR code
  const solanaPayUrl = `solana:${SELLER_WALLET}?amount=${currentPrice}&label=Buddy%20AI&message=Buddy%20AI%20Agent%20Purchase`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SELLER_WALLET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Check for payment
  const checkPayment = useCallback(async (walletAddress: string): Promise<boolean> => {
    try {
      const connection = new Connection(SOLANA_RPC, "confirmed");
      const sellerPubkey = new PublicKey(SELLER_WALLET);

      let buyerPubkey: PublicKey;
      try {
        buyerPubkey = new PublicKey(walletAddress.trim());
      } catch {
        return false;
      }

      // Get recent transactions for the seller wallet
      const signatures = await connection.getSignaturesForAddress(sellerPubkey, { limit: 30 });

      // Check each transaction
      for (const sig of signatures) {
        const tx = await connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (!tx || !tx.meta) continue;

        // Check if this transaction is from the buyer
        const accountKeys = tx.transaction.message.accountKeys;
        const isFromBuyer = accountKeys.some(
          (key) => key.pubkey.toString() === buyerPubkey.toString()
        );

        if (!isFromBuyer) continue;

        // Check the amount transferred
        const preBalances = tx.meta.preBalances;
        const postBalances = tx.meta.postBalances;

        // Find seller's index in account keys
        const sellerIndex = accountKeys.findIndex(
          (key) => key.pubkey.toString() === SELLER_WALLET
        );

        if (sellerIndex === -1) continue;

        const amountReceived = (postBalances[sellerIndex] - preBalances[sellerIndex]) / LAMPORTS_PER_SOL;

        // Check if amount matches (with small tolerance for fees)
        if (amountReceived >= currentPrice - 0.01) {
          // Payment found!
          setTxSignature(sig.signature);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Check payment error:", error);
      return false;
    }
  }, [currentPrice]);

  // Auto-watch for payment when wallet is entered
  useEffect(() => {
    if (!buyerWallet.trim() || buyerWallet.length < 32 || verificationStatus === "success") {
      return;
    }

    // Validate wallet format
    try {
      new PublicKey(buyerWallet.trim());
    } catch {
      return;
    }

    setIsWatching(true);
    setVerificationStatus("watching");

    const checkInterval = setInterval(async () => {
      setCheckCount((prev) => prev + 1);
      const found = await checkPayment(buyerWallet);

      if (found) {
        clearInterval(checkInterval);
        setIsWatching(false);
        setVerificationStatus("success");

        // Save purchase
        const newSoldCount = soldCount + 1;
        localStorage.setItem("buddy_sold_count", newSoldCount.toString());
        localStorage.setItem(`buddy_purchased_${buyerWallet}`, "true");
        localStorage.setItem("buddy_verified_wallet", buyerWallet);
        setSoldCount(newSoldCount);
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(checkInterval);
      setIsWatching(false);
    };
  }, [buyerWallet, checkPayment, soldCount, verificationStatus]);

  const goToDownload = () => {
    localStorage.setItem("buddy_verified_wallet", buyerWallet);
    window.location.href = "/download?verified=true&wallet=" + encodeURIComponent(buyerWallet);
  };

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[200px]" />
      </div>

      <div ref={containerRef} className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
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
            Get{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Buddy AI
            </span>{" "}
            Now
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted max-w-2xl mx-auto"
          >
            One-time payment, lifetime access. Pay with Solana.
          </motion.p>
        </div>

        {/* Main pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-b from-primary to-accent rounded-3xl blur-sm opacity-50" />

          <div className="relative p-8 sm:p-12 rounded-3xl bg-card border border-transparent">
            {/* Early bird badge */}
            {isEarlyBird && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/30 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                  </svg>
                  EARLY BIRD - {spotsLeft} spots left!
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mt-4">
              {/* Left: Price and QR */}
              <div className="flex flex-col items-center">
                {/* Price display */}
                <div className="text-center mb-6">
                  {isEarlyBird && (
                    <div className="text-muted line-through text-2xl mb-1">
                      {NORMAL_PRICE} SOL
                    </div>
                  )}
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {currentPrice}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-white">SOL</span>
                      <span className="text-sm text-muted">~${currentPrice * 80} USD</span>
                    </div>
                  </div>
                  <div className="text-green-400 mt-2 font-medium">
                    Lifetime access - one-time payment
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-2xl mb-4">
                  <QRCodeSVG
                    value={solanaPayUrl}
                    size={180}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <p className="text-sm text-muted mb-4">Scan with your Solana wallet</p>

                {/* Wallet address */}
                <div className="w-full">
                  <p className="text-sm text-muted mb-2 text-center">Or send {currentPrice} SOL to:</p>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <code className="flex-1 text-xs sm:text-sm text-primary break-all">
                      {SELLER_WALLET}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="flex-shrink-0 p-2 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-400 text-sm text-center mt-2">Address copied!</p>
                  )}
                </div>

                {/* Progress bar for early bird */}
                {isEarlyBird && (
                  <div className="w-full mt-6">
                    <div className="flex justify-between text-sm text-muted mb-2">
                      <span>{soldCount} sold</span>
                      <span>{EARLY_BIRD_LIMIT} early bird spots</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(soldCount / EARLY_BIRD_LIMIT) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Features + Verification */}
              <div className="flex flex-col">
                <h3 className="text-xl font-bold mb-4">What you get:</h3>
                <ul className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <svg
                        className="w-5 h-5 mt-0.5 flex-shrink-0 text-accent"
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
                    </motion.li>
                  ))}
                </ul>

                {/* Verification section */}
                <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {verificationStatus === "success" ? "Payment Verified!" : "Automatic Verification"}
                  </h4>

                  {verificationStatus !== "success" && (
                    <>
                      <p className="text-sm text-muted mb-3">
                        Enter your wallet address and we'll detect your payment automatically:
                      </p>
                      <input
                        type="text"
                        value={buyerWallet}
                        onChange={(e) => setBuyerWallet(e.target.value)}
                        placeholder="Your Solana wallet address"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none text-sm mb-3"
                      />
                    </>
                  )}

                  {verificationStatus === "success" ? (
                    <button
                      onClick={goToDownload}
                      className="w-full py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Buddy AI
                    </button>
                  ) : verificationStatus === "watching" ? (
                    <div className="w-full py-4 rounded-xl bg-primary/20 border border-primary/30 text-primary font-semibold flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Waiting for payment...</span>
                    </div>
                  ) : (
                    <div className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-muted font-medium flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Enter your wallet to start monitoring
                    </div>
                  )}

                  {/* Status info */}
                  {verificationStatus === "watching" && (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-muted">
                        Checking blockchain... ({checkCount} checks)
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Send exactly <span className="text-primary font-semibold">{currentPrice} SOL</span> to complete purchase
                      </p>
                    </div>
                  )}

                  {txSignature && verificationStatus === "success" && (
                    <a
                      href={`https://solscan.io/tx/${txSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary text-sm mt-3 text-center hover:underline"
                    >
                      View transaction on Solscan →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 grid sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Secure", text: "Direct blockchain payment" },
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Instant", text: "Auto-detection in seconds" },
            { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "Lifetime", text: "Free updates forever" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <span className="font-semibold">{item.title}</span>
              <span className="text-sm text-muted">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
