import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Heart, Infinity as InfinityIcon, Sparkles } from 'lucide-react';
import { TLC_TERMS, APP_LOGO } from '../../lib/constants';

interface HeroProps {
  onGetStarted?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-50/50 to-transparent -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 rounded-[1.5rem] shadow-2xl overflow-hidden border-2 border-white"
              >
                <img src={APP_LOGO} alt="TLC Logo" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-black uppercase tracking-[0.2em]"
              >
                <Sparkles className="h-3 w-3" />
                Strategic Godly Culture
              </motion.div>
            </div>
            
            <div className="mb-10">
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                Revealing the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400">
                  Identity and Dignity of Love.
                </span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl font-black text-amber-600 italic tracking-tight">
                {TLC_TERMS.slogan}
              </motion.p>
            </div>
            
            <p className="text-lg text-gray-500 mb-12 leading-relaxed max-w-xl font-medium">
              TLC is a Godly and strategic concept powered by love to reveal and sustain the identity and impact of love in our communities and society.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted || (() => scrollToSection('participation'))}
                className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-amber-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-gray-200"
              >
                {TLC_TERMS.activation}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('nature')}
                className="px-10 py-5 bg-white border border-gray-100 text-gray-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                {TLC_TERMS.learnMore}
              </motion.button>
            </div>

            <div className="mt-20 grid grid-cols-3 gap-8 border-t border-gray-50 pt-12">
              {[ 
                { icon: Heart, label: 'Identity', color: 'text-rose-500', bg: 'bg-rose-50' },
                { icon: Shield, label: 'Action', color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: InfinityIcon, label: 'Continuity', color: 'text-emerald-500', bg: 'bg-emerald-50' }
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + (i * 0.1) }}
                  className="flex flex-col gap-3"
                >
                  <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{item.label}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Strategy</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="aspect-[4/5] rounded-[4rem] bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-3xl overflow-hidden relative">
                <img 
                  src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c35255a3-6c72-496e-bb8c-e17c53a01097/tlc-hero-background-065c4cbc-1770853013669.webp" 
                  alt="Community Love"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[3s]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              {/* Floating UI Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 overflow-hidden rounded-2xl shadow-lg">
                    <img src={APP_LOGO} alt="TLC Mini" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Recent Recognition</p>
                    <p className="text-[10px] text-gray-400 font-bold">+1,000 Tokens Transferred</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Integrity Verified</p>
                    <p className="text-[10px] text-gray-400 font-bold">98% Active Compliance</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;