import React, { useEffect, useRef, useState } from 'react';
import { 
  Store as StoreIcon, 
  MapPin, 
  Navigation, 
  Star, 
  Clock, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  ExternalLink, 
  Phone, 
  Compass,
  X,
  Footprints,
  Car
} from 'lucide-react';
import L from 'leaflet';
import { Store, Product, StoreProduct } from '../types';
import { lynkStore, formatDistance } from '../lib/storage';

interface MarketMapProps {
  stores: Store[];
  selectedStoreId?: string | null;
  onSelectStore: (store: Store) => void;
  onOpenStoreModal: (store: Store) => void;
  heightClass?: string;
  initialExploreMode?: boolean;
}

export const MarketMap: React.FC<MarketMapProps> = ({
  stores,
  selectedStoreId,
  onSelectStore,
  onOpenStoreModal,
  heightClass = 'h-[640px]',
  initialExploreMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routePolylineRef = useRef<L.Polyline | null>(null);

  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [exploreMode, setExploreMode] = useState<boolean>(initialExploreMode);
  const [showNavRoute, setShowNavRoute] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const currentCity = lynkStore.getCurrentCity();

  // Initialize or update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coordinates: current city
    const userLat = currentCity.latitude;
    const userLon = currentCity.longitude;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLat, userLon],
        zoom: 14,
        zoomControl: true,
      });

      // CartoDB Voyager tiles (crisp, modern, high-contrast, free, zero API key)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // User Position Marker ("YOU")
      const userIconHtml = `
        <div class="lynk-marker-pin w-10 h-10 bg-blue-600 border-2 border-white text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <svg class="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        </div>
      `;

      const userIcon = L.divIcon({
        className: 'lynk-marker-container',
        html: userIconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([userLat, userLon], { icon: userIcon, zIndexOffset: 500 })
        .addTo(map)
        .bindPopup(`<strong>You are here</strong><br/>${currentCity.locality}`);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([userLat, userLon], 14);
    }

    return () => {
      // Keep map reference across re-renders
    };
  }, [currentCity.name]);

  // Update Store Markers based on filters and explore mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old store markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    const filteredStores = stores.filter(s => {
      if (filterCategory !== 'all' && s.category !== filterCategory) return false;
      return true;
    });

    filteredStores.forEach(store => {
      // Marker Pin color & icon based on category
      let bgClass = 'bg-slate-900';
      let tagText = '';

      if (store.category === 'electronics') {
        bgClass = 'bg-blue-600';
        tagText = '₹2,399 IN STOCK';
      } else if (store.category === 'grocery') {
        bgClass = 'bg-emerald-600';
        tagText = 'FRESH 15M';
      } else if (store.category === 'pharmacy') {
        bgClass = 'bg-rose-600';
        tagText = 'OPEN 24/7';
      } else if (store.category === 'fashion') {
        bgClass = 'bg-indigo-600';
        tagText = '30% OFF';
      } else if (store.category === 'local_crafts') {
        bgClass = 'bg-amber-600';
        tagText = 'GI AUTHENTIC';
      } else {
        bgClass = 'bg-violet-600';
        tagText = 'ROASTERY';
      }

      // Marker HTML: Standard Pin or Immersive Explore Badge
      let markerHtml = '';
      if (exploreMode) {
        markerHtml = `
          <div class="group flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-110">
            <div class="px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white ${bgClass} shadow-md border border-white whitespace-nowrap flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>${tagText}</span>
            </div>
            <div class="w-2 h-2 bg-slate-800 rotate-45 -mt-1 border-r border-b border-white"></div>
          </div>
        `;
      } else {
        markerHtml = `
          <div class="lynk-marker-pin w-9 h-9 ${bgClass} text-white border-2 border-white rounded-full flex items-center justify-center shadow-lg">
            <span class="text-[11px] font-bold">${store.name.substring(0, 2).toUpperCase()}</span>
          </div>
        `;
      }

      const storeIcon = L.divIcon({
        className: 'lynk-marker-container',
        html: markerHtml,
        iconSize: exploreMode ? [110, 36] : [36, 36],
        iconAnchor: exploreMode ? [55, 34] : [18, 18],
      });

      const marker = L.marker([store.latitude, store.longitude], { icon: storeIcon })
        .addTo(map)
        .on('click', () => {
          setActiveStore(store);
          onSelectStore(store);
        });

      markersRef.current[store.id] = marker;
    });

  }, [stores, exploreMode, filterCategory]);

  // Synchronize when selectedStoreId changes externally
  useEffect(() => {
    if (!selectedStoreId) return;
    const store = stores.find(s => s.id === selectedStoreId);
    if (store && mapInstanceRef.current) {
      setActiveStore(store);
      mapInstanceRef.current.flyTo([store.latitude, store.longitude], 15, { duration: 1.2 });
    }
  }, [selectedStoreId, stores]);

  // Draw simulated route line when Navigate is clicked
  const handleNavigateClick = (store: Store) => {
    setShowNavRoute(true);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
    }

    const userCoord: [number, number] = [currentCity.latitude, currentCity.longitude];
    const storeCoord: [number, number] = [store.latitude, store.longitude];

    // Add intermediate bend to make it feel like a real street path
    const midLat = (userCoord[0] + storeCoord[0]) / 2 + 0.0008;
    const midLon = (userCoord[1] + storeCoord[1]) / 2 - 0.0005;

    const latlngs: [number, number][] = [userCoord, [midLat, midLon], storeCoord];

    const polyline = L.polyline(latlngs, {
      color: '#2563eb',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
    }).addTo(map);

    routePolylineRef.current = polyline;
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  };

  const clearNavigation = () => {
    setShowNavRoute(false);
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-100">
      
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Category Filters Bar */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F5]/90 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-stone-300/80 pointer-events-auto overflow-x-auto max-w-[calc(100%-140px)] scrollbar-none">
          {['all', 'electronics', 'grocery', 'pharmacy', 'fashion', 'local_crafts'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-stone-950 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/60'
              }`}
            >
              {cat === 'all' ? 'All Stores' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Explore Mode Toggle */}
        <button
          onClick={() => setExploreMode(!exploreMode)}
          className={`pointer-events-auto px-3.5 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 border ${
            exploreMode
              ? 'bg-stone-950 text-stone-100 border-stone-800 shadow-stone-950/20'
              : 'bg-[#FAF8F5]/90 text-stone-800 border-stone-300/80 hover:bg-white'
          }`}
          title="Toggle digital price & stock overlays on map"
        >
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-mono text-[11px] tracking-wider uppercase">{exploreMode ? 'Explore: Live' : 'Explore Mode'}</span>
        </button>
      </div>

      {/* The Leaflet Canvas Map */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />

      {/* Floating Store Card upon Marker Click */}
      {activeStore && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#FAF8F5]/95 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-stone-300/80 text-stone-900">
            
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif-editorial text-xl text-stone-950 tracking-tight">
                    {activeStore.name}
                  </h4>
                  {activeStore.isVerified && (
                    <span className="w-4 h-4 rounded-full bg-stone-950 text-white flex items-center justify-center text-[9px] font-bold" title="Verified Store">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-light">
                  {activeStore.address}
                </p>
              </div>

              <button
                onClick={() => setActiveStore(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-950 hover:bg-stone-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="mt-3.5 flex items-center flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 text-stone-800 font-medium bg-white px-2.5 py-1 rounded-full border border-stone-200 shadow-2xs">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                {activeStore.rating} ({activeStore.reviewCount})
              </span>

              <span className="text-stone-700 font-normal flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-stone-200 shadow-2xs">
                <MapPin className="w-3 h-3 text-stone-500" />
                {formatDistance(activeStore.distanceKm || 0.5)} away
              </span>

              <span className="text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Open till {activeStore.closingTime}
              </span>
            </div>

            {/* In-Store Featured Products & Pricing Peek */}
            <div className="mt-4 pt-3.5 border-t border-stone-200/80 space-y-1.5">
              <p className="font-mono text-[9px] font-medium text-stone-500 uppercase tracking-widest">
                Live Inventory Available Today
              </p>
              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                <span className="font-medium text-stone-800 truncate max-w-[180px]">
                  {activeStore.category === 'electronics' ? 'SoundWave Pro X Earbuds' : 'Curated Essentials'}
                </span>
                <span className="font-serif-editorial text-sm font-semibold text-stone-950">
                  {activeStore.category === 'electronics' ? '₹2,399' : 'From ₹360'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => onOpenStoreModal(activeStore)}
                className="flex-1 py-2.5 px-4 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-medium tracking-wide shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Store Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleNavigateClick(activeStore)}
                className="py-2.5 px-4 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium border border-stone-300/80 flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Navigate to store"
              >
                <Navigation className="w-3.5 h-3.5 text-stone-600" />
                <span>Navigate</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Active Navigation Route HUD */}
      {showNavRoute && activeStore && (
        <div className="absolute top-16 left-4 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="bg-[#0F1012]/95 backdrop-blur-md rounded-3xl p-4 text-stone-100 shadow-2xl border border-stone-800 max-w-xs">
            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-stone-800">
              <div className="flex items-center gap-2 font-mono text-[10px] font-semibold text-emerald-400 tracking-wider">
                <Navigation className="w-3.5 h-3.5 animate-spin" />
                <span>ACTIVE ROUTE PREVIEW</span>
              </div>
              <button onClick={clearNavigation} className="text-stone-400 hover:text-stone-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs font-light">
              <div className="flex items-center gap-2 text-stone-300">
                <span className="w-2 h-2 rounded-full bg-stone-400" />
                <span>You ({currentCity.locality})</span>
              </div>
              <div className="pl-1 text-stone-500 font-mono text-[10px]">
                ↓ {formatDistance(activeStore.distanceKm || 0.5)} walking corridor
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{activeStore.name}</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 font-light">
              <span className="flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-stone-400" />
                ~{activeStore.walkingMinutes || 7} min walk
              </span>
              <span className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-emerald-400" />
                ~{activeStore.drivingMinutes || 3} min drive
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
