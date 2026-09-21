import React from 'react';
import { Sparkles, Map, SlidersHorizontal, Store, RotateCcw } from 'lucide-react';

interface GuidedDemoBannerProps {
  onTriggerScenario: (scenario: 'compare_earbuds' | 'map_navigate' | 'shop_inventory' | 'ask_ai') => void;
  onReset: () => void;
}

export const GuidedDemoBanner: React.FC<GuidedDemoBannerProps> = ({
  onTriggerScenario,
  onReset,
}) => {
  return (
    <aside aria-label="Demo scenarios" className="bg-[#121316] text-[#FAF8F5] border-b border-white/[0.08] px-4 py-2 text-xs relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span className="font-mono uppercase tracking-widest text-[10px] text-amber-300/90 font-medium">
            LIVE SYSTEM
          </span>
          <span className="text-white/20 hidden sm:inline">|</span>
          <span className="text-stone-300 text-xs hidden sm:inline font-light tracking-wide">
            One-Click Scenarios:
          </span>
        </div>

        {/* Quick Scenario Buttons with editorial pill aesthetic */}
        <div className="flex items-center flex-wrap gap-1.5">
          <button
            onClick={() => onTriggerScenario('compare_earbuds')}
            className="group px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-stone-200 border border-white/[0.08] hover:border-white/20 text-[11px] font-medium transition-all duration-200 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3 h-3 text-stone-400 group-hover:text-white transition-colors" />
            <span>1. Compare Earbuds</span>
          </button>

          <button
            onClick={() => onTriggerScenario('map_navigate')}
            className="group px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-stone-200 border border-white/[0.08] hover:border-white/20 text-[11px] font-medium transition-all duration-200 flex items-center gap-1.5"
          >
            <Map className="w-3 h-3 text-stone-400 group-hover:text-emerald-400 transition-colors" />
            <span>2. Live Map</span>
          </button>

          <button
            onClick={() => onTriggerScenario('shop_inventory')}
            className="group px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-stone-200 border border-white/[0.08] hover:border-white/20 text-[11px] font-medium transition-all duration-200 flex items-center gap-1.5"
          >
            <Store className="w-3 h-3 text-stone-400 group-hover:text-amber-400 transition-colors" />
            <span>3. Shop Owner</span>
          </button>

          <button
            onClick={() => onTriggerScenario('ask_ai')}
            className="group px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-stone-200 border border-white/[0.08] hover:border-white/20 text-[11px] font-medium transition-all duration-200 flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>4. LYNK AI</span>
          </button>

          <button
            onClick={onReset}
            className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-stone-400 hover:text-white border border-white/[0.06] transition-all duration-200 ml-1"
            title="Reset to default seed data"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

      </div>
    </aside>
  );
};
