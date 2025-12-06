-- Create the table for dynamic delivery banner messages
CREATE TABLE public.delivery_banner_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_type TEXT NOT NULL, -- e.g., 'delivery_info', 'promotion', 'alert'
  content TEXT NOT NULL,      -- The actual text of the banner message
  start_date TIMESTAMP WITH TIME ZONE, -- When the message should start appearing
  end_date TIMESTAMP WITH TIME ZONE,   -- When the message should stop appearing
  is_active BOOLEAN DEFAULT TRUE,      -- Admin can toggle visibility
  priority INTEGER DEFAULT 0,          -- For ordering messages (higher number = higher priority)
  link_url TEXT,                       -- Optional URL for a CTA
  link_text TEXT,                      -- Optional text for the CTA link
  background_color TEXT,               -- Optional Tailwind class for background (e.g., 'bg-red-600')
  text_color TEXT,                     -- Optional Tailwind class for text (e.g., 'text-white')
  icon_name TEXT,                      -- Optional Lucide icon name (e.g., 'Truck', 'Gift')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for the table
ALTER TABLE public.delivery_banner_messages ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active messages
CREATE POLICY "Allow public read access to active banner messages" ON public.delivery_banner_messages
FOR SELECT USING (
  is_active = TRUE AND
  (start_date IS NULL OR start_date <= NOW()) AND
  (end_date IS NULL OR end_date >= NOW())
);

-- Policy for admin users to perform all operations (CRUD)
CREATE POLICY "Admins can manage all banner messages" ON public.delivery_banner_messages
FOR ALL TO authenticated USING (
  (SELECT public.get_user_role(auth.uid())) = 'admin'
) WITH CHECK (
  (SELECT public.get_user_role(auth.uid())) = 'admin'
);

-- Create a trigger to automatically set the updated_at timestamp
CREATE TRIGGER set_delivery_banner_messages_updated_at
BEFORE UPDATE ON public.delivery_banner_messages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();