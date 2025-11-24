-- Drop any existing SELECT policies on public.products to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated to read all products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can select all products (DEBUG)" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;

-- Add a single, clear SELECT policy for authenticated users on public.products
CREATE POLICY "Allow authenticated to read all products"
ON public.products FOR SELECT TO authenticated USING (true);