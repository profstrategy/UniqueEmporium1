-- 1. Enable the pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create a function that calls your Edge Function
CREATE OR REPLACE FUNCTION public.notify_admin_on_new_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with the privileges of the function owner (usually postgres)
AS $$
DECLARE
  -- Replace with your actual Edge Function URL
  edge_function_url TEXT := 'https://vjsbnynwkwamvwzlvbny.supabase.co/functions/v1/notify-new-order'; 
  payload JSONB;
BEGIN
  -- Construct the payload with relevant new order data
  payload := jsonb_build_object(
    'order_id', NEW.id,
    'order_number', NEW.order_number,
    'user_id', NEW.user_id,
    'total_amount', NEW.total_amount,
    'status', NEW.status,
    'items', NEW.items,
    'shipping_address', NEW.shipping_address,
    'delivery_method', NEW.delivery_method,
    'created_at', NEW.created_at
  );

  -- Call the Edge Function asynchronously
  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.jwt.arr', true) -- Pass JWT if function requires auth
    ),
    body := payload
  );

  RETURN NEW;
END;
$$;

-- 3. Create the trigger on the orders table
DROP TRIGGER IF EXISTS on_new_order_notify_admin ON public.orders;
CREATE TRIGGER on_new_order_notify_admin
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.notify_admin_on_new_order();