import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GuidedDemoBanner } from './components/GuidedDemoBanner';
import { HeroSection } from './components/HeroSection';
import { HeroVisual } from './components/HeroVisual';
import { ProductDiscovery } from './components/ProductDiscovery';
import { MarketMap } from './components/MarketMap';
import { OrdersView } from './components/OrdersView';
import { SavedView } from './components/SavedView';
import { ShopOwnerDashboard } from './components/ShopOwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { StoreDetailModal } from './components/StoreDetailModal';
import { ReservationModal } from './components/ReservationModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ShopOwnerOnboarding } from './components/ShopOwnerOnboarding';
import { LynkAiAssistant } from './components/LynkAiAssistant';
import { lynkStore } from './lib/storage';
import { Store, Product, Order } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'map' | 'compare' | 'orders' | 'saved' | 'shop_dashboard' | 'admin_dashboard'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [selectedStoreForModal, setSelectedStoreForModal] = useState<Store | null>(null);
  const [reserveModalData, setReserveModalData] = useState<{ product: Product; store: Store; price: number } | null>(null);
  const [checkoutModalData, setCheckoutModalData] = useState<{ product: Product; store: Store; price: number } | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isStoreOnboardingOpen, setIsStoreOnboardingOpen] = useState(false);
  const [selectedMapStoreId, setSelectedMapStoreId] = useState<string | null>(null);

  // Force re-render on storage changes
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = lynkStore.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const currentCity = lynkStore.getCurrentCity();
  const allStores = lynkStore.getAllStores();
  const cityStores = allStores.filter(s => s.city === currentCity.name);

  // Guided Demo Scenario handler
  const handleTriggerScenario = (scenario: 'compare_earbuds' | 'map_navigate' | 'shop_inventory' | 'ask_ai') => {
    if (scenario === 'compare_earbuds') {
      setSearchQuery('earbuds');
      setSelectedCategory('electronics');
      setActiveTab('discover');
      setTimeout(() => {
        const el = document.getElementById('market-inventory');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (scenario === 'map_navigate') {
      setActiveTab('map');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (scenario === 'shop_inventory') {
      lynkStore.switchRole('shop_owner');
      setActiveTab('shop_dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (scenario === 'ask_ai') {
      setIsAiOpen(true);
    }
  };

  const handleResetDemo = () => {
    lynkStore.resetToDefaults();
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveTab('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSearchQuery(product.name);
    const el = document.getElementById('market-inventory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white pb-16 lg:pb-0">
      {/* 1. Evaluator Quick-Test Guided Banner */}
      <GuidedDemoBanner
        onTriggerScenario={handleTriggerScenario}
        onReset={handleResetDemo}
      />

      {/* 2. Main LYNK Top Bar & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearchFocus={() => {
          if (activeTab !== 'discover' && activeTab !== 'compare') {
            setActiveTab('discover');
          }
        }}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenStoreOnboarding={() => setIsStoreOnboardingOpen(true)}
      />

      {/* 3. Main Views */}
      <main className="flex-1">
        {(activeTab === 'discover' || activeTab === 'compare') && (
          <div>
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={(q) => {
                setSearchQuery(q);
                const el = document.getElementById('market-inventory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onExploreClick={() => {
                const el = document.getElementById('market-inventory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onListStoreClick={() => setIsStoreOnboardingOpen(true)}
            />

            <HeroVisual
              onSelectStore={(storeId) => {
                const store = lynkStore.getStoreById(storeId);
                if (store) setSelectedStoreForModal(store);
              }}
              onSelectProduct={(productId) => {
                const prod = lynkStore.getProductById(productId);
                if (prod) {
                  setSearchQuery(prod.name);
                  const el = document.getElementById('market-inventory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            <div id="market-inventory">
              <ProductDiscovery
                onSelectProduct={handleSelectProduct}
                onSelectStore={(store) => setSelectedStoreForModal(store)}
                onOpenReserve={(product, store, price) => setReserveModalData({ product, store, price })}
                onOpenCheckout={(product, store, price) => setCheckoutModalData({ product, store, price })}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-950">
                  Live Market Map — {currentCity.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Discover verified physical shops, check open/closed status, and compare real-time in-store stock across {currentCity.locality}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAiOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Ask LYNK AI for Route
                </button>
                <button
                  onClick={() => setIsStoreOnboardingOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  + Add Your Store
                </button>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <MarketMap
                stores={cityStores.length > 0 ? cityStores : allStores}
                selectedStoreId={selectedMapStoreId}
                onSelectStore={(store) => setSelectedMapStoreId(store.id)}
                onOpenStoreModal={(store) => setSelectedStoreForModal(store)}
                heightClass="h-[640px] sm:h-[720px]"
                initialExploreMode={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <OrdersView />
        )}

        {activeTab === 'saved' && (
          <SavedView
            onSelectStore={(store) => setSelectedStoreForModal(store)}
            onSelectProduct={(product) => {
              setSearchQuery(product.name);
              setActiveTab('discover');
            }}
          />
        )}

        {activeTab === 'shop_dashboard' && (
          <ShopOwnerDashboard
            onOpenStoreOnboarding={() => setIsStoreOnboardingOpen(true)}
          />
        )}

        {activeTab === 'admin_dashboard' && (
          <AdminDashboard />
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        onOpenStoreOnboarding={() => setIsStoreOnboardingOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* 5. Mobile Navigation Bar */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 6. Modals */}
      {selectedStoreForModal && (
        <StoreDetailModal
          store={selectedStoreForModal}
          onClose={() => setSelectedStoreForModal(null)}
          onReserveProduct={(prod, store, price) => {
            setSelectedStoreForModal(null);
            setReserveModalData({ product: prod, store, price });
          }}
          onCheckoutProduct={(prod, store, price) => {
            setSelectedStoreForModal(null);
            setCheckoutModalData({ product: prod, store, price });
          }}
        />
      )}

      {reserveModalData && (
        <ReservationModal
          product={reserveModalData.product}
          store={reserveModalData.store}
          price={reserveModalData.price}
          onClose={() => setReserveModalData(null)}
          onViewReservations={() => {
            setReserveModalData(null);
            setActiveTab('orders');
          }}
        />
      )}

      {checkoutModalData && (
        <CheckoutModal
          product={checkoutModalData.product}
          store={checkoutModalData.store}
          price={checkoutModalData.price}
          onClose={() => setCheckoutModalData(null)}
          onOrderCompleted={() => {
            setCheckoutModalData(null);
            setActiveTab('orders');
          }}
        />
      )}

      {isStoreOnboardingOpen && (
        <ShopOwnerOnboarding
          onClose={() => setIsStoreOnboardingOpen(false)}
          onStoreCreated={() => {
            setIsStoreOnboardingOpen(false);
            setActiveTab('shop_dashboard');
          }}
        />
      )}

      <LynkAiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onSearchQuery={(q) => {
          setSearchQuery(q);
          setActiveTab('discover');
          setIsAiOpen(false);
        }}
        onSelectStore={(storeId) => {
          const store = lynkStore.getStoreById(storeId);
          if (store) {
            setSelectedStoreForModal(store);
            setIsAiOpen(false);
          }
        }}
      />
    </div>
  );
}
