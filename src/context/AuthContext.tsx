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
  const [isLoading, setIsLoading] = useState(true); // Keep initial state as true
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // To prevent state updates on unmounted component

    const loadUserAndProfile = async () => {
      console.log("AuthContext: Starting loadUserAndProfile function for initial session.");
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;
        console.log("AuthContext: getSession resolved, initialSession:", initialSession ? "present" : "null");
        
        setSession(initialSession);
        const currentUser = initialSession?.user ?? null;

        if (currentUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', currentUser.id)
            .single();

          if (error) {
            console.error("AuthContext: Error fetching initial user profile:", error);
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
      } catch (error) {
        console.error("AuthContext: Error during initial session load:", error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        if (isMounted) {
          setIsLoading(false); // Set loading to false ONLY after initial check is complete
          console.log("AuthContext: loadUserAndProfile - setIsLoading(false) called.");
        }
      }
    };

    loadUserAndProfile(); // Call the initial load function

    // Set up listener for subsequent auth state changes (does not affect isLoading)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;
        console.log("AuthContext: onAuthStateChange event:", event);
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;

        if (currentUser) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('first_name, last_name, role')
            .eq('id', currentUser.id)
            .single();

          if (error) {
            console.error("AuthContext: Error fetching user profile on change:", error);
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
        // IMPORTANT: Do NOT set isLoading(false) here. It's only for initial load.
      }
    );

    return () => {
      console.log("AuthContext: Cleaning up auth listener.");
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

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