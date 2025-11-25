CREATE POLICY "Public read access for review author names" ON public.profiles
FOR SELECT TO public
USING (true);