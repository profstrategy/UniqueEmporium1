CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE TO authenticated
USING (
  (SELECT public.get_user_role(auth.uid())) = 'admin'
);