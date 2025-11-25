CREATE POLICY "Public products read access" ON public.products
FOR SELECT USING (true);