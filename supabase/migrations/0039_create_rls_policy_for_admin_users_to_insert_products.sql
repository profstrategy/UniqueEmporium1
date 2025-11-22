-- Allow admin users to insert products
CREATE POLICY "Admins can insert products" ON public.products
FOR INSERT TO authenticated WITH CHECK (( SELECT public.get_user_role(auth.uid()) ) = 'admin');