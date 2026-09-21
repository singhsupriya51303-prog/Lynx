import React, { useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Zap, 
  Store, 
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { lynkStore } from '../lib/storage';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onExploreClick: () => void;
  onListStoreClick: () => void;
}

const POPULAR_SEARCH_SUGGESTIONS = [
  'Wireless earbuds',
  'Laptop charger',
  'Running shoes',
  'Organic honey',
  'Coffee',
  'Sambalpuri silk',
  'Thermometer',
];

const CATEGORIES = [
  { id: 'all', label: 'All Market' },
  { id: 'electronics', label: 'Electronics & Audio' },
  { id: 'fashion', label: 'Fashion & Shoes' },
  { id: 'grocery', label: 'Groceries & Gourmet' },
  { id: 'pharmacy', label: 'Pharmacy & Wellness' },
  { id: 'local_crafts', label: 'Local Crafts & Weaves' },
  { id: 'food_beverage', label: 'Roasteries & Cafes' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  selectedCategory,
  setSelectedCategory,
  onExploreClick,
  onListStoreClick,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const currentCity = lynkStore.getCurrentCity();
  const stores = lynkStore.getStores();

  // Vertical parallax driven by page scroll relative to HeroSection
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax offsets: translate downward in local space as page scrolls down,
  // making the imagery glide significantly slower than the foreground text in the viewport.
  const ambientImageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const leftCardParallaxY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const rightCardParallaxY = useTransform(scrollYProgress, [0, 1], [0, 175]);
  const showcaseParallaxY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FAF8F5] border-b border-stone-200/70 pt-10 pb-16 sm:pt-16 sm:pb-24"
    >
      
      {/* Subtle architectural grid pattern */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-stone-200/30 to-transparent blur-3xl pointer-events-none" />

      {/* Subtle Parallax Ambient Architectural Imagery Backdrop */}
      <motion.div 
        style={{ y: ambientImageY }}
        className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 -top-12 -bottom-12"
      >
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80" 
          alt="Neighborhood Architectural Backdrop"
          className="w-full h-full object-cover filter grayscale contrast-125 mix-blend-multiply scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/70 to-[#FAF8F5]" />
      </motion.div>

      {/* Left Floating Editorial Imagery Card (Parallax) */}
      <motion.div 
        style={{ y: leftCardParallaxY }}
        className="hidden xl:block absolute left-6 2xl:left-12 top-28 w-56 2xl:w-64 z-10 pointer-events-none"
      >
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-[24px] border border-stone-200/90 shadow-2xl shadow-stone-900/[0.08] transform -rotate-1 transition-transform duration-500 hover:rotate-0">
          <div className="relative aspect-[4/5] rounded-[18px] overflow-hidden bg-stone-100">
            <img 
              src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80"
              alt="Metro Electronics Showroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#0F1012]/85 backdrop-blur-xs text-[9px] font-mono uppercase tracking-widest text-amber-300 border border-stone-700/50">
              Live In-Store
            </div>
            <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-[10px] text-stone-800 flex items-center justify-between shadow-2xs">
              <span className="font-serif-editorial font-medium">Saheed Nagar</span>
              <span className="text-emerald-700 font-mono text-[9px] font-semibold">550m</span>
            </div>
          </div>
          <div className="pt-2.5 px-1 text-left">
            <div className="font-serif-editorial text-sm text-stone-900 leading-tight">Metro Hub & Audio</div>
            <p className="text-[10px] text-stone-500 font-light mt-0.5">Counter reserve ready</p>
          </div>
        </div>
      </motion.div>

      {/* Right Floating Editorial Imagery Card (Parallax) */}
      <motion.div 
        style={{ y: rightCardParallaxY }}
        className="hidden xl:block absolute right-6 2xl:right-12 top-36 w-56 2xl:w-64 z-10 pointer-events-none"
      >
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-[24px] border border-stone-200/90 shadow-2xl shadow-stone-900/[0.08] transform rotate-1 transition-transform duration-500 hover:rotate-0">
          <div className="relative aspect-[4/5] rounded-[18px] overflow-hidden bg-stone-100">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
              alt="Verified Audio In Stock"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#0F1012]/85 backdrop-blur-xs text-[9px] font-mono uppercase tracking-widest text-emerald-300 border border-stone-700/50">
              Verified Stock
            </div>
            <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-white/90 backdrop-blur-xs text-[10px] text-stone-800 flex items-center justify-between shadow-2xs">
              <span className="font-serif-editorial font-medium">₹2,399</span>
              <span className="text-stone-500 font-mono text-[9px]">14 Units</span>
            </div>
          </div>
          <div className="pt-2.5 px-1 text-left">
            <div className="font-serif-editorial text-sm text-stone-900 leading-tight">Wireless Noise-Cancel</div>
            <p className="text-[10px] text-stone-500 font-light mt-0.5">Pickup in 10 mins</p>
          </div>
        </div>
      </motion.div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Brand Principle Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-stone-300/80 text-stone-800 text-xs shadow-2xs mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500 font-medium">
            THE NETWORK BEHIND THE NEIGHBORHOOD
          </span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-700 font-medium text-[11px]">Real-Time Commerce</span>
        </motion.div>

        {/* Hero Headline - High-contrast editorial display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-serif-editorial text-5xl sm:text-7xl lg:text-[84px] leading-[0.98] tracking-tight text-stone-950 font-normal">
            See what’s around you.
            <span className="block italic font-light text-stone-600 sm:inline sm:ml-4">
              Compare. Discover. Buy.
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed tracking-normal"
        >
          Connect nearby physical shops, verified inventory, live prices, and instant pickup in one view. 
          Your phone is now a real-time window into your neighborhood market.
        </motion.p>

        {/* Core Search Bar with clean editorial silhouette */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-2xl mx-auto"
        >
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-stone-900/[0.04] border border-stone-300 focus-within:border-stone-900 focus-within:ring-2 focus-within:ring-stone-900/10 transition-all p-2">
            <div className="pl-3 sm:pl-4 text-stone-400">
              <Search className="w-5 h-5 text-stone-700" />
            </div>
            
            <input
              id="hero-main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, brands or local market items…"
              className="w-full px-3 py-2.5 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none"
            />

            <button
              id="hero-search-submit-btn"
              onClick={() => onSearchSubmit(searchQuery)}
              className="group px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium tracking-wide shadow-sm flex items-center gap-2 transition-all transform active:scale-95 shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Dynamic Available Inventory & City Counter */}
          <div className="mt-3.5 flex items-center justify-between text-xs text-stone-500 px-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-700" />
              <span>In <strong className="text-stone-900 font-semibold">{currentCity.name}</strong> ({currentCity.locality})</span>
            </div>
            <div className="font-medium text-stone-700">
              {stores.length * 480}+ verified items in stock today
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-4 flex items-center flex-wrap justify-center gap-1.5 text-xs">
            <span className="text-stone-400 font-medium mr-1">Trending nearby:</span>
            {POPULAR_SEARCH_SUGGESTIONS.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSearchQuery(item);
                  onSearchSubmit(item);
                }}
                className="px-3 py-1 rounded-full bg-white/90 border border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-950 transition-colors shadow-2xs font-normal"
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Pills Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-stone-950 text-white shadow-xs'
                  : 'bg-white border border-stone-200/90 text-stone-600 hover:text-stone-950 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Primary CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex items-center justify-center gap-3 sm:gap-4"
        >
          <button
            id="hero-explore-market-btn"
            onClick={onExploreClick}
            className="group px-7 py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm tracking-wide shadow-sm transition-all flex items-center gap-2"
          >
            <span>Explore The Market</span>
            <ArrowRight className="w-4 h-4 text-amber-300 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <button
            id="hero-list-store-btn"
            onClick={onListStoreClick}
            className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white border border-stone-300 hover:border-stone-400 text-stone-800 font-medium text-xs sm:text-sm tracking-wide shadow-2xs transition-all flex items-center gap-2"
          >
            <Store className="w-4 h-4 text-stone-600" />
            <span>List Your Store</span>
          </button>
        </motion.div>

        {/* Editorial Hero Imagery Showcase (Parallax Layer) */}
        {/* Moves vertically slower than the text during page scroll via showcaseParallaxY */}
        <motion.div
          style={{ y: showcaseParallaxY }}
          className="mt-14 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            
            {/* Card 1: Handloom & Crafts */}
            <div className="group relative rounded-[22px] overflow-hidden bg-white border border-stone-200/90 p-2.5 shadow-lg shadow-stone-900/[0.03] transition-all hover:shadow-xl">
              <div className="relative aspect-[16/11] rounded-[16px] overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=700&q=80"
                  alt="Authentic Silk & Weaves"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0F1012]/85 text-amber-300 text-[9px] font-mono uppercase tracking-wider backdrop-blur-xs">
                  Handlooms
                </div>
              </div>
              <div className="pt-3 pb-1 px-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-editorial text-base text-stone-900 font-medium">Utkal Handloom Guild</h4>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                    Open Now
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Sambalpuri silk & organic cottons</p>
              </div>
            </div>

            {/* Card 2: Consumer Tech & Electronics */}
            <div className="group relative rounded-[22px] overflow-hidden bg-white border border-stone-200/90 p-2.5 shadow-lg shadow-stone-900/[0.03] transition-all hover:shadow-xl">
              <div className="relative aspect-[16/11] rounded-[16px] overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=700&q=80"
                  alt="Smart Electronics Hub"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0F1012]/85 text-emerald-400 text-[9px] font-mono uppercase tracking-wider backdrop-blur-xs">
                  Direct Counter
                </div>
              </div>
              <div className="pt-3 pb-1 px-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-editorial text-base text-stone-900 font-medium">Metro Tech Janpath</h4>
                  <span className="font-mono text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded-md border border-stone-200">
                    550m away
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Verified local warranties & live testing</p>
              </div>
            </div>

            {/* Card 3: Roasteries & Organic Pantry */}
            <div className="group relative rounded-[22px] overflow-hidden bg-white border border-stone-200/90 p-2.5 shadow-lg shadow-stone-900/[0.03] transition-all hover:shadow-xl">
              <div className="relative aspect-[16/11] rounded-[16px] overflow-hidden bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80"
                  alt="Artisan Roasteries & Pantry"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0F1012]/85 text-amber-300 text-[9px] font-mono uppercase tracking-wider backdrop-blur-xs">
                  Gourmet
                </div>
              </div>
              <div className="pt-3 pb-1 px-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-editorial text-base text-stone-900 font-medium">Koraput Coffee Lab</h4>
                  <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                    Fresh Roast
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-light mt-0.5">Estate beans & artisanal honey</p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* 3 Core Pillars */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 pt-10 border-t border-stone-200/70 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-3.5">
            <span className="font-mono text-xs font-semibold text-stone-400 mt-0.5">01</span>
            <div>
              <h4 className="font-serif-editorial text-lg text-stone-950 font-normal">Search & Discover</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Tell LYNK what you need. See which neighborhood shops have it in stock.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="font-mono text-xs font-semibold text-stone-400 mt-0.5">02</span>
            <div>
              <h4 className="font-serif-editorial text-lg text-stone-950 font-normal">Real-Time Comparison</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Compare price, walking distance, offers, and pickup times side-by-side.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <span className="font-mono text-xs font-semibold text-stone-400 mt-0.5">03</span>
            <div>
              <h4 className="font-serif-editorial text-lg text-stone-950 font-normal">Connect & Transact</h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Reserve for 30 mins, navigate to the shop, or order for doorstep delivery.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
