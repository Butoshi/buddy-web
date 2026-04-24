import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_WALLET_ADDRESS!;
const PROMO_PRICE = 0.01; // TEST MODE
const NORMAL_PRICE = 0.01; // TEST MODE
const PROMO_END_DATE = new Date("2026-04-27T17:00:00Z");
const LAMPORTS_PER_SOL = 1_000_000_000;

// Calculate current price based on promo
function getCurrentPrice(): number {
  const now = new Date().getTime();
  const end = PROMO_END_DATE.getTime();
  return now < end ? PROMO_PRICE : NORMAL_PRICE;
}

export async function POST(request: NextRequest) {
  try {
    const { buyerWallet, userId, referralCode } = await request.json();

    if (!buyerWallet) {
      return NextResponse.json({ error: 'Buyer wallet address required' }, { status: 400 });
    }

    const rpcUrl = 'https://api.mainnet-beta.solana.com';

    // 1. Get recent transactions FROM the buyer's wallet
    const signaturesResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [
          buyerWallet,
          { limit: 20 } // Check last 20 transactions
        ]
      })
    });

    const signaturesData = await signaturesResponse.json();

    if (signaturesData.error || !signaturesData.result || signaturesData.result.length === 0) {
      return NextResponse.json({ error: 'No recent transactions found from your wallet' }, { status: 404 });
    }

    // 2. Check each transaction to find a valid payment to our wallet
    for (const sigInfo of signaturesData.result) {
      const signature = sigInfo.signature;

      // Skip failed transactions
      if (sigInfo.err) continue;

      // Check if this transaction was already used
      const { data: existingPurchase } = await supabase
        .from('license_codes')
        .select('code')
        .eq('transaction_signature', signature)
        .single();

      if (existingPurchase) {
        // This transaction was already used - return the existing license
        return NextResponse.json({
          success: true,
          code: existingPurchase.code,
          message: 'License already assigned to this transaction'
        });
      }

      // Get transaction details
      const txResponse = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransaction',
          params: [
            signature,
            { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }
          ]
        })
      });

      const txData = await txResponse.json();

      if (txData.error || !txData.result) continue;

      const transaction = txData.result;

      // Skip failed transactions
      if (transaction.meta?.err) continue;

      // Find transfer to our wallet
      const instructions = transaction.transaction?.message?.instructions || [];
      let transferAmount = 0;
      let isValidPayment = false;

      for (const ix of instructions) {
        if (ix.parsed?.type === 'transfer' && ix.program === 'system') {
          const info = ix.parsed.info;
          if (info.destination === WALLET_ADDRESS && info.source === buyerWallet) {
            transferAmount = info.lamports / LAMPORTS_PER_SOL;
            if (transferAmount >= getCurrentPrice()) {
              isValidPayment = true;
              break;
            }
          }
        }
      }

      // Also check inner instructions
      if (!isValidPayment) {
        const innerInstructions = transaction.meta?.innerInstructions || [];
        for (const inner of innerInstructions) {
          for (const ix of inner.instructions || []) {
            if (ix.parsed?.type === 'transfer' && ix.program === 'system') {
              const info = ix.parsed.info;
              if (info.destination === WALLET_ADDRESS && info.source === buyerWallet) {
                transferAmount = info.lamports / LAMPORTS_PER_SOL;
                if (transferAmount >= getCurrentPrice()) {
                  isValidPayment = true;
                  break;
                }
              }
            }
          }
          if (isValidPayment) break;
        }
      }

      // If we found a valid payment, process it
      if (isValidPayment) {
        // Get an unused license code
        const { data: availableCode, error: codeError } = await supabase
          .from('license_codes')
          .select('id, code')
          .eq('is_used', false)
          .limit(1)
          .single();

        if (codeError || !availableCode) {
          return NextResponse.json({ error: 'No license codes available' }, { status: 500 });
        }

        // Mark the code as used
        const { error: updateError } = await supabase
          .from('license_codes')
          .update({
            is_used: true,
            used_by: userId || null,
            transaction_signature: signature,
            wallet_address: buyerWallet,
            used_at: new Date().toISOString()
          })
          .eq('id', availableCode.id);

        if (updateError) {
          return NextResponse.json({ error: 'Failed to assign license' }, { status: 500 });
        }

        // Handle referral commission if referral code exists
        if (referralCode) {
          try {
            const { data: referrer } = await supabase
              .from('referrals')
              .select('id, total_earnings, total_sales')
              .eq('referral_code', referralCode)
              .single();

            if (referrer) {
              await supabase
                .from('referral_sales')
                .insert({
                  referrer_id: referrer.id,
                  buyer_email: userId ? 'user-' + userId.slice(0, 8) : 'anonymous',
                  transaction_signature: signature,
                  commission_amount: 1,
                  status: 'pending'
                });

              await supabase
                .from('referrals')
                .update({
                  total_earnings: (referrer.total_earnings || 0) + 1,
                  total_sales: (referrer.total_sales || 0) + 1
                })
                .eq('id', referrer.id);
            }
          } catch (refError) {
            console.error('Referral tracking error:', refError);
          }
        }

        // Return success
        return NextResponse.json({
          success: true,
          code: availableCode.code,
          amount: transferAmount,
          wallet: buyerWallet
        });
      }
    }

    // No valid payment found
    return NextResponse.json({
      error: `No payment of ${getCurrentPrice()} SOL or more found from your wallet. Please make sure you sent the payment and wait a few seconds for confirmation.`
    }, { status: 404 });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
