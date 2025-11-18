-- Create a new storage bucket for payment receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', FALSE)
ON CONFLICT (id) DO NOTHING; -- Prevents error if bucket already exists

-- Policies for the 'receipts' bucket
-- Policy for users to upload their own receipts
CREATE POLICY "Allow authenticated users to upload their own receipts"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'receipts' AND auth.uid() = owner
);

-- Policy for users to view their own receipts
CREATE POLICY "Allow authenticated users to view their own receipts"
ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'receipts' AND auth.uid() = owner
);

-- Policy for users to update their own receipts (e.g., metadata)
CREATE POLICY "Allow authenticated users to update their own receipts"
ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'receipts' AND auth.uid() = owner
);

-- Policy for users to delete their own receipts
CREATE POLICY "Allow authenticated users to delete their own receipts"
ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'receipts' AND auth.uid() = owner
);

-- Policy for admins to view all receipts (assuming 'admin' role in public.profiles)
CREATE POLICY "Allow admins to view all receipts"
ON storage.objects FOR SELECT USING (
  bucket_id = 'receipts' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);