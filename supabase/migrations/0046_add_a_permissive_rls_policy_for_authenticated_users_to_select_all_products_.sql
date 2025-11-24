-- Temporarily add a permissive policy for authenticated users to select all products
-- This is for debugging purposes to confirm RLS on 'products' is the issue.
-- This policy will be refined or removed once the root cause is identified.
CREATE POLICY "Authenticated users can select all products (DEBUG)"
ON public.products FOR SELECT TO authenticated USING (true);