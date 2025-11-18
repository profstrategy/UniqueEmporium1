-- Drop the existing 'Enable full access for admins' policy on products
DROP POLICY IF EXISTS "Enable full access for admins" ON public.products;

-- Create a new policy for admins to view all products using get_user_role
CREATE POLICY "Admins can view all products" ON public.products
FOR SELECT TO authenticated USING (
  (SELECT public.get_user_role(auth.uid())) = 'admin'
);