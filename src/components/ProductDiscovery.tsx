import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Check, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowUpDown, 
  TrendingDown, 
  Zap, 
  Store as StoreIcon, 
  Bookmark, 
  ChevronRight, 
  Sparkles,
  ShoppingBag,
  BellRing
} from 'lucide-react';
import { Product, Store, ComparisonStoreOption } from '../types';
import { lynkStore, formatDistance } from '../lib/storage';

interface ProductDiscoveryProps {
  onSelectProduct: (product: Product) => void;
  onSelectStore: (store: Store) => void;
  onOpenReserve: (product: Product, store: Store, price: number) => void;
  onOpenCheckout: (product: Product, store: Store, price: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const ProductDiscovery: React.FC<ProductDiscoveryProps> = ({
  onSelectProduct,
  onSelectStore,
  onOpenReserve,
  onOpenCheckout,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  // Filter States
  const [maxDistance, setMaxDistance] = useState<number>(5); // km
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [pickupOnly, setPickupOnly] = useState<boolean>(false);
  const [deliveryOnly, setDeliveryOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'distance' | 'pickup_time'>('recommended');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-earbuds-1');

  const allProducts = lynkStore.getAllProducts();
  const currentCity = lynkStore.getCurrentCity();

  // Filter Products
  const filteredProducts = allProducts.filter((prod) => {
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      const matchCat = prod.category.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  // Current active product comparison
  const activeProduct = allProducts.find(p => p.id === selectedProductId) || filteredProducts[0] || allProducts[0];
  const rawComparison = lynkStore.getProductComparison(activeProduct.id);

  // Apply filters to comparison options
  let comparisonOptions = rawComparison.filter((opt) => {
    if (opt.distanceKm > maxDistance) return false;
    if (inStockOnly && opt.storeProduct.stockQuantity <= 0) return false;
    if (pickupOnly && !opt.storeProduct.pickupAvailable) return false;
    if (deliveryOnly && !opt.storeProduct.deliveryAvailable) return false;
    return true;
  });

  // Sort comparison
  if (sortBy === 'price_low') {
    comparisonOptions.sort((a, b) => a.storeProduct.price - b.storeProduct.price);
  } else if (sortBy === 'distance') {
    comparisonOptions.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'pickup_time') {
    comparisonOptions.sort((a, b) => a.storeProduct.estimatedPickupMinutes - b.storeProduct.estimatedPickupMinutes);
  }

  // Find highlights
  const lowestPriceOpt = rawComparison.find(c => c.isLowestPrice);
  const closestOpt = rawComparison.find(c => c.isClosest);
  const fastestPickupOpt = rawComparison.find(c => c.isFastestPickup);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-8 border-b border-stone-200/80">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
            VERIFIED LOCAL INVENTORY
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-editorial font-normal text-stone-950 tracking-tight">
            Real-Time Product & Price Comparison
          </h2>
          <p className="text-xs text-stone-500 mt-1 font-light">
            Comparing live store inventory, actual counter prices, and instant pickup in <strong className="text-stone-800 font-medium">{currentCity.name}</strong>
          </p>
        </div>

        {/* Quick Filter Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-full p-1 text-xs shadow-2xs">
            <span className="text-stone-400 px-2.5 text-[11px] font-medium">Distance:</span>
            {[1, 3, 5, 10].map((dist) => (
              <button
                key={dist}
                onClick={() => setMaxDistance(dist)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  maxDistance === dist 
                    ? 'bg-stone-950 text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                ≤ {dist} km
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 text-stone-800 text-xs font-medium rounded-full px-4 py-2 shadow-2xs focus:outline-none focus:border-stone-900 cursor-pointer appearance-none pr-8"
            >
              <option value="recommended">Best Overall</option>
              <option value="price_low">Lowest Price First</option>
              <option value="distance">Nearest First</option>
              <option value="pickup_time">Fastest In-Store Pickup</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Main Comparison Layout: Left Products List, Center Comparison Matrix */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Selection Grid (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              Select Product to Compare ({filteredProducts.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[740px] overflow-y-auto pr-1">
            {filteredProducts.map((prod) => {
              const isSelected = prod.id === activeProduct.id;
              const comparisonCount = lynkStore.getProductComparison(prod.id).length;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`group p-3 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-white border-stone-950 shadow-md ring-1 ring-stone-950/10'
                      : 'bg-white/70 border-stone-200/80 hover:bg-white hover:border-stone-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200/80 bg-stone-100 shrink-0">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[9px] font-medium text-stone-500 uppercase tracking-widest">
                      {prod.brand}
                    </span>
                    <h4 className="text-xs font-semibold text-stone-950 truncate mt-0.5">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1 font-light">
                      {prod.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] font-medium text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                        {comparisonCount} local stores in stock
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-stone-950 translate-x-0.5' : 'text-stone-300 group-hover:text-stone-500'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Product Head-to-Head Comparison Matrix (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Product Headline Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 shrink-0 shadow-2xs">
                  <img
                    src={activeProduct.imageUrl}
                    alt={activeProduct.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-stone-500">
                      {activeProduct.brand}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500 capitalize">{activeProduct.category.replace('_', ' ')}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif-editorial font-normal text-stone-950 mt-1 tracking-tight">
                    {activeProduct.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 max-w-xl font-light leading-relaxed">
                    {activeProduct.description}
                  </p>
                </div>
              </div>

              {/* Actions: Price Alert & Bookmark */}
              <div className="flex items-center gap-2 self-start shrink-0">
                <button
                  onClick={() => lynkStore.togglePriceDropNotification(activeProduct.id)}
                  className={`px-3.5 py-2 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all ${
                    lynkStore.isPriceDropNotificationEnabled(activeProduct.id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400 bg-white'
                  }`}
                  title={lynkStore.isPriceDropNotificationEnabled(activeProduct.id) ? 'Price drop alerts active (Click to mute)' : 'Notify me of price drops'}
                >
                  <BellRing className={`w-3.5 h-3.5 ${lynkStore.isPriceDropNotificationEnabled(activeProduct.id) ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span className="hidden sm:inline">
                    {lynkStore.isPriceDropNotificationEnabled(activeProduct.id) ? 'Alert Active' : 'Notify Price Drop'}
                  </span>
                </button>

                <button
                  onClick={() => lynkStore.toggleSaveProduct(activeProduct.id)}
                  className="p-2 rounded-full border border-stone-200 hover:border-stone-400 text-stone-600 hover:text-stone-950 transition-colors bg-white shadow-2xs"
                  title="Save product"
                >
                  <Bookmark className={`w-4 h-4 ${lynkStore.isProductSaved(activeProduct.id) ? 'fill-stone-900 text-stone-900' : ''}`} />
                </button>
              </div>
            </div>

            {/* 3 Core Highlights Cards (Lowest Price, Closest Store, Fastest Pickup) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              
              {/* Highlight 1: Lowest Price */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 shadow-2xs">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500">Lowest Price</span>
                </div>
                {lowestPriceOpt ? (
                  <div className="mt-2.5">
                    <div className="text-2xl font-serif-editorial font-normal text-stone-950">
                      ₹{lowestPriceOpt.storeProduct.price.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs font-medium text-stone-800 mt-0.5 truncate">
                      {lowestPriceOpt.store.name}
                    </p>
                    <p className="text-[11px] text-stone-500 font-light">
                      {formatDistance(lowestPriceOpt.distanceKm)} away
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 mt-2 font-light">No stores available</p>
                )}
              </div>

              {/* Highlight 2: Closest Store */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 shadow-2xs">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <MapPin className="w-3.5 h-3.5 text-stone-600" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500">Closest Store</span>
                </div>
                {closestOpt ? (
                  <div className="mt-2.5">
                    <div className="text-2xl font-serif-editorial font-normal text-stone-950">
                      {formatDistance(closestOpt.distanceKm)}
                    </div>
                    <p className="text-xs font-medium text-stone-800 mt-0.5 truncate">
                      {closestOpt.store.name}
                    </p>
                    <p className="text-[11px] text-stone-500 font-light">
                      ₹{closestOpt.storeProduct.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 mt-2 font-light">No stores available</p>
                )}
              </div>

              {/* Highlight 3: Fastest Pickup */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/80 shadow-2xs">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500">Fastest Pickup</span>
                </div>
                {fastestPickupOpt ? (
                  <div className="mt-2.5">
                    <div className="text-2xl font-serif-editorial font-normal text-stone-950">
                      {fastestPickupOpt.storeProduct.estimatedPickupMinutes} min
                    </div>
                    <p className="text-xs font-medium text-stone-800 mt-0.5 truncate">
                      {fastestPickupOpt.store.name}
                    </p>
                    <p className="text-[11px] text-stone-500 font-light">
                      Ready at counter
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 mt-2 font-light">No stores available</p>
                )}
              </div>

            </div>
          </div>

          {/* Detailed Side-by-Side Store Cards */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-500">
                Stores with verified live inventory ({comparisonOptions.length})
              </h4>
              <span className="text-xs font-light text-stone-500">Includes 30-min price guarantee</span>
            </div>

            {comparisonOptions.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                <StoreIcon className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-sm font-medium text-stone-700 mt-2">No nearby stores matched current filters</p>
                <button
                  onClick={() => {
                    setMaxDistance(10);
                    setInStockOnly(false);
                    setPickupOnly(false);
                  }}
                  className="mt-3 px-5 py-2 rounded-full bg-stone-950 text-white text-xs font-medium tracking-wide shadow-xs"
                >
                  Expand Search Radius
                </button>
              </div>
            ) : (
              comparisonOptions.map((opt) => {
                const discount = Math.round(((opt.storeProduct.mrp - opt.storeProduct.price) / opt.storeProduct.mrp) * 100);
                
                return (
                  <div
                    key={opt.store.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-2xs hover:shadow-md hover:border-stone-300 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                  >
                    
                    {/* Store Info & Superlative Badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1.5">
                        <button
                          onClick={() => onSelectStore(opt.store)}
                          className="font-serif-editorial text-lg text-stone-950 hover:text-stone-700 transition-colors text-left"
                        >
                          {opt.store.name}
                        </button>
                        
                        {opt.isLowestPrice && (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                            LOWEST PRICE
                          </span>
                        )}

                        {opt.isClosest && (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
                            CLOSEST
                          </span>
                        )}

                        {opt.isFastestPickup && (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-amber-100/80 text-amber-900 border border-amber-200">
                            FASTEST PICKUP
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-1 font-light">
                        {opt.store.address}
                      </p>

                      {/* Store Meta Row */}
                      <div className="mt-3.5 flex items-center flex-wrap gap-3 text-xs text-stone-600">
                        <span className="flex items-center gap-1 font-medium text-stone-800">
                          <MapPin className="w-3.5 h-3.5 text-stone-500" />
                          {formatDistance(opt.distanceKm)} ({opt.walkingMinutes} min walk)
                        </span>

                        <span className="flex items-center gap-1 font-medium text-emerald-800">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          {opt.storeProduct.stockQuantity} in stock
                        </span>

                        <span className="flex items-center gap-1 text-stone-500 font-light">
                          <Clock className="w-3.5 h-3.5" />
                          Pickup in {opt.storeProduct.estimatedPickupMinutes} min
                        </span>

                        {opt.storeProduct.deliveryAvailable && (
                          <span className="text-stone-700 font-light bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                            Express 2-hr delivery
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 gap-3">
                      <div className="text-left sm:text-right">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-serif-editorial text-stone-950 font-normal">
                            ₹{opt.storeProduct.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-stone-400 line-through">
                            ₹{opt.storeProduct.mrp.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {discount > 0 && (
                          <span className="text-[11px] font-medium text-emerald-700">
                            Save {discount}% off MRP
                          </span>
                        )}
                      </div>

                      {/* Reserve & Buy CTA */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenReserve(activeProduct, opt.store, opt.storeProduct.price)}
                          className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300/80 text-xs font-medium tracking-wide transition-colors shadow-2xs"
                          title="Hold for 30 minutes with zero upfront payment"
                        >
                          Reserve (30m)
                        </button>

                        <button
                          onClick={() => onOpenCheckout(activeProduct, opt.store, opt.storeProduct.price)}
                          className="px-5 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-medium tracking-wide shadow-xs transition-all transform active:scale-95"
                        >
                          Buy Now
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
