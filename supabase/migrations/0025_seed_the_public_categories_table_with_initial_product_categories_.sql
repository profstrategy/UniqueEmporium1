INSERT INTO public.categories (id, name, product_count, status, created_at, updated_at)
VALUES
('shein-gowns', 'SHEIN Gowns', 0, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, name, product_count, status, created_at, updated_at)
VALUES
('men-vintage-shirts', 'Men Vintage Shirts', 0, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, name, product_count, status, created_at, updated_at)
VALUES
('children-jeans', 'Children Jeans', 0, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, name, product_count, status, created_at, updated_at)
VALUES
('amazon-ladies', 'Amazon Ladies', 0, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, name, product_count, status, created_at, updated_at)
VALUES
('others', 'Others', 0, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, name, product_count, status, created_at, updated_at)
VALUES
('kids', 'Kids', 0, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, name, product_count, status, created_at, updated_at)
VALUES
('children-shirts', 'Children Shirts', 0, 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;