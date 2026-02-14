import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Loader2, Send, ShieldAlert } from 'lucide-react';

interface ContactRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
}

export const ContactRequestDialog: React.FC<ContactRequestDialogProps> = ({
  isOpen,
  onClose,
  receiverId,
  receiverName,
  receiverRole
}) => {
  const { user } = useAuth();
  const [purpose, setPurpose] = useState<string>('connection');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!user?.id || !message.trim()) return;

    try {
      setSending(true);

      // Send Request - Backend trigger handles moderation and limits
      const { error } = await supabase
        .from('contact_requests')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          purpose,
          message: message.trim(),
          status: 'pending'
        });

      if (error) {
        if (error.message.includes('limit reached')) {
          toast.error('Daily limit reached', { description: 'You have reached your daily limit for contact requests.' });
        } else if (error.message.includes('not accepting')) {
          toast.error('Not accepting requests', { description: 'This user is not accepting connection requests at this time.' });
        } else {
          throw error;
        }
        return;
      }

      toast.success('Request sent!', {
        description: `Your ${purpose} request has been sent to ${receiverName}.`
      });
      onClose();
      setMessage('');
    } catch (error: any) {
      toast.error('Failed to send request: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-amber-100 p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900">
            Connect with {receiverName}
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium pt-2">
            Establish a purposeful connection. Messaging will be enabled once your request is accepted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold">Purpose of Contact</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger className="rounded-2xl border-amber-100 bg-amber-50/30 font-bold">
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-amber-100">
                <SelectItem value="connection" className="font-bold">Connection & Community</SelectItem>
                <SelectItem value="collaboration" className="font-bold">Collaboration</SelectItem>
                <SelectItem value="other" className="font-bold">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold">Introduction Message</Label>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                Respectful AI Moderated
              </span>
            </div>
            <Textarea 
              placeholder={`Hi ${receiverName}, I'd like to connect because...`}
              className="min-h-[120px] rounded-2xl border-amber-100 resize-none focus-visible:ring-amber-500 font-medium"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="rounded-full px-8 font-bold border-gray-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-8 font-bold flex-1 sm:flex-none shadow-lg shadow-amber-900/10"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};