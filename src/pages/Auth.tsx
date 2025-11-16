"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative overflow-hidden">
      {/* Subtle Logo Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/unique-emporium-logo.png')",
          backgroundSize: 'cover', // Changed from 'contain' to 'cover'
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <AuthForm />
    </div>
  );
};

export default AuthPage;