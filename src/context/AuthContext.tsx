import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner"; // Import toast for error handling
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface CustomUser extends User {
  first_name?: string;
  last_name?: string;
  role?: string;
  custom_user_id?: string; // NEW: Add custom_user_id
}

interface AuthContextType {
  session: Session | null;
  user: CustomUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  setAuthState: (session: Session | null, user: CustomUser | null) => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const setAuthState = (newSession: Session | null, newUser: CustomUser | null) => {
    setSession(newSession);
    setUser(newUser);
    setIsAdmin(newUser?.role === 'admin');
    setIsLoading(false); // Set isLoading to false only after all auth state is determined
  };

  useEffect(() => {
    let isMounted = true;

    const handleAuthChange = async (currentSession: Session | null) => {
      if (!isMounted) return;

      if (currentSession) {
        // Fetch profile immediately if session exists
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, role, custom_user_id') // NEW: Select custom_user_id
          .eq('id', currentSession.user.id)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error('Profile fetch error during auth change:', error);
          // If profile fetch fails, still set basic user from session
          setAuthState(currentSession, currentSession.user);
        } else if (profile) {
          // Merge profile data with session user data
          setAuthState(currentSession, {
            ...currentSession.user,
            first_name: profile.first_name,
            last_name: profile.last_name,
            role: profile.role,
            custom_user_id: profile.custom_user_id // NEW: Assign custom_user_id
          });
        } else {
          // No profile found, but session exists. Treat as basic user.
          setAuthState(currentSession, currentSession.user);
        }
      } else {
        // No session, clear auth state
        setAuthState(null, null);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      handleAuthChange(data.session); // Process initial session
    });

    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      handleAuthChange(newSession); // Process subsequent changes
    });

    return () => {
      isMounted = false;
      data.subscription?.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Sign In Failed", { description: error.message });
      throw error;
    }
    toast.success("Signed in successfully!");
  };

  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }
      }
    });

    if (error) {
      toast.error("Sign Up Failed", { description: error.message });
      throw error;
    }
    toast.success("Account created! Please check your email to confirm.");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign Out Failed", { description: error.message });
      throw error;
    }
    toast.info("You have been signed out.");
    navigate('/'); // Redirect to homepage after successful logout
  };

  return (
    <AuthContext.Provider
      value={{ 
        session, 
        user, 
        isAdmin, 
        isLoading, 
        setAuthState,
        signInWithEmail,
        signUpWithEmail,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};