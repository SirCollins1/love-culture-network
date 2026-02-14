import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Heart, Camera, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { TLC_TERMS, IDENTITY_CATEGORIES } from '../../lib/constants';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

interface CreateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: any) => void;
  initialCategory?: 'SINGLE' | 'PARTNER' | 'MARRIED';
}

const CreateProfileDialog: React.FC<CreateProfileDialogProps> = ({ isOpen, onClose, onSuccess, initialCategory }) => {
  const { user, setCategory, completeActivation } = useAuth();
  const [step, setStep] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    category: initialCategory || 'SINGLE',
    bio: '',
  });

  React.useEffect(() => {
    if (initialCategory) {
      setFormData(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  const handleActivationPayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    completeActivation();
    setIsProcessing(false);
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (formData.category === 'MARRIED') {
        setStep(2); // Go to activation payment
      } else {
        setStep(3); // Go to bio
      }
      return;
    }

    if (step === 3) {
      // Final creation
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: 'Aligning identity with TLC values...',
          success: () => {
            const profileData = {
              ...formData,
              category: IDENTITY_CATEGORIES[formData.category as keyof typeof IDENTITY_CATEGORIES].label,
              recognitions: 0,
              isVerified: formData.category === 'MARRIED',
              followers: 0,
              admins: [formData.name],
            };
            
            setCategory(formData.category as any);
            onSuccess(profileData);
            onClose();
            setStep(1);
            setFormData({ name: user?.name || '', category: 'SINGLE', bio: '' });
            return 'Profile successfully manifested in the community.';
          },
          error: 'Failed to create profile.',
        }
      );
    }
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
            <form onSubmit={handleSubmit} className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-xl">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Manifest Identity</h3>
                </div>
                <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex gap-2 mb-8 px-1">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      step >= s ? 'bg-amber-500' : 'bg-gray-100'
                    } ${step === 2 && formData.category !== 'MARRIED' && s === 2 ? 'hidden' : ''}`}
                  />
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">FullName / Identity Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      placeholder="e.g. John Mercy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Identity Category</label>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(IDENTITY_CATEGORIES).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: key as any })}
                          className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                            formData.category === key 
                              ? 'border-amber-500 bg-amber-50/50' 
                              : 'border-gray-100 hover:border-amber-200'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-gray-900">{value.label}</p>
                            <p className="text-xs text-gray-500">{value.description}</p>
                          </div>
                          {formData.category === key && <Heart className="h-5 w-5 text-amber-500 fill-current" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 py-4">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto">
                      <CreditCard className="h-10 w-10 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900">Activation Token</h4>
                      <p className="text-gray-500 font-medium">Secure your status as a Love Model</p>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                      <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Total Value</div>
                      <div className="text-4xl font-black text-amber-900">\\u20a61,000</div>
                    </div>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                      The Activation Token supports the 60/40 allocation model, ensuring platform sustainability and community-wide recognition of love.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Your Expression (Bio)</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                      placeholder="How do you express love and continuity in your community?"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>

                  <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                    <div className="flex gap-4">
                      <ShieldCheck className="h-6 w-6 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-amber-900 mb-1">Authenticity Pledge</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          By manifesting this profile, I commit to the TLC Nature & Purpose of revealing the dignity of love through action and continuity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                {step > 1 && !isProcessing && (
                  <button
                    type="button"
                    onClick={() => setStep(formData.category === 'MARRIED' && step === 3 ? 2 : 1)}
                    className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                )}
                
                {step === 2 ? (
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleActivationPayment}
                    className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Pay Activation Token'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg"
                  >
                    {step === 1 ? 'Next' : 'Create Profile'}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateProfileDialog;