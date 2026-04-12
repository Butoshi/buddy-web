"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ReferralRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const [notFound, setNotFound] = useState(false);
  const username = params.username as string;

  useEffect(() => {
    async function checkAndRedirect() {
      // Check if this username exists as a referral code
      const { data } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referral_code', username.toLowerCase())
        .single();

      if (data) {
        // Valid referral code - redirect to buy page with ref
        router.replace(`/buy?ref=${username.toLowerCase()}`);
      } else {
        // Not a valid referral code - show 404
        setNotFound(true);
      }
    }

    if (username) {
      checkAndRedirect();
    }
  }, [username, router]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">404</h1>
          <p className="text-muted mb-6">This referral link doesn&apos;t exist</p>
          <a href="/" className="text-primary hover:text-accent">
            Go to homepage
          </a>
        </div>
      </div>
    );
  }

  // Loading state while checking
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <svg className="w-8 h-8 animate-spin text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-muted">Redirecting...</p>
      </div>
    </div>
  );
}
