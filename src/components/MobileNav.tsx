import React from 'react';
import { Compass, Map as MapIcon, SlidersHorizontal, ShoppingBag, Store, ShieldCheck } from 'lucide-react';
import { lynkStore } from '../lib/storage';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const currentUser = lynkStore.getCurrentUser();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F1012]/95 backdrop-blur-xl border-t border-stone-800/80 py-2 px-3 shadow-2xl safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-mono tracking-wider transition-colors ${
            activeTab === 'discover' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="mt-1">Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-mono tracking-wider transition-colors ${
            activeTab === 'map' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span className="mt-1">Map</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-mono tracking-wider transition-colors ${
            activeTab === 'compare' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="mt-1">Compare</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-mono tracking-wider transition-colors ${
            activeTab === 'orders' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="mt-1">Orders</span>
        </button>

        {currentUser.role === 'shop_owner' ? (
          <button
            onClick={() => setActiveTab('shop_dashboard')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-mono tracking-wider transition-colors ${
              activeTab === 'shop_dashboard' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="mt-1">My Store</span>
          </button>
        ) : currentUser.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('admin_dashboard')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-mono tracking-wider transition-colors ${
              activeTab === 'admin_dashboard' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="mt-1">Admin</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-mono tracking-wider transition-colors ${
              activeTab === 'saved' ? 'text-amber-300' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="mt-1">Saved</span>
          </button>
        )}
      </div>
    </div>
  );
};
