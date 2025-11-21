-- Create the product_images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the 'product_images' bucket
-- Allow authenticated users to upload product images
CREATE POLICY "Allow authenticated uploads to product_images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product_images' AND auth.uid() IS NOT NULL);

-- Allow public read access to product_images
CREATE POLICY "Allow public read access to product_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product_images');

-- Allow authenticated users to update product images
CREATE POLICY "Allow authenticated updates to product_images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'product_images');

-- Allow authenticated users to delete product images
CREATE POLICY "Allow authenticated deletes from product_images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product_images');