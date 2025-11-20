import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner"; // Import toast for error handling
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface CustomUser extends User {
  first_name?: string;
  last_name?: string;
  role?: string;
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
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      // setIsLoading(false); // Moved to CheckAuth for profile loading
    });

    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      // setIsLoading(false); // Moved to CheckAuth for profile loading
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