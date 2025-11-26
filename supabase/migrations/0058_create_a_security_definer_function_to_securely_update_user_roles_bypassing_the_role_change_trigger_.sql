CREATE OR REPLACE FUNCTION public.update_admin_role_securely(old_admin_id uuid, new_admin_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 1. Revert the old Super Admin ID to 'customer' role
  UPDATE public.profiles
  SET role = 'customer'
  WHERE id = old_admin_id;

  -- 2. Set the new Super Admin ID to 'admin' role
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = new_admin_id;
END;
$$;