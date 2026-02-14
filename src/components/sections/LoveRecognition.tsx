import { motion } from 'framer-motion';
import { RECOGNITION_TIERS, TLC_TERMS, ALLOCATION_MODEL } from '../../lib/constants';
import { Sprout, Star, Crown, ArrowRight, Heart, Info, Users } from 'lucide-react';
import { toast } from 'sonner';

interface LoveRecognitionProps {
  onOpenTokenDialog: (tier?: any) => void;
}

const LoveRecognition: React.FC<LoveRecognitionProps> = ({ onOpenTokenDialog }) => {
  const tiers = [
    { 
      ...RECOGNITION_TIERS.RISING, 
      icon: Sprout, 
      desc: "For Community Members beginning to manifest love consistently." 
    },
    { 
      ...RECOGNITION_TIERS.SPECIAL, 
      icon: Star, 
      desc: "Recognizing sustained impact and cultural alignment within the community." 
    },
    { 
      ...RECOGNITION_TIERS.EXCEPTIONAL, 
      icon: Crown, 
      desc: "Married Couples recognized as Love Models for inspiring others and providing mentorship." 
    },
  ];

  const handleViewLeaderboard = () => {
    toast.info("Leaderboard Feature", {
      description: "The global recognition leaderboard is currently being verified and will be live soon."
    });
  };

  return (
    <section className="py-24" id="recognition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between mb-20 gap-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Love Recognition Framework
              </h2>
              <p className="text-lg text-gray-600 mb-8 font-medium">
                Married Couples are recognized as Love Models for inspiring others with their healthy relationship experience and providing mentorship that guides singles and intentional partners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-1 inline-flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 shadow-sm">
                  <span className="shrink-0"><Info className="h-5 w-5" /></span>
                  <span>{ALLOCATION_MODEL.LOVE_MODELS}% of recognition tokens from Singles and Intentional Partners are directly transferred to Married Couples/Love Models.</span>
                </div>
                <div className="flex-1 inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 shadow-sm">
                  <span className="shrink-0"><Users className="h-5 w-5" /></span>
                  <span>Singles and Intentional Partners receive Supportive Tokens to support their learning and development experience.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group h-full"
            >
              <div className={`absolute inset-0 ${tier.bg} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="relative h-full bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm">
                <div className={`w-20 h-20 ${tier.bg} ${tier.color} rounded-full flex items-center justify-center mb-6`}>
                  <tier.icon className="h-10 w-10" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.label}</h3>
                <p className="text-sm font-medium text-amber-600 mb-4 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {tier.range}
                </p>
                <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                  {tier.desc}
                </p>

                <div className="mt-auto w-full pt-8 border-t border-gray-50">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Support via Recognition</p>
                  <button 
                    onClick={() => onOpenTokenDialog(tier)}
                    className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${
                      tier.label.includes('Exceptional') 
                      ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200' 
                      : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                    ₦{tier.token.toLocaleString()} {TLC_TERMS.donation}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={handleViewLeaderboard}
            className="inline-flex items-center gap-2 text-amber-600 font-bold hover:text-amber-700 transition-colors active:scale-95 group"
          >
            View Recognition Leaderboard 
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoveRecognition;