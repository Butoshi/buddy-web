import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const WALLET_ADDRESS = process.env.NEXT_PUBLIC_SOLANA_WALLET_ADDRESS!;
const REQUIRED_SOL = 6; // 6 SOL minimum
const LAMPORTS_PER_SOL = 1_000_000_000;

export async function POST(request: NextRequest) {
  try {
    const { signature, userId } = await request.json();

    if (!signature) {
      return NextResponse.json({ error: 'Transaction signature required' }, { status: 400 });
    }

    // 1. Verify transaction on Solana
    const rpcUrl = 'https://api.mainnet-beta.solana.com';

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

    if (txData.error || !txData.result) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const transaction = txData.result;

    // 2. Check if transaction was successful
    if (transaction.meta?.err) {
      return NextResponse.json({ error: 'Transaction failed' }, { status: 400 });
    }

    // 3. Find transfer to our wallet
    const instructions = transaction.transaction?.message?.instructions || [];
    let transferAmount = 0;
    let senderWallet = '';

    for (const ix of instructions) {
      if (ix.parsed?.type === 'transfer' && ix.program === 'system') {
        const info = ix.parsed.info;
        if (info.destination === WALLET_ADDRESS) {
          transferAmount = info.lamports / LAMPORTS_PER_SOL;
          senderWallet = info.source;
          break;
        }
      }
    }

    // Also check inner instructions
    const innerInstructions = transaction.meta?.innerInstructions || [];
    for (const inner of innerInstructions) {
      for (const ix of inner.instructions || []) {
        if (ix.parsed?.type === 'transfer' && ix.program === 'system') {
          const info = ix.parsed.info;
          if (info.destination === WALLET_ADDRESS) {
            transferAmount = info.lamports / LAMPORTS_PER_SOL;
            senderWallet = info.source;
            break;
          }
        }
      }
    }

    if (transferAmount < REQUIRED_SOL) {
      return NextResponse.json({
        error: `Insufficient amount. Required: ${REQUIRED_SOL} SOL, Received: ${transferAmount} SOL`
      }, { status: 400 });
    }

    // 4. Check if this transaction was already used
    const { data: existingPurchase } = await supabase
      .from('license_codes')
      .select('code')
      .eq('transaction_signature', signature)
      .single();

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        code: existingPurchase.code,
        message: 'License already assigned to this transaction'
      });
    }

    // 5. Get an unused license code
    const { data: availableCode, error: codeError } = await supabase
      .from('license_codes')
      .select('id, code')
      .eq('is_used', false)
      .limit(1)
      .single();

    if (codeError || !availableCode) {
      return NextResponse.json({ error: 'No license codes available' }, { status: 500 });
    }

    // 6. Mark the code as used
    const { error: updateError } = await supabase
      .from('license_codes')
      .update({
        is_used: true,
        used_by: userId || null,
        transaction_signature: signature,
        wallet_address: senderWallet,
        used_at: new Date().toISOString()
      })
      .eq('id', availableCode.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to assign license' }, { status: 500 });
    }

    // 7. Return success with license code
    return NextResponse.json({
      success: true,
      code: availableCode.code,
      amount: transferAmount,
      wallet: senderWallet
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
