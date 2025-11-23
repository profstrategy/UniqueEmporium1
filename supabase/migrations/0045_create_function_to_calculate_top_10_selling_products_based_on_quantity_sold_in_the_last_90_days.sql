CREATE OR REPLACE FUNCTION public.get_top_selling_products(
    time_period_days integer DEFAULT 90,
    limit_count integer DEFAULT 10
)
RETURNS TABLE (
    product_id text,
    total_quantity_sold numeric
)
LANGUAGE SQL
AS $$
SELECT
    (item->>'product_id')::text AS product_id,
    SUM((item->>'quantity')::numeric) AS total_quantity_sold
FROM
    orders,
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
$$;