-- Drop existing trigger if it exists (for safe migration/re-run)
DROP TRIGGER IF EXISTS on_order_completed_update_reviews ON public.orders;

-- Create the trigger
CREATE TRIGGER on_order_completed_update_reviews
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_verified_buyer_status();