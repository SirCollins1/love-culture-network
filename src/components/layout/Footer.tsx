import React from 'react';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { APP_LOGO } from '../../lib/constants';

const Footer = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast.info("Feature Coming Soon", {
        description: "This section is currently being developed."
      });
    }
  };

  const handleSocialClick = (name: string) => {
    toast.info(`${name} Profile`, {
      description: `Follow us on ${name} for the latest TLC updates and impact stories.`
    });
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 overflow-hidden rounded-xl shadow-md border border-gray-100">
                <img 
                  src={APP_LOGO} 
                  alt="The Love Culture Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">The Love Culture</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-medium">
              TLC is a Godly and strategic concept powered by love to reveal and sustain the identity and impact of love in our communities and society.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, name: 'Instagram' },
                { Icon: Twitter, name: 'Twitter' },
                { Icon: Linkedin, name: 'LinkedIn' }
              ].map(({ Icon, name }, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSocialClick(name)}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:border-amber-200 transition-all active:scale-90 shadow-sm"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-900 mb-6">Foundations</h4>
            <ul className="space-y-4">
              {[
                { label: 'Identity', id: 'nature' },
                { label: 'Action', id: 'nature' },
                { label: 'Continuity', id: 'nature' },
                { label: '60/40 Model', id: 'allocation' }
              ].map((item) => (
                <li key={item.label}>
                  <button 
                    onClick={() => scrollToSection(item.id)}
                    className="text-gray-500 hover:text-amber-600 transition-colors text-left text-sm font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-900 mb-6">Regulations</h4>
            <ul className="space-y-4">
              {['Code of Integrity', 'Privacy Framework', 'Token Policy', 'Member Standards'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => toast.info(`${item}`, { description: "Regulatory document is available for verified members." })}
                    className="text-gray-500 hover:text-amber-600 transition-colors text-left text-sm font-medium"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <p>© {new Date().getFullYear()} The Love Culture (TLC). All rights reserved.</p>
          <div className="flex gap-8">
            <button onClick={() => toast.info("Impact Reports", { description: "Annual impact reporting is under audit." })} className="hover:text-amber-600">Impact Reports</button>
            <button onClick={() => toast.info("Cultural Governance", { description: "Governance framework is viewable for intentional partners." })} className="hover:text-amber-600">Cultural Governance</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;