import React, { useState } from 'react';
import { 
  Smartphone, 
  Store as StoreIcon, 
  Sparkles, 
  Check, 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroVisualProps {
  onSelectStore: (storeId: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({
  onSelectStore,
  onSelectProduct,
}) => {
  const [activeNode, setActiveNode] = useState<string | null>('metro');

  return (
    <div className="relative w-full max-w-6xl mx-auto my-10 px-4 sm:px-6">
      
      {/* Outer Card Container with soft editorial dark canvas */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative overflow-hidden rounded-[32px] bg-[#121316] p-6 sm:p-10 text-white shadow-2xl border border-stone-800/80"
      >
        
        {/* Glow ambient background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-stone-700/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header inside visual */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-emerald-400/90">
                LIVE MARKETPLACE OVERLAY
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-editorial font-normal mt-1.5 text-stone-100 tracking-tight">
              Your city is the marketplace.
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-400 bg-white/[0.04] px-4 py-1.5 rounded-full border border-white/[0.08]">
            <span className="text-stone-200 font-medium">Active Mesh:</span>
            <span className="font-light text-stone-400">Customer ⇄ Physical Stores ⇄ Live Inventory</span>
          </div>
        </div>

        {/* Interactive Future Scene Representation */}
        <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center: Interactive Digital City Canvas */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[420px] rounded-2xl bg-black/40 border border-white/[0.06] p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
            
            {/* Street Grid Lines Background */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FAF8F5_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
            
            {/* Radial Digital Links connecting center to stores */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-stone-500/25 stroke-dasharray-[4_4]" xmlns="http://www.w3.org/2000/svg">
              <line x1="50%" y1="50%" x2="25%" y2="22%" strokeWidth="1.2" className="animate-pulse" />
              <line x1="50%" y1="50%" x2="78%" y2="28%" strokeWidth="1.2" className="animate-pulse" />
              <line x1="50%" y1="50%" x2="80%" y2="76%" strokeWidth="1.2" className="animate-pulse" />
              <line x1="50%" y1="50%" x2="20%" y2="78%" strokeWidth="1.2" className="animate-pulse" />
            </svg>

            {/* Top Store Node 1: Metro Electronics */}
            <div 
              onClick={() => {
                setActiveNode('metro');
                onSelectStore('store-bbsr-1');
              }}
              className={`absolute top-6 left-4 sm:left-8 cursor-pointer transition-all duration-300 transform hover:scale-105 z-20 ${
                activeNode === 'metro' ? 'scale-105 ring-1 ring-amber-400/80 rounded-2xl' : 'opacity-90'
              }`}
            >
              <div className="bg-[#18191D]/95 backdrop-blur-md border border-white/[0.1] rounded-2xl p-3.5 shadow-xl max-w-[210px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-100">
                    <StoreIcon className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">Metro Electronics</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/70 px-1.5 py-0.5 rounded-full border border-emerald-800/40">
                    550m
                  </span>
                </div>
                <div className="mt-2 text-xs text-stone-300">
                  Wireless Earbuds <strong className="text-amber-300 font-semibold">₹2,399</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1.5">
                  <span className="text-emerald-400 font-medium">In stock (14)</span>
                  <span>Pickup: 10 min</span>
                </div>
              </div>
            </div>

            {/* Top Store Node 2: Smart Hub Digital */}
            <div 
              onClick={() => {
                setActiveNode('smarthub');
                onSelectStore('store-bbsr-2');
              }}
              className={`absolute top-10 right-4 sm:right-8 cursor-pointer transition-all duration-300 transform hover:scale-105 z-20 ${
                activeNode === 'smarthub' ? 'scale-105 ring-1 ring-amber-400/80 rounded-2xl' : 'opacity-90'
              }`}
            >
              <div className="bg-[#18191D]/95 backdrop-blur-md border border-white/[0.1] rounded-2xl p-3.5 shadow-xl max-w-[210px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-100">
                    <StoreIcon className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">Smart Hub Digital</span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-mono bg-amber-950/70 px-1.5 py-0.5 rounded-full border border-amber-800/40">
                    320m
                  </span>
                </div>
                <div className="mt-2 text-xs text-stone-300">
                  Fast 65W GaN <strong className="text-amber-300 font-semibold">₹899</strong>
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1.5">
                  <span className="text-emerald-400 font-medium">Closest store</span>
                  <span>Pickup: 8 min</span>
                </div>
              </div>
            </div>

            {/* Center Node: The Customer Walking through Market with Smartphone */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-center">
              <div className="relative group">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-stone-800 via-stone-700 to-amber-400/80 p-0.5 shadow-2xl animate-pulse">
                  <div className="w-full h-full rounded-full bg-[#121316] flex flex-col items-center justify-center text-white">
                    <Smartphone className="w-6 h-6 text-stone-200" />
                    <span className="font-mono text-[9px] text-amber-300 uppercase tracking-widest mt-0.5">YOU</span>
                  </div>
                </div>

                {/* Pulse Rings */}
                <div className="absolute inset-0 rounded-full border border-amber-400/30 scale-125 animate-ping pointer-events-none" />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#18191D] text-stone-200 text-[11px] px-3 py-1 rounded-full border border-white/[0.1] shadow-md font-light">
                  Janpath Corridor
                </div>
              </div>
            </div>

            {/* Bottom Store Node 3: Odisha Handloom Emporium */}
            <div 
              onClick={() => {
                setActiveNode('crafts');
                onSelectStore('store-bbsr-4');
              }}
              className={`absolute bottom-6 left-4 sm:left-8 cursor-pointer transition-all duration-300 transform hover:scale-105 z-20 ${
                activeNode === 'crafts' ? 'scale-105 ring-1 ring-amber-400/80 rounded-2xl' : 'opacity-90'
              }`}
            >
              <div className="bg-[#18191D]/95 backdrop-blur-md border border-white/[0.1] rounded-2xl p-3.5 shadow-xl max-w-[210px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-100">
                    <StoreIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span className="truncate">Handloom Emporium</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">1.2 km</span>
                </div>
                <div className="mt-2 text-xs text-stone-300">
                  Sambalpuri Silk <strong className="text-amber-300 font-semibold">₹6,499</strong>
                </div>
                <div className="text-[10px] text-stone-400 mt-1.5 font-light">
                  GI-Tagged Authentic Weaves
                </div>
              </div>
            </div>

            {/* Bottom Store Node 4: FreshMart Superstore */}
            <div 
              onClick={() => {
                setActiveNode('freshmart');
                onSelectStore('store-bbsr-5');
              }}
              className={`absolute bottom-6 right-4 sm:right-8 cursor-pointer transition-all duration-300 transform hover:scale-105 z-20 ${
                activeNode === 'freshmart' ? 'scale-105 ring-1 ring-amber-400/80 rounded-2xl' : 'opacity-90'
              }`}
            >
              <div className="bg-[#18191D]/95 backdrop-blur-md border border-white/[0.1] rounded-2xl p-3.5 shadow-xl max-w-[210px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-100">
                    <StoreIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">FreshMart Grocery</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">850m</span>
                </div>
                <div className="mt-2 text-xs text-stone-300">
                  Raw Honey & A2 Ghee
                </div>
                <div className="text-[10px] text-emerald-400 mt-1.5 font-light">
                  Express 15m Counter Pickup
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Smartphone Live Screen Peek */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="rounded-3xl bg-[#18191D] p-6 border border-white/[0.08] shadow-2xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="font-mono text-xs uppercase tracking-widest text-stone-200">
                    LIVE LYNK RADAR
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-white/[0.06] text-stone-300 px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                  REAL-TIME SYNC
                </span>
              </div>

              {/* Simulated Customer Experience Card */}
              <div className="mt-5 space-y-3.5">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-stone-400">Target Product</p>
                  <h4 className="text-base font-serif-editorial text-stone-100 mt-1">SoundWave Pro X Wireless Earbuds</h4>
                  
                  <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-emerald-400">Lowest</span>
                      <strong className="text-sm text-stone-100 font-medium">₹2,399</strong>
                      <span className="block text-[10px] text-stone-400 truncate">Metro Elec</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-stone-300">Closest</span>
                      <strong className="text-sm text-stone-100 font-medium">320 m</strong>
                      <span className="block text-[10px] text-stone-400 truncate">Smart Hub</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                      <span className="block font-mono text-[9px] uppercase tracking-wider text-amber-300">Fastest</span>
                      <strong className="text-sm text-stone-100 font-medium">8 min</strong>
                      <span className="block text-[10px] text-stone-400 truncate">Pickup</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-medium text-stone-200">Metro Electronics</span>
                    <p className="text-[11px] text-stone-400 font-light mt-0.5">550 m away • Open till 9:30 PM</p>
                  </div>
                  <button
                    onClick={() => onSelectProduct('prod-earbuds-1')}
                    className="group px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-white text-stone-950 font-medium text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>Compare</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>

              {/* Value Statement */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center gap-2.5 text-xs text-stone-400 font-light">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero guesswork. Verify price and stock before you step outside.</span>
              </div>

            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
