import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Bell, 
  SlidersHorizontal, 
  ChevronDown, 
  Store as StoreIcon, 
  ShieldCheck, 
  User, 
  ShoppingBag, 
  Bookmark, 
  Map as MapIcon, 
  Compass, 
  Check, 
  Sparkles,
  ExternalLink,
  TrendingDown
} from 'lucide-react';
import { lynkStore } from '../lib/storage';
import { CityLocation, UserRole } from '../types';
import { INDIAN_CITIES } from '../data/seedData';

interface HeaderProps {
  activeTab: 'discover' | 'map' | 'compare' | 'orders' | 'saved' | 'shop_dashboard' | 'admin_dashboard';
  setActiveTab: (tab: any) => void;
  onSearchFocus?: () => void;
  onOpenAi: () => void;
  onOpenStoreOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSearchFocus,
  onOpenAi,
  onOpenStoreOnboarding,
}) => {
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentCity = lynkStore.getCurrentCity();
  const currentUser = lynkStore.getCurrentUser();
  const notifications = lynkStore.getNotifications(currentUser.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCityChange = (cityName: CityLocation['name']) => {
    lynkStore.setCity(cityName);
    setShowCityPicker(false);
  };

  const handleRoleChange = (role: UserRole) => {
    lynkStore.switchRole(role);
    setShowRolePicker(false);
    if (role === 'shop_owner') {
      setActiveTab('shop_dashboard');
    } else if (role === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('discover');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-xl border-b border-stone-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-8">
            <button 
              id="header-logo-btn"
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              {/* Sculptural Connected LYNK Logo Mark */}
              <div className="w-9 h-9 rounded-xl bg-stone-950 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300 border border-stone-800">
                <svg className="w-4 h-4 text-amber-400/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif-editorial text-2xl sm:text-[26px] tracking-tight text-stone-950 font-normal group-hover:text-stone-700 transition-colors">
                    LYNK
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 font-medium px-1.5 py-0.5 rounded-full bg-stone-200/50 border border-stone-300/40">
                    IN
                  </span>
                </div>
                <p className="text-[10px] font-normal text-stone-500 hidden sm:block -mt-1 tracking-wide">
                  India’s market, connected.
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-stone-200/70">
              <button
                id="nav-discover-btn"
                onClick={() => setActiveTab('discover')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'discover' 
                    ? 'bg-stone-950 text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Discover</span>
              </button>

              <button
                id="nav-map-btn"
                onClick={() => setActiveTab('map')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'map' 
                    ? 'bg-stone-950 text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Market Map</span>
              </button>

              <button
                id="nav-compare-btn"
                onClick={() => setActiveTab('compare')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'compare' 
                    ? 'bg-stone-950 text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>

              <button
                id="nav-orders-btn"
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'orders' 
                    ? 'bg-stone-950 text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Orders</span>
              </button>

              <button
                id="nav-saved-btn"
                onClick={() => setActiveTab('saved')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'saved' 
                    ? 'bg-stone-950 text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved</span>
              </button>
            </nav>
          </div>

          {/* Right Area Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Indian City & Locality Selector */}
            <div className="relative">
              <button
                id="header-city-selector-btn"
                onClick={() => {
                  setShowCityPicker(!showCityPicker);
                  setShowRolePicker(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-300/70 bg-white/80 hover:bg-white hover:border-stone-400 text-xs font-medium text-stone-800 shadow-2xs transition-all"
                title="Change city / locality"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span className="truncate max-w-[110px] sm:max-w-[140px] tracking-tight">
                  {currentCity.name}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showCityPicker && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <p className="text-xs font-bold text-stone-900">Select City / Market</p>
                    <p className="text-[11px] text-stone-500">View real-time local stores & prices</p>
                  </div>
                  <div className="space-y-1">
                    {INDIAN_CITIES.map(city => (
                      <button
                        key={city.name}
                        onClick={() => handleCityChange(city.name)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          currentCity.name === city.name 
                            ? 'bg-stone-100 text-stone-950 font-semibold' 
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-stone-900">{city.name}</div>
                          <div className="text-[11px] text-stone-500">{city.locality}</div>
                        </div>
                        {currentCity.name === city.name && (
                          <Check className="w-4 h-4 text-stone-900" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* LYNK AI Quick Prompt Button */}
            <button
              id="header-ai-btn"
              onClick={onOpenAi}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-950 text-white text-xs font-medium border border-stone-800 shadow-xs hover:bg-stone-800 transition-all transform active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>LYNK AI</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowCityPicker(false);
                  setShowRolePicker(false);
                }}
                className="relative p-2 rounded-full text-stone-600 hover:text-stone-950 hover:bg-stone-200/50 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          notifications.forEach(n => lynkStore.markNotificationAsRead(n.id));
                        }}
                        className="text-[11px] text-stone-600 hover:text-stone-950 font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-stone-500 py-6 text-center">No notifications yet</p>
                    ) : (
                      notifications.map(n => {
                        const isPriceDrop = n.type === 'price_drop';
                        return (
                          <div 
                            key={n.id}
                            onClick={() => {
                              lynkStore.markNotificationAsRead(n.id);
                              if (isPriceDrop) {
                                setActiveTab('saved');
                                setShowNotifications(false);
                              }
                            }}
                            className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                              isPriceDrop 
                                ? n.read 
                                  ? 'bg-emerald-50/50 border border-emerald-100/60 text-stone-800 hover:bg-emerald-50' 
                                  : 'bg-emerald-50/80 border border-emerald-200 text-stone-950 shadow-2xs hover:bg-emerald-100/70'
                                : n.read 
                                  ? 'bg-stone-50 text-stone-600 hover:bg-stone-100' 
                                  : 'bg-stone-100/70 border border-stone-200/70 text-stone-950 hover:bg-stone-100'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <div className="flex items-center gap-1.5">
                                {isPriceDrop && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-700 text-white tracking-wider flex items-center gap-0.5">
                                    <TrendingDown className="w-2.5 h-2.5" />
                                    PRICE DROP
                                  </span>
                                )}
                                <p className="font-bold text-stone-950">{n.title}</p>
                              </div>
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-stone-600 leading-relaxed">{n.message}</p>
                            {isPriceDrop && (
                              <p className="text-[10px] text-emerald-800 font-semibold mt-1 hover:underline">
                                Tap to view watchlist & drop details →
                              </p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Demo User & Role Switcher */}
            <div className="relative">
              <button
                id="header-user-menu-btn"
                onClick={() => {
                  setShowRolePicker(!showRolePicker);
                  setShowCityPicker(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-stone-300/70 hover:border-stone-400 bg-white/80 shadow-2xs transition-colors"
              >
                <span className="text-xs font-medium text-stone-700 hidden sm:inline-block">
                  {currentUser.role === 'customer' && 'Customer'}
                  {currentUser.role === 'shop_owner' && 'Shop Owner'}
                  {currentUser.role === 'admin' && 'Admin'}
                </span>
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-stone-200" 
                />
              </button>

              {showRolePicker && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-2 z-50">
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <p className="text-xs font-bold text-stone-900">{currentUser.fullName}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                  </div>
                  
                  <div className="py-1 space-y-0.5">
                    <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Switch Demo Role
                    </p>
                    
                    <button
                      onClick={() => handleRoleChange('customer')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        currentUser.role === 'customer' ? 'bg-stone-100 font-bold text-stone-950' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-stone-500" />
                        <span>Demo Customer</span>
                      </div>
                      {currentUser.role === 'customer' && <Check className="w-3.5 h-3.5 text-stone-900" />}
                    </button>

                    <button
                      onClick={() => handleRoleChange('shop_owner')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        currentUser.role === 'shop_owner' ? 'bg-stone-100 font-bold text-stone-950' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <StoreIcon className="w-3.5 h-3.5 text-stone-500" />
                        <span>Demo Shop Owner (Metro)</span>
                      </div>
                      {currentUser.role === 'shop_owner' && <Check className="w-3.5 h-3.5 text-stone-900" />}
                    </button>

                    <button
                      onClick={() => handleRoleChange('admin')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        currentUser.role === 'admin' ? 'bg-stone-100 font-bold text-stone-950' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                        <span>Demo Admin (Operations)</span>
                      </div>
                      {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-stone-900" />}
                    </button>
                  </div>

                  <div className="pt-2 mt-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setShowRolePicker(false);
                        onOpenStoreOnboarding();
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-stone-900 hover:bg-stone-100 rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span>List Your Local Store</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
