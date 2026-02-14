import React from 'react';
import { motion } from 'framer-motion';
import { IDENTITY_CATEGORIES, TLC_TERMS } from '../../lib/constants';
import { CheckCircle2, User, Users, HeartHandshake, Sparkles } from 'lucide-react';

interface RegistrationPathwaysProps {
  onSelectPath: (id: string) => void;
}

const RegistrationPathways: React.FC<RegistrationPathwaysProps> = ({ onSelectPath }) => {
  const pathways = [
    {
      id: 'SINGLE',
      ...IDENTITY_CATEGORIES.SINGLE,
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      features: ['Personal Identity Profile', 'Community Access', 'Basic Recognitions'],
    },
    {
      id: 'PARTNER',
      ...IDENTITY_CATEGORIES.PARTNER,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      features: ['Collaboration Tools', 'Initiative Support', 'Strategic Networking'],
    },
    {
      id: 'MARRIED',
      ...IDENTITY_CATEGORIES.MARRIED,
      icon: HeartHandshake,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      features: ['Love Model Status', 'Legacy Continuity', 'Model Recognition'],
    },
  ];

  return (
    <section className="py-32 bg-white" id="participation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-slate-100"
          >
            <Sparkles className="h-3 w-3" />
            {TLC_TERMS.activation}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-black text-gray-900 mb-6 tracking-tight leading-none"
          >
            Identity <span className="text-amber-500">Pathways.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            Select the identity category that authentically represents your current walk in The Love Culture.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pathways.map((path, idx) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
            >
              {path.id === 'MARRIED' && (
                <div className="absolute top-0 right-0 p-6">
                  <div className="bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Core Model
                  </div>
                </div>
              )}

              <div className={`w-16 h-16 ${path.bg} ${path.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                <path.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 mb-3">{path.label}</h3>
              <p className="text-gray-400 font-medium mb-8 min-h-[3rem] text-sm">
                {path.description}
              </p>
              
              <div className="mb-10">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Activation Token</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {path.activation === 0 ? 'Free' : `\u20a6${path.activation.toLocaleString()}`}
                  </span>
                  <span className="text-gray-400 text-sm font-bold">/ once</span>
                </div>
              </div>

              <ul className="space-y-5 mb-10">
                {path.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-4 text-sm font-bold text-gray-600">
                    <div className={`w-5 h-5 rounded-full ${path.bg} ${path.color} flex items-center justify-center shrink-0`}>
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPath(path.id)}
                className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all ${
                path.id === 'MARRIED' 
                  ? 'bg-gray-900 text-white hover:bg-amber-600' 
                  : 'bg-slate-50 text-gray-900 hover:bg-slate-100 border border-slate-200'
              }`}>
                {path.id === 'MARRIED' ? TLC_TERMS.activationToken : TLC_TERMS.freeAccess}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistrationPathways;