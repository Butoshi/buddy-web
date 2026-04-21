"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import BuddyLogo from "@/components/BuddyLogo";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  // Check if username is available
  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const { data } = await supabase
        .from('referrals')
        .select('id')
        .eq('referral_code', username.toLowerCase())
        .single();

      setUsernameAvailable(!data);
    } catch {
      setUsernameAvailable(true);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Validate username format
  const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate username
    if (!isValidUsername(formData.username)) {
      setError("Username must be 3-20 characters, letters, numbers and underscore only");
      return;
    }

    if (!usernameAvailable) {
      setError("This username is already taken");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    // Sign up with username in metadata
    const { error, data } = await signUp(formData.email, formData.password);

    if (error) {
      setError(error.message || "Failed to create account");
      setIsLoading(false);
      return;
    }

    // Create referral entry with the username
    if (data?.user) {
      try {
        await supabase.from('referrals').insert({
          user_id: data.user.id,
          referral_code: formData.username.toLowerCase(),
        });
      } catch (refError) {
        console.error('Failed to create referral:', refError);
      }
    }

    router.push("/buy");
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-muted mb-6">
            Your account has been created successfully. You can now sign in and start using Buddy.
          </p>
          <Link href="/login" className="btn-glow text-white px-6 py-3 rounded-xl font-semibold inline-block">
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-primary/10" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[200px]" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-3">
              <BuddyLogo size={52} trackMouse={false} breathe={false} />
              <span className="text-2xl font-black">Buddy</span>
            </Link>
          </div>

          <div className="bg-card/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
              <p className="text-muted">Start trading with AI in minutes</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username for referral */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username <span className="text-muted font-normal">(for your referral link)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                      setFormData({ ...formData, username: value });
                      if (value.length >= 3) {
                        checkUsername(value);
                      } else {
                        setUsernameAvailable(null);
                      }
                    }}
                    placeholder="cryptoking"
                    maxLength={20}
                    className={`w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-white/5 border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      usernameAvailable === true ? 'border-green-500/50' :
                      usernameAvailable === false ? 'border-red-500/50' :
                      'border-white/10 focus:border-primary/50'
                    }`}
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {/* Status indicator */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {checkingUsername && (
                      <svg className="w-5 h-5 animate-spin text-muted" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {!checkingUsername && usernameAvailable === true && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
                {formData.username.length > 0 && formData.username.length < 3 && (
                  <p className="text-xs text-yellow-400 mt-1">Username must be at least 3 characters</p>
                )}
                {usernameAvailable === false && (
                  <p className="text-xs text-red-400 mt-1">This username is already taken</p>
                )}
                {usernameAvailable === true && (
                  <p className="text-xs text-green-400 mt-1">Your referral link: buddy.ai/{formData.username.toLowerCase()}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                    </svg>
                  </button>
                </div>
                {/* Password strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`h-1 flex-1 rounded ${i < strength ? strengthColors[strength - 1] : "bg-white/10"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted">
                      Password strength: <span className={strength >= 3 ? "text-green-400" : strength >= 2 ? "text-yellow-400" : "text-red-400"}>{strengthLabels[strength - 1] || "Too weak"}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">Passwords don&apos;t match</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="w-5 h-5 mt-0.5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20" />
                <span className="text-sm text-muted">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:text-accent">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-primary hover:text-accent">Privacy Policy</Link>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || formData.password !== formData.confirmPassword}
                className="w-full py-4 rounded-xl btn-glow text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Sign in link */}
            <p className="text-center text-muted mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-accent font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-black mb-6">
            Start Trading{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smarter
            </span>
          </h1>

          <p className="text-lg text-muted mb-12">
            Join traders using Buddy to automate their memecoin trading on PumpFun.
          </p>

          {/* Benefits */}
          <div className="space-y-6">
            {[
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Instant Setup", desc: "Start trading in under 5 minutes" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Bank-Level Security", desc: "Your keys stay on your machine" },
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "No Hidden Fees", desc: "Transparent pricing, one-time payment" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
