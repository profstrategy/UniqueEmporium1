CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if the user exists in the profiles table
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;

  -- If user doesn't exist in profiles, check auth.users (e.g., during sign-up)
  IF user_role IS NULL THEN
    -- You might want to return a default role or handle this case differently
    -- For now, we'll return 'customer' as a default for new/unknown users
    -- Or you could return NULL and handle it in your application logic
    RETURN 'customer'; -- Or 'guest' or whatever default is appropriate
  END IF;

  RETURN user_role;
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    -- Handle case where user is not found in either table
    RETURN 'customer'; -- Or 'guest' or appropriate default
  WHEN OTHERS THEN
    -- Log error or handle unexpected issues
    RAISE NOTICE 'Error in get_user_role: %', SQLERRM;
    RETURN 'customer'; -- Or appropriate default
END;
$function$;