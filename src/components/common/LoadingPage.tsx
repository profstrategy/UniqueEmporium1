"use client";

import React from "react";
import { motion } from "framer-motion";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx"; // Import the brand logo

const LoadingPage = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <UniqueEmporiumLogo className="h-32 w-32 text-primary" /> {/* Use the brand logo */}
        </motion.div>
        <p className="text-lg font-medium text-muted-foreground">Loading...</p>
      </div>
    </motion.div>
  );
};

export default LoadingPage;