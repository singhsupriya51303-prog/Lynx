import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Share2, 
  Bookmark, 
  Search, 
  Tag, 
  CheckCircle2, 
  Navigation, 
  ArrowRight 
} from 'lucide-react';
import { Store, Product, StoreProduct } from '../types';
import { lynkStore, formatDistance } from '../lib/storage';

interface StoreDetailModalProps {
  store: Store;
  onClose: () => void;
  onReserveProduct: (product: Product, store: Store, price: number) => void;
  onCheckoutProduct: (product: Product, store: Store, price: number) => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({
  store,
  onClose,
  onReserveProduct,
  onCheckoutProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'offers' | 'reviews' | 'about'>('products');
  const [productSearch, setProductSearch] = useState('');

  const storeProducts = lynkStore.getStoreProducts(store.id);
  const allProducts = lynkStore.getAllProducts();
  const offers = lynkStore.getOffers(store.id);

  // Join product details with store pricing
  const inventoryItems = storeProducts.map(sp => {
    const prod = allProducts.find(p => p.id === sp.productId);
    return {
      storeProduct: sp,
      product: prod,
    };
  }).filter((item): item is { storeProduct: StoreProduct; product: Product } => item.product !== undefined);

  const filteredInventory = inventoryItems.filter(item => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      item.product.name.toLowerCase().includes(q) ||
      item.product.brand.toLowerCase().includes(q) ||
      item.product.category.toLowerCase().includes(q)
    );
  });

  const isSaved = lynkStore.isStoreSaved(store.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 relative text-slate-900 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Cover & Hero Header */}
        <div className="relative h-44 sm:h-52 bg-slate-900 shrink-0">
          <img
            src={store.coverUrl || store.imageUrl}
            alt={store.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => lynkStore.toggleSaveStore(store.id)}
              className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 backdrop-blur-xs transition-colors"
              title="Save store"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 backdrop-blur-xs transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Store Identification Details overlaid on hero */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {store.category.replace('_', ' ')}
                </span>
                {store.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-600/90 px-2 py-0.5 rounded-full border border-blue-400/40">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Local Merchant
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                {store.name}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {store.tagline || store.address}
              </p>
            </div>

            {/* Rating pill */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm">{store.rating}</span>
              <span className="text-xs text-slate-400">({store.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Store Key Facts Row */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>{store.locality}, {store.city} ({formatDistance(store.distanceKm || 0.5)} away)</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <Clock className="w-4 h-4" />
            <span>Open today: {store.openingTime} – {store.closingTime}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-700 font-mono">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{store.phone}</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-4 text-xs font-bold overflow-x-auto scrollbar-none">
          {[
            { id: 'products', label: `In-Stock Products (${inventoryItems.length})` },
            { id: 'overview', label: 'Store Overview' },
            { id: 'offers', label: `Active Offers (${offers.length})` },
            { id: 'reviews', label: 'Customer Reviews' },
            { id: 'about', label: 'About & Timing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents (Scrollable Area) */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: PRODUCTS IN STOCK */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* In-Store Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder={`Search ${inventoryItems.length} products available at this counter…`}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Product Listing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredInventory.map(({ storeProduct, product }) => {
                  const discount = Math.round(((storeProduct.mrp - storeProduct.price) / storeProduct.mrp) * 100);
                  
                  return (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs flex flex-col justify-between transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {product.description}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {storeProduct.stockQuantity} in stock
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Pickup: {storeProduct.estimatedPickupMinutes}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and CTAs */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-display font-extrabold text-slate-950">
                              ₹{storeProduct.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 line-through">
                              ₹{storeProduct.mrp.toLocaleString('en-IN')}
                            </span>
                          </div>
                          {discount > 0 && (
                            <span className="text-[10px] text-emerald-600 font-bold block">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onReserveProduct(product, store, storeProduct.price)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold transition-colors"
                          >
                            Reserve
                          </button>
                          <button
                            onClick={() => onCheckoutProduct(product, store, storeProduct.price)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                          >
                            Buy
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900">About {store.name}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {store.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="text-xs font-bold text-blue-900 block">Immediate Handover</span>
                  <span className="text-[11px] text-blue-700 mt-0.5 block">Dedicated counter pickup queue</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-900 block">Price Protection</span>
                  <span className="text-[11px] text-emerald-700 mt-0.5 block">Online price honored in-store</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                  <span className="text-xs font-bold text-amber-900 block">Official Warranty</span>
                  <span className="text-[11px] text-amber-700 mt-0.5 block">Authorized retail dealer bill</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OFFERS */}
          {activeTab === 'offers' && (
            <div className="space-y-3">
              {offers.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No active promotional campaigns right now.</p>
              ) : (
                offers.map(off => (
                  <div key={off.id} className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                        {off.badgeText || 'SPECIAL OFFER'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-950 mt-1">{off.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{off.description}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Valid till {off.endDate}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-2xl font-display font-bold text-slate-900">{store.rating} / 5.0</span>
                  <p className="text-xs text-slate-500">Based on {store.reviewCount} customer visits</p>
                </div>
              </div>

              {/* Sample verified customer feedback */}
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Debashish M.</span>
                    <span className="text-[11px] text-slate-400">Yesterday</span>
                  </div>
                  <div className="flex text-amber-400 my-1">
                    {'★★★★★'}
                  </div>
                  <p className="text-slate-600">
                    "Reserved earbuds on LYNK while taking the auto from Master Canteen. Walked into the shop, showed the 4-digit code, and had the item in my hand in 2 minutes. Outstanding!"
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Pooja K.</span>
                    <span className="text-[11px] text-slate-400">3 days ago</span>
                  </div>
                  <div className="flex text-amber-400 my-1">
                    {'★★★★★'}
                  </div>
                  <p className="text-slate-600">
                    "Great price match with online marketplaces, plus I got to verify the sealed pack right in front of me."
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT & TIMING */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Store Schedule</h5>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Monday – Saturday</span>
                    <span className="font-semibold">{store.openingTime} – {store.closingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">10:00 AM – 08:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Merchant Location Details</h5>
                <p className="leading-relaxed">{store.address}</p>
                <p className="text-slate-500 mt-1">Landmark: Opposite Ashok Nagar Post Office</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
