import React from 'react';
import { MapPin, Heart, ShieldCheck, Zap } from 'lucide-react';
import { INDIAN_CITIES } from '../data/seedData';
import { lynkStore } from '../lib/storage';

interface FooterProps {
  onOpenStoreOnboarding: () => void;
  onOpenAi: () => void;
  setActiveTab: (tab: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStoreOnboarding,
  onOpenAi,
  setActiveTab,
}) => {
  const currentCity = lynkStore.getCurrentCity();

  return (
    <footer className="bg-[#0F1012] text-stone-400 pt-16 sm:pt-20 pb-28 lg:pb-20 border-t border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-stone-800/80">
          
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-white">
                <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <span className="font-serif-editorial text-2xl tracking-tight text-stone-100 font-normal">
                LYNK
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                INDIA
              </span>
            </div>

            <p className="font-serif-editorial text-lg text-stone-300 italic">
              “India’s market, connected.”
            </p>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm font-light">
              LYNK connects nearby physical shops, malls, local businesses, brands, products, inventory, prices, offers and customers into one intelligent marketplace.
            </p>

            <div className="pt-1 text-xs text-stone-300 font-normal">
              LYNK does not replace India's local markets. LYNK connects them.
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest text-stone-300 mb-4">
                Marketplace
              </h4>
              <ul className="space-y-2.5 font-light">
                <li>
                  <button onClick={() => setActiveTab('discover')} className="hover:text-stone-100 transition-colors">
                    Product Discovery
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('map')} className="hover:text-stone-100 transition-colors">
                    Interactive Market Map
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('compare')} className="hover:text-stone-100 transition-colors">
                    Price & Distance Comparison
                  </button>
                </li>
                <li>
                  <button onClick={onOpenAi} className="hover:text-amber-200 transition-colors text-amber-300 font-medium">
                    LYNK AI Assistant
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest text-stone-300 mb-4">
                For Retailers
              </h4>
              <ul className="space-y-2.5 font-light">
                <li>
                  <button onClick={onOpenStoreOnboarding} className="hover:text-stone-100 transition-colors text-stone-200 font-medium underline underline-offset-4 decoration-stone-600">
                    List Your Local Store
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('shop_dashboard')} className="hover:text-stone-100 transition-colors">
                    Merchant Dashboard
                  </button>
                </li>
                <li>
                  <span className="text-stone-600">Inventory Sync API</span>
                </li>
                <li>
                  <span className="text-stone-600">30-min Hold Protocol</span>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-mono text-[10px] font-medium uppercase tracking-widest text-stone-300 mb-4">
                Active Hubs
              </h4>
              <ul className="space-y-2 font-light">
                {INDIAN_CITIES.map(c => (
                  <li key={c.name} className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-stone-500" />
                    <button 
                      onClick={() => lynkStore.setCity(c.name)}
                      className={`hover:text-stone-100 transition-colors ${currentCity.name === c.name ? 'text-amber-300 font-medium' : 'text-stone-400'}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <div>
            &copy; {new Date().getFullYear()} LYNK India Marketplace Technologies. Built for local commerce.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted with pride for Indian local businesses</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
