CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  date_prefix TEXT;
  random_digits TEXT;
  role_prefix TEXT := 'UU'; -- Default to 'UU' for regular users
  generated_custom_id TEXT;
  is_unique BOOLEAN;
BEGIN
  -- Generate date prefix (YYMMDD)
  date_prefix := TO_CHAR(NOW(), 'YYMMDD');

  -- Loop to ensure uniqueness for the custom_user_id
  LOOP
    -- Generate 4 random digits
    random_digits := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    generated_custom_id := role_prefix || '-' || date_prefix || '-' || random_digits;

    -- Check if the generated ID is unique
    SELECT NOT EXISTS (SELECT 1 FROM public.profiles WHERE custom_user_id = generated_custom_id) INTO is_unique;

    IF is_unique THEN
      EXIT; -- Exit loop if unique
    END IF;
  END LOOP;

  INSERT INTO public.profiles (id, first_name, last_name, email, custom_user_id)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email,
    generated_custom_id -- Insert the generated custom ID
  );
  RETURN new;
END;
$$;