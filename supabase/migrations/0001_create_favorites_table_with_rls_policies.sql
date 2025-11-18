-- Create the favorites table
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL, -- Assuming product IDs are text
  product_data JSONB NOT NULL, -- Store the full product object
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE (user_id, product_id) -- Ensure a user can only favorite a product once
);

-- Enable RLS on the favorites table (REQUIRED for security)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own favorited items
CREATE POLICY "Users can view their own favorites" ON public.favorites
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Policy: Users can only add their own favorited items
CREATE POLICY "Users can insert their own favorites" ON public.favorites
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own favorited items
CREATE POLICY "Users can delete their own favorites" ON public.favorites
FOR DELETE TO authenticated USING (auth.uid() = user_id);