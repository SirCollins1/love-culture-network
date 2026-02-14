import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Coins, Loader2, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { requestWithdrawal, BankVerificationStatus } from '@/lib/supabase';

const withdrawalSchema = z.object({
  amount: z.number().min(10, 'Minimum withdrawal is 10 tokens').max(10000, 'Maximum withdrawal is 10,000 tokens'),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

interface WithdrawalFormProps {
  balance: number;
  verificationStatus: BankVerificationStatus;
  bankAccountId?: string;
}

export function WithdrawalForm({ balance, verificationStatus, bankAccountId }: WithdrawalFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 10,
    },
  });

  async function onSubmit(values: WithdrawalFormValues) {
    if (!bankAccountId) {
      toast.error('Bank account details not found');
      return;
    }

    setLoading(true);
    try {
      await requestWithdrawal(values.amount, bankAccountId);
      toast.success('Withdrawal request submitted successfully');
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to request withdrawal');
    } finally {
      setLoading(false);
    }
  }

  const isVerified = verificationStatus === 'Verified';

  if (success) {
    return (
      <Card className="w-full border-green-200 bg-green-50/50">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-green-800">Request Received!</h3>
          <p className="text-green-700">
            Your withdrawal request has been submitted. Funds will be processed to your bank account within 3-5 business days.
          </p>
          <Button variant="outline" onClick={() => setSuccess(false)} className="mt-4">
            New Withdrawal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-royal-blue/20 shadow-lg relative overflow-hidden">
      {!isVerified && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center p-6 text-center">
          <div className="max-w-xs space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Verification Required</h3>
            <p className="text-sm text-slate-600">
              Bank verification is required before real token withdrawals. Please complete your bank profile first.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-xs font-medium">
              Status: <span className="uppercase">{verificationStatus}</span>
            </div>
          </div>
        </div>
      )}

      <div className="h-24 bg-royal-blue/5 border-b border-royal-blue/10 flex items-center px-6">
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Available Balance</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-royal-blue">{balance.toLocaleString()}</span>
            <span className="text-sm font-semibold text-slate-400">Tokens</span>
          </div>
        </div>
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c35255a3-6c72-496e-bb8c-e17c53a01097/secure-withdrawal-6dd093e5-1771009249412.webp" 
          alt="Withdrawal" 
          className="h-16 w-16 object-contain"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5 text-royal-blue" />
          Withdraw Tokens
        </CardTitle>
        <CardDescription>
          Convert your earned tokens into real cash instantly.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Withdrawal Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        className="pl-10 h-12 text-lg font-bold" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                      <Coins className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>Min: 10 | Max: 10,000</span>
                    <span className={field.value > balance ? "text-red-500 font-bold" : ""}>
                      Approx. ${(field.value * 0.1).toFixed(2)} USD
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 bg-royal-blue hover:bg-royal-blue/90 text-lg font-semibold shadow-lg shadow-royal-blue/20"
              disabled={loading || !isVerified || form.watch('amount') > balance}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <ArrowUpRight className="w-5 h-5 mr-2" />
              )}
              {form.watch('amount') > balance ? 'Insufficient Balance' : 'Process Withdrawal'}
            </Button>

            <p className="text-[10px] text-center text-slate-400 leading-tight">
              By clicking "Process Withdrawal", you agree to our Terms of Service regarding currency conversion and transfer fees.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}