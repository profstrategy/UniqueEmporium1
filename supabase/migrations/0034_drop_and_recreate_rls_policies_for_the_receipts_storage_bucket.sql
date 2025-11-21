-- Drop existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow authenticated users to read their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to read all receipts" ON storage.objects;

-- Create a policy to allow authenticated users to read their own receipts
CREATE POLICY "Allow authenticated users to read their own receipts"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'receipts' AND auth.uid() = (storage.foldername(name))[1]::uuid);

-- Create a policy to allow admin users to read all receipts
CREATE POLICY "Allow admin to read all receipts"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'receipts' AND (SELECT public.get_user_role(auth.uid())) = 'admin');