import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth, UserRole } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import CommunitySection from '@/components/sections/CommunitySection';
import IntegrityVerification from '@/components/sections/IntegrityVerification';
import LoveRecognition from '@/components/sections/LoveRecognition';
import AllocationModel from '@/components/sections/AllocationModel';
import { RecognitionStandards, ConceptStewardship } from '@/components/sections/StandardsAndStewardship';
import RegistrationPathways from '@/components/sections/RegistrationPathways';
import ProfileCard from '@/components/profile/ProfileCard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AuthDialogs } from '@/components/forms/AuthDialogs';
import { supabase } from '@/lib/supabase';
import { TLC_TERMS } from '@/lib/constants';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/" />;
  
  // Admin check
  if (adminOnly && user.email !== TLC_TERMS.adminEmail) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function DashboardPage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        // FIXED: Column name is user_id, not id
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        const { data: bank } = await supabase
          .from('bank_accounts')
          .select('id, status')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          setProfileData({
            ...profile,
            bank_account_id: bank?.id,
            bank_verification_status: bank?.status || profile.bank_verification_status || 'Not Submitted'
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center py-20 min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-blue"></div>
    </div>
  );

  if (!profileData) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Profile not found. Please try logging in again.</p>
    </div>
  );

  return <ProfileCard user={profileData} />;
}

function MainApp() {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [initialRole, setInitialRole] = useState<UserRole>('Single');

  const handleSelectPath = (pathId: string) => {
    const roleMap: Record<string, UserRole> = {
      'SINGLE': 'Single',
      'PARTNER': 'Intentional Partners',
      'MARRIED': 'Married/Love Models'
    };
    
    setInitialRole(roleMap[pathId] || 'Single');
    setAuthMode('register');
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-royal-blue/10">
      <Navbar 
        onNavigateHome={() => navigate('/')}
        onNavigateMyProfile={() => navigate('/dashboard')}
        onLogin={() => {
          setAuthMode('login');
          setIsAuthOpen(true);
        }}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-24">
                <CommunitySection 
                  onCreateProfile={() => {
                    setAuthMode('register');
                    setInitialRole('Single');
                    setIsAuthOpen(true);
                  }}
                  onProfileClick={() => {}}
                  onTransferClick={() => {}}
                />
                <LoveRecognition />
                <AllocationModel />
                <IntegrityVerification />
                <RecognitionStandards />
                <ConceptStewardship />
                <RegistrationPathways onSelectPath={handleSelectPath} />
              </div>
            </>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="py-12 bg-slate-50/50 min-h-screen">
                <DashboardPage />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <div className="max-w-7xl mx-auto px-4 py-12">
                <AdminDashboard />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <AuthDialogs 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode}
        initialRole={initialRole}
      />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </Router>
  );
}