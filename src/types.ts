export type UserRole = 'customer' | 'shop_owner' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  savedStoreIds: string[];
  savedProductIds: string[];
  createdAt: string;
}

export type StoreCategory = 
  | 'electronics' 
  | 'fashion' 
  | 'grocery' 
  | 'pharmacy' 
  | 'food_beverage' 
  | 'home_lifestyle' 
  | 'local_crafts' 
  | 'books_stationery';

export type StoreType = 'local_shop' | 'brand_outlet' | 'mall_store' | 'supermarket';

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  tagline?: string;
  description: string;
  category: StoreCategory;
  storeType: StoreType;
  address: string;
  locality: string;
  city: 'Bhubaneswar' | 'Bengaluru' | 'Mumbai' | 'Delhi' | 'Hyderabad';
  latitude: number;
  longitude: number;
  phone: string;
  openingTime: string; // e.g. "09:00 AM"
  closingTime: string; // e.g. "09:30 PM"
  isOpenNow: boolean;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  imageUrl: string;
  coverUrl?: string;
  distanceKm?: number; // dynamically computed relative to active location
  walkingMinutes?: number;
  drivingMinutes?: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: StoreCategory;
  description: string;
  imageUrl: string;
  specifications: Record<string, string>;
  createdAt: string;
}

export interface StoreProduct {
  id: string;
  storeId: string;
  productId: string;
  price: number; // in INR
  mrp: number; // Maximum Retail Price in INR
  stockQuantity: number;
  pickupAvailable: boolean;
  estimatedPickupMinutes: number;
  deliveryAvailable: boolean;
  estimatedDeliveryHours: number;
  updatedAt: string;
}

export interface Offer {
  id: string;
  storeId: string;
  productId?: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat' | 'bogo';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  badgeText?: string;
}

export type ReservationStatus = 'active' | 'completed' | 'cancelled' | 'expired';

export interface Reservation {
  id: string;
  reservationNumber: string;
  customerId: string;
  storeId: string;
  productId: string;
  quantity: number;
  price: number;
  status: ReservationStatus;
  expiresAt: string; // 30 minutes from creation
  createdAt: string;
  pickupCode: string;
}

export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentStatus = 'pending' | 'completed' | 'cash_on_pickup';
export type OrderStatus = 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  brand: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  storeId: string;
  storeName: string;
  totalAmount: number;
  fulfillmentType: FulfillmentType;
  paymentMethod: 'upi' | 'card' | 'cash_on_pickup';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryAddress?: string;
  contactPhone: string;
  items: OrderItem[];
  createdAt: string;
  estimatedTime: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'price_drop' | 'reservation' | 'order' | 'offer' | 'stock' | 'system';
  storeId?: string;
  productId?: string;
  read: boolean;
  createdAt: string;
}

export interface CityLocation {
  name: 'Bhubaneswar' | 'Bengaluru' | 'Mumbai' | 'Delhi' | 'Hyderabad';
  state: string;
  locality: string;
  latitude: number;
  longitude: number;
  totalStores: number;
  totalProducts: number;
}

export interface ComparisonStoreOption {
  store: Store;
  storeProduct: StoreProduct;
  product: Product;
  activeOffer?: Offer;
  distanceKm: number;
  walkingMinutes: number;
  isLowestPrice?: boolean;
  isClosest?: boolean;
  isFastestPickup?: boolean;
  isHighestRated?: boolean;
}
