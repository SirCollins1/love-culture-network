import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';

const IntegrityVerification = () => {
  const steps = [
    { 
      title: "Identity Check", 
      desc: "Verification of individual or partner alignment with TLC nature and purpose.",
      icon: Activity
    },
    { 
      title: "Commitment Review", 
      desc: "Review of historical participation and community feedback.",
      icon: ShieldCheck
    },
    { 
      title: "Badge Issuance", 
      desc: "Immutable integrity badge issued to the profile as a symbol of trust.",
      icon: CheckCircle2
    }
  ];

  return (
    <section id="verification" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100">
              <ShieldCheck className="h-3 w-3" />
              Trust Infrastructure
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
              Integrity is the <br />
              <span className="text-blue-600">Foundation of Impact.</span>
            </h2>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              In The Love Culture, verification is not just about identity, it's about alignment with a Godly and strategic mission to restore community dignity.
            </p>

            <div className="space-y-6">
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex gap-6 p-6 rounded-3xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative z-10 aspect-square rounded-[4rem] bg-gradient-to-br from-blue-50 to-white border border-gray-100 shadow-3xl overflow-hidden flex items-center justify-center">
              <motion.div 
                animate={{ 
                  rotate: 360,
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-5"
              >
                <div className="h-full w-full border-[1px] border-dashed border-blue-900 rounded-full" />
              </motion.div>
              
              <div className="text-center z-20">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-32 h-32 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-200 flex items-center justify-center mx-auto mb-8"
                >
                  <ShieldCheck className="h-16 w-16 text-white" />
                </motion.div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">Verified Badge</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Immutable Verification Token</p>
              </div>

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-20 right-20 p-4 bg-white rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-xs font-bold">Aligned</span>
              </motion.div>
            </div>
            
            <div className="absolute -inset-10 bg-blue-50/30 blur-[100px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntegrityVerification;