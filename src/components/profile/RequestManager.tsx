import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { 
  Check, 
  X, 
  Clock, 
  MessageSquare, 
  User as UserIcon,
  ShieldCheck,
  MoreVertical,
  Ban,
  Loader2,
  GraduationCap,
  FileText
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ContactRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  purpose: string;
  message: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string;
    role: string;
    integrity_badge: boolean;
  };
  receiver: {
    full_name: string;
    avatar_url: string;
    role: string;
  };
}

interface MentorshipRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  goals: string;
  background: string;
  created_at: string;
  sender: {
    full_name: string;
    avatar_url: string;
    role: string;
    integrity_badge: boolean;
  };
}

export const RequestManager: React.FC = () => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<ContactRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ContactRequest[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchRequests();
    }
  }, [user?.id]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch incoming
      const { data: incoming, error: inError } = await supabase
        .from('contact_requests')
        .select(`
          *,
          sender:profiles!sender_id(full_name, avatar_url, role, integrity_badge)
        `)
        .eq('receiver_id', user?.id)
        .order('created_at', { ascending: false });

      if (inError) throw inError;

      // Fetch outgoing
      const { data: outgoing, error: outError } = await supabase
        .from('contact_requests')
        .select(`
          *,
          receiver:profiles!receiver_id(full_name, avatar_url, role)
        `)
        .eq('sender_id', user?.id)
        .order('created_at', { ascending: false });

      if (outError) throw outError;

      // Fetch mentorship requests (for Love Models)
      if (user?.category === 'Married/Love Models') {
        const { data: mentorship, error: mentError } = await supabase
          .from('mentorship_requests')
          .select(`
            *,
            sender:profiles!sender_id(full_name, avatar_url, role, integrity_badge)
          `)
          .eq('receiver_id', user?.id)
          .order('created_at', { ascending: false });

        if (mentError) throw mentError;
        setMentorshipRequests(mentorship || []);
      }

      setIncomingRequests(incoming || []);
      setOutgoingRequests(outgoing || []);
    } catch (error: any) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: 'accepted' | 'rejected' | 'blocked', table: 'contact_requests' | 'mentorship_requests' = 'contact_requests') => {
    try {
      setProcessingId(requestId);
      const { error } = await supabase
        .from(table)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;

      toast.success(`Request ${status}`);
      fetchRequests();
    } catch (error: any) {
      toast.error('Failed to update request');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-amber-600" />
          Interaction Center
        </h3>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Review and manage your connection requests.
        </p>
      </div>

      <Tabs defaultValue="received" className="w-full">
        <TabsList className="bg-amber-50 p-1 rounded-2xl mb-6">
          <TabsTrigger value="received" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 shadow-sm">
            Received ({incomingRequests.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          {user?.category === 'Married/Love Models' && (
            <TabsTrigger value="mentorship" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 shadow-sm flex gap-2 items-center">
              Mentorship ({mentorshipRequests.filter(r => r.status === 'pending').length})
              <GraduationCap className="h-4 w-4" />
            </TabsTrigger>
          )}
          <TabsTrigger value="sent" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-amber-600 shadow-sm">
            Sent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-gray-200">
              <Clock className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No incoming requests yet.</p>
            </div>
          ) : (
            incomingRequests.map((request) => (
              <Card key={request.id} className={`rounded-[2rem] border-amber-100 shadow-sm overflow-hidden ${request.status !== 'pending' ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12 ring-2 ring-amber-100 ring-offset-2">
                        <AvatarImage src={request.sender?.avatar_url} />
                        <AvatarFallback><UserIcon /></AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-gray-900">{request.sender?.full_name || 'Anonymous'}</h4>
                          {request.sender?.integrity_badge && (
                            <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-50" />
                          )}
                          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-amber-100 bg-amber-50 text-amber-700">
                            {request.sender?.role || 'Member'}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                          Purpose: {request.purpose}
                        </p>
                        <div className="bg-gray-50 p-4 rounded-2xl mt-2 italic text-sm text-gray-600 relative">
                          <span className="absolute -top-2 left-4 px-2 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-tighter">Initial Message</span>
                          "{request.message}"
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col justify-end items-center gap-2">
                      {request.status === 'pending' ? (
                        <>
                          <Button 
                            onClick={() => handleStatusUpdate(request.id, 'accepted')}
                            disabled={!!processingId}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full font-bold px-6 h-10 w-full md:w-auto"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleStatusUpdate(request.id, 'rejected')}
                            disabled={!!processingId}
                            className="rounded-full font-bold px-6 h-10 border-red-100 text-red-600 hover:bg-red-50 w-full md:w-auto"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      ) : (
                        <Badge className={`rounded-full px-4 py-1 font-bold ${
                          request.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="mentorship" className="space-y-4">
          {mentorshipRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-gray-200">
              <GraduationCap className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No mentorship applications yet.</p>
            </div>
          ) : (
            mentorshipRequests.map((request) => (
              <Card key={request.id} className={`rounded-[2.5rem] border-indigo-100 shadow-sm overflow-hidden ${request.status !== 'pending' ? 'opacity-60' : ''}`}>
                <CardContent className="p-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 ring-2 ring-indigo-100 ring-offset-2">
                          <AvatarImage src={request.sender?.avatar_url} />
                          <AvatarFallback><UserIcon /></AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-black text-gray-900 text-lg">{request.sender?.full_name || 'Anonymous'}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-indigo-100 bg-indigo-50 text-indigo-700">
                              {request.sender?.role || 'Member'}
                            </Badge>
                            {request.sender?.integrity_badge && (
                              <ShieldCheck className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      {request.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleStatusUpdate(request.id, 'accepted', 'mentorship_requests')}
                            disabled={!!processingId}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold px-6 h-10"
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleStatusUpdate(request.id, 'rejected', 'mentorship_requests')}
                            disabled={!!processingId}
                            className="rounded-full font-bold px-6 h-10 border-red-100 text-red-600"
                          >
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <Badge className={`rounded-full px-4 py-1 font-bold ${
                          request.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-indigo-50/30 p-5 rounded-3xl border border-indigo-50 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-indigo-600" />
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Primary Goals</p>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{request.goals}"</p>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journey Background</p>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{request.background}"</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-gray-200">
              <Clock className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No requests sent yet.</p>
            </div>
          ) : (
            outgoingRequests.map((request) => (
              <Card key={request.id} className="rounded-[2rem] border-amber-100 shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-amber-100 ring-offset-2">
                      <AvatarImage src={request.receiver?.avatar_url} />
                      <AvatarFallback><UserIcon /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-black text-gray-900">{request.receiver?.full_name || 'Anonymous'}</h4>
                      <div className="flex items-center gap-4">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                          {request.purpose}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium">
                          Sent on {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`rounded-full px-4 py-1 font-bold ${
                      request.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      request.status === 'accepted' ? 'bg-green-50 text-green-600 border-green-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};