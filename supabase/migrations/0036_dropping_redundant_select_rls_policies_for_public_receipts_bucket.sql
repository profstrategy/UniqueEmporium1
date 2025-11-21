-- Drop existing SELECT policies on the receipts bucket
DROP POLICY IF EXISTS "Allow authenticated users to read their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin to read all receipts" ON storage.objects;