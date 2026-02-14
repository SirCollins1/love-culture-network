import React from 'react';
import { Heart, Quote, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const recognitions = [
  {
    id: 1,
    from: "Samuel Integrity",
    to: "Sarah Love-Model",
    content: "Consistently demonstrating the 60/40 model in her community initiatives. A true light and representation of TLC values.",
    type: "Rising Love Model",
    amount: "₦1,000",
    date: "2 hours ago"
  },
  {
    id: 2,
    from: "Grace Fellowship",
    to: "David Strategic",
    content: "The impact of the last outreach revealed the true identity of love in our neighborhood. Continuity in action!",
    type: "Special Love Model",
    amount: "₦10,000",
    date: "5 hours ago"
  },
  {
    id: 3,
    from: "Faith Works",
    to: "Unity Hub",
    content: "Unwavering commitment to cultural continuity and strategic allocation of tokens for local development.",
    type: "Exceptional Love Model",
    amount: "₦50,000",
    date: "1 day ago"
  }
];

const RecognitionFeed = () => {
  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {recognitions.map((rec, idx) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: idx * 0.1 
            }}
            className="group bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="absolute -top-2 -right-2 opacity-[0.03] group-hover:opacity-10 transition-opacity rotate-12">
              <Quote className="h-24 w-24" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 leading-none mb-1">
                    {rec.from}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    Transferred to {rec.to}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px] font-black">{rec.amount}</span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 font-medium italic relative z-10">
              "{rec.content}"
            </p>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
              <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                rec.type.includes('Exceptional') ? 'bg-indigo-50 text-indigo-600' :
                rec.type.includes('Special') ? 'bg-amber-50 text-amber-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                {rec.type}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">{rec.date}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RecognitionFeed;