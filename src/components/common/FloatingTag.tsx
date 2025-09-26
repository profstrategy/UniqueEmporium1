"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FloatingTagProps {
  text: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const FloatingTag = ({ text, variant = "default", className }: FloatingTagProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("absolute top-2 left-2 z-10", className)}
    >
      <Badge variant={variant} className="px-2 py-1 text-xs font-semibold">
        {text}
      </Badge>
    </motion.div>
  );
};

export default FloatingTag;