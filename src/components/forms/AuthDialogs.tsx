import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth, UserRole } from '../../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'reset' | 'verify';
  initialRole?: UserRole;
}

export const AuthDialogs: React.FC<AuthDialogProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  initialRole = 'Single'
}) => {
  const { login, register, resetPassword, verifyEmail, isLoading } = useAuth();
  const [mode, setMode] = React.useState<'login' | 'register' | 'reset' | 'verify'>(initialMode);
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(initialRole);
  
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: '',
  });

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  React.useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        onClose();
      } else if (mode === 'register') {
        await register(formData.email, formData.password, formData.name, selectedRole);
        setMode('verify');
      } else if (mode === 'reset') {
        await resetPassword(formData.email);
        setMode('login');
      } else if (mode === 'verify') {
        await verifyEmail('mock-token');
        onClose();
      }
    } catch (err) {
      // Error handled in context
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0 bg-white">
        <div className="bg-gray-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Lock size={120} />
          </div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-3xl font-black tracking-tight">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Join the Culture'}
              {mode === 'reset' && 'Reset Access'}
              {mode === 'verify' && 'Verify Identity'}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-medium">
              {mode === 'login' && 'Re-align with your TLC profile and continue your legacy.'}
              {mode === 'register' && `Registering as ${selectedRole}.`}
              {mode === 'reset' && 'Enter your email to receive a secure recovery link.'}
              {mode === 'verify' && "We've sent a verification code to your email."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-white">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  required
                  placeholder="Emmanuel Peace"
                  className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:ring-amber-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  required
                  type="email"
                  placeholder="your@identity.tlc"
                  className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:ring-amber-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</Label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => setMode('reset')}
                    className="text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  required
                  type="password"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:ring-amber-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          )}

          {mode === 'verify' && (
            <div className="py-4 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 animate-bounce" />
              </div>
              <p className="text-sm text-gray-500">Click the button below to simulate email verification for this demo.</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-gray-900 hover:bg-amber-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-200"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {mode === 'login' && 'Access Identity'}
                {mode === 'register' && 'Initialize Profile'}
                {mode === 'reset' && 'Send Recovery Link'}
                {mode === 'verify' && 'Complete Verification'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </>
            )}
          </Button>

          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-gray-500 font-medium">
                New to the Culture? {' '}
                <button 
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-amber-600 font-black uppercase tracking-widest"
                >
                  Register Now
                </button>
              </p>
            ) : (
              mode !== 'verify' && (
                <p className="text-xs text-gray-500 font-medium">
                  Already have an account? {' '}
                  <button 
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-amber-600 font-black uppercase tracking-widest"
                  >
                    Back to Login
                  </button>
                </p>
              )
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};