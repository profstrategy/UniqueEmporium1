-- Add foreign key constraint for user_id referencing public.profiles(id)
ALTER TABLE public.product_reviews
ADD CONSTRAINT fk_user_id
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint for product_id referencing public.products(id)
ALTER TABLE public.product_reviews
ADD CONSTRAINT fk_product_id
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;