"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BuddyLogo from "@/components/BuddyLogo";

interface LicenseData {
  code: string;
  used_at: string;
  transaction_signature: string;
  wallet_address: string;
}

interface ReferralData {
  id: string;
  referral_code: string;
  wallet_address: string | null;
  total_earnings: number;
  paid_earnings: number;
  total_sales: number;
}

interface ReferralSale {
  id: string;
  buyer_email: string;
  commission_amount: number;
  status: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [loadingLicense, setLoadingLicense] = useState(true);
  const [copiedLicense, setCopiedLicense] = useState(false);
  const [copiedTelegram, setCopiedTelegram] = useState(false);

  // Referral state
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [referralSales, setReferralSales] = useState<ReferralSale[]>([]);
  const [loadingReferral, setLoadingReferral] = useState(true);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [walletInput, setWalletInput] = useState("");
  const [savingWallet, setSavingWallet] = useState(false);

  // Private Telegram group link (only for buyers)
  const TELEGRAM_GROUP = "https://t.me/+XXXXXXXXXX"; // Replace with actual link

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchLicense() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("license_codes")
          .select("code, used_at, transaction_signature, wallet_address")
          .eq("used_by", user.id)
          .single();

        if (!error && data) {
          setLicenseData(data);
        }
      } catch (err) {
        console.error("Error fetching license:", err);
      } finally {
        setLoadingLicense(false);
      }
    }

    if (user) {
      fetchLicense();
    }
  }, [user]);

  // Fetch or create referral data
  useEffect(() => {
    async function fetchReferral() {
      if (!user) return;

      try {
        // Try to get existing referral
        let { data, error } = await supabase
          .from("referrals")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // If no referral exists, create one
        if (error && error.code === "PGRST116") {
          const newCode = generateReferralCode();
          const { data: newReferral, error: createError } = await supabase
            .from("referrals")
            .insert({
              user_id: user.id,
              referral_code: newCode,
            })
            .select()
            .single();

          if (!createError && newReferral) {
            data = newReferral;
          }
        }

        if (data) {
          setReferralData(data);
          setWalletInput(data.wallet_address || "");

          // Fetch referral sales
          const { data: sales } = await supabase
            .from("referral_sales")
            .select("*")
            .eq("referrer_id", data.id)
            .order("created_at", { ascending: false });

          if (sales) {
            setReferralSales(sales);
          }
        }
      } catch (err) {
        console.error("Error fetching referral:", err);
      } finally {
        setLoadingReferral(false);
      }
    }

    if (user) {
      fetchReferral();
    }
  }, [user]);

  // Generate a random referral code
  function generateReferralCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Save wallet address
  async function saveWalletAddress() {
    if (!referralData || !walletInput.trim()) return;

    setSavingWallet(true);
    try {
      const { error } = await supabase
        .from("referrals")
        .update({ wallet_address: walletInput.trim() })
        .eq("id", referralData.id);

      if (!error) {
        setReferralData({ ...referralData, wallet_address: walletInput.trim() });
      }
    } catch (err) {
      console.error("Error saving wallet:", err);
    } finally {
      setSavingWallet(false);
    }
  }

  // Copy referral link
  const copyReferralLink = () => {
    if (referralData?.referral_code) {
      const link = `${window.location.origin}/${referralData.referral_code}`;
      navigator.clipboard.writeText(link);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    }
  };

  const copyLicense = () => {
    if (licenseData?.code) {
      navigator.clipboard.writeText(licenseData.code);
      setCopiedLicense(true);
      setTimeout(() => setCopiedLicense(false), 2000);
    }
  };

  const copyTelegram = () => {
    navigator.clipboard.writeText(TELEGRAM_GROUP);
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const hasPurchased = !!licenseData;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/5 bg-background/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BuddyLogo width={34} height={30} />
            </div>
            <span className="text-xl font-black">Buddy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted hover:text-white transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="text-sm text-muted hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-black text-white">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-black mb-1">My Profile</h1>
            <p className="text-muted">{user.email}</p>
          </div>

          {/* Purchase Status */}
          <div className={`p-6 rounded-2xl border ${hasPurchased ? "bg-green-500/10 border-green-500/20" : "bg-yellow-500/10 border-yellow-500/20"}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${hasPurchased ? "bg-green-500/20" : "bg-yellow-500/20"}`}>
                {hasPurchased ? (
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h2 className={`font-bold ${hasPurchased ? "text-green-400" : "text-yellow-400"}`}>
                  {hasPurchased ? "Buddy AI Purchased" : "No Purchase Yet"}
                </h2>
                <p className="text-sm text-muted">
                  {hasPurchased
                    ? `Purchased on ${new Date(licenseData.used_at).toLocaleDateString()}`
                    : "Purchase Buddy AI to get your license key and access to the private Telegram group"}
                </p>
              </div>
              {!hasPurchased && (
                <Link href="/buy" className="px-4 py-2 rounded-xl btn-glow text-white font-semibold text-sm">
                  Buy Now
                </Link>
              )}
            </div>
          </div>

          {/* License Key - Only for buyers */}
          {hasPurchased && (
            <div className="p-6 rounded-2xl bg-card/50 border border-white/10">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                License Key
              </h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={licenseData.code}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-mono text-lg font-bold text-center"
                />
                <button
                  onClick={copyLicense}
                  className="px-4 py-3 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors"
                >
                  {copiedLicense ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-muted mt-2">Use this key to activate Buddy AI on your computer</p>
            </div>
          )}

          {/* Download - Only for buyers */}
          {hasPurchased && (
            <div className="p-6 rounded-2xl bg-card/50 border border-white/10">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Buddy AI
              </h2>
              <a
                href="https://github.com/Butoshi/buddy-releases/releases/latest/download/buddy-windows.zip"
                className="w-full py-4 rounded-xl btn-glow text-white font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download for Windows
              </a>
              <p className="text-xs text-muted mt-2 text-center">Latest version with all updates included</p>
            </div>
          )}

          {/* Private Telegram - Only for buyers */}
          {hasPurchased && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0088cc]/20 to-[#0088cc]/5 border border-[#0088cc]/20">
              <h2 className="font-bold mb-4 flex items-center gap-2 text-[#0088cc]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Private Telegram Group
              </h2>
              <p className="text-sm text-muted mb-4">
                Join our private Telegram group for lifetime support, updates, and to connect with other Buddy users.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={TELEGRAM_GROUP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Join Telegram Group
                </a>
                <button
                  onClick={copyTelegram}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {copiedTelegram ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>
          )}

          {/* Transaction Info - Only for buyers */}
          {hasPurchased && licenseData.transaction_signature && (
            <div className="p-6 rounded-2xl bg-card/50 border border-white/10">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Transaction Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Transaction</span>
                  <a
                    href={`https://solscan.io/tx/${licenseData.transaction_signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent font-mono"
                  >
                    {licenseData.transaction_signature.slice(0, 8)}...{licenseData.transaction_signature.slice(-8)}
                  </a>
                </div>
                {licenseData.wallet_address && (
                  <div className="flex justify-between">
                    <span className="text-muted">Wallet</span>
                    <span className="font-mono text-white/70">
                      {licenseData.wallet_address.slice(0, 6)}...{licenseData.wallet_address.slice(-4)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">Date</span>
                  <span className="text-white/70">
                    {new Date(licenseData.used_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Referral Program Section */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h2 className="font-bold mb-4 flex items-center gap-2 text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Referral Program - Earn 1 SOL per sale!
            </h2>

            {loadingReferral ? (
              <div className="flex justify-center py-4">
                <svg className="w-6 h-6 animate-spin text-purple-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : referralData ? (
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-purple-400">{referralData.total_sales}</div>
                    <div className="text-xs text-muted">Sales</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-green-400">{referralData.total_earnings} SOL</div>
                    <div className="text-xs text-muted">Earned</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl font-black text-yellow-400">{(referralData.total_earnings - referralData.paid_earnings).toFixed(2)} SOL</div>
                    <div className="text-xs text-muted">Pending</div>
                  </div>
                </div>

                {/* Referral Link */}
                <div>
                  <label className="block text-sm text-muted mb-2">Your Referral Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${referralData.referral_code}`}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-mono"
                    />
                    <button
                      onClick={copyReferralLink}
                      className="px-4 py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 transition-colors text-purple-400"
                    >
                      {copiedReferral ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Wallet Address Input */}
                <div>
                  <label className="block text-sm text-muted mb-2">
                    Your SOL Wallet (for receiving commissions)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      placeholder="Paste your Solana wallet address..."
                      className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-mono focus:border-purple-500/50 focus:outline-none"
                    />
                    <button
                      onClick={saveWalletAddress}
                      disabled={savingWallet || walletInput === referralData.wallet_address}
                      className="px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-semibold"
                    >
                      {savingWallet ? "Saving..." : "Save"}
                    </button>
                  </div>
                  {referralData.wallet_address && (
                    <p className="text-xs text-green-400 mt-1">Wallet saved - You will receive commissions here</p>
                  )}
                  {!referralData.wallet_address && (
                    <p className="text-xs text-yellow-400 mt-1">Add your wallet to receive commission payments</p>
                  )}
                </div>

                {/* Recent Sales */}
                {referralSales.length > 0 && (
                  <div>
                    <label className="block text-sm text-muted mb-2">Recent Referral Sales</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {referralSales.slice(0, 5).map((sale) => (
                        <div key={sale.id} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-sm">
                          <span className="text-muted">{new Date(sale.created_at).toLocaleDateString()}</span>
                          <span className={`font-semibold ${sale.status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                            +{sale.commission_amount} SOL ({sale.status})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* How it works */}
                <div className="bg-white/5 rounded-xl p-4 text-sm text-muted">
                  <strong className="text-white">How it works:</strong> Share your referral link. When someone purchases Buddy using your link, you earn 1 SOL commission. Payments are sent weekly to your wallet.
                </div>
              </div>
            ) : (
              <p className="text-muted">Unable to load referral data</p>
            )}
          </div>

          {/* Help Section */}
          <div className="p-6 rounded-2xl bg-card/50 border border-white/10 text-center">
            <h2 className="font-bold mb-2">Need Help?</h2>
            <p className="text-sm text-muted mb-4">
              {hasPurchased
                ? "Join the private Telegram group for support or contact us on Twitter"
                : "Follow us on Twitter for updates and support"}
            </p>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#1DA1F2] hover:text-[#1a8cd8] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow on Twitter
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
