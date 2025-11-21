CREATE POLICY "Admins can update all payment receipts" ON public.payment_receipts
FOR UPDATE TO authenticated
USING ( (SELECT public.get_user_role(auth.uid())) = 'admin' );