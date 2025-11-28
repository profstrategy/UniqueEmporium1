CREATE OR REPLACE FUNCTION public.prevent_role_status_change()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  super_admin_id UUID := '73b71930-874b-4686-8780-03028181c45c'; -- Your designated Super Admin ID
BEGIN
  -- Allow ONLY the Super Admin to change roles/status.
  IF auth.uid() = super_admin_id THEN
    RETURN NEW; -- Super Admin is allowed to proceed with any changes
  END IF;

  -- For non-Super Admin users, prevent changes to 'role' or 'status'
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Unauthorized: Only the Super Admin can change account roles.';
  END IF;

  IF OLD.status IS DISTINCT FROM NEW.status THEN
    RAISE EXCEPTION 'Unauthorized: Only the Super Admin can change account status.';
  END IF;

  RETURN NEW;
END;
$$;