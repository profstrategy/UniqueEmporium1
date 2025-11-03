"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const stepVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as Easing } },
};

const CheckoutProgress = ({ currentStep, totalSteps = 3 }: CheckoutProgressProps) => {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 md:gap-4 py-8"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <motion.div
            key={stepNumber}
            className={cn(
              "relative flex items-center justify-center h-8 w-8 rounded-full border-2",
              isActive
                ? "border-primary bg-primary text-white" // Active step: white text
                : isCompleted
                  ? "border-primary bg-primary/20 text-white" // Completed step: white text
                  : "border-muted-foreground text-white", // Inactive step: white text
            )}
            variants={stepVariants}
          >
            <span className="font-semibold text-sm">{stepNumber}</span>
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "absolute left-full top-1/2 h-0.5 w-8 md:w-12 -translate-y-1/2 transition-colors duration-300",
                  isCompleted ? "bg-primary" : "bg-muted-foreground",
                )}
              />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CheckoutProgress;