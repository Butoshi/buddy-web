-- ============================================
-- BUDDY REFERRAL SYSTEM
-- Copie ce SQL dans Supabase > SQL Editor > Run
-- ============================================

-- 1. Table des parrains
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  wallet_address VARCHAR(50),
  total_earnings DECIMAL(10, 4) DEFAULT 0,
  paid_earnings DECIMAL(10, 4) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Table des ventes parrainées
CREATE TABLE referral_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES referrals(id),
  buyer_email VARCHAR(255),
  transaction_signature VARCHAR(100) UNIQUE NOT NULL,
  commission_amount DECIMAL(10, 4) DEFAULT 1,
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Index pour performance
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referral_sales_status ON referral_sales(status);

-- 4. RLS (Row Level Security)
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_sales ENABLE ROW LEVEL SECURITY;

-- Policies pour referrals
CREATE POLICY "Users can view own referral" ON referrals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own referral" ON referrals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own referral" ON referrals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Public can read by code" ON referrals FOR SELECT USING (true);

-- Policies pour referral_sales
CREATE POLICY "Referrers can view own sales" ON referral_sales FOR SELECT USING (
  referrer_id IN (SELECT id FROM referrals WHERE user_id = auth.uid())
);
CREATE POLICY "API can insert sales" ON referral_sales FOR INSERT WITH CHECK (true);
CREATE POLICY "API can update sales" ON referral_sales FOR UPDATE USING (true);
CREATE POLICY "Public can read sales" ON referral_sales FOR SELECT USING (true);
