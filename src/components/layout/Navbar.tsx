import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Award, 
  BarChart3, 
  Menu, 
  X, 
  LogIn, 
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { AuthDialogs } from '../forms/AuthDialogs';
import { TLC_TERMS, APP_LOGO } from '../../lib/constants';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateMyProfile: () => void;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigateHome, onNavigateMyProfile, onLogin }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Our Nature', href: 'nature', icon: Heart },
    { name: 'Impact Model', href: 'allocation', icon: BarChart3 },
    { name: 'Community Profiles', href: 'community', icon: Users },
    { name: 'Recognition', href: 'recognition', icon: Award },
    { name: 'Integrity', href: 'verification', icon: ShieldCheck },
  ];

  const scrollToSection = (id: string) => {
    onNavigateHome();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setIsOpen(false);
  };

  const handleLogoClick = () => {
    onNavigateHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer" 
            onClick={handleLogoClick}
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg border border-gray-50">
              <img 
                src={APP_LOGO} 
                alt="TLC Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-gray-900 leading-none">TLC</span>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">The Love Culture</span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-amber-50"
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </button>
            ))}
            
            <div className="h-6 w-[1px] bg-gray-200 mx-2" />

            {user ? (
              <div className="flex items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNavigateMyProfile}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100 hover:bg-amber-100 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 border border-white shadow-sm">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 m-1 text-gray-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-amber-700">My Profile</span>
                </motion.button>
                <button 
                  onClick={() => {
                    logout();
                    onNavigateHome();
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin}
                className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-amber-600 transition-colors px-3 py-2 rounded-xl"
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
            )}

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('participation')}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-sm"
            >
              {TLC_TERMS.freeAccess}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {!user && (
              <button 
                onClick={onLogin}
                className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
              >
                <LogIn className="h-5 w-5" />
              </button>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  className="w-full text-left px-3 py-4 text-base font-medium text-gray-700 hover:bg-amber-50 rounded-xl flex items-center gap-3 transition-colors"
                  onClick={() => scrollToSection(link.href)}
                >
                  <link.icon className="h-5 w-5 text-amber-500" />
                  {link.name}
                </button>
              ))}
              
              {user && (
                <button 
                  onClick={onNavigateMyProfile}
                  className="w-full flex items-center justify-start gap-3 px-3 py-4 text-base font-bold text-amber-700 hover:bg-amber-50 rounded-xl transition-colors"
                >
                  <User className="h-5 w-5" />
                  Access My Identity
                </button>
              )}

              <div className="pt-4 flex flex-col gap-3">
                {user && (
                  <button 
                    onClick={() => {
                      logout();
                      onNavigateHome();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 text-red-600 font-bold border border-red-100 rounded-xl bg-red-50/30"
                  >
                    <LogOut className="h-5 w-5" /> Logout
                  </button>
                )}
                <button 
                  onClick={() => scrollToSection('participation')}
                  className="w-full bg-amber-600 text-white px-6 py-4 rounded-xl text-base font-bold shadow-lg shadow-amber-200 uppercase tracking-widest"
                >
                  {TLC_TERMS.freeAccess}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;