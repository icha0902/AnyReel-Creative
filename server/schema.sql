-- ══════════════════════════════════════════════════════════════════
-- 🎬 AnyReel Creative — Supabase Database Migration Schema
-- Jalankan skrip ini di: Supabase Dashboard > SQL Editor > New Query
-- ══════════════════════════════════════════════════════════════════

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Automatic Profile Creation Trigger for Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN lower(new.email) IN ('dyladyla328@gmail.com', 'admin@anyreel.com') THEN 'admin'
      ELSE COALESCE(new.raw_user_meta_data->>'role', 'user')
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      phone = EXCLUDED.phone;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Seed Admin Profile for dyladyla328@gmail.com (aichayy matcha)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'dyladyla328@gmail.com') THEN
    INSERT INTO public.profiles (id, full_name, email, phone, role)
    SELECT id, 'aichayy matcha', 'dyladyla328@gmail.com', '085754051605', 'admin'
    FROM auth.users
    WHERE email = 'dyladyla328@gmail.com'
    ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'aichayy matcha';
  END IF;
END $$;

-- 5. Services Catalog Table
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price_per_minute INTEGER DEFAULT 10000,
  slots_per_month INTEGER DEFAULT 15,
  slots_remaining INTEGER DEFAULT 15,
  is_popular BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Services are viewable by everyone" ON public.services;
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify services" ON public.services;
CREATE POLICY "Only admins can modify services" ON public.services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Seed default services from reference wireframe
INSERT INTO public.services (id, name, description, category, price_per_minute, slots_per_month, slots_remaining, is_popular, image_url)
VALUES
  (
    'svc-reels-tiktok', 
    'Paket Reels & TikTok Editing', 
    'Video vertikal singkat dengan potongan cepat, subtitle, dan musik.', 
    'short-form', 
    10000, 
    15, 
    15, 
    TRUE,
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'svc-youtube', 
    'Paket YouTube Editing', 
    'Video panjang dengan transisi, color grading, dan sound design.', 
    'long-form', 
    10000, 
    8, 
    8, 
    FALSE,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'svc-commercial', 
    'Paket Commercial Ads Editing', 
    'Video iklan produk dengan tampilan rapi dan pesan yang tegas.', 
    'commercial', 
    10000, 
    5, 
    5, 
    FALSE,
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80'
  )
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    price_per_minute = EXCLUDED.price_per_minute,
    is_popular = EXCLUDED.is_popular,
    image_url = EXCLUDED.image_url;

-- 6. Vouchers Table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  max_uses INTEGER DEFAULT 20,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vouchers viewable by everyone" ON public.vouchers;
CREATE POLICY "Vouchers viewable by everyone" ON public.vouchers FOR SELECT USING (true);

-- Seed welcome voucher (20% diskon, kuota 20 pengguna)
INSERT INTO public.vouchers (code, discount_percent, max_uses)
VALUES ('WELCOME20', 20, 20)
ON CONFLICT (code) DO NOTHING;

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 1,
  file_link TEXT,
  editing_style TEXT,
  voucher_code TEXT,
  subtotal INTEGER NOT NULL,
  discount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','editing','review','revision','revising','done','cancelled')),
  result_link TEXT,
  payment_method TEXT,
  tripay_reference TEXT,
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 2,
  revisions JSONB DEFAULT '[]'::jsonb,
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Orders are viewable by owner, admin, or tracking" ON public.orders;
CREATE POLICY "Orders are viewable by owner, admin, or tracking" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users & admins can update orders" ON public.orders;
CREATE POLICY "Users & admins can update orders" ON public.orders FOR UPDATE USING (true);

-- 8. Revision Requests Table (Audit log terperinci)
CREATE TABLE IF NOT EXISTS public.revision_requests (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  notes TEXT NOT NULL,
  sections_to_fix JSONB DEFAULT '[]'::jsonb,
  reference_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','resolved')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.revision_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Revision requests viewable by all" ON public.revision_requests;
CREATE POLICY "Revision requests viewable by all" ON public.revision_requests FOR ALL USING (true);
