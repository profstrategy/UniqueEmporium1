-- Drop the existing function to allow re-creation with new security settings
DROP FUNCTION IF EXISTS public.get_top_selling_products(time_period_days integer, limit_count integer);

-- Re-create the function with SECURITY DEFINER and SET search_path = ''
CREATE OR REPLACE FUNCTION public.get_top_selling_products(time_period_days integer DEFAULT 30, limit_count integer DEFAULT 10)
 RETURNS TABLE(product_id text, total_quantity_sold numeric)
 LANGUAGE sql
 SECURITY DEFINER -- This makes the function run with the privileges of its creator (e.g., postgres)
 SET search_path = '' -- This ensures the function's search path is empty, preventing unintended access
AS $function$
  SELECT
    (item->>'product_id')::text AS product_id,
    SUM((item->>'quantity')::numeric) AS total_quantity_sold
  FROM
    public.orders, -- Explicitly use public.orders
    jsonb_array_elements(items) AS item
  WHERE
    status = 'completed'
    AND order_date >= NOW() - INTERVAL '1 day' * time_period_days
  GROUP BY
    product_id
  ORDER BY
    total_quantity_sold DESC
  LIMIT
    limit_count;
$function$;

-- Grant execute permissions to the anon role so unauthenticated users can call it
GRANT EXECUTE ON FUNCTION public.get_top_selling_products(time_period_days integer, limit_count integer) TO anon;