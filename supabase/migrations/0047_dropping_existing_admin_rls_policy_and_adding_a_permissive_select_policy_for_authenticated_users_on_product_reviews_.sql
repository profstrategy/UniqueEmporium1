-- Drop the existing broad admin policy on product_reviews
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.product_reviews;

-- Add a new permissive SELECT policy for authenticated users on product_reviews (for debugging)
CREATE POLICY "Authenticated users can select all reviews (DEBUG)"
ON public.product_reviews FOR SELECT TO authenticated USING (true);