import React, { useState } from 'react';
import { 
  X, 
  Store as StoreIcon, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { lynkStore } from '../lib/storage';

interface ShopOwnerOnboardingProps {
  onClose: () => void;
  onStoreCreated: () => void;
}

export const ShopOwnerOnboarding: React.FC<ShopOwnerOnboardingProps> = ({
  onClose,
  onStoreCreated,
}) => {
  const [step, setStep] = useState<number>(1);
  const currentCity = lynkStore.getCurrentCity();

  // Form Fields
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState('electronics');
  const [locality, setLocality] = useState(currentCity.locality);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('+91 94370 00000');
  const [openingTime, setOpeningTime] = useState('09:30 AM');
  const [closingTime, setClosingTime] = useState('09:30 PM');
  
  // First product
  const [firstProductName, setFirstProductName] = useState('');
  const [firstProductPrice, setFirstProductPrice] = useState('1999');
  const [firstProductStock, setFirstProductStock] = useState('8');

  const handleFinishOnboarding = () => {
    // Generate new store in the system
    const newStoreId = `store-user-${Date.now()}`;
    const newStore: any = {
      id: newStoreId,
      ownerId: 'user-demo-customer',
      name: storeName || 'New Neighborhood Shop',
      tagline: 'Fresh arrivals & best counter prices',
      description: 'Serving genuine products with warranty and immediate in-store counter pickup.',
      category: category as any,
      storeType: 'local_shop' as const,
      address: address || `${locality}, ${currentCity.name}`,
      locality,
      city: currentCity.name,
      latitude: currentCity.latitude + (Math.random() - 0.5) * 0.015,
      longitude: currentCity.longitude + (Math.random() - 0.5) * 0.015,
      phone,
      openingTime,
      closingTime,
      isOpenNow: true,
      rating: 4.8,
      reviewCount: 1,
      isVerified: true,
      imageUrl: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
    };

    // Add to storage
    const allStores = lynkStore.getAllStores();
    allStores.unshift(newStore);

    if (firstProductName.trim()) {
      lynkStore.addProductToStore(
        newStoreId,
        {
          name: firstProductName,
          brand: storeName,
          category: category as any,
          description: 'In-store inventory item available today.',
          imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80',
          specifications: { 'Warranty': '1 Year Brand Warranty' },
        },
        {
          price: Number(firstProductPrice),
          mrp: Math.round(Number(firstProductPrice) * 1.3),
          stockQuantity: Number(firstProductStock),
          pickupAvailable: true,
          deliveryAvailable: true,
        }
      );
    }

    lynkStore.saveToStorage();
    setStep(6); // Step 6: Go live screen!

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Counter Indicator */}
        {step < 6 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Merchant Onboarding</span>
              <span className="text-blue-600">Step {step} of 5</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: BUSINESS NAME & CATEGORY */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-display font-extrabold text-slate-950">
                1. What is your store name?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tell nearby shoppers who you are.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Shop / Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Royal Audio & Gadgets"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Primary Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
              >
                <option value="electronics">Electronics & Audio</option>
                <option value="fashion">Fashion & Footwear</option>
                <option value="grocery">Groceries & Gourmet</option>
                <option value="pharmacy">Pharmacy & Health</option>
                <option value="local_crafts">Local Crafts & Handlooms</option>
                <option value="food_beverage">Food, Roasteries & Sweets</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                disabled={!storeName.trim()}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STORE LOCATION */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-display font-extrabold text-slate-950">
                2. Where is your physical store?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                LYNK calculates precise walking distances and travel time for nearby customers.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Locality / Market Corridor</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Janpath, Saheed Nagar, Koramangala"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Complete Address & Landmark</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No. 12, Ground Floor, Market Complex, Opp State Bank"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OPENING HOURS */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-display font-extrabold text-slate-950">
                3. Set your store schedule
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Let shoppers know when your counter is open for pickup and inquiries.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase">Opens At</label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase">Closes At</label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Store WhatsApp / Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1 font-mono"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 & 5: ADD FIRST PRODUCT & STOCK */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-display font-extrabold text-slate-950">
                4. Add your first in-stock product
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You can add more anytime from your inventory dashboard.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Product Title</label>
              <input
                type="text"
                value={firstProductName}
                onChange={(e) => setFirstProductName(e.target.value)}
                placeholder="e.g. BassPro True Wireless Earbuds"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase">Counter Price (₹)</label>
                <input
                  type="number"
                  value={firstProductPrice}
                  onChange={(e) => setFirstProductPrice(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase">Units In Stock</label>
                <input
                  type="number"
                  value={firstProductStock}
                  onChange={(e) => setFirstProductStock(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
              >
                Back
              </button>
              <button
                onClick={handleFinishOnboarding}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <span>Publish Store</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: GO LIVE CONFIRMATION */}
        {step === 6 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE ON LYNK</span>
            </div>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-950">
              Your store is now visible on LYNK!
            </h3>
            
            <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
              Nearby customers in <strong>{currentCity.name}</strong> can now discover your products, compare counter prices, and reserve for instant pickup.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Store:</span>
                <span className="font-bold text-slate-900">{storeName || 'Neighborhood Shop'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">City:</span>
                <span className="text-slate-800">{currentCity.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verified Status:</span>
                <span className="text-blue-700 font-semibold">Active & Live</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onStoreCreated();
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                Go to Merchant Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
