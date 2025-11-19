"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AuthPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative overflow-hidden">
      {/* Back Button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-4 z-20 bg-white shadow-md"
        onClick={() => navigate(-1)} // Navigate back one step in history
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Subtle Logo Background */}
      <div 
        className="absolute inset-0 bg-center opacity-20 bg-logo-sm md:bg-logo-md lg:bg-logo-lg bg-no-repeat"
        style={{
          backgroundImage: "url('/unique-emporium-logo.png')",
          backgroundPosition: 'center',
        }}
      />
      <AuthForm />
    </div>
  );
};

export default AuthPage;