import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  Store as StoreIcon, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { lynkStore, formatDistance } from '../lib/storage';
import { Order, Reservation } from '../types';

export const OrdersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'orders'>('reservations');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentUser = lynkStore.getCurrentUser();
  const reservations = lynkStore.getReservations(currentUser.id);
  const orders = lynkStore.getOrders(currentUser.id);
  const allStores = lynkStore.getAllStores();
  const allProducts = lynkStore.getAllProducts();

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCancelReservation = (resId: string) => {
    if (confirm('Cancel this in-store hold? The product will be released back to other shoppers.')) {
      lynkStore.cancelReservation(resId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-8 border-b border-stone-200/80">
        <div>
          <h2 className="text-3xl sm:text-4xl font-serif-editorial font-normal text-stone-950 tracking-tight">
            My Orders & In-Store Holds
          </h2>
          <p className="text-xs text-stone-500 mt-1.5 font-light">
            Real-time tracking of your local shop reservations, counter holds, and completed orders.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'reservations'
                ? 'bg-stone-950 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Holds & Reservations ({reservations.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-stone-950 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Orders & Bills ({orders.length})
          </button>
        </div>
      </div>

      {/* RESERVATIONS TAB */}
      {activeTab === 'reservations' && (
        <div className="mt-8 space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/90 p-8 shadow-2xs">
              <Clock className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif-editorial text-lg text-stone-900 mt-3 font-normal">No Active Reservations</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-light">
                When you reserve an item, the local retailer holds it for you for 30 minutes at counter pricing.
              </p>
            </div>
          ) : (
            reservations.map((res) => {
              const store = allStores.find(s => s.id === res.storeId);
              const product = allProducts.find(p => p.id === res.productId);
              const isActive = res.status === 'active';

              return (
                <div
                  key={res.id}
                  className={`p-6 sm:p-7 rounded-3xl border transition-all ${
                    isActive
                      ? 'bg-white border-stone-300 shadow-sm'
                      : 'bg-stone-50/60 border-stone-200 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider ${
                          isActive ? 'bg-amber-100/80 text-amber-900 border border-amber-300' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {isActive ? 'HOLD ACTIVE • 30 MIN' : res.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono text-stone-400">
                          {res.reservationNumber}
                        </span>
                      </div>
                      <h4 className="font-serif-editorial text-2xl text-stone-950 mt-1.5 tracking-tight font-normal">
                        {product?.name || 'Product'}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5 font-light">
                        Reserved at <strong className="text-stone-900 font-medium">{store?.name || 'Local Store'}</strong>
                      </p>
                    </div>

                    {/* Counter Pickup Code */}
                    <div className="bg-[#0F1012] text-white p-3.5 rounded-2xl text-center self-start sm:self-auto min-w-[150px] border border-stone-800 shadow-md">
                      <span className="font-mono text-[9px] font-medium uppercase tracking-widest text-stone-400 block">
                        PICKUP CODE
                      </span>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="font-mono font-bold text-2xl text-amber-300 tracking-wider">
                          {res.pickupCode}
                        </span>
                        <button
                          onClick={() => handleCopyCode(res.pickupCode)}
                          className="text-stone-400 hover:text-white p-1"
                          title="Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {copiedCode === res.pickupCode && (
                        <span className="font-mono text-[9px] text-emerald-400 block mt-0.5">Copied!</span>
                      )}
                    </div>
                  </div>

                  {/* Details Row */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
                    <div className="flex items-center gap-3">
                      <span className="font-serif-editorial text-lg font-medium text-stone-950">
                        ₹{res.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="font-light">Pay at store counter during pickup</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <button
                          onClick={() => handleCancelReservation(res.id)}
                          className="px-4 py-1.5 rounded-full border border-stone-300 text-stone-600 hover:text-stone-950 hover:border-stone-500 text-xs font-medium transition-colors shadow-2xs"
                        >
                          Cancel Hold
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="mt-8 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/90 p-8 shadow-2xs">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif-editorial text-lg text-stone-900 mt-3 font-normal">No Placed Orders Yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-light">
                Your completed orders with local stores will appear here with automated invoice copies.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-stone-700">
                        {order.orderNumber}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs text-stone-500 font-light">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h4 className="font-serif-editorial text-xl text-stone-950 mt-1 font-normal">
                      {order.storeName}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="py-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-11 h-11 rounded-xl object-cover border border-stone-200 bg-stone-50"
                        />
                        <div>
                          <p className="font-medium text-stone-900">{item.productName}</p>
                          <p className="font-mono text-[11px] text-stone-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-serif-editorial text-sm font-semibold text-stone-950">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary Row */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="text-stone-500 font-light">
                    Fulfillment: <strong className="text-stone-900 font-medium capitalize">{order.fulfillmentType}</strong> ({order.estimatedTime})
                  </div>
                  <div className="font-serif-editorial text-xl text-stone-950 font-normal">
                    Total: ₹{order.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
