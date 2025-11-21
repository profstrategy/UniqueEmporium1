-- Create a policy to allow authenticated users to read their own receipts
CREATE POLICY "Allow authenticated users to read their own receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND auth.uid() = owner
);

-- Create a policy to allow 'admin' role users to read ALL receipts
CREATE POLICY "Admins can read all receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND (SELECT public.get_user_role(auth.uid())) = 'admin'
);