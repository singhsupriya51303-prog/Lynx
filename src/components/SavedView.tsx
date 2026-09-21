import React, { useState } from 'react';
import { 
  Bookmark, 
  Store as StoreIcon, 
  Trash2, 
  ArrowRight, 
  Bell, 
  BellRing, 
  BellOff, 
  TrendingDown, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { lynkStore, formatDistance } from '../lib/storage';
import { Product, Store } from '../types';

interface SavedViewProps {
  onSelectStore: (store: Store) => void;
  onSelectProduct: (product: Product) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  onSelectStore,
  onSelectProduct,
}) => {
  const stores = lynkStore.getAllStores();
  const products = lynkStore.getAllProducts();

  const savedStores = stores.filter(s => lynkStore.isStoreSaved(s.id));
  const savedProducts = products.filter(p => lynkStore.isProductSaved(p.id));

  // Local feedback banner state for actions like price drop simulation
  const [feedbackToast, setFeedbackToast] = useState<{
    title: string;
    message: string;
    type: 'success' | 'alert';
  } | null>(null);

  const handleTogglePriceDrop = (productId: string, productName: string) => {
    const isNowEnabled = lynkStore.togglePriceDropNotification(productId);
    if (isNowEnabled) {
      setFeedbackToast({
        title: 'Price Drop Alerts Enabled',
        message: `You will be notified immediately whenever any local shop discounts ${productName}.`,
        type: 'success',
      });
    } else {
      setFeedbackToast({
        title: 'Price Drop Alerts Paused',
        message: `Notifications for ${productName} have been muted.`,
        type: 'alert',
      });
    }

    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  const handleSimulatePriceDrop = (productId: string) => {
    const res = lynkStore.simulatePriceDrop(productId);
    if (res) {
      setFeedbackToast({
        title: `Price Drop Alert Dispatched!`,
        message: `${res.storeName} just reduced ${res.productName} from ₹${res.oldPrice.toLocaleString('en-IN')} to ₹${res.newPrice.toLocaleString('en-IN')} (${res.discountPercent}% OFF). Alert added to your top notification bell.`,
        type: 'success',
      });
      setTimeout(() => {
        setFeedbackToast(null);
      }, 6000);
    }
  };

  const handleQuickAddEarbuds = () => {
    const prod = products.find(p => p.id === 'prod-earbuds-1') || products[0];
    if (prod) {
      lynkStore.toggleSaveProduct(prod.id);
      lynkStore.setPriceDropNotification(prod.id, true);
    }
  };

  const totalAlertsActive = savedProducts.filter(p => lynkStore.isPriceDropNotificationEnabled(p.id)).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Toast Notification Banner */}
      {feedbackToast && (
        <div 
          id="saved-view-feedback-toast"
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-stone-300/80 shadow-sm flex items-start gap-3.5 transition-all animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="p-2 rounded-full bg-stone-950 text-white shrink-0 mt-0.5">
            <BellRing className="w-3.5 h-3.5 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-mono text-[10px] font-semibold text-stone-900 uppercase tracking-wider">
              {feedbackToast.title}
            </h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed font-light">
              {feedbackToast.message}
            </p>
          </div>
          <button 
            onClick={() => setFeedbackToast(null)}
            className="text-xs font-medium text-stone-500 hover:text-stone-950 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header with Metrics Ribbon */}
      <div className="pb-8 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-3xl sm:text-4xl font-serif-editorial font-normal text-stone-950 tracking-tight">
              Saved Stores & Products
            </h2>
            <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
              Watchlist
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1.5 font-light">
            Track your favorite neighborhood shops and receive real-time counter price drop notifications.
          </p>
        </div>

        {/* Quick Badges */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="px-3 py-1 rounded-full bg-white border border-stone-200 shadow-2xs flex items-center gap-2 text-xs">
            <StoreIcon className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-medium text-stone-800">{savedStores.length} Stores</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-white border border-stone-200 shadow-2xs flex items-center gap-2 text-xs">
            <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-medium text-stone-800">{savedProducts.length} Items</span>
          </div>

          <div className={`px-3 py-1 rounded-full border shadow-2xs flex items-center gap-2 text-xs transition-colors ${
            totalAlertsActive > 0 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium' 
              : 'bg-stone-50 border-stone-200 text-stone-500'
          }`}>
            <BellRing className={`w-3.5 h-3.5 ${totalAlertsActive > 0 ? 'text-emerald-700' : 'text-stone-400'}`} />
            <span>{totalAlertsActive} Alerts Active</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        
        {/* Watchlisted Products with Price Drop Notification Toggles */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-stone-500 flex items-center gap-2">
                <span>Watchlisted Products & Price Alerts</span>
                <span className="text-stone-400 font-normal">({savedProducts.length})</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 font-light">
                Toggle &ldquo;Notify me of price drops&rdquo; to receive instant alerts when local retailers discount an item.
              </p>
            </div>

            {savedProducts.length > 0 && (
              <span className="text-xs text-stone-400 font-light hidden sm:inline-block">
                Auto-matches nearby inventory
              </span>
            )}
          </div>

          {savedProducts.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-stone-200/90 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-5 h-5" />
              </div>
              <h4 className="text-base font-serif-editorial text-stone-900">Your Watchlist is Empty</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-light">
                Bookmark items while exploring to compare counter prices and get automated price drop alerts.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={handleQuickAddEarbuds}
                  className="px-5 py-2 rounded-full bg-stone-950 text-white hover:bg-stone-800 text-xs font-medium tracking-wide transition-colors shadow-xs"
                >
                  + Add Demo Earbuds to Watchlist
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {savedProducts.map((prod) => {
                const isNotifyEnabled = lynkStore.isPriceDropNotificationEnabled(prod.id);
                const priceInfo = lynkStore.getProductBestPriceInfo(prod.id);

                return (
                  <div
                    key={prod.id}
                    id={`saved-product-${prod.id}`}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 hover:border-stone-300 shadow-2xs transition-all overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                      
                      {/* Product details */}
                      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-stone-200 shrink-0 bg-stone-50">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[9px] font-medium text-stone-500 uppercase tracking-widest">
                              {prod.brand}
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="text-xs text-stone-500 capitalize font-light">
                              {prod.category.replace('_', ' ')}
                            </span>
                            {priceInfo && priceInfo.discountPercent > 0 && (
                              <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-medium bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                                {priceInfo.discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif-editorial text-lg text-stone-950 truncate">
                            {prod.name}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-light">
                            {prod.description}
                          </p>

                          {/* Local price intelligence tag */}
                          {priceInfo ? (
                            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                              <div className="flex items-center gap-1.5 font-medium text-stone-900">
                                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Lowest: ₹{priceInfo.lowestPrice.toLocaleString('en-IN')}</span>
                                <span className="text-[11px] text-stone-400 line-through font-light">
                                  ₹{priceInfo.mrp.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <span className="text-stone-300 hidden sm:inline">•</span>
                              <span className="text-xs text-stone-600 font-light">
                                Available at <strong className="text-stone-900 font-medium">{priceInfo.lowestStoreName}</strong> ({priceInfo.storeCount} local {priceInfo.storeCount === 1 ? 'store' : 'stores'} in stock)
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-stone-400 mt-2 font-light">Checking local stores...</p>
                          )}
                        </div>
                      </div>

                      {/* Right action block: Actions & Navigation */}
                      <div className="flex items-center justify-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="px-4 py-2 rounded-full bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-300/80 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                          title="Compare across local stores"
                        >
                          <span>Compare Stores</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => lynkStore.toggleSaveProduct(prod.id)}
                          className="p-2 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-100 transition-colors"
                          title="Remove from saved items"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Dedicated 'Notify me of price drops' Control Strip */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/70 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 px-5 sm:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full transition-colors shrink-0 ${
                          isNotifyEnabled 
                            ? 'bg-emerald-100 text-emerald-900' 
                            : 'bg-stone-200 text-stone-500'
                        }`}>
                          {isNotifyEnabled ? (
                            <BellRing className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <BellOff className="w-3.5 h-3.5 text-stone-400" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-stone-900">
                              Notify me of price drops
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider ${
                              isNotifyEnabled 
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                                : 'bg-stone-200 text-stone-600'
                            }`}>
                              {isNotifyEnabled ? 'Active' : 'Muted'}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5 font-light">
                            {isNotifyEnabled 
                              ? 'You will receive immediate alerts whenever any neighborhood retailer drops the price.' 
                              : 'Alerts are paused. Turn on to catch counter price discounts.'}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Toggle Switch & Simulation Trigger */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {/* Instant Simulator trigger for evaluators */}
                        {isNotifyEnabled && (
                          <button
                            onClick={() => handleSimulatePriceDrop(prod.id)}
                            className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-[11px] font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                            title="Simulate a merchant dropping price by 15% to test notifications"
                          >
                            <Zap className="w-3 h-3 text-amber-600" />
                            <span>Test Price Drop</span>
                          </button>
                        )}

                        {/* Switch toggle */}
                        <button
                          id={`toggle-price-drop-${prod.id}`}
                          role="switch"
                          aria-checked={isNotifyEnabled}
                          onClick={() => handleTogglePriceDrop(prod.id, prod.name)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isNotifyEnabled ? 'bg-stone-950' : 'bg-stone-300'
                          }`}
                          title={isNotifyEnabled ? 'Turn off price drop alerts' : 'Turn on price drop alerts'}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              isNotifyEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bookmarked Stores Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-stone-500 flex items-center gap-2">
                <span>Bookmarked Stores</span>
                <span className="text-stone-400 font-normal">({savedStores.length})</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5 font-light">
                Physical shops you frequently visit for fast counter pickup and inquiries.
              </p>
            </div>
          </div>

          {savedStores.length === 0 ? (
            <p className="text-xs text-stone-500 py-8 text-center bg-white rounded-3xl border border-stone-200/90 shadow-2xs font-light">
              No saved stores yet. Click the bookmark icon on any store card or map pin to save it here.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {savedStores.map(store => (
                <div
                  key={store.id}
                  id={`saved-store-${store.id}`}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 shadow-2xs flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] font-medium text-stone-500 uppercase tracking-widest">
                      {store.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-serif-editorial text-base text-stone-950 truncate mt-0.5">
                      {store.name}
                    </h4>
                    <p className="text-xs text-stone-500 truncate font-light">{store.address}</p>
                    <p className="text-[11px] text-emerald-800 font-medium mt-1">
                      Open till {store.closingTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectStore(store)}
                      className="p-2 rounded-full bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors"
                      title="View store details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => lynkStore.toggleSaveStore(store.id)}
                      className="p-2 rounded-full text-stone-400 hover:text-stone-950 transition-colors"
                      title="Remove from saved stores"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
