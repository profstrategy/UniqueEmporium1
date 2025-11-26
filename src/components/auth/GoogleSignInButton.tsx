"use client";

import React, { useState, useEffect } from 'react';
import './GoogleSignInButton.css';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { toast } from "sonner"; // Import toast for notifications

const GoogleSignInButton = () => {
  // No longer need buttonState as Supabase handles redirects
  // const [buttonState, setButtonState] = useState('');

  const handleClick = async () => {
    // In a real app, this would trigger the Google OAuth flow.
    // For now, we just mark it as clicked.
    // if (buttonState.includes('clicked')) return;
    // setButtonState('clicked');
    
    // Simulate a brief loading state before resetting
    // setTimeout(() => {
    //   setButtonState('');
    // }, 1500);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // Redirects back to your app's root URL
        },
      });

      if (error) {
        toast.error("Google Sign-In Failed", { description: error.message });
        console.error("Google Sign-In Error:", error);
      } else {
        // Supabase will handle the redirect, so no success toast here.
        // The CheckAuth component will handle navigation after successful sign-in.
      }
    } catch (err) {
      toast.error("An unexpected error occurred during Google Sign-In.");
      console.error("Unexpected Google Sign-In Error:", err);
    }
  };

  const baseClasses = "firebaseui-idp-google flex items-center justify-center select-none p-3 px-5 bg-white border-0 rounded-full shadow-md outline-none overflow-hidden transform cursor-pointer";
  const textClasses = "firebaseui-idp-text ml-2 font-medium text-sm text-gray-600";

  return (
    <button
      type="button" // Added type="button" to prevent unintended form submission
      className={`${baseClasses}`} // Removed buttonState from class list
      data-provider-id="google.com"
      onClick={handleClick}
    >
      <span className="firebaseui-idp-icon-wrapper h-[18px] w-[18px]">
        <img
          className="firebaseui-idp-icon h-full w-auto"
          alt=""
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        />
      </span>
      <span className={`${textClasses} hidden sm:inline-block`}>
        Sign in with Google
      </span>
      <span className={`${textClasses} inline-block sm:hidden`}>
        Google
      </span>
    </button>
  );
};

export default GoogleSignInButton;