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
import { Loader2, GraduationCap, ShieldCheck } from 'lucide-react';

interface MentorshipRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string;
  receiverName: string;
}

export const MentorshipRequestDialog: React.FC<MentorshipRequestDialogProps> = ({
  isOpen,
  onClose,
  receiverId,
  receiverName
}) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState('');
  const [background, setBackground] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!user?.id || !goals.trim() || !background.trim()) return;

    try {
      setSending(true);

      const { error } = await supabase
        .from('mentorship_requests')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          goals: goals.trim(),
          background: background.trim(),
          status: 'pending'
        });

      if (error) {
        if (error.message.includes('limit reached')) {
          toast.error('Daily limit reached', { description: 'You have reached your daily limit for requests.' });
        } else {
          throw error;
        }
        return;
      }

      toast.success('Mentorship Request Sent!', {
        description: `Your application has been submitted to ${receiverName}.`
      });
      onClose();
      setGoals('');
      setBackground('');
    } catch (error: any) {
      toast.error('Failed to send request: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-indigo-100 p-8">
        <DialogHeader>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="h-6 w-6 text-indigo-600" />
          </div>
          <DialogTitle className="text-2xl font-black text-gray-900">
            Mentorship Application
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium pt-2 text-sm leading-relaxed">
            Love Models provide guidance based on Godly and strategic values. Please share your intentions for seeking mentorship.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-gray-700">What are your primary goals?</Label>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Specific</span>
            </div>
            <Textarea 
              placeholder="E.g., Seeking guidance on intentional dating, preparing for marriage, or personal growth in love..."
              className="min-h-[100px] rounded-2xl border-indigo-100 focus-visible:ring-indigo-500 bg-indigo-50/10"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-gray-700">Your Journey Background</Label>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Context</span>
            </div>
            <Textarea 
              placeholder="Briefly describe your current relationship status or the challenges you're facing..."
              className="min-h-[100px] rounded-2xl border-indigo-100 focus-visible:ring-indigo-500 bg-indigo-50/10"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
              Your application is private and will only be visible to the Love Model. Respectful communication is mandatory and monitored.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="rounded-full px-8 font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={sending || !goals.trim() || !background.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 font-bold flex-1 shadow-lg shadow-indigo-900/10"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <GraduationCap className="h-4 w-4 mr-2" />}
            Submit Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};