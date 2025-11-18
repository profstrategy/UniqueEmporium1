-- Drop the table if it already exists (WARNING: This will delete all existing data in the 'products' table)
DROP TABLE IF EXISTS public.products CASCADE;

-- Create products table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount_percentage INTEGER,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tag TEXT,
  tag_variant TEXT,
  limited_stock BOOLEAN DEFAULT FALSE,
  min_order_quantity INTEGER NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  full_description TEXT,
  key_features TEXT[],
  style_notes TEXT,
  detailed_specs JSONB,
  reviews JSONB,
  related_products TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation needed
CREATE POLICY "Enable read access for all users" ON public.products 
FOR SELECT USING (true);

CREATE POLICY "Enable full access for admins" ON public.products 
FOR ALL TO authenticated USING ((auth.uid() IN ( SELECT profiles.id FROM profiles WHERE (profiles.role = 'admin'::text))));