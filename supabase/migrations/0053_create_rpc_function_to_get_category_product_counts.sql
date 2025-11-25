-- Drop the function if it already exists to allow re-creation
DROP FUNCTION IF EXISTS get_category_product_counts();

-- Create the function
CREATE OR REPLACE FUNCTION get_category_product_counts()
RETURNS TABLE(category_id TEXT, product_count BIGINT)
LANGUAGE sql
AS $function$
  SELECT 
    p.category AS category_id,
    COUNT(p.id) AS product_count
  FROM 
    public.products p
  WHERE 
    p.status = 'active' -- Only count active products
  GROUP BY 
    p.category;
$function$;