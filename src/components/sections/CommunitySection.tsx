import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter, Sparkles, Plus, Info } from 'lucide-react';
import ProfileCard from '../profile/ProfileCard';
import RecognitionFeed from '../profile/RecognitionFeed';
import { ALLOCATION_MODEL } from '../../lib/constants';

interface CommunitySectionProps {
  addedProfiles?: any[];
  onCreateProfile: () => void;
  onProfileClick: (profile: any) => void;
  onTransferClick: (profile: any) => void;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ 
  addedProfiles = [], 
  onCreateProfile,
  onProfileClick,
  onTransferClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sampleProfiles = [
    {
      id: "sample-1",
      name: "Emmanuel Peace",
      category: "Married/Love Models",
      bio: "Recognized as a Love Model for inspiring others with healthy relationship experience and providing mentorship. Dedicated to the 60/40 allocation model.",
      recognitions: 156,
      isVerified: true,
      followers: 1240,
      admins: ["Emmanuel", "Lydia", "TLC Admin"],
      avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/c35255a3-6c72-496e-bb8c-e17c53a01097/emmanuel-peace-avatar-23fe7caf-1770853013995.webp"
    },
    {
      id: "sample-2",
      name: "Lydia Compassion",
      category: "Intentional Partners",
      bio: "Aligning with the TLC culture to support community development. Learning from Love Models and providing a strategic example for others.",
      recognitions: 84,
      isVerified: true,
      followers: 892,
      admins: ["Lydia"],
      avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/c35255a3-6c72-496e-bb8c-e17c53a01097/lydia-compassion-avatar-078578cb-1770853014319.webp",
      isReceptive: true
    },
    {
      id: "sample-3",
      name: "Joshua Sincerity",
      category: "Single",
      bio: "A Community Member learning the nature of love from Intentional Partners and Married Couples/Love Models. Committed to revealing the dignity of love.",
      recognitions: 42,
      isVerified: false,
      followers: 320,
      admins: ["Joshua"],
      avatar: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/c35255a3-6c72-496e-bb8c-e17c53a01097/joshua-sincerity-avatar-07605b88-1770853014179.webp"
    }
  ];

  const allProfiles = [...addedProfiles, ...sampleProfiles];
  const filteredProfiles = allProfiles.filter(p => 
    (p?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p?.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="py-32 bg-slate-50/50" id="community">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[2px] w-12 bg-amber-500"></div>
                  <span className="text-amber-600 font-black text-xs uppercase tracking-[0.3em]">The Living Community</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight leading-none">
                  Authentic <span className="text-amber-500">Alignment.</span>
                </h2>
                <p className="text-gray-500 text-lg max-w-md">
                  Discover Community Members who represent the TLC culture of love, dignity, and mentorship.
                </p>
              </motion.div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search members..."
                    className="pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-amber-600 transition-colors shadow-sm"
                >
                  <Filter className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {filteredProfiles.map((profile, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onProfileClick(profile)}
                  className="cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <ProfileCard 
                    {...profile} 
                    onTransferClick={(e: any) => {
                      e?.stopPropagation();
                      onTransferClick(profile);
                    }}
                  />
                </div>
              ))}
              
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                onClick={onCreateProfile}
                className="rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center group hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer min-h-[400px]"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-amber-50 text-amber-500">
                  <Plus className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Join as a Community Member</h3>
                <p className="text-gray-400 text-sm max-w-[200px]">
                  Align your identity with TLC values and start your impact journey.
                </p>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3.5rem] p-8 lg:p-12 shadow-2xl shadow-gray-200/50 sticky top-24 border border-gray-50"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-200">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Activity</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Recognition</p>
                  </div>
                </div>
                <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <RecognitionFeed />
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3 items-start">
                <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  {ALLOCATION_MODEL.LOVE_MODELS}% of recognition tokens support Married Love Models | {ALLOCATION_MODEL.PLATFORM}% Strategic Initiatives (Platform Account: {ALLOCATION_MODEL.PLATFORM_ACCOUNT})
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const el = document.getElementById('community');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full mt-6 py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:from-amber-600 hover:to-amber-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
              >
                <Heart className="h-4 w-4 fill-current" />
                Select Member to Recognize
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;