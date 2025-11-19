import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import LoadingPage from '@/components/common/LoadingPage';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { session, setAuthState, isLoading, user, isAdmin } = useAuth(); // Added isAdmin
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfileAndRedirect = async () => {
      if (!session) {
        if (isMounted) {
          setAuthState(null, null);
          hasRedirected.current = false;
        }
        return;
      }

      // If session exists but user profile isn't fully loaded in context yet
      if (session && (!user || !user.role)) { // Check for user.role to ensure profile is loaded
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, role')
          .eq('id', session.user.id)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error('Profile fetch error:', error);
          setAuthState(session, session.user); // Set basic user if profile fetch fails
        } else if (profile) {
          setAuthState(session, {
            ...session.user,
            first_name: profile.first_name,
            last_name: profile.last_name,
            role: profile.role
          });
        } else {
          // Profile might not exist immediately after signup, set basic user
          setAuthState(session, session.user);
        }
        return; // Important: return after setting state to let useEffect re-run with updated state
      }

      // After user is loaded (or if already loaded), handle redirection
      if (isMounted && user && !isLoading && location.pathname === '/auth' && !hasRedirected.current) {
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          // Redirect to the 'from' state if available, otherwise to home page
          const from = (location.state as { from?: string })?.from;
          navigate(from || '/', { replace: true });
        }
        hasRedirected.current = true;
      }
    };

    fetchProfileAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [session, user, isLoading, isAdmin, setAuthState, navigate, location.pathname, location.state]); // Added isAdmin and location.state to dependencies

  if (isLoading) return <LoadingPage />;

  return <>{children}</>;
}