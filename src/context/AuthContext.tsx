import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase, getProfile } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

// Consistent with database enum: 'Single', 'Intentional Partners', 'Married/Love Models'
export type UserRole = 'Single' | 'Intentional Partners' | 'Married/Love Models';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string | null;
  avatar?: string;
  isVerified: boolean;
  emailVerified: boolean;
  activationPaid: boolean;
  isReceptive?: boolean;
  balance?: number;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  setRole: (role: string) => Promise<void>;
  setCategory: (category: string) => Promise<void>;
  completeActivation: () => Promise<void>;
  toggleReceptiveMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: Session | null) => {
    if (session?.user) {
      setSupabaseUser(session.user);
      try {
        const profile = await getProfile(session.user.id);
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.full_name || 'User',
            email: session.user.email!,
            role: profile.role,
            isVerified: profile.is_verified || false,
            emailVerified: session.user.email_confirmed_at !== undefined,
            activationPaid: profile.activation_paid || false,
            isReceptive: profile.receptive_mode || false,
            balance: profile.balance || 0,
            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    } else {
      setSupabaseUser(null);
      setUser(null);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back to The Love Culture!");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: string = 'Single') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { 
            full_name: name,
            role: role
          }
        }
      });
      
      if (error) {
        await supabase.from('system_logs').insert({
          level: 'ERROR',
          message: `Signup failed for ${email}`,
          details: { error: error.message }
        });
        throw error;
      }
      
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your identity."
      });
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    toast.info("Logged out safely.");
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Reset link sent!", {
        description: `Instructions have been sent to ${email}`
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    try {
      toast.success("Email verification initiated.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (user && supabaseUser) {
      const dbData: any = {};
      if (data.name) dbData.full_name = data.name;
      if (data.role) dbData.role = data.role;
      if (data.isReceptive !== undefined) dbData.receptive_mode = data.isReceptive;
      if (data.activationPaid !== undefined) dbData.activation_paid = data.activationPaid;
      if (data.avatar) dbData.avatar_url = data.avatar;

      const { error } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('user_id', supabaseUser.id);

      if (error) {
        await supabase.from('system_logs').insert({
          level: 'ERROR',
          message: `Profile update failed for user ${supabaseUser.id}`,
          details: { error: error.message, data }
        });
        toast.error("Failed to update profile");
        throw error;
      }

      setUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const toggleReceptiveMode = async () => {
    if (user) {
      const newStatus = !user.isReceptive;
      await updateUser({ isReceptive: newStatus });
      
      toast.success(newStatus ? "Receptive Mode Enabled" : "Receptive Mode Disabled", {
        description: newStatus 
          ? "You are now open to receiving supportive tokens." 
          : "You are no longer signaling for supportive tokens."
      });
    }
  };

  const setRole = async (role: string) => {
    if (user) {
      await updateUser({ role });
    }
  };

  const setCategory = async (category: string) => {
    if (user) {
      await updateUser({ role: category });
    }
  };

  const completeActivation = async () => {
    if (user) {
      await updateUser({ activationPaid: true });
      toast.success("Activation token confirmed!", {
        description: "Your identity as a Love Model is now being processed."
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser,
      isLoading, 
      login, 
      register, 
      logout, 
      resetPassword, 
      verifyEmail, 
      updateUser,
      setRole,
      setCategory,
      completeActivation,
      toggleReceptiveMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};