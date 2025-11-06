"use client";

import React from "react";
import { motion, Easing, RepeatType } from "framer-motion";
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
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{
        opacity: 1,
        y: [0, -5, 0], // Vertical float
        scale: 1,
      }}
      transition={{
        duration: 3,
        ease: "easeInOut" as Easing,
        repeat: Infinity,
        repeatType: "reverse" as RepeatType,
      }}
      className={cn(
        "absolute top-2 z-10", // Removed 'left-2' from here
        className
      )}
      style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }} // Custom drop shadow for depth
    >
      <Badge variant={variant} className="relative px-2 py-0.5 text-xs font-semibold shadow-lg">
        {text}
        {/* Dot Punched Effect */}
        <div className="absolute right-[-0.5rem] top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-background" />
      </Badge>
    </motion.div>
  );
};

export default FloatingTag;