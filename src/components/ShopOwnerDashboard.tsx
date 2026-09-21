import React, { useState } from 'react';
import { 
  Store as StoreIcon, 
  TrendingUp, 
  Eye, 
  Search, 
  ShoppingBag, 
  Clock, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Save, 
  AlertCircle, 
  Sparkles,
  DollarSign,
  Package
} from 'lucide-react';
import { lynkStore } from '../lib/storage';
import { StoreProduct, Product } from '../types';

interface ShopOwnerDashboardProps {
  onOpenStoreOnboarding: () => void;
}

export const ShopOwnerDashboard: React.FC<ShopOwnerDashboardProps> = ({
  onOpenStoreOnboarding,
}) => {
  // We'll manage "Metro Electronics" (store-bbsr-1) for this demo shop owner
  const targetStoreId = 'store-bbsr-1';
  const store = lynkStore.getStoreById(targetStoreId) || lynkStore.getAllStores()[0];
  const allProducts = lynkStore.getAllProducts();
  const storeProducts = lynkStore.getStoreProducts(store.id);
  const reservations = lynkStore.getStoreReservations(store.id);
  const orders = lynkStore.getStoreOrders(store.id);

  const [activeTab, setActiveTab] = useState<'inventory' | 'reservations' | 'orders' | 'settings'>('inventory');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);

  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductCat, setNewProductCat] = useState('electronics');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('1499');
  const [newProductMrp, setNewProductMrp] = useState('2199');
  const [newProductStock, setNewProductStock] = useState('10');

  const handleStartEdit = (sp: StoreProduct) => {
    setEditingItemId(sp.id);
    setEditPrice(sp.price);
    setEditStock(sp.stockQuantity);
  };

  const handleSaveEdit = (sp: StoreProduct) => {
    lynkStore.updateInventoryItem(store.id, sp.productId, {
      price: Number(editPrice),
      stockQuantity: Number(editStock),
    });
    setEditingItemId(null);
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    lynkStore.addProductToStore(
      store.id,
      {
        name: newProductName,
        brand: newProductBrand || 'Local Brand',
        category: newProductCat as any,
        description: newProductDesc || 'Available in-store with official dealer bill.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        specifications: { 'Warranty': '1 Year Brand Warranty' },
      },
      {
        price: Number(newProductPrice),
        mrp: Number(newProductMrp),
        stockQuantity: Number(newProductStock),
        pickupAvailable: true,
        deliveryAvailable: true,
      }
    );

    setShowAddProductModal(false);
    setNewProductName('');
    setNewProductBrand('');
    setNewProductDesc('');
  };

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Merchant Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-extrabold text-slate-950">
                {store.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                LIVE ON LYNK
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Merchant ID: <strong>MCH-751001-01</strong> • {store.locality}, {store.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add In-Store Product</span>
          </button>
        </div>
      </div>

      {/* Real-time Merchant Analytics Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Local Views</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-display font-extrabold text-slate-950">
            1,248
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            +18% from nearby mobile searches
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Product Searches</span>
            <Search className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-display font-extrabold text-slate-950">
            430
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Matched your live store inventory
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Holds</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-display font-extrabold text-slate-950">
            {reservations.filter(r => r.status === 'active').length}
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            Customers walking to counter
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">LYNK Sales Today</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-display font-extrabold text-slate-950">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Direct customer settlement
          </p>
        </div>

      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
        {[
          { id: 'inventory', label: `Live Inventory & Pricing (${storeProducts.length})` },
          { id: 'reservations', label: `Customer Holds (${reservations.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: INVENTORY & PRICING TABLE */}
      {activeTab === 'inventory' && (
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Store Catalog & Stock Levels
              </h3>
              <p className="text-[11px] text-slate-500">
                Changes saved here reflect in customer price comparisons immediately.
              </p>
            </div>
            <span className="text-xs text-blue-600 font-semibold">
              Live Real-Time Sync Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Counter Price (₹)</th>
                  <th className="py-3 px-4">MRP (₹)</th>
                  <th className="py-3 px-4">In-Store Stock</th>
                  <th className="py-3 px-4">Pickup Time</th>
                  <th className="py-3 px-4 text-right">Quick Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storeProducts.map((sp) => {
                  const prod = allProducts.find(p => p.id === sp.productId);
                  if (!prod) return null;
                  const isEditing = editingItemId === sp.id;

                  return (
                    <tr key={sp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{prod.name}</div>
                            <div className="text-[11px] text-slate-500">{prod.brand}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-24 p-1.5 rounded border border-blue-500 font-bold text-slate-900"
                          />
                        ) : (
                          <span className="font-bold text-slate-900 text-sm">
                            ₹{sp.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-400 font-mono">
                        ₹{sp.mrp.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-18 p-1.5 rounded border border-blue-500 font-bold text-slate-900"
                          />
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            sp.stockQuantity > 5 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : sp.stockQuantity > 0 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sp.stockQuantity} units
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {sp.estimatedPickupMinutes} min
                      </td>

                      <td className="py-3 px-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveEdit(sp)}
                              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingItemId(null)}
                              className="p-1.5 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(sp)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INCOMING RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="mt-6 space-y-3">
          {reservations.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center bg-white rounded-3xl border border-slate-200">
              No customer holds currently placed.
            </p>
          ) : (
            reservations.map((res) => {
              const prod = allProducts.find(p => p.id === res.productId);
              return (
                <div key={res.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      CUSTOMER HOLD
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{prod?.name || 'Product'}</h4>
                    <p className="text-xs text-slate-500">Hold expires in 30 minutes from creation</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block">CUSTOMER CODE</span>
                    <span className="font-mono font-extrabold text-2xl text-blue-700">{res.pickupCode}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: STORE ORDERS */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-3">
          {orders.length === 0 ? (
            <p className="text-xs text-slate-500 py-12 text-center bg-white rounded-3xl border border-slate-200">
              No orders yet.
            </p>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-slate-700">{ord.orderNumber}</span>
                  <h4 className="font-bold text-sm text-slate-900 mt-0.5">{ord.items.map(i => i.productName).join(', ')}</h4>
                  <p className="text-xs text-slate-500 capitalize">{ord.fulfillmentType} • {ord.paymentMethod.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-extrabold text-base text-slate-950">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block mt-0.5">
                    {ord.orderStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add New In-Store Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-slate-900">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl text-slate-950">
              Add Product to Counter Inventory
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add a product currently on your shop shelves to appear on LYNK immediately.
            </p>

            <form onSubmit={handleAddNewProduct} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Wireless Gaming Mouse RGB"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Brand</label>
                  <input
                    type="text"
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    placeholder="Logitech / Boat"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Category</label>
                  <select
                    value={newProductCat}
                    onChange={(e) => setNewProductCat(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="grocery">Grocery</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="local_crafts">Crafts & Weaves</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Your Price (₹)</label>
                  <input
                    type="number"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">MRP (₹)</label>
                  <input
                    type="number"
                    value={newProductMrp}
                    onChange={(e) => setNewProductMrp(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Stock Qty</label>
                  <input
                    type="number"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:outline-none mt-1"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  Publish to Live LYNK Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
