import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdpdrplulzmbzpginxdb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcGRycGx1bHptYnpwZ2lueGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NTgzNDcsImV4cCI6MjA4NjUzNDM0N30.IbXvmBTzBMfblXQBpuTs4sXRRCf741qbuHYUnUepPXU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BankVerificationStatus = 'Not Submitted' | 'Pending Verification' | 'Verified';

export interface BankAccount {
  id: string;
  user_id: string;
  full_name: string;
  bank_name: string;
  account_number: string;
  country: string;
  status: BankVerificationStatus;
  rejection_reason?: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Rejected';
  bank_account_id: string;
  created_at: string;
}

// Profile Operations
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// Bank Operations
export async function submitBankDetails(details: Omit<BankAccount, 'id' | 'user_id' | 'status' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('bank_accounts')
    .upsert({
      user_id: user.id,
      ...details,
      status: 'Pending Verification',
      rejection_reason: null,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;

  // Also update the profile status cache/field
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ bank_verification_status: 'Pending Verification' })
    .eq('user_id', user.id);

  if (profileError) throw profileError;
}

export async function getBankDetails() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as BankAccount | null;
}

// Withdrawal Operations
export async function requestWithdrawal(amount: number, bankAccountId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify user is verified first
  const { data: profile } = await supabase
    .from('profiles')
    .select('bank_verification_status, balance')
    .eq('user_id', user.id)
    .single();

  if (profile?.bank_verification_status !== 'Verified') {
    throw new Error('Bank verification is required before real token withdrawals.');
  }

  if ((profile?.balance || 0) < amount) {
    throw new Error('Insufficient token balance');
  }

  const { error } = await supabase
    .from('withdrawals')
    .insert({
      user_id: user.id,
      amount,
      bank_account_id: bankAccountId,
      status: 'Pending'
    });

  if (error) throw error;
}

// Admin Operations
export async function getAllPendingVerifications() {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select(`
      *,
      profiles:user_id (email, full_name)
    `)
    .eq('status', 'Pending Verification');

  if (error) throw error;
  return data;
}

export async function approveBankVerification(userId: string, accountId: string) {
  const { error: accError } = await supabase
    .from('bank_accounts')
    .update({ status: 'Verified' })
    .eq('id', accountId);

  if (accError) throw accError;

  const { error: profError } = await supabase
    .from('profiles')
    .update({ bank_verification_status: 'Verified' })
    .eq('user_id', userId);

  if (profError) throw profError;
}

export async function rejectBankVerification(userId: string, accountId: string, reason: string) {
  const { error: accError } = await supabase
    .from('bank_accounts')
    .update({ status: 'Not Submitted', rejection_reason: reason })
    .eq('id', accountId);

  if (accError) throw accError;

  const { error: profError } = await supabase
    .from('profiles')
    .update({ bank_verification_status: 'Not Submitted' })
    .eq('user_id', userId);

  if (profError) throw profError;
}