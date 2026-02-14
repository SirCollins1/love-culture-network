import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BookOpen, CheckCircle2 } from 'lucide-react';
import { LOVE_MODEL_CRITERIA } from '../../lib/constants';

export const RecognitionStandards = () => {
  return (
    <section className="py-24 bg-white" id="standards">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100 shadow-inner">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-8 text-amber-600"
            >
              <ShieldCheck className="h-8 w-8" />
            </motion.div>
            <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Recognition Standards</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Love Models are recognized based on observable qualities and community impact. 
              These criteria ensure authenticity and meaningful recognition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LOVE_MODEL_CRITERIA.map((criterion, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-black">
                    {idx + 1}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">{criterion.title}</h4>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {criterion.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ConceptStewardship = () => {
  return (
    <section className="py-24 bg-amber-50/30 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-8 text-amber-600">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-6">Concept Stewardship</h3>
          <div className="relative">
            <div className="absolute -left-4 -top-4 text-6xl text-amber-200/50 font-serif">“</div>
            <p className="text-lg text-gray-600 font-medium leading-relaxed relative z-10 italic">
              This framework may be reviewed by the Concept Pioneer and a special team or experts when necessary, ensuring alignment with our core values and mission of love.
            </p>
            <div className="absolute -right-4 -bottom-4 text-6xl text-amber-200/50 font-serif">”</div>
          </div>
        </div>
      </div>
    </section>
  );
};