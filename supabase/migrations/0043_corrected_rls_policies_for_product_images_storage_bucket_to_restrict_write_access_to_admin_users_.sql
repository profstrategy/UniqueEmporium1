-- Drop existing policies for product_images bucket
DROP POLICY IF EXISTS "Allow public read access to product_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload product_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update product_images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete product_images" ON storage.objects;

-- Re-create policies with admin role check for write operations
-- Policy for public read access (remains public)
CREATE POLICY "product_images_public_read"
ON storage.objects FOR SELECT
USING (bucket_id = 'product_images');

-- Policy for admin users to insert images
CREATE POLICY "product_images_admin_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product_images' AND public.get_user_role(auth.uid()) = 'admin');

-- Policy for admin users to update images
CREATE POLICY "product_images_admin_update" -- Added missing CREATE POLICY statement
ON storage.objects FOR UPDATE
USING (bucket_id = 'product_images' AND public.get_user_role(auth.uid()) = 'admin');

-- Policy for admin users to delete images
CREATE POLICY "product_images_admin_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product_images' AND public.get_user_role(auth.uid()) = 'admin');