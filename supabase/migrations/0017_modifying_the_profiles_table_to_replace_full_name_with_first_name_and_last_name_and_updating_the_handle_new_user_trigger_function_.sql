-- Step 1: Add new columns for first_name and last_name
ALTER TABLE public.profiles
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Step 2: Update existing data (if any) from full_name to first_name and last_name
-- This is a basic attempt; you might need more sophisticated parsing for real-world data
UPDATE public.profiles
SET
  first_name = split_part(full_name, ' ', 1),
  last_name = NULLIF(trim(substring(full_name from position(' ' in full_name))), '');

-- Step 3: Drop the old full_name column
ALTER TABLE public.profiles
DROP COLUMN full_name;

-- Step 4: Update the handle_new_user function to use first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name', -- Use 'first_name' from options.data
    new.raw_user_meta_data ->> 'last_name',  -- Use 'last_name' from options.data
    new.email
  );
  RETURN new;
END;
$$;