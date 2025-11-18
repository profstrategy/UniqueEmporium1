"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
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
  user: CustomUser | null;
  isAdmin: boolean;
  isLoading: boolean;
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
  const navigate = useNavigate();
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    let isMounted = true;

    const handleAuthStateChange = async (event: string, currentSession: Session | null) => {
      if (!isMounted) return;
      console.log("AuthContext: onAuthStateChange event:", event);

      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;

      if (currentUser) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, role')
          .eq('id', currentUser.id)
          .single();

        if (!isMounted) return;

        if (profileError) {
          console.error("AuthContext: Error fetching user profile during state change:", profileError);
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

      if (isInitialLoadRef.current) {
        setIsLoading(false);
        isInitialLoadRef.current = false;
        console.log("AuthContext: Initial auth state determined, isLoading set to false.");
      }
    };

    supabase.auth.getSession()
      .then(({ data: { session: initialSession } }) => {
        if (!isMounted) return;
        handleAuthStateChange('INITIAL_SESSION', initialSession);
      })
      .catch(error => {
        console.error("AuthContext: Error getting initial session:", error);
        if (isInitialLoadRef.current) {
          setIsLoading(false);
          isInitialLoadRef.current = false;
        }
      });

    // Correct Supabase v2 syntax
    const { data: listener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
      console.log("AuthContext: Cleaning up auth listener.");
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Sign In Failed", { description: error.message });
      throw error;
    }
    toast.success("Welcome back!");
  };

  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
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
