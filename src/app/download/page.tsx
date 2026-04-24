"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BuddyLogo from "@/components/BuddyLogo";

const platforms = [
  {
    name: "Windows",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
      </svg>
    ),
    version: "v1.0.0",
    size: "~100 MB",
    requirements: "Windows 10/11 (64-bit)",
    downloadUrl: "https://github.com/Butoshi/Buddy-App-web3/releases/tag/AIAgent",
    fileName: "Buddy-AI-Agent.zip",
  },
];

const features = [
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Instant setup - start in 5 minutes" },
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Runs 100% locally - your keys stay safe" },
  { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", text: "Auto-updates to latest version" },
];

function DownloadContent() {
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const searchParams = useSearchParams();

  // Check if user has purchased
  useEffect(() => {
    setIsLoading(true);

    // Check URL params
    const verified = searchParams.get("verified");
    const wallet = searchParams.get("wallet");

    if (verified === "true") {
      if (wallet) {
        setWalletAddress(wallet);
        setHasPurchased(true);
      } else {
        // Check localStorage for verified wallet
        const savedWallet = localStorage.getItem("buddy_verified_wallet");
        if (savedWallet) {
          setWalletAddress(savedWallet);
          setHasPurchased(true);
        }
      }
    } else {
      // Check if any wallet was verified before
      const savedWallet = localStorage.getItem("buddy_verified_wallet");
      if (savedWallet) {
        const purchased = localStorage.getItem(`buddy_purchased_${savedWallet}`);
        if (purchased === "true") {
          setWalletAddress(savedWallet);
          setHasPurchased(true);
        }
      }
    }

    setIsLoading(false);
  }, [searchParams]);

  // Detect platform
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.includes("win")) {
        setSelectedPlatform(0);
      } else if (userAgent.includes("mac")) {
        setSelectedPlatform(1);
      } else if (userAgent.includes("linux")) {
        setSelectedPlatform(2);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[200px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {hasPurchased ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium text-green-400">Payment Verified - Download Available</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-yellow-400">Purchase Required</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              Download{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Buddy
              </span>
            </h1>

            <p className="text-xl text-muted max-w-2xl mx-auto">
              {hasPurchased
                ? "Thank you for your purchase! Download Buddy for your platform below."
                : "Get Buddy AI trading agent for your platform. Purchase required to download."
              }
            </p>

            {hasPurchased && walletAddress && (
              <p className="text-sm text-muted mt-4">
                Verified wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Not purchased - Show CTA */}
      {!hasPurchased && (
        <section className="py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center"
          >
            <div className="p-8 rounded-3xl bg-card/50 border border-white/10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-4">Purchase Required</h2>
              <p className="text-muted mb-6">
                Complete your purchase and verify your payment to access downloads.
              </p>

              <Link
                href="/#pricing"
                className="inline-block px-8 py-4 rounded-xl btn-glow text-white font-semibold"
              >
                Buy Buddy Now
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Platform selection - Only show if purchased */}
      {hasPurchased && (
        <>
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {platforms.map((platform, index) => (
                  <motion.button
                    key={platform.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setSelectedPlatform(index)}
                    className={`p-6 rounded-2xl border text-center transition-all ${
                      selectedPlatform === index
                        ? "bg-primary/10 border-primary/50"
                        : "bg-card/50 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className={`mx-auto mb-4 ${selectedPlatform === index ? "text-primary" : "text-muted"}`}>
                      {platform.icon}
                    </div>
                    <h3 className="font-bold text-lg">{platform.name}</h3>
                    <p className="text-sm text-muted">{platform.version}</p>
                  </motion.button>
                ))}
              </div>

              {/* Download card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-8 rounded-3xl bg-card/50 border border-white/10"
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      Buddy for {platforms[selectedPlatform].name}
                    </h2>
                    <p className="text-muted mb-4">{platforms[selectedPlatform].requirements}</p>
                    <div className="flex gap-4 text-sm text-muted mb-6">
                      <span>Version: {platforms[selectedPlatform].version}</span>
                      <span>•</span>
                      <span>Size: {platforms[selectedPlatform].size}</span>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                            </svg>
                          </div>
                          <span className="text-sm">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <a
                      href={platforms[selectedPlatform].downloadUrl}
                      className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl btn-glow text-white font-bold text-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download for {platforms[selectedPlatform].name}
                    </a>
                    <p className="text-xs text-muted mt-4">
                      {platforms[selectedPlatform].fileName}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Installation steps */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Installation is{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Simple
                </span>
              </h2>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { num: "1", title: "Download", desc: "Get the installer for your platform" },
                  { num: "2", title: "Install", desc: "Run the installer and follow prompts" },
                  { num: "3", title: "Configure", desc: "Add your wallet and set parameters" },
                  { num: "4", title: "Trade", desc: "Start the agent and watch it trade" },
                ].map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {step.num}
                    </div>
                    <h3 className="font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Help section */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted mb-4">Need help?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#" className="text-primary hover:text-accent transition-colors">
              Read Documentation
            </Link>
            <span className="text-muted">•</span>
            <Link href="#" className="text-primary hover:text-accent transition-colors">
              Watch Tutorial
            </Link>
            <span className="text-muted">•</span>
            <Link href="#" className="text-primary hover:text-accent transition-colors">
              Follow on Twitter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BuddyLogo size={48} trackMouse={true} breathe={false} />
            <span className="text-xl font-black">Buddy</span>
          </Link>
          <Link href="/#pricing" className="text-sm text-muted hover:text-white transition-colors">
            Back to Pricing
          </Link>
        </div>
      </header>

      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      }>
        <DownloadContent />
      </Suspense>
    </div>
  );
}
