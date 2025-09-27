"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, name: "Shipping" },
  { number: 2, name: "Payment" },
  { number: 3, name: "Review" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as Easing } },
};

const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  return (
    <motion.div
      className="max-w-3xl mx-auto mt-8 mb-12 flex justify-between items-center relative"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Line connecting steps */}
      <div className="absolute left-0 right-0 h-0.5 bg-border top-1/2 -translate-y-1/2 z-0" />
      <div
        className="absolute left-0 h-0.5 bg-primary top-1/2 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step) => (
        <motion.div
          key={step.number}
          className="flex flex-col items-center z-10"
          variants={stepVariants}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
              currentStep >= step.number
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground border border-border",
            )}
          >
            {step.number}
          </div>
          <p
            className={cn(
              "mt-2 text-xs md:text-sm font-medium transition-colors duration-300",
              currentStep >= step.number ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {step.name}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CheckoutProgress;