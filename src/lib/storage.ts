import { 
  Store, 
  Product, 
  StoreProduct, 
  Offer, 
  Reservation, 
  Order, 
  NotificationItem, 
  ComparisonStoreOption, 
  CityLocation,
  UserRole,
  UserProfile
} from '../types';
import { 
  SEED_STORES, 
  SEED_PRODUCTS, 
  SEED_STORE_PRODUCTS, 
  SEED_OFFERS, 
  SEED_RESERVATIONS, 
  SEED_ORDERS, 
  SEED_NOTIFICATIONS, 
  INDIAN_CITIES 
} from '../data/seedData';

// Haversine formula to compute accurate distance between two lat/long points
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function estimateWalkingMinutes(km: number): number {
  // Average walking speed in Indian markets: ~4.5 km/h -> ~13 mins per km
  return Math.max(2, Math.round(km * 13));
}

type Listener = () => void;

class LynkStoreService {
  private stores: Store[] = [];
  private products: Product[] = [];
  private storeProducts: StoreProduct[] = [];
  private offers: Offer[] = [];
  private reservations: Reservation[] = [];
  private orders: Order[] = [];
  private notifications: NotificationItem[] = [];
  private savedStoreIds: Set<string> = new Set(['store-bbsr-1']);
  private savedProductIds: Set<string> = new Set(['prod-earbuds-1']);
  private priceDropNotificationProductIds: Set<string> = new Set(['prod-earbuds-1']);
  private currentCity: CityLocation = INDIAN_CITIES[0]; // Default Bhubaneswar
  private currentUser: UserProfile = {
    id: 'user-demo-customer',
    fullName: 'Aarav Patnaik',
    email: 'aarav.p@lynk.in',
    phone: '+91 98765 43210',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    savedStoreIds: ['store-bbsr-1'],
    savedProductIds: ['prod-earbuds-1'],
    createdAt: '2025-01-01',
  };

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedStores = localStorage.getItem('lynk_stores');
      const savedProds = localStorage.getItem('lynk_products');
      const savedSP = localStorage.getItem('lynk_store_products');
      const savedOffers = localStorage.getItem('lynk_offers');
      const savedRes = localStorage.getItem('lynk_reservations');
      const savedOrders = localStorage.getItem('lynk_orders');
      const savedNotifs = localStorage.getItem('lynk_notifications');
      const savedRole = localStorage.getItem('lynk_active_role');
      const savedCityName = localStorage.getItem('lynk_active_city');
      const savedSavedStores = localStorage.getItem('lynk_saved_stores');
      const savedSavedProds = localStorage.getItem('lynk_saved_products');
      const savedPriceDropNotifs = localStorage.getItem('lynk_price_drop_notifs');

      this.stores = savedStores ? JSON.parse(savedStores) : [...SEED_STORES];
      this.products = savedProds ? JSON.parse(savedProds) : [...SEED_PRODUCTS];
      this.storeProducts = savedSP ? JSON.parse(savedSP) : [...SEED_STORE_PRODUCTS];
      this.offers = savedOffers ? JSON.parse(savedOffers) : [...SEED_OFFERS];
      this.reservations = savedRes ? JSON.parse(savedRes) : [...SEED_RESERVATIONS];
      this.orders = savedOrders ? JSON.parse(savedOrders) : [...SEED_ORDERS];
      this.notifications = savedNotifs ? JSON.parse(savedNotifs) : [...SEED_NOTIFICATIONS];

      // Refresh any cached product images with the latest verified seed image URLs
      const seedProductMap = new Map(SEED_PRODUCTS.map(p => [p.id, p.imageUrl]));
      let productsUpdated = false;
      this.products = this.products.map(p => {
        const freshUrl = seedProductMap.get(p.id);
        if (freshUrl && freshUrl !== p.imageUrl) {
          productsUpdated = true;
          return { ...p, imageUrl: freshUrl };
        }
        return p;
      });
      if (productsUpdated) {
        localStorage.setItem('lynk_products', JSON.stringify(this.products));
      }

      if (savedSavedStores) {
        this.savedStoreIds = new Set(JSON.parse(savedSavedStores));
      }
      if (savedSavedProds) {
        this.savedProductIds = new Set(JSON.parse(savedSavedProds));
      }
      if (savedPriceDropNotifs) {
        this.priceDropNotificationProductIds = new Set(JSON.parse(savedPriceDropNotifs));
      }

      if (savedCityName) {
        const found = INDIAN_CITIES.find(c => c.name === savedCityName);
        if (found) this.currentCity = found;
      }

      if (savedRole) {
        this.switchRole(savedRole as UserRole, false);
      }
    } catch {
      this.resetToDefaults();
    }
  }

  public saveToStorage() {
    try {
      localStorage.setItem('lynk_stores', JSON.stringify(this.stores));
      localStorage.setItem('lynk_products', JSON.stringify(this.products));
      localStorage.setItem('lynk_store_products', JSON.stringify(this.storeProducts));
      localStorage.setItem('lynk_offers', JSON.stringify(this.offers));
      localStorage.setItem('lynk_reservations', JSON.stringify(this.reservations));
      localStorage.setItem('lynk_orders', JSON.stringify(this.orders));
      localStorage.setItem('lynk_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('lynk_saved_stores', JSON.stringify(Array.from(this.savedStoreIds)));
      localStorage.setItem('lynk_saved_products', JSON.stringify(Array.from(this.savedProductIds)));
      localStorage.setItem('lynk_price_drop_notifs', JSON.stringify(Array.from(this.priceDropNotificationProductIds)));
      localStorage.setItem('lynk_active_city', this.currentCity.name);
      localStorage.setItem('lynk_active_role', this.currentUser.role);
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
    this.notify();
  }

  public resetToDefaults() {
    this.stores = [...SEED_STORES];
    this.products = [...SEED_PRODUCTS];
    this.storeProducts = [...SEED_STORE_PRODUCTS];
    this.offers = [...SEED_OFFERS];
    this.reservations = [...SEED_RESERVATIONS];
    this.orders = [...SEED_ORDERS];
    this.notifications = [...SEED_NOTIFICATIONS];
    this.savedStoreIds = new Set(['store-bbsr-1']);
    this.savedProductIds = new Set(['prod-earbuds-1']);
    this.priceDropNotificationProductIds = new Set(['prod-earbuds-1']);
    this.currentCity = INDIAN_CITIES[0];
    this.switchRole('customer', false);
    this.saveToStorage();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- Location & User State ---
  public getCurrentCity(): CityLocation {
    return this.currentCity;
  }

  public setCity(cityName: CityLocation['name']) {
    const found = INDIAN_CITIES.find(c => c.name === cityName);
    if (found) {
      this.currentCity = found;
      this.saveToStorage();
    }
  }

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public switchRole(role: UserRole, persist: boolean = true) {
    if (role === 'customer') {
      this.currentUser = {
        id: 'user-demo-customer',
        fullName: 'Aarav Patnaik',
        email: 'aarav.p@lynk.in',
        phone: '+91 98765 43210',
        role: 'customer',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        savedStoreIds: Array.from(this.savedStoreIds),
        savedProductIds: Array.from(this.savedProductIds),
        createdAt: '2025-01-01',
      };
    } else if (role === 'shop_owner') {
      this.currentUser = {
        id: 'owner-1',
        fullName: 'Rajesh Mohanty',
        email: 'metro.electronics@lynk.in',
        phone: '+91 94370 12890',
        role: 'shop_owner',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        savedStoreIds: [],
        savedProductIds: [],
        createdAt: '2024-11-01',
      };
    } else {
      this.currentUser = {
        id: 'user-demo-admin',
        fullName: 'Ananya Sen (LYNK Ops)',
        email: 'admin@lynk.in',
        phone: '+91 98300 00001',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        savedStoreIds: [],
        savedProductIds: [],
        createdAt: '2024-06-01',
      };
    }
    if (persist) {
      this.saveToStorage();
    }
  }

  // --- Stores with dynamic Distance computation ---
  public getStores(cityFilter?: string): Store[] {
    const city = cityFilter || this.currentCity.name;
    const centerLat = this.currentCity.latitude;
    const centerLon = this.currentCity.longitude;

    return this.stores
      .filter(s => !city || s.city.toLowerCase() === city.toLowerCase())
      .map(store => {
        const dist = calculateDistanceKm(centerLat, centerLon, store.latitude, store.longitude);
        const walking = estimateWalkingMinutes(dist);
        const driving = Math.max(2, Math.round(dist * 4));
        return {
          ...store,
          distanceKm: dist,
          walkingMinutes: walking,
          drivingMinutes: driving,
        };
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  public getAllStores(): Store[] {
    return this.stores;
  }

  public getStoreById(id: string): Store | undefined {
    const store = this.stores.find(s => s.id === id);
    if (!store) return undefined;
    const dist = calculateDistanceKm(this.currentCity.latitude, this.currentCity.longitude, store.latitude, store.longitude);
    return {
      ...store,
      distanceKm: dist,
      walkingMinutes: estimateWalkingMinutes(dist),
      drivingMinutes: Math.max(2, Math.round(dist * 4)),
    };
  }

  // --- Products & Store Comparison ---
  public getAllProducts(): Product[] {
    return this.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public getStoreProducts(storeId?: string, productId?: string): StoreProduct[] {
    return this.storeProducts.filter(sp => {
      if (storeId && sp.storeId !== storeId) return false;
      if (productId && sp.productId !== productId) return false;
      return true;
    });
  }

  // Core LYNK Value: Get all stores selling a specific product with factual tags (Lowest price, Closest, Fastest pickup)
  public getProductComparison(productId: string): ComparisonStoreOption[] {
    const product = this.products.find(p => p.id === productId);
    if (!product) return [];

    const storeMappings = this.storeProducts.filter(sp => sp.productId === productId && sp.stockQuantity > 0);
    const activeCityStores = this.getStores(); // stores in active city with distance

    const options: ComparisonStoreOption[] = [];

    storeMappings.forEach(sp => {
      const store = activeCityStores.find(s => s.id === sp.storeId);
      if (store) {
        const activeOffer = this.offers.find(o => o.storeId === store.id && (o.productId === productId || !o.productId) && o.isActive);
        const dist = store.distanceKm || 0.5;
        const walking = store.walkingMinutes || estimateWalkingMinutes(dist);

        options.push({
          store,
          storeProduct: sp,
          product,
          activeOffer,
          distanceKm: dist,
          walkingMinutes: walking,
        });
      }
    });

    if (options.length === 0) return [];

    // Compute factual superlatives
    let minPrice = Infinity;
    let minDistance = Infinity;
    let minPickup = Infinity;
    let maxRating = -1;

    options.forEach(opt => {
      if (opt.storeProduct.price < minPrice) minPrice = opt.storeProduct.price;
      if (opt.distanceKm < minDistance) minDistance = opt.distanceKm;
      if (opt.storeProduct.estimatedPickupMinutes < minPickup) minPickup = opt.storeProduct.estimatedPickupMinutes;
      if (opt.store.rating > maxRating) maxRating = opt.store.rating;
    });

    return options.map(opt => ({
      ...opt,
      isLowestPrice: opt.storeProduct.price === minPrice,
      isClosest: opt.distanceKm === minDistance,
      isFastestPickup: opt.storeProduct.estimatedPickupMinutes === minPickup,
      isHighestRated: opt.store.rating === maxRating && maxRating >= 4.7,
    })).sort((a, b) => a.storeProduct.price - b.storeProduct.price);
  }

  // Offers
  public getOffers(storeId?: string): Offer[] {
    if (storeId) {
      return this.offers.filter(o => o.storeId === storeId && o.isActive);
    }
    return this.offers.filter(o => o.isActive);
  }

  // Reservations
  public getReservations(userId?: string): Reservation[] {
    if (userId) {
      return this.reservations.filter(r => r.customerId === userId);
    }
    return this.reservations;
  }

  public getStoreReservations(storeId: string): Reservation[] {
    return this.reservations.filter(r => r.storeId === storeId);
  }

  public createReservation(data: {
    customerId: string;
    storeId: string;
    productId: string;
    quantity: number;
    price: number;
  }): Reservation {
    const resId = `res-${Date.now()}`;
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();
    const reservationNumber = `LNK-RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins

    const newRes: Reservation = {
      id: resId,
      reservationNumber,
      customerId: data.customerId,
      storeId: data.storeId,
      productId: data.productId,
      quantity: data.quantity,
      price: data.price,
      status: 'active',
      expiresAt,
      createdAt: new Date().toISOString(),
      pickupCode,
    };

    this.reservations.unshift(newRes);

    // Also create notification
    const store = this.getStoreById(data.storeId);
    const prod = this.getProductById(data.productId);
    this.addNotification({
      userId: data.customerId,
      title: 'Reservation Confirmed',
      message: `Reserved ${prod?.name || 'product'} at ${store?.name || 'store'}. Hold active for 30 mins. Code: ${pickupCode}`,
      type: 'reservation',
      storeId: data.storeId,
      productId: data.productId,
    });

    this.saveToStorage();
    return newRes;
  }

  public cancelReservation(resId: string) {
    const res = this.reservations.find(r => r.id === resId);
    if (res) {
      res.status = 'cancelled';
      this.saveToStorage();
    }
  }

  // Orders & Simulated Checkout
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.orders.filter(o => o.customerId === userId);
    }
    return this.orders;
  }

  public getStoreOrders(storeId: string): Order[] {
    return this.orders.filter(o => o.storeId === storeId);
  }

  public createOrder(data: {
    customerId: string;
    storeId: string;
    storeName: string;
    items: Array<{
      productId: string;
      productName: string;
      brand: string;
      imageUrl: string;
      quantity: number;
      unitPrice: number;
    }>;
    totalAmount: number;
    fulfillmentType: 'pickup' | 'delivery';
    paymentMethod: 'upi' | 'card' | 'cash_on_pickup';
    deliveryAddress?: string;
    contactPhone: string;
  }): Order {
    const orderNumber = `LNK-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: data.customerId,
      storeId: data.storeId,
      storeName: data.storeName,
      totalAmount: data.totalAmount,
      fulfillmentType: data.fulfillmentType,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'cash_on_pickup' ? 'pending' : 'completed',
      orderStatus: 'confirmed',
      deliveryAddress: data.deliveryAddress,
      contactPhone: data.contactPhone,
      createdAt: new Date().toISOString(),
      estimatedTime: data.fulfillmentType === 'pickup' ? 'Ready for pickup in 10-15 min' : 'Delivery within 2 hours',
      items: data.items.map((it, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        orderId: `ord-${Date.now()}`,
        ...it,
      })),
    };

    // Decrement stock in storeProducts
    data.items.forEach(it => {
      const sp = this.storeProducts.find(s => s.storeId === data.storeId && s.productId === it.productId);
      if (sp && sp.stockQuantity >= it.quantity) {
        sp.stockQuantity -= it.quantity;
      }
    });

    this.orders.unshift(newOrder);

    this.addNotification({
      userId: data.customerId,
      title: 'Order Confirmed!',
      message: `Your order ${orderNumber} at ${data.storeName} is placed (${data.fulfillmentType === 'pickup' ? 'Counter Pickup' : 'Express Delivery'}).`,
      type: 'order',
      storeId: data.storeId,
    });

    this.saveToStorage();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['orderStatus']) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      this.saveToStorage();
    }
  }

  // Shop Owner Inventory Management
  public updateInventoryItem(storeId: string, productId: string, updates: Partial<StoreProduct>) {
    const item = this.storeProducts.find(sp => sp.storeId === storeId && sp.productId === productId);
    if (item) {
      const oldPrice = item.price;
      Object.assign(item, updates, { updatedAt: new Date().toISOString() });
      
      // If price was decreased and price drop notification is enabled, notify customer!
      if (updates.price !== undefined && updates.price < oldPrice) {
        if (this.isPriceDropNotificationEnabled(productId)) {
          const prod = this.getProductById(productId);
          const store = this.getStoreById(storeId);
          const discountPercent = Math.round(((oldPrice - updates.price) / oldPrice) * 100);
          this.addNotification({
            userId: this.currentUser.id,
            title: `Price Drop Alert: ${prod?.name || 'Item'}`,
            message: `${store?.name || 'A local store'} lowered the counter price of ${prod?.name} by ${discountPercent}% (now ₹${updates.price.toLocaleString('en-IN')}, was ₹${oldPrice.toLocaleString('en-IN')}). In-store hold available!`,
            type: 'price_drop',
            productId,
            storeId,
          });
        }
      }

      this.saveToStorage();
    }
  }

  public addProductToStore(storeId: string, product: Omit<Product, 'id' | 'createdAt'>, inventory: {
    price: number;
    mrp: number;
    stockQuantity: number;
    pickupAvailable: boolean;
    deliveryAvailable: boolean;
  }) {
    const newProdId = `prod-${Date.now()}`;
    const newProduct: Product = {
      id: newProdId,
      ...product,
      createdAt: new Date().toISOString(),
    };
    this.products.push(newProduct);

    const newSP: StoreProduct = {
      id: `sp-${Date.now()}`,
      storeId,
      productId: newProdId,
      price: inventory.price,
      mrp: inventory.mrp,
      stockQuantity: inventory.stockQuantity,
      pickupAvailable: inventory.pickupAvailable,
      estimatedPickupMinutes: 10,
      deliveryAvailable: inventory.deliveryAvailable,
      estimatedDeliveryHours: 2,
      updatedAt: new Date().toISOString(),
    };
    this.storeProducts.push(newSP);
    this.saveToStorage();
    return { newProduct, newSP };
  }

  // Notifications
  public getNotifications(userId?: string): NotificationItem[] {
    if (userId) {
      return this.notifications.filter(n => n.userId === userId);
    }
    return this.notifications;
  }

  public markNotificationAsRead(id: string) {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.saveToStorage();
    }
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      ...item,
    });
    this.saveToStorage();
  }

  // Saved / Bookmarked items
  public isStoreSaved(storeId: string): boolean {
    return this.savedStoreIds.has(storeId);
  }

  public toggleSaveStore(storeId: string) {
    if (this.savedStoreIds.has(storeId)) {
      this.savedStoreIds.delete(storeId);
    } else {
      this.savedStoreIds.add(storeId);
    }
    this.saveToStorage();
  }

  public isProductSaved(productId: string): boolean {
    return this.savedProductIds.has(productId);
  }

  public toggleSaveProduct(productId: string) {
    if (this.savedProductIds.has(productId)) {
      this.savedProductIds.delete(productId);
      this.priceDropNotificationProductIds.delete(productId);
    } else {
      this.savedProductIds.add(productId);
      // Auto-enable price drop notification by default when bookmarking a product
      this.priceDropNotificationProductIds.add(productId);
    }
    this.saveToStorage();
  }

  // --- Price Drop Notifications ---
  public isPriceDropNotificationEnabled(productId: string): boolean {
    return this.priceDropNotificationProductIds.has(productId);
  }

  public togglePriceDropNotification(productId: string): boolean {
    const nextState = !this.priceDropNotificationProductIds.has(productId);
    if (nextState) {
      this.priceDropNotificationProductIds.add(productId);
      // Also ensure product is saved if user toggles notification
      if (!this.savedProductIds.has(productId)) {
        this.savedProductIds.add(productId);
      }
    } else {
      this.priceDropNotificationProductIds.delete(productId);
    }
    this.saveToStorage();
    return nextState;
  }

  public setPriceDropNotification(productId: string, enabled: boolean) {
    if (enabled) {
      this.priceDropNotificationProductIds.add(productId);
      if (!this.savedProductIds.has(productId)) {
        this.savedProductIds.add(productId);
      }
    } else {
      this.priceDropNotificationProductIds.delete(productId);
    }
    this.saveToStorage();
  }

  public getPriceDropNotificationCount(): number {
    return this.priceDropNotificationProductIds.size;
  }

  public getProductBestPriceInfo(productId: string): {
    lowestPrice: number;
    highestPrice: number;
    mrp: number;
    storeCount: number;
    lowestStoreName: string;
    lowestStoreId: string;
    lowestStoreDistanceKm: number;
    discountPercent: number;
  } | null {
    const options = this.getProductComparison(productId);
    if (options.length === 0) return null;

    const lowestOpt = options.find(o => o.isLowestPrice) || options[0];
    const prices = options.map(o => o.storeProduct.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const mrp = lowestOpt.storeProduct.mrp;
    const discountPercent = Math.round(((mrp - minPrice) / mrp) * 100);

    return {
      lowestPrice: minPrice,
      highestPrice: maxPrice,
      mrp,
      storeCount: options.length,
      lowestStoreName: lowestOpt.store.name,
      lowestStoreId: lowestOpt.store.id,
      lowestStoreDistanceKm: lowestOpt.distanceKm,
      discountPercent,
    };
  }

  // Developer / Evaluator simulation trigger: simulates a local shop reducing price on a watched product
  public simulatePriceDrop(productId: string): {
    productName: string;
    storeName: string;
    oldPrice: number;
    newPrice: number;
    discountPercent: number;
  } | null {
    const prod = this.getProductById(productId);
    if (!prod) return null;

    // Find in-stock store product for this item
    const options = this.storeProducts.filter(sp => sp.productId === productId);
    if (options.length === 0) return null;

    // Pick the store with the highest price or first store to drop price realistically
    const targetSp = options.sort((a, b) => b.price - a.price)[0];
    const store = this.getStoreById(targetSp.storeId);
    const oldPrice = targetSp.price;

    // Drop price by ~12-15%, rounded to nearest 50
    const drop = Math.max(100, Math.round((oldPrice * 0.14) / 50) * 50);
    const newPrice = Math.max(199, oldPrice - drop);
    const discountPercent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

    targetSp.price = newPrice;
    targetSp.updatedAt = new Date().toISOString();

    // Ensure notification preference is enabled so user feels the flow
    this.priceDropNotificationProductIds.add(productId);
    if (!this.savedProductIds.has(productId)) {
      this.savedProductIds.add(productId);
    }

    // Add alert notification
    this.addNotification({
      userId: this.currentUser.id,
      title: `Price Drop Alert: ${prod.name}`,
      message: `${store?.name || 'A local shop'} just lowered ${prod.name} from ₹${oldPrice.toLocaleString('en-IN')} to ₹${newPrice.toLocaleString('en-IN')} (${discountPercent}% OFF). In stock for 10-min counter hold!`,
      type: 'price_drop',
      productId,
      storeId: store?.id,
    });

    this.saveToStorage();

    return {
      productName: prod.name,
      storeName: store?.name || 'Local Store',
      oldPrice,
      newPrice,
      discountPercent,
    };
  }
}

export const lynkStore = new LynkStoreService();
