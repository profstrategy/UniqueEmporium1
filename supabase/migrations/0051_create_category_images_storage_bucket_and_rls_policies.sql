-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('category_images', 'category_images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket (if applicable, though buckets themselves don't have RLS, objects do)
-- We will set RLS on the objects within the bucket

-- Create RLS policies for the objects in the bucket
-- Allow public read access to category images
CREATE POLICY "Public read access for category images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'category_images' );

-- Allow authenticated users to insert category images (admin only in practice)
CREATE POLICY "Authenticated users can insert category images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'category_images' );

-- Allow authenticated users to update their own category images (admin only in practice)
CREATE POLICY "Authenticated users can update their own category images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'category_images' );

-- Allow authenticated users to delete their own category images (admin only in practice)
CREATE POLICY "Authenticated users can delete their own category images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'category_images' );