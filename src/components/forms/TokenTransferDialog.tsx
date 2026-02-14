import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { TLC_TERMS, RECOGNITION_TIERS, ALLOCATION_MODEL } from '../../lib/constants';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

interface TokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientCategory?: string;
  isRecipientReceptive?: boolean;
  initialTier?: any;
}

const TokenTransferDialog: React.FC<TokenDialogProps> = ({ 
  isOpen, 
  onClose, 
  recipientName, 
  recipientCategory,
  isRecipientReceptive,
  initialTier 
}) => {
  const { user } = useAuth();
  const [step, setStep] = React.useState(1);
  const [selectedTier, setSelectedTier] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setError(null);
      if (initialTier) {
        setSelectedTier(initialTier);
        setStep(2);
      } else {
        setSelectedTier(null);
        setStep(1);
      }
    }
  }, [isOpen, initialTier]);

  const validateTransfer = () => {
    if (!user) {
      setError("Please login to transfer tokens.");
      return false;
    }

    const senderRole = user.category.toLowerCase();
    const receiverRole = (recipientCategory || "").toLowerCase();

    // The Community is no longer a valid direct recipient for recognition tokens
    if (recipientName === 'The Community') {
      setError("Recognition Tokens cannot be transferred directly to the community. Please select a verified recipient.");
      return false;
    }

    // Rules:
    // 1. 'Single' -> 'Married Couple/Love Model'
    if (senderRole.includes('single')) {
      if (!receiverRole.includes('married') && !receiverRole.includes('model')) {
        setError("As a Single member, you can only transfer recognition tokens to Married Couples/Love Models.");
        return false;
      }
    }

    // 2. 'Intentional Partners' -> 'Married Couple/Love Model'
    if (senderRole.includes('partner')) {
      if (!receiverRole.includes('married') && !receiverRole.includes('model')) {
        setError("As an Intentional Partner, you can only transfer recognition tokens to Married Couples/Love Models.");
        return false;
      }
    }

    // 3. 'Married Couples' -> 'Single' (only if in 'Receptive Mode') or 'Intentional Partners'
    if (senderRole.includes('married') || senderRole.includes('model')) {
      if (receiverRole.includes('single')) {
        if (!isRecipientReceptive) {
          setError("Supportive tokens can only be transferred to Singles who are in 'Receptive Mode'.");
          return false;
        }
      } else if (!receiverRole.includes('partner')) {
        setError("Married Couples/Love Models can only transfer supportive tokens to Singles (in Receptive Mode) or Intentional Partners.");
        return false;
      }
    }

    // Final check for reciprocity (Can't transfer to self)
    if (user.name === recipientName) {
      setError("You cannot transfer tokens to your own profile.");
      return false;
    }

    return true;
  };

  const handleTransfer = () => {
    if (!validateTransfer()) return;

    setStep(3);
    setTimeout(() => {
      toast.success(`${TLC_TERMS.payment} Successful`, {
        description: `Your ${TLC_TERMS.donation} has been structurally allocated and transferred to ${recipientName}.`
      });
      setTimeout(() => {
        onClose();
        setStep(1);
        setSelectedTier(null);
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <Heart className="h-5 w-5 text-amber-600 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Transfer Love Recognition</h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-gray-500 mb-6">Select a {TLC_TERMS.price} to recognize the impact of {recipientName}.</p>
                  
                  {Object.values(RECOGNITION_TIERS).map((tier) => (
                    <button
                      key={tier.label}
                      onClick={() => {
                        setSelectedTier(tier);
                        setStep(2);
                      }}
                      className="w-full p-6 border-2 border-gray-100 rounded-2xl flex items-center justify-between hover:border-amber-200 hover:bg-amber-50 transition-all group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${tier.bg} ${tier.color}`}>
                          <Heart className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{tier.label}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{TLC_TERMS.donation}</p>
                        </div>
                      </div>
                      <div className="text-right font-black text-gray-900 text-lg">
                        ₦{tier.token.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && selectedTier && (
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="h-10 w-10 text-amber-600" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">{TLC_TERMS.checkout}</h4>
                  <p className="text-gray-500 mb-8 px-8">
                    You are transferring a <span className="font-bold text-gray-900">₦{selectedTier.token.toLocaleString()}</span> {TLC_TERMS.donation} to {recipientName}.
                  </p>
                  
                  <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">60% Recipient Impact</span>
                      <span className="font-bold text-gray-900">₦{(selectedTier.token * 0.6).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">40% Platform ({ALLOCATION_MODEL.PLATFORM_ACCOUNT})</span>
                      <span className="font-bold text-gray-900">₦{(selectedTier.token * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between font-bold">
                      <span>Total {TLC_TERMS.price}</span>
                      <span className="text-amber-600">₦{selectedTier.token.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleTransfer}
                      className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-lg"
                    >
                      Confirm Transfer
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-emerald-200"
                  >
                    <Check className="h-12 w-12" />
                  </motion.div>
                  <h4 className="text-2xl font-black mb-2">Success</h4>
                  <p className="text-gray-500 font-medium">The culture is sustained through your action.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TokenTransferDialog;