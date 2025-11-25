-- Create or replace the function to get product counts per category
CREATE OR REPLACE FUNCTION public.get_category_product_counts()
RETURNS TABLE(category_id text, product_count bigint)
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