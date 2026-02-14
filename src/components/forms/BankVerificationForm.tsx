import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, Loader2, Building2, User, Landmark, Globe, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitBankDetails, getBankDetails, BankAccount } from '@/lib/supabase';

const bankSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  bank_name: z.string().min(2, 'Bank name is required'),
  account_number: z.string().min(8, 'Invalid account number format').max(20, 'Account number too long'),
  country: z.string().min(2, 'Country is required'),
});

type BankFormValues = z.infer<typeof bankSchema>;

export function BankVerificationForm() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [existingData, setExistingData] = useState<BankAccount | null>(null);

  const form = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      full_name: '',
      bank_name: '',
      account_number: '',
      country: '',
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBankDetails();
        if (data) {
          setExistingData(data);
          form.reset({
            full_name: data.full_name,
            bank_name: data.bank_name,
            account_number: data.account_number,
            country: data.country,
          });
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
      } finally {
        setInitialLoading(false);
      }
    }
    loadData();
  }, [form]);

  async function onSubmit(values: BankFormValues) {
    setLoading(true);
    try {
      await submitBankDetails(values);
      toast.success('Bank details submitted successfully. Awaiting verification.');
      // Refresh data
      const updatedData = await getBankDetails();
      setExistingData(updatedData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit bank details');
    } finally {
      setLoading(false);
    }
  }

  const isPending = existingData?.status === 'Pending Verification';
  const isVerified = existingData?.status === 'Verified';
  const hasRejection = existingData?.status === 'Not Submitted' && existingData?.rejection_reason;

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-royal-blue" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-royal-blue/20 shadow-xl overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-royal-blue to-sky-blue relative overflow-hidden">
        <img 
          src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c35255a3-6c72-496e-bb8c-e17c53a01097/bank-verification-hero-5aa2c04d-1771009251136.webp" 
          alt="Security Banner" 
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldCheck className="w-16 h-16 text-white drop-shadow-lg" />
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-royal-blue">Bank Verification</CardTitle>
        <CardDescription>
          Your bank information is required for secure token withdrawals. We use industry-standard encryption to protect your data.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isVerified && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
            <ShieldCheck className="w-5 h-5" />
            <p className="font-medium text-sm">Your bank account is verified. You can now withdraw tokens.</p>
          </div>
        )}

        {isPending && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3 text-yellow-700">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="font-medium text-sm">Verification pending. Our administrators are reviewing your details.</p>
          </div>
        )}

        {hasRejection && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Previous submission was rejected</p>
              <p className="text-sm opacity-90">Reason: {existingData.rejection_reason}</p>
              <p className="text-xs mt-1 font-medium">Please correct the details below and re-submit.</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4 text-royal-blue" />
                      Full Name (Account Name)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} disabled={isPending || isVerified} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-royal-blue" />
                      Bank Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Central Bank" {...field} disabled={isPending || isVerified} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-royal-blue" />
                      Account Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} disabled={isPending || isVerified} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-royal-blue" />
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} disabled={isPending || isVerified} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormDescription className="text-xs text-slate-500 italic">
              Important: The full name must match the identity on your bank account to avoid rejection.
            </FormDescription>

            {!isVerified && !isPending && (
              <Button 
                type="submit" 
                className="w-full bg-royal-blue hover:bg-royal-blue/90" 
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {hasRejection ? 'Re-submit for Verification' : 'Submit for Verification'}
              </Button>
            )}
            
            {(isPending || isVerified) && (
              <p className="text-center text-sm text-slate-400">
                To update your bank details, please contact support.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}