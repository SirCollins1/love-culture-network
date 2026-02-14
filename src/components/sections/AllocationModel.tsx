import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, Wallet } from 'lucide-react';
import { ALLOCATION_MODEL } from '../../lib/constants';

const AllocationModel = () => {
  const stats = [
    { 
      val: `${ALLOCATION_MODEL.LOVE_MODELS}%`, 
      label: "Direct Love Impact", 
      sub: "Routing tokens to Married Couples (Love Models) for their willingness to inspire and provide mentorship.",
      icon: Heart,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    { 
      val: `${ALLOCATION_MODEL.PLATFORM}%`, 
      label: "Cultural Continuity", 
      sub: `Strategic allocation to the Platform Account (Account: ${ALLOCATION_MODEL.PLATFORM_ACCOUNT}) for infrastructure and sustainable impact.`,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50"
    }
  ];

  return (
    <section id="allocation" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[2px] w-12 bg-gray-900"></div>
              <span className="text-gray-900 font-black text-xs uppercase tracking-[0.3em]">Strategic Framework</span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight leading-none">
              The {ALLOCATION_MODEL.LOVE_MODELS}/{ALLOCATION_MODEL.PLATFORM} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Allocation Model.</span>
            </h2>
            <p className="text-gray-500 text-xl font-medium leading-relaxed">
              A Godly strategy for sustainable impact. We route appreciation where it reveals identity and sustains the culture of love.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 hover:shadow-2xl transition-all group"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className={`w-32 h-32 rounded-[2.5rem] ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-12 w-12" />
                </div>
                <div>
                  <div className={`text-6xl font-black ${stat.color} mb-2`}>{stat.val}</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{stat.label}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">{stat.sub}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] group-hover:bg-amber-500/20 transition-all" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h3 className="text-3xl font-black mb-4">Ready to Participate?</h3>
              <p className="text-gray-400 text-lg">
                Join a movement where every token transferred reveals identity and fuels the strategic impact of love in action.
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const el = document.getElementById('community');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-10 py-5 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-900/20 hover:bg-amber-400 transition-all flex items-center gap-3"
            >
              <Wallet className="h-4 w-4" />
              Initialize Alignment
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AllocationModel;