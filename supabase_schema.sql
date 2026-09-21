-- ==========================================================
-- LYNK: "India’s market, connected."
-- SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'shop_owner', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STORES TABLE
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('electronics', 'fashion', 'grocery', 'pharmacy', 'food_beverage', 'home_lifestyle', 'local_crafts', 'books_stationery')),
  store_type TEXT NOT NULL DEFAULT 'local_shop',
  address TEXT NOT NULL,
  locality TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT NOT NULL,
  opening_time TEXT NOT NULL DEFAULT '09:00 AM',
  closing_time TEXT NOT NULL DEFAULT '09:30 PM',
  is_open_now BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3,2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STORE_PRODUCTS TABLE (Live Inventory & Store Pricing)
CREATE TABLE IF NOT EXISTS store_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price NUMERIC(10,2) NOT NULL,
  mrp NUMERIC(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  pickup_available BOOLEAN DEFAULT TRUE,
  estimated_pickup_minutes INTEGER DEFAULT 10,
  delivery_available BOOLEAN DEFAULT TRUE,
  estimated_delivery_hours INTEGER DEFAULT 2,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (store_id, product_id)
);

-- 5. OFFERS TABLE
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat', 'bogo')),
  discount_value NUMERIC(10,2) NOT NULL,
  badge_text TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RESERVATIONS TABLE (30-min guaranteed in-store hold)
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL,
  pickup_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  total_amount NUMERIC(10,2) NOT NULL,
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('pickup', 'delivery')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'cash_on_pickup')),
  payment_status TEXT NOT NULL DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'cash_on_pickup')),
  order_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (order_status IN ('confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'completed', 'cancelled')),
  delivery_address TEXT,
  contact_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL
);

-- 9. SAVED STORES & PRODUCTS
CREATE TABLE IF NOT EXISTS saved_stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (customer_id, store_id)
);

CREATE TABLE IF NOT EXISTS saved_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (customer_id, product_id)
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('price_drop', 'reservation', 'order', 'offer', 'stock', 'system')),
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = user_uid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STORES: Anyone can view; only owner or admin can update
CREATE POLICY "Public can view stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Shop owners can insert stores" ON stores FOR INSERT WITH CHECK (auth.uid() = owner_id OR is_admin(auth.uid()));
CREATE POLICY "Shop owners can update own stores" ON stores FOR UPDATE USING (auth.uid() = owner_id OR is_admin(auth.uid()));
CREATE POLICY "Shop owners can delete own stores" ON stores FOR DELETE USING (auth.uid() = owner_id OR is_admin(auth.uid()));

-- PRODUCTS: Anyone can view; authenticated shop owners / admins can add
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Shop owners & admins can insert products" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- STORE_PRODUCTS: Anyone can view pricing; only store owner can update stock/price
CREATE POLICY "Public can view inventory" ON store_products FOR SELECT USING (true);
CREATE POLICY "Store owners can manage inventory" ON store_products FOR ALL USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = store_products.store_id AND stores.owner_id = auth.uid()) OR is_admin(auth.uid())
);

-- OFFERS: Anyone can view active offers; store owner can manage
CREATE POLICY "Public can view offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Store owners can manage offers" ON offers FOR ALL USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = offers.store_id AND stores.owner_id = auth.uid()) OR is_admin(auth.uid())
);

-- RESERVATIONS: Customers see their own; Store owners see reservations for their store
CREATE POLICY "Customers view own reservations" ON reservations FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Store owners view store reservations" ON reservations FOR SELECT USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = reservations.store_id AND stores.owner_id = auth.uid()) OR is_admin(auth.uid())
);
CREATE POLICY "Customers can create reservations" ON reservations FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers and owners can update reservations" ON reservations FOR UPDATE USING (
  auth.uid() = customer_id OR EXISTS (SELECT 1 FROM stores WHERE stores.id = reservations.store_id AND stores.owner_id = auth.uid()) OR is_admin(auth.uid())
);

-- ORDERS: Customers see their own; Store owners see orders for their store
CREATE POLICY "Customers view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Store owners view store orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()) OR is_admin(auth.uid())
);
CREATE POLICY "Customers can place orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Store owners can update order status" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()) OR is_admin(auth.uid())
);

-- NOTIFICATIONS: User views own
CREATE POLICY "User views own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User updates own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
