"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const platforms = [
  {
    name: "Windows",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
      </svg>
    ),
    version: "v2.4.1",
    size: "84 MB",
    requirements: "Windows 10/11 (64-bit)",
    downloadUrl: "https://github.com/your-repo/buddy-agent/releases/latest/download/buddy-windows.exe",
    fileName: "buddy-windows.exe",
  },
  {
    name: "macOS",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    version: "v2.4.1",
    size: "92 MB",
    requirements: "macOS 12+ (Intel & Apple Silicon)",
    downloadUrl: "https://github.com/your-repo/buddy-agent/releases/latest/download/buddy-macos.dmg",
    fileName: "buddy-macos.dmg",
  },
  {
    name: "Linux",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.002c-.06-.135-.12-.2-.184-.268-.257-.135-.544-.268-.837-.335-.092-.003-.17.016-.255.064-.166.135-.266.467-.166.8.1.067.146.134.186.268.04.132.065.2.065.267.028.2.02.4 0 .535v.004c-.046.329-.222.635-.469.87-.263.268-.615.468-1.033.535-.418.068-.869 0-1.249-.2-.196-.134-.36-.333-.535-.602-.053-.2-.07-.468-.106-.736-.006-.063-.015-.128-.017-.19-.043-.134-.143-.2-.267-.334-.393-.268-.707-.668-.963-1.071-.256-.268-.494-.6-.685-.867-.192-.135-.358-.332-.521-.465a2.626 2.626 0 01-.4-.6c-.066-.2-.1-.4-.066-.6.032-.134.068-.267.135-.4.068-.133.158-.266.27-.332.226-.135.47-.2.725-.2.167 0 .333.033.494.067h.003v-.002a2.24 2.24 0 00-.068-.468c-.135-.467-.334-.866-.535-1.2-.198-.335-.33-.535-.39-.668-.067-.133-.068-.2.058-.267.127-.068.287.004.42.067.133.068.26.2.387.334.254.27.544.6.803 1.006.212.335.379.668.479 1.004.134.066.267.135.383.2.01-.067.012-.135.019-.2.002-.135-.013-.266.019-.467l.003-.002c.088-.4.26-.733.504-1.002.245-.266.568-.468.93-.534.357-.066.735 0 1.067.2.33.2.591.468.795.8.202.334.347.734.44 1.134.093.4.127.8.127 1.2 0 .4-.034.8-.127 1.134-.093.333-.23.667-.415 1.003z" />
      </svg>
    ),
    version: "v2.4.1",
    size: "78 MB",
    requirements: "Ubuntu 20.04+, Debian 11+, Fedora 35+",
    downloadUrl: "https://github.com/your-repo/buddy-agent/releases/latest/download/buddy-linux.AppImage",
    fileName: "buddy-linux.AppImage",
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xl font-black text-white">B</span>
            </div>
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
