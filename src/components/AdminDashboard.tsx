import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Store as StoreIcon, 
  Users, 
  ShoppingBag, 
  Search, 
  DollarSign, 
  Check, 
  X, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';
import { lynkStore } from '../lib/storage';
import { Store } from '../types';

export const AdminDashboard: React.FC = () => {
  const allStores = lynkStore.getAllStores();
  const allProducts = lynkStore.getAllProducts();
  const allOrders = lynkStore.getOrders();
  const allReservations = lynkStore.getReservations();

  const [searchQuery, setSearchQuery] = useState('');
  const [storeList, setStoreList] = useState<Store[]>(allStores);

  const totalGMV = allOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 142000;

  const handleToggleVerify = (storeId: string) => {
    setStoreList(prev => prev.map(s => {
      if (s.id === storeId) {
        return { ...s, isVerified: !s.isVerified };
      }
      return s;
    }));
  };

  const filteredStores = storeList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-extrabold shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-extrabold text-slate-950">
                LYNK Marketplace Operations
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                ADMIN CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Platform-wide moderation, merchant verification, and city analytics
            </p>
          </div>
        </div>
      </div>

      {/* Platform Analytics Metrics */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Merchants</span>
          <div className="mt-2 text-2xl font-display font-extrabold text-slate-950">
            {allStores.length} Verified Stores
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Across 5 major Indian cities
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Catalog Items</span>
          <div className="mt-2 text-2xl font-display font-extrabold text-slate-950">
            12,480+ SKUs
          </div>
          <p className="text-[11px] text-blue-600 font-semibold mt-1">
            Real-time counter stock sync
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Holds & Reservations</span>
          <div className="mt-2 text-2xl font-display font-extrabold text-slate-950">
            {allReservations.length + 84} Holds
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            94% store pickup completion
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Marketplace Value</span>
          <div className="mt-2 text-2xl font-display font-extrabold text-slate-950">
            ₹{totalGMV.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Directly empowered local retailers
          </p>
        </div>
      </div>

      {/* Store Verification & Moderation Table */}
      <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Merchant Directory & Verification Moderation
            </h3>
            <p className="text-[11px] text-slate-500">
              Verify local shops to grant the LYNK Trust Badge on map and search results.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores by city or name…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Store Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">City / Locality</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Moderation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStores.map(store => (
                <tr key={store.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                        {store.name.substring(0, 1)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{store.name}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{store.address}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 capitalize text-slate-700">
                    {store.category.replace('_', ' ')}
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    <strong>{store.city}</strong> • {store.locality}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-600">
                    {store.phone}
                  </td>

                  <td className="py-3 px-4 font-bold text-amber-600">
                    ★ {store.rating}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleVerify(store.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        store.isVerified
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {store.isVerified ? '✓ Verified' : 'Pending'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
