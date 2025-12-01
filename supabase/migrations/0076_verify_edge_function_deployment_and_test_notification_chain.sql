-- 1. Check Edge Function URL in notify trigger (should be correct)
SELECT 
  proname, 
  prosrc 
FROM pg_proc 
WHERE proname = 'notify_admin_on_new_order' 
LIMIT 1;