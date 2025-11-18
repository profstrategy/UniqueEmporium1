"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Extend the User type to include first_name and last_name
interface CustomUser extends User {
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  session: Session | null;
  user: CustomUser | null; // Use CustomUser here
  isAdmin: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName: string, lastName: string) => Promise<void>; // Updated signature
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<CustomUser | null>(null); // Use CustomUser
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        
        if (currentUser) {
          // Fetch profile data to get first_name, last_name, and role
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', currentUser.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            // Fallback to basic user data if profile fetch fails
            setUser(currentUser);
            setIsAdmin(false);
          } else if (profile) {
            setUser({
              ...currentUser,
              first_name: profile.first_name,
              last_name: profile.last_name,
            });
            setIsAdmin(profile.role === 'admin');
          } else {
            // User exists but no profile found (shouldn't happen with trigger)
            setUser(currentUser);
            setIsAdmin(false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, role')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          console.error("Error fetching initial user profile:", error);
          setUser(currentUser);
          setIsAdmin(false);
        } else if (profile) {
          setUser({
            ...currentUser,
            first_name: profile.first_name,
            last_name: profile.last_name,
          });
          setIsAdmin(profile.role === 'admin');
        } else {
          setUser(currentUser);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Function to handle sign in
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Sign In Failed", { description: error.message });
      throw error;
    }
    toast.success("Welcome back!");
  };

  // Function to handle sign up
  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }, // Pass first_name and last_name
      },
    });

    if (error) {
      toast.error("Sign Up Failed", { description: error.message });
      throw error;
    }

    if (user) {
      toast.success("Account created successfully!", {
        description: "Please check your email to confirm your account.",
      });
    }
  };

  // Function to handle sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign Out Failed", { description: error.message });
      throw error;
    }
    toast.info("You have been logged out.");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAdmin,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
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