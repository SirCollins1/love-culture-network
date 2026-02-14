import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  CreditCard, 
  History, 
  ArrowRight,
  BadgeCheck,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankVerificationStatus } from '@/lib/supabase';
import { BankVerificationForm } from '@/components/forms/BankVerificationForm';
import { WithdrawalForm } from '@/components/forms/WithdrawalForm';

interface ProfileCardProps {
  user?: {
    id: string;
    full_name?: string;
    name?: string; 
    email?: string;
    role?: string;
    category?: string; 
    avatar_url?: string;
    avatar?: string; 
    balance?: number;
    bank_verification_status?: BankVerificationStatus;
    bank_account_id?: string;
  };
  id?: string;
  full_name?: string;
  name?: string;
  email?: string;
  role?: string;
  category?: string;
  avatar_url?: string;
  avatar?: string;
  balance?: number;
  bank_verification_status?: BankVerificationStatus;
  onTransferClick?: (e: any) => void;
}

export function ProfileCard(props: ProfileCardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const userData = props?.user || props || {};
  const fullName = userData?.full_name || userData?.name || 'Anonymous';
  const displayRole = userData?.role || userData?.category || 'Member';
  const avatarUrl = userData?.avatar_url || userData?.avatar;
  const balance = userData?.balance || 0;
  const verificationStatus = (userData?.bank_verification_status as BankVerificationStatus) || 'Not Submitted';

  const getStatusBadge = (status: BankVerificationStatus) => {
    switch (status) {
      case 'Verified':
        return <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1 shadow-sm"><BadgeCheck className="w-3 h-3" /> Verified</Badge>;
      case 'Pending Verification':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1 shadow-sm"><Clock className="w-3 h-3" /> Pending</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200 flex items-center gap-1 shadow-sm"><AlertTriangle className="w-3 h-3" /> Not Verified</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="w-full md:w-80 shrink-0 border-royal-blue/10 shadow-lg bg-white">
          <CardHeader className="text-center pb-2">
            <div className="relative mx-auto mb-4">
              <Avatar className="h-24 w-24 ring-4 ring-royal-blue/10">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-royal-blue text-white text-2xl font-bold">
                  {fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                {verificationStatus === 'Verified' && (
                  <div className="bg-white rounded-full p-1 shadow-md">
                    <BadgeCheck className="w-6 h-6 text-green-500" />
                  </div>
                )}
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">{fullName}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              {userData?.email || 'No email provided'}
            </CardDescription>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="bg-royal-blue/10 text-royal-blue">
                {displayRole}
              </Badge>
              {getStatusBadge(verificationStatus)}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 font-medium uppercase mb-1">Total Balance</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-royal-blue">{balance.toLocaleString()}</span>
                <span className="text-sm font-semibold text-slate-400">Tokens</span>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Button 
                variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
                className="w-full justify-start text-sm font-medium"
                onClick={() => setActiveTab('overview')}
              >
                <User className="w-4 h-4 mr-2" /> Overview
              </Button>
              <Button 
                variant={activeTab === 'bank' ? 'secondary' : 'ghost'} 
                className="w-full justify-start text-sm font-medium"
                onClick={() => setActiveTab('bank')}
              >
                <CreditCard className="w-4 h-4 mr-2" /> Bank Settings
              </Button>
              <Button 
                variant={activeTab === 'withdraw' ? 'secondary' : 'ghost'} 
                className="w-full justify-start text-sm font-medium"
                onClick={() => setActiveTab('withdraw')}
              >
                <History className="w-4 h-4 mr-2" /> Withdrawals
              </Button>
            </nav>
          </CardContent>
        </Card>

        <div className="flex-1 w-full space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:border-royal-blue/30 transition-all cursor-pointer shadow-sm hover:shadow-md" onClick={() => setActiveTab('bank')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      Bank Verification
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 mb-2">Required for cashing out tokens.</p>
                    {getStatusBadge(verificationStatus)}
                  </CardContent>
                </Card>
                <Card className="hover:border-royal-blue/30 transition-all cursor-pointer shadow-sm hover:shadow-md" onClick={() => setActiveTab('withdraw')}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      Quick Withdraw
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 mb-2">Current balance: {balance} tokens</p>
                    <Badge variant="outline">\u2248 ${((balance) * 0.1).toFixed(2)} USD</Badge>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest token transactions and requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-400">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No recent activity to show.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <BankVerificationForm />
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <WithdrawalForm 
                balance={balance} 
                verificationStatus={verificationStatus}
                bankAccountId={userData?.bank_account_id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;