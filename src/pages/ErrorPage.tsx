"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        className="text-center max-w-lg mx-auto p-8 rounded-xl shadow-2xl border border-destructive/30 bg-card"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <AlertTriangle className="h-24 w-24 text-destructive mx-auto mb-8 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4 text-foreground">Oops! Something Went Wrong</h1>
        <p className="text-lg text-muted-foreground mb-6">
          We encountered an unexpected error. Don't worry, our team has been notified.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Please try navigating back or return to the homepage. If the issue persists, please contact support.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="destructive">
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;