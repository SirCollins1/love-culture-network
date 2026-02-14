import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { 
  Send, 
  ShieldAlert, 
  Loader2, 
  MoreVertical,
  User as UserIcon,
  MessageSquare,
  Lock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_flagged: boolean | null;
  moderation_status: string | null;
}

interface MessageThreadProps {
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  receiverId,
  receiverName,
  receiverAvatar
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id && receiverId) {
      fetchMessages();
      const channel = subscribeToMessages();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id, receiverId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`chat:${receiverId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user?.id}`
      }, (payload) => {
        if (payload.new.sender_id === receiverId) {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return channel;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newMessage.trim()) return;

    try {
      setSending(true);

      // Insert Message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage.trim()
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('mutual consent')) {
          toast.error('Messaging Locked', { 
            description: 'Mutual consent is required. Please send a connection request first.',
            icon: <Lock className="h-5 w-5 text-amber-600" />
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.is_flagged) {
        toast.warning('Message Flagged', {
          description: 'Your message was flagged for respectful communication review.',
          icon: <ShieldAlert className="h-5 w-5 text-amber-500" />
        });
      }

      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (error: any) {
      toast.error('Failed to send message: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-[2.5rem] border border-amber-100 shadow-xl overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-amber-50 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-amber-100 ring-offset-2">
              <AvatarImage src={receiverAvatar} />
              <AvatarFallback><UserIcon /></AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <h4 className="font-black text-gray-900">{receiverName}</h4>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-green-500 fill-green-50" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Consent Verified</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-2 bg-amber-50 rounded-xl cursor-help">
                  <Lock className="h-4 w-4 text-amber-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl border-amber-100 bg-white p-3">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">End-to-End Strategic Privacy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-8 bg-slate-50/30">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-amber-600 opacity-20" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Start the Conversation</p>
              <p className="text-xs text-gray-400 font-medium">Remember to always be Godly and strategic.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[75%] px-5 py-4 rounded-[2rem] relative shadow-sm ${
                  msg.sender_id === user?.id 
                    ? 'bg-amber-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-amber-100'
                } ${msg.is_flagged ? 'ring-2 ring-red-400 ring-offset-2' : ''}`}>
                  <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                  {msg.is_flagged && (
                    <div className="flex items-center gap-1 mt-2 p-2 bg-red-50 text-red-600 rounded-xl border border-red-100">
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-[9px] font-black uppercase tracking-tighter">Potential Violation Flagged</span>
                    </div>
                  )}
                </div>
                <span className={`text-[9px] mt-2 font-black uppercase tracking-tighter ${
                  msg.sender_id === user?.id ? 'text-amber-600/50' : 'text-gray-400'
                }`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-amber-50">
        <form 
          onSubmit={handleSend}
          className="flex gap-3 bg-slate-50 p-2.5 rounded-[2rem] border border-slate-100 items-center transition-all focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:bg-white focus-within:border-amber-200"
        >
          <Input 
            placeholder="Type a respectful message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="border-none bg-transparent focus-visible:ring-0 shadow-none font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-bold h-12"
            disabled={sending}
          />
          <Button 
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="rounded-2xl bg-amber-600 hover:bg-amber-700 text-white h-12 px-6 shadow-lg shadow-amber-900/20 group"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
          </Button>
        </form>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
            <ShieldCheck className="h-3 w-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">AI Moderation Active</span>
          </div>
          <div className="h-1 w-1 bg-gray-200 rounded-full" />
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Respect our community guidelines</p>
        </div>
      </div>
    </div>
  );
};