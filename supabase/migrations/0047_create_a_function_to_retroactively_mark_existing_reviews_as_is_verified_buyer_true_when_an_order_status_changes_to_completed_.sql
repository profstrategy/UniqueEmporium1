CREATE OR REPLACE FUNCTION public.update_verified_buyer_status()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  item JSONB;
  product_id_text TEXT;
BEGIN
  -- Check if the new status is 'completed' and the old status was not 'completed'
  IF NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' THEN
    -- Iterate over each item in the order's items array
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
      product_id_text := item ->> 'product_id';

      -- Update any existing reviews for this product by this user
      UPDATE public.product_reviews
      SET is_verified_buyer = TRUE
      WHERE
        user_id = NEW.user_id
        AND product_id = product_id_text
        AND is_verified_buyer = FALSE; -- Only update if it wasn't already verified
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;