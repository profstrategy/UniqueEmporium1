"use client";

import React, { useState } from "react";
import { User, Lock, Mail, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import GoogleSignInButton from "./GoogleSignInButton";
import { useAuth } from "@/context/AuthContext.tsx"; // Import useAuth
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx"; // Import the logo

// Helper component for social links
const SocialLinks = () => (
  <div className="flex justify-center space-x-2 my-5">
    <GoogleSignInButton />
  </div>
);

// Helper component for input fields
interface InputFieldProps {
  type: string;
  placeholder: string;
  Icon: React.ElementType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  Icon,
  value,
  onChange,
}) => (
  <div className="relative w-full my-2">
    <input
      type={type}
      placeholder={placeholder}
      required
      value={value}
      onChange={onChange}
      className="bg-gray-100 border-none rounded-full py-3 px-4 w-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition duration-300 hover:scale-[1.01]"
    />
    {Icon && (
      <Icon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
    )}
  </div>
);

export default function AuthForm() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpFirstName, setSignUpFirstName] = useState(""); // New state
  const [signUpLastName, setSignUpLastName] = useState("");   // New state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const isMobile = useIsMobile();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      await signInWithEmail(signInEmail, signInPassword);
      // Redirection is now handled by CheckAuth
    } catch (error) {
      // Error handled by toast in AuthContext
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    try {
      await signUpWithEmail(signUpEmail, signUpPassword, signUpFirstName, signUpLastName); // Updated call
      // Redirection is now handled by CheckAuth
    } catch (error) {
      // Error handled by toast in AuthContext
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      toast.error("Please enter your email address to reset your password.");
      return;
    }

    toast.loading("Sending password reset link...", { id: "password-reset-link" });
    const { error } = await supabase.auth.resetPasswordForEmail(signInEmail, {
      redirectTo: `${window.location.origin}/auth?reset=true`, // Redirect back to auth page with a flag
    });

    if (error) {
      toast.dismiss("password-reset-link");
      toast.error("Password Reset Failed", { description: error.message });
    } else {
      toast.dismiss("password-reset-link");
      toast.success("Password Reset Email Sent!", {
        description: "Please check your email for instructions to reset your password.",
      });
    }
  };

  // Mobile View with vertical sliding prompt
  if (isMobile) {
    return (
      <div className="bg-gray-50 rounded-2xl shadow-2xl relative overflow-hidden w-full max-w-md h-[650px]">
        {/* Sign-Up Form */}
        <div
          className={`absolute left-0 w-full h-[65%] transition-all duration-1600 ease-in-out ${
            isActive ? "bottom-0" : "-bottom-full"
          }`}
        >
          <form onSubmit={handleSignUp} className="flex flex-col p-8 h-full w-full justify-center items-center text-center">
            {/* Removed logo from here */}
            <h1 className="font-bold text-[19px] text-foreground">Create Your Unique Account</h1>
            <SocialLinks />
            <span className="text-xs mb-2 text-muted-foreground">
              Or use your email for registration
            </span>
            <div className="flex w-full gap-2"> {/* Added flex container for first name and surname */}
              <InputField
                type="text"
                placeholder="First Name"
                Icon={User}
                value={signUpFirstName}
                onChange={(e) => setSignUpFirstName(e.target.value)}
              />
              <InputField
                type="text"
                placeholder="Surname"
                Icon={User}
                value={signUpLastName}
                onChange={(e) => setSignUpLastName(e.target.value)}
              />
            </div>
            <InputField
              type="email"
              placeholder="Email"
              Icon={Mail}
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="Password"
              Icon={Lock}
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
            <button
              type="submit"
              className="mt-4 rounded-full border border-secondary bg-secondary text-white text-xs font-bold py-3 px-11 tracking-wider uppercase transition duration-80 active:scale-95 focus:outline-none hover:bg-secondary/80 disabled:opacity-50"
              disabled={isSigningUp}
            >
              {isSigningUp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Sign-In Form */}
        <div
          className={`absolute left-0 w-full h-[65%] transition-all duration-1600 ease-in-out ${
            isActive ? "-top-full" : "top-0"
          }`}
        >
          <form onSubmit={handleSignIn} className="flex flex-col p-8 h-full w-full justify-center items-center text-center">
            <UniqueEmporiumLogo className="h-[60px] w-auto mb-[10px]" /> {/* Logo for Sign In */}
            <h1 className="font-bold text-[19px] text-foreground">Sign In to Your Emporium</h1>
            <SocialLinks />
            <span className="text-xs mb-2 text-muted-foreground">Or use your email account</span>
            <InputField
              type="email"
              placeholder="Email"
              Icon={Mail}
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="Password"
              Icon={Lock}
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
            />
            <a
              href="#"
              onClick={handleForgotPassword}
              className="text-sm text-primary my-4 hover:underline"
            >
              Forgot your password?
            </a>
            <button
              type="submit"
              className="rounded-full border border-secondary bg-secondary text-white text-xs font-bold py-3 px-11 tracking-wider uppercase transition duration-80 active:scale-95 focus:outline-none hover:bg-secondary/80 disabled:opacity-50"
              disabled={isSigningIn}
            >
              {isSigningIn ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div
          className={`absolute left-0 w-full h-[35%] overflow-hidden z-10 transition-all duration-1600 ease-in-out ${
            isActive
              ? "bottom-[65%] rounded-b-[60px]"
              : "bottom-0 rounded-t-[60px]"
          }`}
        >
          <div
            className={`bg-gradient-to-b from-secondary to-secondary/80 text-white relative h-[200%] w-full transition-transform duration-1600 ease-in-out ${
              isActive
                ? "transform -translate-y-1/2"
                : "transform translate-y-0"
            }`}
          >
            {/* Sign Up Prompt (Top half) */}
            <div className="absolute top-0 left-0 w-full h-[50%] flex flex-col items-center justify-center text-center px-8 py-[0.4rem]">
              <UniqueEmporiumLogo className="h-16 w-auto mb-[10px]" /> {/* Added logo here */}
              <h1 className="font-bold text-2xl">Start Your Journey!</h1>
              <p className="text-sm font-light leading-5 tracking-wider my-4">
                Enter your details and discover unique wholesale fashion.
              </p>
              <button
                onClick={() => setIsActive(true)}
                className="ghost bg-transparent border-2 border-white text-white rounded-full text-xs font-bold py-3 px-11 tracking-wider uppercase hover:bg-white hover:text-secondary"
              >
                Sign Up
              </button>
            </div>

            {/* Sign In Prompt (Bottom half) */}
            <div className="absolute top-1/2 left-0 w-full h-[50%] flex flex-col items-center justify-center text-center px-8 py-[0.4rem]">
              <UniqueEmporiumLogo className="h-16 w-auto mb-[10px]" /> {/* Logo for Sign In Prompt */}
              <h1 className="font-bold text-2xl">Welcome Back!</h1>
              <p className="text-sm font-light leading-5 tracking-wider my-4">
                Log in to manage your orders and explore new collections.
              </p>
              <button
                onClick={() => setIsActive(false)}
                className="ghost bg-transparent border-2 border-white text-white rounded-full text-xs font-bold py-3 px-11 tracking-wider uppercase hover:bg-white hover:text-secondary"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div
      className={`bg-white rounded-[90px] shadow-2xl relative overflow-hidden w-[768px] max-w-full min-h-[480px] transition-all duration-300`}
      style={{
        boxShadow:
          "30px 14px 28px rgba(0, 0, 5, .2), 0 10px 10px rgba(0, 0, 0, .2)",
        opacity: 0.95,
      }}
    >
      {/* SIGN UP CONTAINER (Registration Form) */}
      <div
        className={`absolute top-0 h-full transition-all duration-1600 ease-in-out left-0 w-1/2 z-10 ${
          isActive ? "translate-x-full opacity-100 z-50" : "opacity-0 z-10"
        }`}
      >
        <form onSubmit={handleSignUp} className="bg-white flex flex-col p-12 h-full justify-center items-center text-center">
          <UniqueEmporiumLogo className="h-[80px] w-auto mb-[10px]" /> {/* Logo for Sign Up */}
          <h1 className="font-bold m-0 text-[19px] text-foreground">Create Your Unique Account</h1>
          <SocialLinks />
          <span className="text-xs mb-2 text-muted-foreground">
            Or use your Email for registration
          </span>
          <div className="flex w-full gap-2"> {/* Added flex container */}
            <InputField
              type="text"
              placeholder="First Name"
              Icon={User}
              value={signUpFirstName}
              onChange={(e) => setSignUpFirstName(e.target.value)}
            />
            <InputField
              type="text"
              placeholder="Surname"
              Icon={User}
              value={signUpLastName}
              onChange={(e) => setSignUpLastName(e.target.value)}
            />
          </div>
          <InputField
            type="email"
            placeholder="Email"
            Icon={Mail}
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            Icon={Lock}
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 rounded-full border border-secondary bg-secondary text-white text-xs font-bold py-3 px-11 tracking-wider uppercase transition duration-80 active:scale-95 focus:outline-none hover:bg-secondary/80 disabled:opacity-50"
            disabled={isSigningUp}
          >
            {isSigningUp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
          </button>
        </form>
      </div>

      {/* SIGN IN CONTAINER (Login Form) */}
      <div
        className={`absolute top-0 h-full transition-all duration-1600 ease-in-out left-0 w-1/2 z-20 ${
          isActive ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <form onSubmit={handleSignIn} className="flex flex-col p-12 h-full justify-center items-center text-center">
          <UniqueEmporiumLogo className="h-[80px] w-auto mb-[10px]" /> {/* Logo for Sign In */}
          <h1 className="font-bold m-0 text-[19px] text-foreground">Sign In to Your Emporium</h1>
          <SocialLinks />
          <span className="text-xs mb-2 text-muted-foreground">Or sign in using E-Mail Address</span>
          <InputField
            type="email"
            placeholder="Email"
            Icon={Mail}
            value={signInEmail}
            onChange={(e) => setSignInEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            Icon={Lock}
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
          />
          <a href="#" onClick={handleForgotPassword} className="text-sm text-primary my-4 hover:underline">
            Forgot your password?
          </a>
          <button
            type="submit"
            className="rounded-full border border-secondary bg-secondary text-white text-xs font-bold py-3 px-11 tracking-wider uppercase transition duration-80 active:scale-95 focus:outline-none hover:bg-secondary/80 disabled:opacity-50"
            disabled={isSigningIn}
          >
            {isSigningIn ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>

      {/* OVERLAY CONTAINER */}
      <div
        className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-1600 ease-in-out z-[100] ${
          isActive ? "transform -translate-x-full" : "transform translate-x-0"
        }`}
      >
        <div
          className={`bg-gradient-to-r from-secondary to-secondary/80 bg-cover bg-no-repeat bg-center text-white relative left-[-100%] h-full w-[200%] transform transition-transform duration-1600 ease-in-out ${
            isActive ? "translate-x-1/2" : "translate-x-0"
          }`}
        >
          {/* OVERLAY LEFT (Sign In Prompt) */}
          <div
            className={`absolute top-0 flex flex-col justify-center items-center p-10 h-full w-1/2 text-center transform transition-transform duration-1600 ease-in-out ${
              isActive ? "translate-y-0" : "translate-y-[-20%]"
            }`}
          >
            <UniqueEmporiumLogo className="h-20 w-auto mb-[10px]" /> {/* Logo for Sign In Prompt */}
            <h1 className="font-bold m-0 text-3xl">Welcome Back!</h1>
            <p className="text-sm font-light leading-5 tracking-wider my-5">
              Log in to manage your orders and explore new collections.
            </p>
            <button
              onClick={() => setIsActive(false)}
              className="ghost mt-5 bg-transparent border-2 border-white text-white rounded-full text-xs font-bold py-3 px-11 tracking-wider uppercase transition duration-80 active:scale-95 focus:outline-none hover:bg-white hover:text-secondary"
              id="signIn"
            >
              Sign In
            </button>
          </div>

          {/* OVERLAY RIGHT (Sign Up Prompt) */}
          <div
            className={`absolute top-0 right-0 flex flex-col justify-center items-center p-10 h-full w-1/2 text-center transform transition-transform duration-1600 ease-in-out ${
              isActive ? "translate-y-[20%]" : "translate-y-0"
            }`}
          >
            <UniqueEmporiumLogo className="h-20 w-auto mb-[10px]" /> {/* Logo for Sign Up Prompt */}
            <h1 className="font-bold m-0 text-3xl">Start Your Journey!</h1>
            <p className="text-sm font-light leading-5 tracking-wider my-5">
              Sign up if you still don't have an account to discover unique wholesale fashion.
            </p>
            <button
              onClick={() => setIsActive(true)}
              className="ghost bg-transparent border-2 border-white text-white rounded-full text-xs font-bold py-3 px-11 tracking-wider uppercase hover:bg-white hover:text-secondary"
              id="signUp"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}