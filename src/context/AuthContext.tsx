"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  sendPasswordResetEmail: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ user: User | null; error: Error | null }>;
  updateUser: (data: { email?: string; password?: string; data?: object }) => Promise<{ user: User | null; error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Signup failed", { description: error.message });
      return { user: null, error };
    }
    if (data.user) {
      toast.success("Signup successful!", { description: "Please check your email to confirm your account." });
    }
    return { user: data.user, error: null };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Login failed", { description: error.message });
      return { user: null, error };
    }
    toast.success("Logged in successfully!");
    return { user: data.user, error: null };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      toast.error("Logout failed", { description: error.message });
      return { error };
    }
    toast.info("Logged out successfully.");
    return { error: null };
  };

  const sendPasswordResetEmail = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error("Password reset failed", { description: error.message });
      return { error };
    }
    toast.success("Password reset email sent!", { description: "Check your inbox for instructions." });
    return { error: null };
  };

  const updatePassword = async (password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error("Password update failed", { description: error.message });
      return { user: null, error };
    }
    toast.success("Password updated successfully!");
    return { user: data.user, error: null };
  };

  const updateUser = async (data: { email?: string; password?: string; data?: object }) => {
    setLoading(true);
    const { data: updatedData, error } = await supabase.auth.updateUser(data);
    setLoading(false);
    if (error) {
      toast.error("Profile update failed", { description: error.message });
      return { user: null, error };
    }
    toast.success("Profile updated successfully!");
    return { user: updatedData.user, error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        sendPasswordResetEmail,
        updatePassword,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};