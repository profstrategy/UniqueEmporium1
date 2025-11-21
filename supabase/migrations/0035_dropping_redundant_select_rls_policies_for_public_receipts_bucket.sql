-- Drop existing SELECT policies on the receipts bucket
DROP POLICY IF EXISTS "Allow authenticated users to view their own receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin users to view all receipts" ON storage.objects;