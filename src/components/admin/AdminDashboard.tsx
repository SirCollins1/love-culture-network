import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Search, 
  Filter, 
  Clock, 
  ShieldAlert, 
  User as UserIcon,
  CreditCard,
  Flag,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getAllPendingVerifications, approveBankVerification, rejectBankVerification } from '@/lib/supabase';

export function AdminDashboard() {
  const [pendingAccounts, setPendingAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    loadPending();
  }, []);

  async function loadPending() {
    setLoading(true);
    try {
      const data = await getAllPendingVerifications();
      setPendingAccounts(data || []);
    } catch (error) {
      toast.error('Failed to load pending verifications');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(userId: string, accountId: string) {
    try {
      await approveBankVerification(userId, accountId);
      toast.success('Account verified successfully');
      loadPending();
    } catch (error) {
      toast.error('Failed to approve verification');
    }
  }

  async function handleReject(userId: string, accountId: string) {
    if (!rejectionReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setIsRejecting(true);
    try {
      await rejectBankVerification(userId, accountId, rejectionReason);
      toast.success('Account verification rejected');
      setRejectionReason('');
      loadPending();
    } catch (error) {
      toast.error('Failed to reject verification');
    } finally {
      setIsRejecting(false);
    }
  }

  const filtered = pendingAccounts.filter(acc => {
    const name = acc.full_name || acc.profiles?.full_name || '';
    const email = acc.profiles?.email || '';
    return name.toLowerCase().includes(search.toLowerCase()) || 
           email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-royal-blue flex items-center gap-2">
            <ShieldAlert className="w-8 h-8" />
            Verification Center
          </h1>
          <p className="text-slate-500">Manage user bank details and withdrawal eligibility.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search accounts..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-royal-blue/5 border-royal-blue/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-royal-blue">{pendingAccounts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Review Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-700">4.2h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">1,248</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Verification Requests</CardTitle>
            <CardDescription>Review bank details submitted by users</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Updated just now
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>User</TableHead>
                  <TableHead>Bank Details</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-royal-blue" />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                      No pending verification requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((acc) => (
                    <TableRow key={acc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{acc.profiles?.full_name || acc.full_name || 'User'}</p>
                            <p className="text-xs text-slate-500">{acc.profiles?.email || 'No email'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-semibold">{acc.bank_name}</p>
                            <p className="text-xs text-slate-500 tracking-wider">{acc.account_number}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Flag className="w-3 h-3 text-slate-400" />
                          {acc.country}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(acc.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Verification</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting {acc.profiles?.full_name || acc.full_name || 'this'}'s bank verification.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Input 
                                  placeholder="e.g. Account number name does not match profile name" 
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                />
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleReject(acc.user_id, acc.id)}
                                  disabled={isRejecting}
                                >
                                  {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                  Confirm Rejection
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(acc.user_id, acc.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}