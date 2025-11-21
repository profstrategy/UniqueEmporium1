import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import LoadingPage from '@/components/common/LoadingPage';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'; // Import useSearchParams

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { session, setAuthState, isLoading, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams(); // Initialize useSearchParams
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
      if (session && (!user || !user.role)) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, role')
          .eq('id', session.user.id)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error('Profile fetch error:', error);
          setAuthState(session, session.user);
        } else if (profile) {
          setAuthState(session, {
            ...session.user,
            first_name: profile.first_name,
            last_name: profile.last_name,
            role: profile.role
          });
        } else {
          setAuthState(session, session.user);
        }
        return;
      }

      // Determine if the user is currently in the password recovery flow
      const isPasswordRecovery = searchParams.get("type") === "recovery";

      // After user is loaded (or if already loaded), handle redirection
      // ONLY redirect if NOT in password recovery AND on the /auth page AND not already redirected
      if (isMounted && user && !isLoading && location.pathname === '/auth' && !isPasswordRecovery && !hasRedirected.current) {
        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
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
  }, [session, user, isLoading, isAdmin, setAuthState, navigate, location.pathname, location.state, searchParams]); // Added searchParams to dependencies

  if (isLoading) return <LoadingPage />;

  return <>{children}</>;
}