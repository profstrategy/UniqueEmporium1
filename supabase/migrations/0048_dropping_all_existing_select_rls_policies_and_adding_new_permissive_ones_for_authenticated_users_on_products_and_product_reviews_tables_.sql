-- Drop all existing SELECT policies on public.products
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can select all products (DEBUG)" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products; -- Also drop this one if it exists
DROP POLICY IF EXISTS "Authenticated users can select all products (DEBUG)" ON public.products; -- Ensure this is dropped if it was created

-- Add a single, clear SELECT policy for authenticated users on public.products
CREATE POLICY "Allow authenticated to read all products"
ON public.products FOR SELECT TO authenticated USING (true);

-- Drop all existing SELECT policies on public.product_reviews
DROP POLICY IF EXISTS "Public read access for reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Authenticated users can select all reviews (DEBUG)" ON public.product_reviews;
DROP POLICY IF EXISTS "Authenticated users can select all reviews (DEBUG)" ON public.product_reviews; -- Ensure this is dropped if it was created

-- Add a single, clear SELECT policy for authenticated users on public.product_reviews
CREATE POLICY "Allow authenticated to read all product_reviews"
ON public.product_reviews FOR SELECT TO authenticated USING (true);