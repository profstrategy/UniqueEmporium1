import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import LoadingPage from '@/components/common/LoadingPage';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { session, setAuthState, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false); // To prevent multiple redirects

  useEffect(() => {
    const loadProfileAndRedirect = async () => {
      if (!session) {
        setAuthState(null, null);
        hasRedirected.current = false; // Reset if session is null
        return;
      }

      // If user data is already loaded and we haven't redirected yet, or if we're on the auth page
      // and the user is now logged in, perform the redirect.
      if (user && !isLoading && !hasRedirected.current) {
        if (location.pathname === '/auth') { // Only redirect from auth page after login
          if (user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/account', { replace: true });
          }
          hasRedirected.current = true;
        }
        return;
      }

      // If session exists but user profile isn't loaded yet, fetch it
      if (session && !user && isLoading) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, role')
          .eq('id', session.user.id)
          .single();

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
          // Handle case where profile might not exist immediately after signup
          setAuthState(session, session.user);
        }
      }
    };

    loadProfileAndRedirect();
  }, [session, setAuthState, isLoading, user, navigate, location.pathname]);

  if (isLoading) return <LoadingPage />;

  return <>{children}</>;
}